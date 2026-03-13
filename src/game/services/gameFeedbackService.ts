import { Image, NativeModules, Platform, Vibration } from 'react-native';
import type { EmitterSubscription } from 'react-native';
import Sound from 'react-native-sound';

import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

type FeedbackSoundKey =
  | 'shoot'
  | 'good-hit'
  | 'perfect-hit'
  | 'miss'
  | 'blocked'
  | 'level-complete'
  | 'level-fail';

const soundFiles: Partial<Record<FeedbackSoundKey, number>> = {
  blocked: require('../../assets/sounds/blocked.wav'),
  'good-hit': require('../../assets/sounds/good-hit.mp3'),
  'level-complete': require('../../assets/sounds/level-complete.wav'),
  'level-fail': require('../../assets/sounds/level-fail.wav'),
  miss: require('../../assets/sounds/miss.wav'),
  'perfect-hit': require('../../assets/sounds/perfect-hit.wav'),
  shoot: require('../../assets/sounds/shoot.wav'),
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

type SoundPlayerModule = {
  addEventListener: (
    eventName: 'FinishedPlaying',
    callback: (data: { success?: boolean }) => void,
  ) => EmitterSubscription;
  pause: () => void;
  playAsset: (asset: number) => void;
  playSoundFile: (fileName: string, fileType: string) => void;
  resume: () => void;
  setMixAudio: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  stop: () => void;
};

const backgroundMusicTracks = [
  require('../../assets/sounds/background/Neon_Nexus_Pulse.mp3'), 
  require('../../assets/sounds/background/Neon_Pulse_Drive.mp3'),
  require('../../assets/sounds/background/bgm.mp3'),
] as const;
const backgroundMusicVolume = 0.38;

let backgroundMusicTrackIndex = 0;
let backgroundMusicEnabled = false;
let backgroundMusicPaused = false;
let backgroundMusicSubscription: EmitterSubscription | null = null;
const soundEffectCache = new Map<FeedbackSoundKey, Sound | null>();

function canPlaySound() {
  return useSettingsStore.getState().settings.soundEnabled;
}

function canVibrate() {
  return useSettingsStore.getState().settings.vibrationEnabled;
}

function getSoundPlayer(): SoundPlayerModule | null {
  if (!NativeModules.RNSoundPlayer) {
    return null;
  }

  try {
    const module = require('react-native-sound-player') as {
      default?: SoundPlayerModule;
    };

    return module.default ?? null;
  } catch {
    return null;
  }
}

function playSound(key: FeedbackSoundKey) {
  if (!canPlaySound()) {
    return;
  }

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

  try {
    Sound.setCategory('Playback', true);
  } catch {
    // Safe fallback if category setup is unavailable.
  }

  const resolvedAsset = Image.resolveAssetSource(soundAsset);
  const assetUri = resolvedAsset?.uri;

  if (!assetUri) {
    soundEffectCache.set(key, null);
    return;
  }

  const effect = new Sound(assetUri, '', error => {
    if (error) {
      soundEffectCache.set(key, null);
      return;
    }

    effect.setVolume(0.75);
    soundEffectCache.set(key, effect);
    effect.play();
  });
}

function getCurrentBackgroundTrack() {
  return backgroundMusicTracks[backgroundMusicTrackIndex] ?? backgroundMusicTracks[0];
}

function playBackgroundTrack(soundPlayer: SoundPlayerModule, asset: number) {
  try {
    soundPlayer.setVolume(backgroundMusicVolume);
  } catch {
    // Some platforms may not expose volume reliably.
  }

  try {
    if (Platform.OS === 'ios') {
      soundPlayer.setMixAudio(true);
    }
  } catch {
    // Optional on iOS only.
  }

  try {
    soundPlayer.playAsset(asset);
  } catch {
    // Missing bundled asset should stay silent.
  }
}

function ensureBackgroundMusicListener(soundPlayer: SoundPlayerModule) {
  if (backgroundMusicSubscription) {
    return;
  }

  backgroundMusicSubscription = soundPlayer.addEventListener('FinishedPlaying', () => {
    if (!backgroundMusicEnabled || backgroundMusicPaused) {
      return;
    }

    backgroundMusicTrackIndex =
      (backgroundMusicTrackIndex + 1) % backgroundMusicTracks.length;

    const nextTrack = getCurrentBackgroundTrack();
    if (!nextTrack) {
      return;
    }

    const currentPlayer = getSoundPlayer();
    if (!currentPlayer) {
      return;
    }

    playBackgroundTrack(currentPlayer, nextTrack);
  });
}

function triggerHaptic(pattern: number | number[]) {
  if (!canVibrate()) {
    return;
  }

  try {
    if (Array.isArray(pattern)) {
      const mutablePattern: number[] = [...pattern];
      Vibration.vibrate(mutablePattern);
      return;
    }

    Vibration.vibrate(pattern);
  } catch {
    // Some devices/platforms may not support the provided pattern; fail silently.
  }
}

export const gameFeedbackService = {
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
    if (!useSettingsStore.getState().settings.musicEnabled) {
      backgroundMusicEnabled = false;
      return;
    }

    const soundPlayer = getSoundPlayer();
    if (!soundPlayer) {
      return;
    }

    backgroundMusicEnabled = true;
    backgroundMusicPaused = false;
    ensureBackgroundMusicListener(soundPlayer);
    playBackgroundTrack(soundPlayer, getCurrentBackgroundTrack());
  },

  pauseBackgroundMusic() {
    const soundPlayer = getSoundPlayer();
    if (!soundPlayer || !backgroundMusicEnabled) {
      return;
    }

    try {
      soundPlayer.pause();
      backgroundMusicPaused = true;
    } catch {
      // Keep background music silent on unsupported environments.
    }
  },

  resumeBackgroundMusic() {
    if (!useSettingsStore.getState().settings.musicEnabled) {
      return;
    }

    const soundPlayer = getSoundPlayer();
    if (!soundPlayer) {
      return;
    }

    backgroundMusicEnabled = true;

    try {
      if (backgroundMusicPaused) {
        soundPlayer.setVolume(backgroundMusicVolume);
        soundPlayer.resume();
        backgroundMusicPaused = false;
        return;
      }
    } catch {
      // Fall back to fresh playback below.
    }

    this.startBackgroundMusic();
  },

  stopBackgroundMusic() {
    const soundPlayer = getSoundPlayer();
    backgroundMusicEnabled = false;
    backgroundMusicPaused = false;

    if (!soundPlayer) {
      return;
    }

    try {
      soundPlayer.stop();
    } catch {
      // Silent fallback.
    }
  },

  syncMusicPreference() {
    const { musicEnabled } = useSettingsStore.getState().settings;

    if (!musicEnabled) {
      this.stopBackgroundMusic();
      return;
    }

    this.resumeBackgroundMusic();
  },
};
