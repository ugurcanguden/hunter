export type LevelResultStars = 0 | 1 | 2 | 3;

export type LevelProgressRecord = {
  levelId: string;
  stars: LevelResultStars;
  bestScore?: number;
  bestPerfectCount?: number;
  lastCompletedAt?: string;
};

export type ProgressState = {
  unlockedLevelIds: string[];
  levelRecords: Record<string, LevelProgressRecord>;
  bestScore: number;
  lastPlayedLevelId: string | null;
  totalStars: number;
};

export type SaveLevelResultInput = {
  levelId: string;
  stars: LevelResultStars;
  score: number;
  perfectCount: number;
  completedAt?: string;
};
