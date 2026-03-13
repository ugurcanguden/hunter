import { Image, Platform, Vibration } from 'react-native';

import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

type SoundModule = typeof import('react-native-sound');
const SoundImport = require('react-native-sound') as
  | SoundModule
  | { default?: SoundModule };
const Sound = (
  typeof SoundImport === 'function'
    ? SoundImport
    : (SoundImport.default ?? SoundImport)
) as SoundModule;
type SoundInstance = InstanceType<typeof Sound>;

type FeedbackSoundKey =
  | 'shoot'
  | 'good-hit'
  | 'perfect-hit'
  | 'miss'
  | 'blocked'
  | 'level-complete'
  | 'level-fail';

type SoundSource = {
  android: string;
  ios: number;
};

const soundFiles: Partial<Record<FeedbackSoundKey, SoundSource>> = {
  blocked: {
    android: 'blocked.wav',
    ios: require('../../assets/sounds/blocked.wav'),
  },
  'good-hit': {
    android: 'good_hit.mp3',
    ios: require('../../assets/sounds/good-hit.mp3'),
  },
  'level-complete': {
    android: 'level_complete.wav',
    ios: require('../../assets/sounds/level-complete.wav'),
  },
  'level-fail': {
    android: 'level_fail.wav',
    ios: require('../../assets/sounds/level-fail.wav'),
  },
  miss: {
    android: 'miss.wav',
    ios: require('../../assets/sounds/miss.wav'),
  },
  'perfect-hit': {
    android: 'perfect_hit.wav',
    ios: require('../../assets/sounds/perfect-hit.wav'),
  },
  shoot: {
    android: 'shoot.wav',
    ios: require('../../assets/sounds/shoot.wav'),
  },
};

const hapticPatterns: Record<
  'shoot' | 'goodHit' | 'perfectHit' | 'miss' | 'blocked' | 'levelComplete' | 'levelFail',
  number | number[]
> = {
  shoot: 10,
  goodHit: 16,
  perfectHit: Platform.OS === 'android' ? [0, 18, 24, 18] : 20,
  miss: 18,
  blocked: [0, 12, 18, 12],
  levelComplete: [0, 18, 30, 18, 30, 20],
  levelFail: [0, 26, 26, 18],
};

const backgroundMusicTracks = [
  {
    android: 'neon_nexus_pulse.mp3',
    ios: require('../../assets/sounds/background/Neon_Nexus_Pulse.mp3'),
  },
  {
    android: 'neon_pulse_drive.mp3',
    ios: require('../../assets/sounds/background/Neon_Pulse_Drive.mp3'),
  },
  {
    android: 'bgm.mp3',
    ios: require('../../assets/sounds/background/bgm.mp3'),
  },
] as const;

const backgroundMusicVolume = 0.38;
const soundEffectVolume = 0.75;

let backgroundMusicAllowed = false;
let backgroundMusicTrackIndex = 0;
let backgroundMusicPaused = false;
let backgroundMusicLoadToken = 0;
let backgroundMusicSound: SoundInstance | null = null;

const soundEffectCache = new Map<FeedbackSoundKey, SoundInstance | null>();

function canPlaySound() {
  return useSettingsStore.getState().settings.soundEnabled;
}

function canPlayMusic() {
  return backgroundMusicAllowed && useSettingsStore.getState().settings.musicEnabled;
}

function canVibrate() {
  return useSettingsStore.getState().settings.vibrationEnabled;
}

function configureAudioSession() {
  try {
    Sound.setCategory('Playback', true);
  } catch {
    // Optional on some environments.
  }
}

function getCurrentBackgroundTrack() {
  return backgroundMusicTracks[backgroundMusicTrackIndex] ?? backgroundMusicTracks[0];
}

function resolveSoundAssetUri(asset: number): string | null {
  const resolvedAsset = Image.resolveAssetSource(asset);
  return resolvedAsset?.uri ?? null;
}

function resolveSoundSource(source: SoundSource): { filename: string; basePath: string } | null {
  if (Platform.OS === 'android') {
    return {
      filename: source.android,
      basePath: Sound.MAIN_BUNDLE,
    };
  }

  const assetUri = resolveSoundAssetUri(source.ios);
  if (!assetUri) {
    return null;
  }

  return {
    filename: assetUri,
    basePath: '',
  };
}

function releaseBackgroundMusicInstance() {
  if (!backgroundMusicSound) {
    return;
  }

  try {
    backgroundMusicSound.release();
  } catch {
    // Ignore cleanup failures.
  }

  backgroundMusicSound = null;
}

function handleBackgroundTrackCompletion(sound: SoundInstance, success: boolean) {
  if (backgroundMusicSound !== sound) {
    try {
      sound.release();
    } catch {
      // Ignore stale instance cleanup failures.
    }
    return;
  }

  releaseBackgroundMusicInstance();
  backgroundMusicPaused = false;

  if (!success || !canPlayMusic()) {
    return;
  }

  backgroundMusicTrackIndex = (backgroundMusicTrackIndex + 1) % backgroundMusicTracks.length;
  gameFeedbackService.startBackgroundMusic();
}

function loadAndPlayBackgroundTrack() {
  const trackAsset = getCurrentBackgroundTrack();
  if (!trackAsset || !canPlayMusic()) {
    return;
  }

  const resolvedTrack = resolveSoundSource(trackAsset);
  if (!resolvedTrack) {
    return;
  }

  configureAudioSession();

  const loadToken = ++backgroundMusicLoadToken;
  const sound = new Sound(resolvedTrack.filename, resolvedTrack.basePath, (error: unknown) => {
    if (loadToken !== backgroundMusicLoadToken) {
      sound.release();
      return;
    }

    if (error) {
      sound.release();
      return;
    }

    backgroundMusicSound = sound;
    backgroundMusicPaused = false;
    sound.setVolume(backgroundMusicVolume);
    sound.play((success: boolean) => handleBackgroundTrackCompletion(sound, success));
  });
}

function playSound(key: FeedbackSoundKey) {
  if (!canPlaySound()) {
    return;
  }

  configureAudioSession();

  const cachedSound = soundEffectCache.get(key);
  if (cachedSound) {
    cachedSound.stop(() => {
      cachedSound.play();
    });
    return;
  }

  if (cachedSound === null) {
    return;
  }

  const soundAsset = soundFiles[key];
  if (!soundAsset) {
    soundEffectCache.set(key, null);
    return;
  }

  const resolvedSound = resolveSoundSource(soundAsset);
  if (!resolvedSound) {
    soundEffectCache.set(key, null);
    return;
  }

  const effect = new Sound(
    resolvedSound.filename,
    resolvedSound.basePath,
    (error: unknown) => {
      if (error) {
        effect.release();
        soundEffectCache.set(key, null);
        return;
      }

      effect.setVolume(soundEffectVolume);
      soundEffectCache.set(key, effect);
      effect.play();
    },
  );
}

function triggerHaptic(pattern: number | number[]) {
  if (!canVibrate()) {
    return;
  }

  try {
    if (Array.isArray(pattern)) {
      Vibration.vibrate([...pattern]);
      return;
    }

    Vibration.vibrate(pattern);
  } catch {
    // Some devices/platforms may not support the provided pattern; fail silently.
  }
}

export const gameFeedbackService = {
  setBackgroundMusicAllowed(allowed: boolean) {
    backgroundMusicAllowed = allowed;

    if (!allowed) {
      this.stopBackgroundMusic();
    }
  },

  playShoot() {
    playSound('shoot');
    triggerHaptic(hapticPatterns.shoot);
  },

  playGoodHit() {
    playSound('good-hit');
    triggerHaptic(hapticPatterns.goodHit);
  },

  playPerfectHit() {
    playSound('perfect-hit');
    triggerHaptic(hapticPatterns.perfectHit);
  },

  playMiss() {
    playSound('miss');
    triggerHaptic(hapticPatterns.miss);
  },

  playBlocked() {
    playSound('blocked');
    triggerHaptic(hapticPatterns.blocked);
  },

  playLevelComplete() {
    playSound('level-complete');
    triggerHaptic(hapticPatterns.levelComplete);
  },

  playLevelFail() {
    playSound('level-fail');
    triggerHaptic(hapticPatterns.levelFail);
  },

  startBackgroundMusic() {
    if (!canPlayMusic()) {
      return;
    }

    if (backgroundMusicSound) {
      if (backgroundMusicPaused) {
        this.resumeBackgroundMusic();
      }
      return;
    }

    loadAndPlayBackgroundTrack();
  },

  pauseBackgroundMusic() {
    if (!backgroundMusicSound || backgroundMusicPaused) {
      return;
    }

    try {
      backgroundMusicSound.pause();
      backgroundMusicPaused = true;
    } catch {
      // Keep background music silent on unsupported environments.
    }
  },

  resumeBackgroundMusic() {
    if (!canPlayMusic()) {
      return;
    }

    configureAudioSession();

    if (!backgroundMusicSound) {
      this.startBackgroundMusic();
      return;
    }

    try {
      backgroundMusicSound.setVolume(backgroundMusicVolume);

      if (backgroundMusicPaused) {
        backgroundMusicPaused = false;
        const currentSound = backgroundMusicSound;
        currentSound.play((success: boolean) =>
          handleBackgroundTrackCompletion(currentSound, success),
        );
        return;
      }
    } catch {
      this.stopBackgroundMusic();
      this.startBackgroundMusic();
    }
  },

  stopBackgroundMusic() {
    backgroundMusicLoadToken += 1;
    backgroundMusicPaused = false;

    if (!backgroundMusicSound) {
      return;
    }

    try {
      backgroundMusicSound.stop(() => {
        releaseBackgroundMusicInstance();
      });
      return;
    } catch {
      releaseBackgroundMusicInstance();
    }
  },

  syncMusicPreference() {
    if (!canPlayMusic()) {
      this.stopBackgroundMusic();
      return;
    }

    this.resumeBackgroundMusic();
  },
};
