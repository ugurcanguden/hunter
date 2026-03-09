import { NativeModules, Platform, Vibration } from 'react-native';

import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

type FeedbackSoundKey =
  | 'shoot'
  | 'good-hit'
  | 'perfect-hit'
  | 'miss'
  | 'blocked'
  | 'level-complete'
  | 'level-fail';

const soundFiles: Record<FeedbackSoundKey, { fileName: string; fileType: string }> = {
  shoot: { fileName: 'shoot', fileType: 'mp3' },
  'good-hit': { fileName: 'good-hit', fileType: 'mp3' },
  'perfect-hit': { fileName: 'perfect-hit', fileType: 'mp3' },
  miss: { fileName: 'miss', fileType: 'mp3' },
  blocked: { fileName: 'blocked', fileType: 'mp3' },
  'level-complete': { fileName: 'level-complete', fileType: 'mp3' },
  'level-fail': { fileName: 'level-fail', fileType: 'mp3' },
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
  playSoundFile: (fileName: string, fileType: string) => void;
  stop: () => void;
};

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

  const sound = soundFiles[key];
  const soundPlayer = getSoundPlayer();

  if (!soundPlayer) {
    return;
  }

  try {
    soundPlayer.playSoundFile(sound.fileName, sound.fileType);
  } catch {
    // Sound assets are optional in this milestone. Missing native bundle files should stay silent.
  }
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

  syncMusicPreference() {
    const { musicEnabled } = useSettingsStore.getState().settings;
    const soundPlayer = getSoundPlayer();

    if (!musicEnabled && soundPlayer) {
      try {
        soundPlayer.stop();
      } catch {
        // Background music is not active yet; keep this future-ready and silent.
      }
    }
  },
};
