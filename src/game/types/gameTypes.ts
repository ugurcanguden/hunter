export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'failed';
export type HitQuality = 'perfect' | 'good' | 'miss' | 'blocked';

export type HitResult = {
  quality: HitQuality;
  message: string;
};

export type FeedbackState = {
  message: string | null;
  type: HitQuality | null;
  until: number | null;
};

export type VisualFeedbackState = {
  targetFlashMs: number;
  targetFlashTone: 'good' | 'perfect' | null;
  obstacleFlashMs: number;
  obstacleFlashId: string | null;
  stageEffectMs: number;
  stageEffectTone: 'success' | 'danger' | 'perfect' | null;
};

export type ObjectiveState = {
  requiredHits: number;
  requiredPerfectHits: number;
  maxMissAllowed: number;
  maxShots: number;
};

export type ObjectiveProgressState = {
  hits: number;
  requiredHits: number;
  perfectHits: number;
  requiredPerfectHits: number;
  misses: number;
  maxMissAllowed: number;
  remainingMisses: number;
  shotsFired: number;
  maxShots: number;
  remainingShots: number;
};

export type FailReason = 'miss-limit' | 'shot-limit' | null;

export type LauncherState = {
  x: number;
  y: number;
  direction: -1 | 1;
  speed: number;
  moveRangePercent: number;
  width: number;
  height: number;
};

export type TargetState = {
  x: number;
  y: number;
  direction: -1 | 1;
  width: number;
  height: number;
  size: number;
  speed: number;
  movementAxis: 'static' | 'horizontal';
  movementBehavior: 'bounce' | 'loop';
  moveRangePercent: number;
};

export type BallState = {
  speed: number;
  visualSize: number;
};

export type ProjectileState = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  isActive: boolean;
};

export type ObstacleState = {
  id: string;
  type: 'blocker';
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameSessionState = {
  status: GameStatus;
  score: number;
  hits: number;
  perfectHits: number;
  misses: number;
  shotsFired: number;
  awardedStars: 0 | 1 | 2 | 3;
  canShoot: boolean;
  failReason: FailReason;
  feedback: FeedbackState;
  visualFeedback: VisualFeedbackState;
  objective: ObjectiveState;
  objectiveProgress: ObjectiveProgressState;
  launcher: LauncherState;
  target: TargetState;
  ball: BallState;
  projectile: ProjectileState;
  obstacles: ObstacleState[];
};
