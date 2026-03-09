export type LevelId = string;
export type LevelDifficulty = 'easy' | 'medium' | 'hard';
export type MovementAxis = 'static' | 'horizontal';
export type MovementBehavior = 'bounce' | 'loop';
export type ObstacleType = 'blocker' | 'movingBlocker';

export type LauncherConfig = {
  speed: number;
  moveRangePercent: number;
  widthScale?: number;
  heightScale?: number;
};

export type TargetConfig = {
  size: number;
  speed: number;
  movementAxis: MovementAxis;
  movementBehavior: MovementBehavior;
  moveRangePercent: number;
  heightScale?: number;
};

export type BallConfig = {
  speed: number;
  radiusScale?: number;
  visualSize?: number;
};

export type ObjectiveConfig = {
  requiredHits: number;
  requiredPerfectHits: number;
  maxMissAllowed: number;
  maxShots: number;
};

export type StarsConfig = {
  oneStarScore: number;
  twoStarScore: number;
  threeStarScore: number;
};

export type ObstacleDefinition = {
  id: string;
  type: ObstacleType;
  xPercent?: number;
  yPercent?: number;
  speed?: number;
  widthPercent?: number;
  heightPercent?: number;
};

export type LevelDefinition = {
  id: LevelId;
  order: number;
  title: string;
  difficulty: LevelDifficulty;
  launcher: LauncherConfig;
  target: TargetConfig;
  ball: BallConfig;
  objective: ObjectiveConfig;
  stars: StarsConfig;
  obstacles?: ObstacleDefinition[];
  metadata?: Record<string, string | number | boolean>;
};
