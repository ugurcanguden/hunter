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
    pack: string;
    completed: string;
    ready: string;
    levelsCount: string;
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
    currentPack: string;
    nextPack: string;
    remoteContentHint: string;
  };
  levels: {
    title: string;
    summary: string;
    campaignStatus: string;
    nextPlayable: string;
    packsUnlocked: string;
    tapToOpen: string;
    loadingPack: string;
  };
  settings: {
    title: string;
    subtitle: string;
    feedback: string;
    feedbackCopy: string;
    feedbackMessageLabel: string;
    feedbackMessagePlaceholder: string;
    feedbackSubmit: string;
    feedbackSending: string;
    feedbackSuccessTitle: string;
    feedbackSuccessMessage: string;
    feedbackErrorTitle: string;
    feedbackErrorMessage: string;
    feedbackDailyLimitTitle: string;
    feedbackDailyLimitMessage: string;
    feedbackRemaining: string;
    feedbackNoPersonalInfo: string;
    feedbackCategoryLabel: string;
    feedbackCategories: {
      complaint: string;
      suggestion: string;
      question: string;
      other: string;
    };
    progress: string;
    progressCopy: string;
    campaignTools: string;
    campaignToolsCopy: string;
    resetProgress: string;
    clearCampaignCache: string;
    seedCampaignData: string;
    seedCampaignDataTitle: string;
    seedCampaignDataMessage: string;
    seedCampaignDataSuccess: string;
    seedCampaignDataError: string;
    clearCampaignCacheTitle: string;
    clearCampaignCacheMessage: string;
    resetProgressTitle: string;
    resetProgressMessage: string;
    cancel: string;
    reset: string;
    languages: {
      en: string;
      tr: string;
    };
    discoverAgain: string;
  };
  discover: {
    title: string;
    skip: string;
    next: string;
    done: string;
    stepCounter: string;
    steps: {
      homeTitle: string;
      homeCopy: string;
      packsTitle: string;
      packsCopy: string;
      gameTitle: string;
      gameCopy: string;
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
    tutorialTitle: string;
    tutorialSkip: string;
    tutorialNext: string;
    tutorialDone: string;
    tutorialStep: string;
    tutorialSteps: {
      targetTitle: string;
      targetCopy: string;
      objectiveTitle: string;
      objectiveCopy: string;
      obstacleTitle: string;
      obstacleCopy: string;
    };
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
      campaign: 'Course',
      next: 'Next',
      pack: 'Pack',
      completed: 'Completed',
      ready: 'Ready',
      levelsCount: 'levels',
    },
    home: {
      subtitle: 'Premium casual arcade foundations, ready for gameplay systems.',
      quickSnapshot: 'Quick Snapshot',
      lastOpenedLevel: 'Last opened level',
      totalStars: 'Total stars',
      bestScore: 'Best score',
      campaignProgress: 'Course Progress',
      unlockedLevels: 'Unlocked levels',
      readyToContinue: 'Ready to continue',
      currentPack: 'Current pack',
      nextPack: 'Next pack',
      remoteContentHint: 'New packs appear here after the starter circuit is complete.',
    },
    levels: {
      title: 'Levels',
      summary: 'open • {{stars}} stars collected',
      campaignStatus: 'Course Status',
      nextPlayable: 'Next playable',
      packsUnlocked: 'packs unlocked',
      tapToOpen: 'Tap a pack to open its levels',
      loadingPack: 'Loading pack...',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Everything is stored on-device. No login, no sync, no cloud profile.',
      feedback: 'Feedback',
      feedbackCopy: 'Tell us what feels broken, confusing, or worth improving. Please do not include personal information.',
      feedbackMessageLabel: 'Your feedback',
      feedbackMessagePlaceholder: 'What happened, or what should improve?',
      feedbackSubmit: 'Send Feedback',
      feedbackSending: 'Sending...',
      feedbackSuccessTitle: 'Thanks',
      feedbackSuccessMessage: 'Your feedback was sent successfully.',
      feedbackErrorTitle: 'Feedback Error',
      feedbackErrorMessage: 'We could not send your feedback right now.',
      feedbackDailyLimitTitle: 'Daily Limit Reached',
      feedbackDailyLimitMessage: 'You can send up to 5 feedback messages per day.',
      feedbackRemaining: '{{remaining}} / {{limit}} left today',
      feedbackNoPersonalInfo: 'No email, name, or personal data is requested.',
      feedbackCategoryLabel: 'Category',
      feedbackCategories: {
        complaint: 'Complaint',
        suggestion: 'Suggestion',
        question: 'Question',
        other: 'Other',
      },
      progress: 'Progress',
      progressCopy: 'Reset local progress, unlocked levels, stars, and cached best scores.',
      campaignTools: 'Course Tools',
      campaignToolsCopy: 'Use these actions to seed and refresh remote course packs while testing PocketBase.',
      resetProgress: 'Reset Progress',
      clearCampaignCache: 'Clear Course Cache',
      seedCampaignData: 'Seed Remote Course',
      seedCampaignDataTitle: 'Seed Remote Course',
      seedCampaignDataMessage: 'This inserts sample pack and level data into PocketBase.',
      seedCampaignDataSuccess: 'Sample course data inserted successfully.',
      seedCampaignDataError: 'PocketBase seed failed.',
      clearCampaignCacheTitle: 'Clear Course Cache',
      clearCampaignCacheMessage: 'This removes downloaded course packs and refetches them on demand.',
      resetProgressTitle: 'Reset Progress',
      resetProgressMessage: 'This clears all local game progress.',
      cancel: 'Cancel',
      reset: 'Reset',
      languages: {
        en: 'English',
        tr: 'Turkish',
      },
      discoverAgain: 'Show Discover Guide Again',
    },
    discover: {
      title: 'Discover Center Hit',
      skip: 'Skip',
      next: 'Next',
      done: 'Start',
      stepCounter: 'Step',
      steps: {
        homeTitle: 'Home & Continue',
        homeCopy: 'Use Continue to jump back into your current run quickly.',
        packsTitle: 'Packs & Unlocks',
        packsCopy: 'Finish levels to unlock the next pack and open harder stages.',
        gameTitle: 'Perfect Zone',
        gameCopy: 'Aim for the bright center of the target for Perfect hits and better score.',
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
      tutorialTitle: 'First Run Guide',
      tutorialSkip: 'Skip',
      tutorialNext: 'Next',
      tutorialDone: 'Got it',
      tutorialStep: 'Step',
      tutorialSteps: {
        targetTitle: 'Target & Perfect Zone',
        targetCopy: 'Hit the target. Shots near the bright center count as Perfect.',
        objectiveTitle: 'Objective & Chances',
        objectiveCopy: 'Complete hit goals before your miss and shot limits run out.',
        obstacleTitle: 'Obstacles',
        obstacleCopy: 'If your shot hits an obstacle it becomes Blocked and counts like a miss.',
      },
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
      campaign: 'Parkur',
      next: 'Sıradaki',
      pack: 'Kutu',
      completed: 'Tamamlandı',
      ready: 'Hazır',
      levelsCount: 'bölüm',
    },
    home: {
      subtitle: 'Premium casual arcade temeli, oynanış sistemleri için hazır.',
      quickSnapshot: 'Hızlı Özet',
      lastOpenedLevel: 'Son açılan bölüm',
      totalStars: 'Toplam yıldız',
      bestScore: 'En iyi skor',
      campaignProgress: 'Parkur İlerlemesi',
      unlockedLevels: 'Açılan bölümler',
      readyToContinue: 'Devam etmeye hazır',
      currentPack: 'Mevcut kutu',
      nextPack: 'Sıradaki kutu',
      remoteContentHint: 'Başlangıç devresi tamamlanınca yeni kutular burada açılır.',
    },
    levels: {
      title: 'Bölümler',
      summary: 'açık • {{stars}} yıldız toplandı',
      campaignStatus: 'Parkur Durumu',
      nextPlayable: 'Sıradaki bölüm',
      packsUnlocked: 'kutu açık',
      tapToOpen: 'Bölümlerini açmak için bir kutuya dokun',
      loadingPack: 'Kutu yükleniyor...',
    },
    settings: {
      title: 'Ayarlar',
      subtitle: 'Her şey cihazda tutulur. Giriş yok, senkron yok, bulut profil yok.',
      feedback: 'Geri Bildirim',
      feedbackCopy: 'Bozuk, karisik veya gelistirilebilir noktalarni bize yaz. Lutfen kisisel bilgi ekleme.',
      feedbackMessageLabel: 'Mesajin',
      feedbackMessagePlaceholder: 'Ne oldu ya da neyin iyilesmesini istiyorsun?',
      feedbackSubmit: 'Geri Bildirim Gonder',
      feedbackSending: 'Gonderiliyor...',
      feedbackSuccessTitle: 'Tesekkurler',
      feedbackSuccessMessage: 'Geri bildirimin basariyla gonderildi.',
      feedbackErrorTitle: 'Geri Bildirim Hatasi',
      feedbackErrorMessage: 'Geri bildirimin su anda gonderilemedi.',
      feedbackDailyLimitTitle: 'Gunluk Limit Doldu',
      feedbackDailyLimitMessage: 'Gunde en fazla 5 geri bildirim gonderebilirsin.',
      feedbackRemaining: 'Bugun kalan: {{remaining}} / {{limit}}',
      feedbackNoPersonalInfo: 'E-posta, isim veya kisisel veri istemiyoruz.',
      feedbackCategoryLabel: 'Kategori',
      feedbackCategories: {
        complaint: 'Sikayet',
        suggestion: 'Oneri',
        question: 'Soru',
        other: 'Diger',
      },
      progress: 'İlerleme',
      progressCopy: 'Yerel ilerlemeyi, açılan bölümleri, yıldızları ve kayıtlı en iyi skorları sıfırla.',
      campaignTools: 'Parkur Araçları',
      campaignToolsCopy: 'PocketBase testleri sırasında remote parkur paketlerini eklemek ve yenilemek için bu araçları kullan.',
      resetProgress: 'İlerlemeyi Sıfırla',
      clearCampaignCache: 'Parkur Cache Temizle',
      seedCampaignData: 'Remote Parkur Seed Et',
      seedCampaignDataTitle: 'Remote Parkur Seed Et',
      seedCampaignDataMessage: 'Bu işlem örnek kutu ve bölüm verilerini PocketBase içine ekler.',
      seedCampaignDataSuccess: 'Örnek parkur verisi başarıyla eklendi.',
      seedCampaignDataError: 'PocketBase seed işlemi başarısız oldu.',
      clearCampaignCacheTitle: 'Parkur Cache Temizle',
      clearCampaignCacheMessage: 'İndirilen parkur paketlerini siler, gerektiğinde yeniden çeker.',
      resetProgressTitle: 'İlerlemeyi Sıfırla',
      resetProgressMessage: 'Bu işlem tüm yerel oyun ilerlemesini temizler.',
      cancel: 'Vazgeç',
      reset: 'Sıfırla',
      languages: {
        en: 'İngilizce',
        tr: 'Türkçe',
      },
      discoverAgain: 'Discover Rehberini Tekrar Göster',
    },
    discover: {
      title: 'Center Hit Keşfi',
      skip: 'Geç',
      next: 'İleri',
      done: 'Başla',
      stepCounter: 'Adım',
      steps: {
        homeTitle: 'Ana Sayfa ve Devam',
        homeCopy: 'Devam Et ile mevcut koşuna hızlıca geri dönebilirsin.',
        packsTitle: 'Kutular ve Kilitler',
        packsCopy: 'Bölümleri bitirerek sonraki kutuyu açar ve daha zor sahnelere geçersin.',
        gameTitle: 'Mükemmel Alan',
        gameCopy: 'Daha iyi skor için hedefin parlak merkezine nişan al ve Mükemmel vur.',
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
      tutorialTitle: 'İlk Oyun Rehberi',
      tutorialSkip: 'Geç',
      tutorialNext: 'İleri',
      tutorialDone: 'Anladım',
      tutorialStep: 'Adım',
      tutorialSteps: {
        targetTitle: 'Hedef ve Mükemmel Alan',
        targetCopy: 'Hedefi vur. Parlak merkeze yakın atışlar Mükemmel sayılır.',
        objectiveTitle: 'Hedef ve Haklar',
        objectiveCopy: 'Hata ve atış limitin bitmeden bölüm hedeflerini tamamla.',
        obstacleTitle: 'Engeller',
        obstacleCopy: 'Atışın engele çarparsa Engellendi olur ve kaçırma gibi sayılır.',
      },
    },
  },
};
