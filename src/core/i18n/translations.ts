import { AppLanguage } from '@centerhit-features/settings/types/settingsTypes';

type TranslationTree = {
  common: {
    play: string;
    levels: string;
    settings: string;
    home: string;
    retry: string;
    resume: string;
    pause: string;
    nextLevel: string;
    language: string;
    sound: string;
    music: string;
    vibration: string;
    on: string;
    off: string;
    open: string;
    locked: string;
    level: string;
    noStarsYet: string;
    score: string;
    hits: string;
    shots: string;
    perfect: string;
    homeAction: string;
    continueAction: string;
    unlocked: string;
    campaign: string;
    next: string;
  };
  home: {
    subtitle: string;
    quickSnapshot: string;
    lastOpenedLevel: string;
    totalStars: string;
    bestScore: string;
    campaignProgress: string;
    unlockedLevels: string;
    readyToContinue: string;
  };
  levels: {
    title: string;
    summary: string;
    campaignStatus: string;
    nextPlayable: string;
  };
  settings: {
    title: string;
    subtitle: string;
    progress: string;
    progressCopy: string;
    resetProgress: string;
    resetProgressTitle: string;
    resetProgressMessage: string;
    cancel: string;
    reset: string;
    languages: {
      en: string;
      tr: string;
    };
  };
  loader: {
    preparing: string;
  };
  game: {
    gameplaySkeletonReady: string;
    gameplaySkeletonSubtitle: string;
    placeholderGameArea: string;
    targetZone: string;
    launcherZone: string;
    ballSpawn: string;
    objectiveLabel: string;
    minimumPerfect: string;
    mistakesLeft: string;
    perfect: string;
    good: string;
    miss: string;
    blocked: string;
    blockedHint: string;
    pauseTitle: string;
    pauseCopy: string;
    completeTitle: string;
    completeStars: string;
    failTitle: string;
    failCopy: string;
    failMissCopy: string;
    failShotsCopy: string;
    nextStarIn: string;
    maxStars: string;
  };
};

export const translations: Record<AppLanguage, TranslationTree> = {
  en: {
    common: {
      play: 'Play',
      levels: 'Levels',
      settings: 'Settings',
      home: 'Home',
      retry: 'Retry',
      resume: 'Resume',
      pause: 'Pause',
      nextLevel: 'Next Level',
      language: 'Language',
      sound: 'Sound',
      music: 'Music',
      vibration: 'Vibration',
      on: 'On',
      off: 'Off',
      open: 'OPEN',
      locked: 'LOCKED',
      level: 'Level',
      noStarsYet: 'No stars yet',
      score: 'Score',
      hits: 'Hits',
      shots: 'Shots',
      perfect: 'Perfect',
      homeAction: 'Home',
      continueAction: 'Continue',
      unlocked: 'Unlocked',
      campaign: 'Campaign',
      next: 'Next',
    },
    home: {
      subtitle: 'Premium casual arcade foundations, ready for gameplay systems.',
      quickSnapshot: 'Quick Snapshot',
      lastOpenedLevel: 'Last opened level',
      totalStars: 'Total stars',
      bestScore: 'Best score',
      campaignProgress: 'Campaign Progress',
      unlockedLevels: 'Unlocked levels',
      readyToContinue: 'Ready to continue',
    },
    levels: {
      title: 'Levels',
      summary: 'open • {{stars}} stars collected',
      campaignStatus: 'Campaign Status',
      nextPlayable: 'Next playable',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Everything is stored on-device. No login, no sync, no cloud profile.',
      progress: 'Progress',
      progressCopy: 'Reset local progress, unlocked levels, stars, and cached best scores.',
      resetProgress: 'Reset Progress',
      resetProgressTitle: 'Reset Progress',
      resetProgressMessage: 'This clears all local game progress.',
      cancel: 'Cancel',
      reset: 'Reset',
      languages: {
        en: 'English',
        tr: 'Turkish',
      },
    },
    loader: {
      preparing: 'Preparing local game systems...',
    },
    game: {
      gameplaySkeletonReady: 'Gameplay Skeleton Ready',
      gameplaySkeletonSubtitle: 'Core gameplay systems will connect into this stage next.',
      placeholderGameArea: 'Placeholder play field',
      targetZone: 'Target zone',
      launcherZone: 'Launcher zone',
      ballSpawn: 'Ball spawn',
      objectiveLabel: 'Objective',
      minimumPerfect: 'Minimum perfect',
      mistakesLeft: 'Mistakes left',
      perfect: 'Perfect',
      good: 'Good',
      miss: 'Miss',
      blocked: 'Blocked',
      blockedHint: 'Hit the gap',
      pauseTitle: 'Game Paused',
      pauseCopy: 'Take a breath. Your current session is kept in place.',
      completeTitle: 'Level Complete',
      completeStars: 'Stars earned',
      failTitle: 'Run Failed',
      failCopy: 'You ran out of room for mistakes. Take another shot.',
      failMissCopy: 'You ran out of room for mistakes. Take another shot.',
      failShotsCopy: 'Your shot limit is spent. Try a cleaner run.',
      nextStarIn: 'to next star',
      maxStars: 'max stars',
    },
  },
  tr: {
    common: {
      play: 'Oyna',
      levels: 'Bölümler',
      settings: 'Ayarlar',
      home: 'Ana Sayfa',
      retry: 'Tekrar Dene',
      resume: 'Devam Et',
      pause: 'Duraklat',
      nextLevel: 'Sonraki Bölüm',
      language: 'Dil',
      sound: 'Ses Efekti',
      music: 'Müzik',
      vibration: 'Titreşim',
      on: 'Açık',
      off: 'Kapalı',
      open: 'AÇIK',
      locked: 'KİLİTLİ',
      level: 'Bölüm',
      noStarsYet: 'Henüz yıldız yok',
      score: 'Skor',
      hits: 'Vuruş',
      shots: 'Atış',
      perfect: 'Mükemmel',
      homeAction: 'Ana Sayfa',
      continueAction: 'Devam Et',
      unlocked: 'Açık',
      campaign: 'Kampanya',
      next: 'Sıradaki',
    },
    home: {
      subtitle: 'Premium casual arcade temeli, oynanış sistemleri için hazır.',
      quickSnapshot: 'Hızlı Özet',
      lastOpenedLevel: 'Son açılan bölüm',
      totalStars: 'Toplam yıldız',
      bestScore: 'En iyi skor',
      campaignProgress: 'Kampanya İlerlemesi',
      unlockedLevels: 'Açılan bölümler',
      readyToContinue: 'Devam etmeye hazır',
    },
    levels: {
      title: 'Bölümler',
      summary: 'açık • {{stars}} yıldız toplandı',
      campaignStatus: 'Kampanya Durumu',
      nextPlayable: 'Sıradaki bölüm',
    },
    settings: {
      title: 'Ayarlar',
      subtitle: 'Her şey cihazda tutulur. Giriş yok, senkron yok, bulut profil yok.',
      progress: 'İlerleme',
      progressCopy: 'Yerel ilerlemeyi, açılan bölümleri, yıldızları ve kayıtlı en iyi skorları sıfırla.',
      resetProgress: 'İlerlemeyi Sıfırla',
      resetProgressTitle: 'İlerlemeyi Sıfırla',
      resetProgressMessage: 'Bu işlem tüm yerel oyun ilerlemesini temizler.',
      cancel: 'Vazgeç',
      reset: 'Sıfırla',
      languages: {
        en: 'İngilizce',
        tr: 'Türkçe',
      },
    },
    loader: {
      preparing: 'Yerel oyun sistemleri hazırlanıyor...',
    },
    game: {
      gameplaySkeletonReady: 'Oynanış İskeleti Hazır',
      gameplaySkeletonSubtitle: 'Ana oynanış sistemleri sonraki aşamada bu sahneye bağlanacak.',
      placeholderGameArea: 'Yer tutucu oyun sahası',
      targetZone: 'Hedef alanı',
      launcherZone: 'Launcher alanı',
      ballSpawn: 'Top çıkış noktası',
      objectiveLabel: 'Hedef',
      minimumPerfect: 'En az mükemmel',
      mistakesLeft: 'Kalan hata hakkı',
      perfect: 'Mükemmel',
      good: 'İyi',
      miss: 'Kaçtı',
      blocked: 'Engellendi',
      blockedHint: 'Boşluğu hedefle',
      pauseTitle: 'Oyun Duraklatıldı',
      pauseCopy: 'Kısa bir nefes al. Mevcut oturum korunuyor.',
      completeTitle: 'Bölüm Tamamlandı',
      completeStars: 'Kazanılan yıldız',
      failTitle: 'Deneme Başarısız',
      failCopy: 'Hata hakkın bitti. Bir kez daha dene.',
      failMissCopy: 'Hata hakkın bitti. Bir kez daha dene.',
      failShotsCopy: 'Atış hakkın tükendi. Daha temiz bir deneme yap.',
      nextStarIn: 'sonraki yıldıza',
      maxStars: 'maks yıldız',
    },
  },
};
