import {
  LevelDefinition,
  LevelDifficulty,
  MovementAxis,
  MovementBehavior,
  ObstacleDefinition,
} from '@centerhit-features/levels/types/levelTypes';

type LevelTuning = {
  launcherSpeed: number;
  launcherRange: number;
  targetSize: number;
  targetSpeed: number;
  targetRange: number;
  ballSpeed: number;
  requiredHits: number;
  requiredPerfectHits: number;
  maxMissAllowed: number;
  maxShots: number;
  oneStarScore: number;
  twoStarScore: number;
  threeStarScore: number;
};

type ObstacleTemplate = Omit<ObstacleDefinition, 'id'>;

type EasyTheme = {
  title: string;
  axis: MovementAxis;
  behavior: MovementBehavior;
  start: LevelTuning;
  end: LevelTuning;
  finalObstacles?: ObstacleTemplate[];
  obstacleRevealStep?: number;
};

function round(value: number, digits = 2) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}

function lerpInt(start: number, end: number, factor: number) {
  return Math.round(lerp(start, end, factor));
}

function padLevel(order: number) {
  return String(order).padStart(2, '0');
}

function createLevelFromTuning(
  order: number,
  title: string,
  difficulty: LevelDifficulty,
  axis: MovementAxis,
  behavior: MovementBehavior,
  tuning: LevelTuning,
  obstacles?: ObstacleDefinition[],
): LevelDefinition {
  const requiredHits = lerpInt(tuning.requiredHits, tuning.requiredHits, 1);
  const maxShots = Math.max(lerpInt(tuning.maxShots, tuning.maxShots, 1), requiredHits);

  return {
    id: `level-${padLevel(order)}`,
    order,
    title,
    difficulty,
    launcher: {
      speed: round(tuning.launcherSpeed),
      moveRangePercent: round(tuning.launcherRange),
    },
    target: {
      size: round(tuning.targetSize),
      speed: round(tuning.targetSpeed),
      movementAxis: axis,
      movementBehavior: behavior,
      moveRangePercent: axis === 'static' ? 0 : round(tuning.targetRange),
    },
    ball: { speed: round(tuning.ballSpeed) },
    objective: {
      requiredHits,
      requiredPerfectHits: lerpInt(tuning.requiredPerfectHits, tuning.requiredPerfectHits, 1),
      maxMissAllowed: lerpInt(tuning.maxMissAllowed, tuning.maxMissAllowed, 1),
      maxShots,
    },
    stars: {
      oneStarScore: lerpInt(tuning.oneStarScore, tuning.oneStarScore, 1),
      twoStarScore: lerpInt(tuning.twoStarScore, tuning.twoStarScore, 1),
      threeStarScore: lerpInt(tuning.threeStarScore, tuning.threeStarScore, 1),
    },
    obstacles,
  };
}

function interpolateTuning(start: LevelTuning, end: LevelTuning, factor: number): LevelTuning {
  return {
    launcherSpeed: lerp(start.launcherSpeed, end.launcherSpeed, factor),
    launcherRange: lerp(start.launcherRange, end.launcherRange, factor),
    targetSize: lerp(start.targetSize, end.targetSize, factor),
    targetSpeed: lerp(start.targetSpeed, end.targetSpeed, factor),
    targetRange: lerp(start.targetRange, end.targetRange, factor),
    ballSpeed: lerp(start.ballSpeed, end.ballSpeed, factor),
    requiredHits: lerpInt(start.requiredHits, end.requiredHits, factor),
    requiredPerfectHits: lerpInt(start.requiredPerfectHits, end.requiredPerfectHits, factor),
    maxMissAllowed: lerpInt(start.maxMissAllowed, end.maxMissAllowed, factor),
    maxShots: lerpInt(start.maxShots, end.maxShots, factor),
    oneStarScore: lerpInt(start.oneStarScore, end.oneStarScore, factor),
    twoStarScore: lerpInt(start.twoStarScore, end.twoStarScore, factor),
    threeStarScore: lerpInt(start.threeStarScore, end.threeStarScore, factor),
  };
}

function mergeProgressiveStart(previous: LevelTuning, next: LevelTuning): LevelTuning {
  return {
    launcherSpeed: Math.max(previous.launcherSpeed, next.launcherSpeed),
    launcherRange: Math.max(previous.launcherRange, next.launcherRange),
    targetSize: Math.min(previous.targetSize, next.targetSize),
    targetSpeed: Math.max(previous.targetSpeed, next.targetSpeed),
    targetRange: Math.max(previous.targetRange, next.targetRange),
    ballSpeed: Math.max(previous.ballSpeed, next.ballSpeed),
    requiredHits: Math.max(previous.requiredHits, next.requiredHits),
    requiredPerfectHits: Math.max(previous.requiredPerfectHits, next.requiredPerfectHits),
    maxMissAllowed: Math.min(previous.maxMissAllowed, next.maxMissAllowed),
    maxShots: Math.max(previous.maxShots, next.maxShots),
    oneStarScore: Math.max(previous.oneStarScore, next.oneStarScore),
    twoStarScore: Math.max(previous.twoStarScore, next.twoStarScore),
    threeStarScore: Math.max(previous.threeStarScore, next.threeStarScore),
  };
}

function mergeProgressiveEnd(start: LevelTuning, end: LevelTuning): LevelTuning {
  return {
    launcherSpeed: Math.max(start.launcherSpeed, end.launcherSpeed),
    launcherRange: Math.max(start.launcherRange, end.launcherRange),
    targetSize: Math.min(start.targetSize, end.targetSize),
    targetSpeed: Math.max(start.targetSpeed, end.targetSpeed),
    targetRange: Math.max(start.targetRange, end.targetRange),
    ballSpeed: Math.max(start.ballSpeed, end.ballSpeed),
    requiredHits: Math.max(start.requiredHits, end.requiredHits),
    requiredPerfectHits: Math.max(start.requiredPerfectHits, end.requiredPerfectHits),
    maxMissAllowed: Math.min(start.maxMissAllowed, end.maxMissAllowed),
    maxShots: Math.max(start.maxShots, end.maxShots),
    oneStarScore: Math.max(start.oneStarScore, end.oneStarScore),
    twoStarScore: Math.max(start.twoStarScore, end.twoStarScore),
    threeStarScore: Math.max(start.threeStarScore, end.threeStarScore),
  };
}

function buildObstacleProgress(
  order: number,
  finalObstacles: ObstacleTemplate[] | undefined,
  variantIndex: number,
  revealStep: number,
): ObstacleDefinition[] | undefined {
  if (!finalObstacles || finalObstacles.length === 0 || variantIndex < revealStep) {
    return undefined;
  }

  const visibleCount =
    variantIndex === revealStep ? Math.min(1, finalObstacles.length) : finalObstacles.length;
  const scale = 0.72 + variantIndex * 0.07;

  return finalObstacles.slice(0, visibleCount).map((obstacle, index) => ({
    ...obstacle,
    id: `obs-${padLevel(order)}-${String.fromCharCode(97 + index)}`,
    widthPercent:
      typeof obstacle.widthPercent === 'number'
        ? round(obstacle.widthPercent * scale, 3)
        : obstacle.widthPercent,
    heightPercent:
      typeof obstacle.heightPercent === 'number'
        ? round(obstacle.heightPercent * scale, 3)
        : obstacle.heightPercent,
  }));
}

function buildEasyLevels(themes: readonly EasyTheme[]) {
  const suffixes = ['Primer', 'Warmup', 'Flow', 'Focus', 'Final'];
  const builtLevels: LevelDefinition[] = [];
  let previousEnd: LevelTuning | null = null;

  themes.forEach((theme, themeIndex) => {
    const progressiveStart = previousEnd
      ? mergeProgressiveStart(previousEnd, theme.start)
      : theme.start;
    const progressiveEnd = mergeProgressiveEnd(progressiveStart, theme.end);

    suffixes.forEach((suffix, variantIndex) => {
      const factor = variantIndex / (suffixes.length - 1);
      const order = themeIndex * suffixes.length + variantIndex + 1;
      const tuning = interpolateTuning(progressiveStart, progressiveEnd, factor);
      const obstacles = buildObstacleProgress(
        order,
        theme.finalObstacles,
        variantIndex,
        theme.obstacleRevealStep ?? 2,
      );

      builtLevels.push(
        createLevelFromTuning(
          order,
          `${theme.title} ${suffix}`,
          'easy',
          theme.axis,
          theme.behavior,
          tuning,
          obstacles,
        ),
      );
    });

    previousEnd = progressiveEnd;
  });

  return builtLevels;
}

function shiftLevels(levelsToShift: readonly LevelDefinition[], offset: number) {
  return levelsToShift.map(level => {
    const shiftedOrder = level.order + offset;

    return {
      ...level,
      id: `level-${padLevel(shiftedOrder)}`,
      order: shiftedOrder,
      obstacles: level.obstacles?.map((obstacle, index) => ({
        ...obstacle,
        id: `obs-${padLevel(shiftedOrder)}-${String.fromCharCode(97 + index)}`,
      })),
    };
  });
}

const easyThemes: readonly EasyTheme[] = [
  {
    title: 'Soft Launch',
    axis: 'static',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.08,
      launcherRange: 0.12,
      targetSize: 1.08,
      targetSpeed: 0.42,
      targetRange: 0,
      ballSpeed: 0.96,
      requiredHits: 3,
      requiredPerfectHits: 0,
      maxMissAllowed: 5,
      maxShots: 7,
      oneStarScore: 140,
      twoStarScore: 240,
      threeStarScore: 320,
    },
    end: {
      launcherSpeed: 1.2,
      launcherRange: 0.16,
      targetSize: 1,
      targetSpeed: 0.6,
      targetRange: 0,
      ballSpeed: 1,
      requiredHits: 4,
      requiredPerfectHits: 0,
      maxMissAllowed: 4,
      maxShots: 6,
      oneStarScore: 200,
      twoStarScore: 320,
      threeStarScore: 440,
    },
  },
  {
    title: 'Pulse Center',
    axis: 'static',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.22,
      launcherRange: 0.16,
      targetSize: 0.98,
      targetSpeed: 0.62,
      targetRange: 0,
      ballSpeed: 1,
      requiredHits: 4,
      requiredPerfectHits: 0,
      maxMissAllowed: 4,
      maxShots: 7,
      oneStarScore: 220,
      twoStarScore: 340,
      threeStarScore: 460,
    },
    end: {
      launcherSpeed: 1.34,
      launcherRange: 0.2,
      targetSize: 0.9,
      targetSpeed: 0.8,
      targetRange: 0,
      ballSpeed: 1.05,
      requiredHits: 5,
      requiredPerfectHits: 1,
      maxMissAllowed: 3,
      maxShots: 7,
      oneStarScore: 280,
      twoStarScore: 420,
      threeStarScore: 560,
    },
  },
  {
    title: 'Opening Drift',
    axis: 'horizontal',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.36,
      launcherRange: 0.2,
      targetSize: 0.9,
      targetSpeed: 0.82,
      targetRange: 0.08,
      ballSpeed: 1.04,
      requiredHits: 5,
      requiredPerfectHits: 1,
      maxMissAllowed: 4,
      maxShots: 8,
      oneStarScore: 300,
      twoStarScore: 440,
      threeStarScore: 580,
    },
    end: {
      launcherSpeed: 1.48,
      launcherRange: 0.24,
      targetSize: 0.84,
      targetSpeed: 0.94,
      targetRange: 0.2,
      ballSpeed: 1.1,
      requiredHits: 6,
      requiredPerfectHits: 1,
      maxMissAllowed: 3,
      maxShots: 8,
      oneStarScore: 360,
      twoStarScore: 500,
      threeStarScore: 660,
    },
  },
  {
    title: 'Sync Line',
    axis: 'horizontal',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.5,
      launcherRange: 0.24,
      targetSize: 0.82,
      targetSpeed: 0.96,
      targetRange: 0.2,
      ballSpeed: 1.08,
      requiredHits: 6,
      requiredPerfectHits: 1,
      maxMissAllowed: 3,
      maxShots: 9,
      oneStarScore: 360,
      twoStarScore: 520,
      threeStarScore: 660,
    },
    end: {
      launcherSpeed: 1.56,
      launcherRange: 0.26,
      targetSize: 0.78,
      targetSpeed: 1.08,
      targetRange: 0.26,
      ballSpeed: 1.12,
      requiredHits: 6,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 8,
      oneStarScore: 390,
      twoStarScore: 560,
      threeStarScore: 700,
    },
  },
  {
    title: 'Sweep Window',
    axis: 'horizontal',
    behavior: 'loop',
    start: {
      launcherSpeed: 1.56,
      launcherRange: 0.26,
      targetSize: 0.8,
      targetSpeed: 1.04,
      targetRange: 0.24,
      ballSpeed: 1.1,
      requiredHits: 6,
      requiredPerfectHits: 1,
      maxMissAllowed: 3,
      maxShots: 9,
      oneStarScore: 400,
      twoStarScore: 560,
      threeStarScore: 700,
    },
    end: {
      launcherSpeed: 1.68,
      launcherRange: 0.28,
      targetSize: 0.72,
      targetSpeed: 1.2,
      targetRange: 0.3,
      ballSpeed: 1.14,
      requiredHits: 7,
      requiredPerfectHits: 2,
      maxMissAllowed: 2,
      maxShots: 10,
      oneStarScore: 470,
      twoStarScore: 650,
      threeStarScore: 800,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.57,
        widthPercent: 0.11,
        heightPercent: 0.038,
      },
    ],
  },
  {
    title: 'Skill Gate',
    axis: 'horizontal',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.66,
      launcherRange: 0.28,
      targetSize: 0.74,
      targetSpeed: 1.14,
      targetRange: 0.28,
      ballSpeed: 1.14,
      requiredHits: 7,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 10,
      oneStarScore: 460,
      twoStarScore: 640,
      threeStarScore: 780,
    },
    end: {
      launcherSpeed: 1.78,
      launcherRange: 0.3,
      targetSize: 0.67,
      targetSpeed: 1.32,
      targetRange: 0.34,
      ballSpeed: 1.18,
      requiredHits: 8,
      requiredPerfectHits: 3,
      maxMissAllowed: 2,
      maxShots: 10,
      oneStarScore: 540,
      twoStarScore: 740,
      threeStarScore: 900,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.54,
        widthPercent: 0.14,
        heightPercent: 0.042,
      },
    ],
  },
  {
    title: 'Rhythm Break',
    axis: 'horizontal',
    behavior: 'loop',
    start: {
      launcherSpeed: 1.74,
      launcherRange: 0.28,
      targetSize: 0.72,
      targetSpeed: 1.2,
      targetRange: 0.28,
      ballSpeed: 1.16,
      requiredHits: 7,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 10,
      oneStarScore: 500,
      twoStarScore: 700,
      threeStarScore: 860,
    },
    end: {
      launcherSpeed: 1.82,
      launcherRange: 0.3,
      targetSize: 0.64,
      targetSpeed: 1.34,
      targetRange: 0.32,
      ballSpeed: 1.2,
      requiredHits: 8,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 11,
      oneStarScore: 590,
      twoStarScore: 780,
      threeStarScore: 930,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.56,
        widthPercent: 0.08,
        heightPercent: 0.032,
      },
    ],
  },
  {
    title: 'Tight Relay',
    axis: 'horizontal',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.8,
      launcherRange: 0.3,
      targetSize: 0.68,
      targetSpeed: 1.28,
      targetRange: 0.3,
      ballSpeed: 1.18,
      requiredHits: 8,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 11,
      oneStarScore: 560,
      twoStarScore: 760,
      threeStarScore: 920,
    },
    end: {
      launcherSpeed: 1.9,
      launcherRange: 0.32,
      targetSize: 0.6,
      targetSpeed: 1.46,
      targetRange: 0.34,
      ballSpeed: 1.24,
      requiredHits: 9,
      requiredPerfectHits: 3,
      maxMissAllowed: 3,
      maxShots: 12,
      oneStarScore: 660,
      twoStarScore: 840,
      threeStarScore: 1020,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.55,
        widthPercent: 0.1,
        heightPercent: 0.036,
      },
    ],
  },
  {
    title: 'Split View',
    axis: 'horizontal',
    behavior: 'loop',
    start: {
      launcherSpeed: 1.86,
      launcherRange: 0.31,
      targetSize: 0.64,
      targetSpeed: 1.34,
      targetRange: 0.32,
      ballSpeed: 1.22,
      requiredHits: 8,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 12,
      oneStarScore: 620,
      twoStarScore: 820,
      threeStarScore: 980,
    },
    end: {
      launcherSpeed: 1.96,
      launcherRange: 0.34,
      targetSize: 0.57,
      targetSpeed: 1.5,
      targetRange: 0.34,
      ballSpeed: 1.26,
      requiredHits: 9,
      requiredPerfectHits: 3,
      maxMissAllowed: 3,
      maxShots: 13,
      oneStarScore: 720,
      twoStarScore: 920,
      threeStarScore: 1100,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.34,
        yPercent: 0.5,
        widthPercent: 0.1,
        heightPercent: 0.034,
      },
      {
        type: 'blocker',
        xPercent: 0.66,
        yPercent: 0.5,
        widthPercent: 0.1,
        heightPercent: 0.034,
      },
    ],
    obstacleRevealStep: 1,
  },
  {
    title: 'Crown Gate',
    axis: 'horizontal',
    behavior: 'bounce',
    start: {
      launcherSpeed: 1.92,
      launcherRange: 0.33,
      targetSize: 0.62,
      targetSpeed: 1.42,
      targetRange: 0.34,
      ballSpeed: 1.24,
      requiredHits: 9,
      requiredPerfectHits: 2,
      maxMissAllowed: 3,
      maxShots: 13,
      oneStarScore: 680,
      twoStarScore: 900,
      threeStarScore: 1080,
    },
    end: {
      launcherSpeed: 2.02,
      launcherRange: 0.35,
      targetSize: 0.52,
      targetSpeed: 1.6,
      targetRange: 0.36,
      ballSpeed: 1.28,
      requiredHits: 10,
      requiredPerfectHits: 3,
      maxMissAllowed: 2,
      maxShots: 14,
      oneStarScore: 800,
      twoStarScore: 1040,
      threeStarScore: 1240,
    },
    finalObstacles: [
      {
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.52,
        widthPercent: 0.08,
        heightPercent: 0.034,
      },
      {
        type: 'blocker',
        xPercent: 0.24,
        yPercent: 0.45,
        widthPercent: 0.08,
        heightPercent: 0.032,
      },
      {
        type: 'blocker',
        xPercent: 0.76,
        yPercent: 0.45,
        widthPercent: 0.08,
        heightPercent: 0.032,
      },
    ],
    obstacleRevealStep: 1,
  },
];

const advancedLevelsBase: readonly LevelDefinition[] = [
  // ── MEDIUM (→ pack-02, orders 51-60) ─────────────────────────────────────
  {
    id: 'level-11',
    order: 11,
    title: 'Tempo Shift',
    difficulty: 'medium',
    launcher: { speed: 1.9, moveRangePercent: 0.36 },
    target: { size: 0.58, speed: 1.45, movementAxis: 'static', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.28 },
    objective: { requiredHits: 9, requiredPerfectHits: 3, maxMissAllowed: 2, maxShots: 12 },
    stars: { oneStarScore: 760, twoStarScore: 940, threeStarScore: 1120 },
  },
  {
    id: 'level-12',
    order: 12,
    title: 'Twin Window',
    difficulty: 'medium',
    launcher: { speed: 1.96, moveRangePercent: 0.34 },
    target: { size: 0.54, speed: 1.52, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.34 },
    ball: { speed: 1.30 },
    objective: { requiredHits: 9, requiredPerfectHits: 3, maxMissAllowed: 2, maxShots: 12 },
    stars: { oneStarScore: 790, twoStarScore: 980, threeStarScore: 1160 },
    obstacles: [
      { id: 'obs-12-a', type: 'blocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.12, heightPercent: 0.036 },
    ],
  },
  {
    // vertical intro — first taste of up/down target in pack-02
    id: 'level-13',
    order: 13,
    title: 'Vertical Shift',
    difficulty: 'medium',
    launcher: { speed: 2.00, moveRangePercent: 0.37 },
    target: { size: 0.54, speed: 0.90, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.31 },
    objective: { requiredHits: 9, requiredPerfectHits: 2, maxMissAllowed: 3, maxShots: 13 },
    stars: { oneStarScore: 840, twoStarScore: 1030, threeStarScore: 1220 },
  },
  {
    id: 'level-14',
    order: 14,
    title: 'Still Nerve',
    difficulty: 'medium',
    launcher: { speed: 2.05, moveRangePercent: 0.40 },
    target: { size: 0.5, speed: 1.2, movementAxis: 'static', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.32 },
    objective: { requiredHits: 10, requiredPerfectHits: 4, maxMissAllowed: 2, maxShots: 13 },
    stars: { oneStarScore: 880, twoStarScore: 1080, threeStarScore: 1270 },
  },
  {
    // first blink — very long visible window, just introduces the concept
    id: 'level-15',
    order: 15,
    title: 'Blink Gate',
    difficulty: 'medium',
    launcher: { speed: 2.10, moveRangePercent: 0.42 },
    target: { size: 0.50, speed: 1.70, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.40, blink: { visibleMs: 2000, hiddenMs: 300 } },
    ball: { speed: 1.33 },
    objective: { requiredHits: 10, requiredPerfectHits: 3, maxMissAllowed: 3, maxShots: 14 },
    stars: { oneStarScore: 930, twoStarScore: 1140, threeStarScore: 1340 },
  },
  {
    id: 'level-16',
    order: 16,
    title: 'Split Corridor',
    difficulty: 'medium',
    launcher: { speed: 2.14, moveRangePercent: 0.43 },
    target: { size: 0.46, speed: 1.74, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.44 },
    ball: { speed: 1.35 },
    objective: { requiredHits: 11, requiredPerfectHits: 4, maxMissAllowed: 1, maxShots: 14 },
    stars: { oneStarScore: 970, twoStarScore: 1190, threeStarScore: 1390 },
    obstacles: [
      { id: 'obs-16-a', type: 'blocker', xPercent: 0.34, yPercent: 0.48, widthPercent: 0.09, heightPercent: 0.032 },
      { id: 'obs-16-b', type: 'blocker', xPercent: 0.66, yPercent: 0.58, widthPercent: 0.09, heightPercent: 0.032 },
    ],
  },
  {
    // vertical + 1 obstacle, still medium difficulty
    id: 'level-17',
    order: 17,
    title: 'Vertical Lock',
    difficulty: 'medium',
    launcher: { speed: 2.18, moveRangePercent: 0.44 },
    target: { size: 0.46, speed: 1.15, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.35 },
    objective: { requiredHits: 11, requiredPerfectHits: 4, maxMissAllowed: 2, maxShots: 14 },
    stars: { oneStarScore: 1020, twoStarScore: 1240, threeStarScore: 1450 },
    obstacles: [
      { id: 'obs-17-a', type: 'blocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.12, heightPercent: 0.034 },
    ],
  },
  {
    id: 'level-18',
    order: 18,
    title: 'Still Pressure',
    difficulty: 'medium',
    launcher: { speed: 2.22, moveRangePercent: 0.47 },
    target: { size: 0.42, speed: 1.3, movementAxis: 'static', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.38 },
    objective: { requiredHits: 12, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 15 },
    stars: { oneStarScore: 1060, twoStarScore: 1280, threeStarScore: 1490 },
    obstacles: [
      { id: 'obs-18-a', type: 'blocker', xPercent: 0.32, yPercent: 0.5, widthPercent: 0.1, heightPercent: 0.03 },
      { id: 'obs-18-b', type: 'blocker', xPercent: 0.68, yPercent: 0.5, widthPercent: 0.1, heightPercent: 0.03 },
    ],
  },
  {
    id: 'level-19',
    order: 19,
    title: 'Pulse Weave',
    difficulty: 'medium',
    launcher: { speed: 2.26, moveRangePercent: 0.48 },
    target: { size: 0.4, speed: 1.9, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.48 },
    ball: { speed: 1.40 },
    objective: { requiredHits: 13, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 16 },
    stars: { oneStarScore: 1110, twoStarScore: 1330, threeStarScore: 1540 },
    obstacles: [
      { id: 'obs-19-a', type: 'blocker', xPercent: 0.5, yPercent: 0.5, widthPercent: 0.11, heightPercent: 0.03 },
      { id: 'obs-19-b', type: 'blocker', xPercent: 0.2, yPercent: 0.42, widthPercent: 0.07, heightPercent: 0.028 },
      { id: 'obs-19-c', type: 'blocker', xPercent: 0.8, yPercent: 0.42, widthPercent: 0.07, heightPercent: 0.028 },
    ],
  },
  {
    // pack-02 cap: blink + obstacles — harder feel but manageable timing
    id: 'level-20',
    order: 20,
    title: 'Blink Weave',
    difficulty: 'medium',
    launcher: { speed: 2.32, moveRangePercent: 0.49 },
    target: { size: 0.40, speed: 1.95, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.44, blink: { visibleMs: 1600, hiddenMs: 400 } },
    ball: { speed: 1.42 },
    objective: { requiredHits: 12, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 15 },
    stars: { oneStarScore: 1150, twoStarScore: 1380, threeStarScore: 1600 },
    obstacles: [
      { id: 'obs-20-a', type: 'blocker', xPercent: 0.24, yPercent: 0.55, widthPercent: 0.08, heightPercent: 0.03 },
      { id: 'obs-20-b', type: 'blocker', xPercent: 0.5, yPercent: 0.46, widthPercent: 0.10, heightPercent: 0.03 },
      { id: 'obs-20-c', type: 'blocker', xPercent: 0.76, yPercent: 0.55, widthPercent: 0.08, heightPercent: 0.03 },
    ],
  },

  // ── HARD (→ pack-03, orders 61-70) — mixed mechanics, ~25% easier than before ──
  {
    id: 'level-21',
    order: 21,
    title: 'Signal Crown',
    difficulty: 'hard',
    launcher: { speed: 2.36, moveRangePercent: 0.49 },
    target: { size: 0.36, speed: 2.10, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.48 },
    ball: { speed: 1.41 },
    objective: { requiredHits: 13, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 16 },
    stars: { oneStarScore: 1220, twoStarScore: 1470, threeStarScore: 1670 },
    obstacles: [
      { id: 'obs-21-a', type: 'blocker', xPercent: 0.34, yPercent: 0.46, widthPercent: 0.07, heightPercent: 0.028 },
      { id: 'obs-21-b', type: 'blocker', xPercent: 0.66, yPercent: 0.58, widthPercent: 0.07, heightPercent: 0.028 },
    ],
  },
  {
    // vertical hard — 2 obstacles, harder than pack-02 vertical
    id: 'level-22',
    order: 22,
    title: 'Vertical Core',
    difficulty: 'hard',
    launcher: { speed: 2.38, moveRangePercent: 0.50 },
    target: { size: 0.36, speed: 1.55, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.42 },
    objective: { requiredHits: 13, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 16 },
    stars: { oneStarScore: 1260, twoStarScore: 1510, threeStarScore: 1710 },
    obstacles: [
      { id: 'obs-22-a', type: 'blocker', xPercent: 0.32, yPercent: 0.48, widthPercent: 0.08, heightPercent: 0.028 },
      { id: 'obs-22-b', type: 'blocker', xPercent: 0.68, yPercent: 0.48, widthPercent: 0.08, heightPercent: 0.028 },
    ],
  },
  {
    id: 'level-23',
    order: 23,
    title: 'Split Pulse',
    difficulty: 'hard',
    launcher: { speed: 2.42, moveRangePercent: 0.51 },
    target: { size: 0.33, speed: 2.14, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.50 },
    ball: { speed: 1.43 },
    objective: { requiredHits: 14, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 17 },
    stars: { oneStarScore: 1300, twoStarScore: 1550, threeStarScore: 1750 },
    obstacles: [
      { id: 'obs-23-a', type: 'blocker', xPercent: 0.40, yPercent: 0.5, widthPercent: 0.07, heightPercent: 0.026 },
      { id: 'obs-23-b', type: 'blocker', xPercent: 0.60, yPercent: 0.5, widthPercent: 0.07, heightPercent: 0.026 },
    ],
  },
  {
    // blink at hard level — shorter visible window
    id: 'level-24',
    order: 24,
    title: 'Echo Blink',
    difficulty: 'hard',
    launcher: { speed: 2.44, moveRangePercent: 0.50 },
    target: { size: 0.34, speed: 2.00, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.46, blink: { visibleMs: 1300, hiddenMs: 600 } },
    ball: { speed: 1.44 },
    objective: { requiredHits: 14, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 17 },
    stars: { oneStarScore: 1340, twoStarScore: 1590, threeStarScore: 1790 },
    obstacles: [
      { id: 'obs-24-a', type: 'blocker', xPercent: 0.18, yPercent: 0.48, widthPercent: 0.06, heightPercent: 0.026 },
      { id: 'obs-24-b', type: 'blocker', xPercent: 0.5, yPercent: 0.56, widthPercent: 0.07, heightPercent: 0.028 },
      { id: 'obs-24-c', type: 'blocker', xPercent: 0.82, yPercent: 0.48, widthPercent: 0.06, heightPercent: 0.026 },
    ],
  },
  {
    id: 'level-25',
    order: 25,
    title: 'Static Fracture',
    difficulty: 'hard',
    launcher: { speed: 2.46, moveRangePercent: 0.52 },
    target: { size: 0.31, speed: 2.18, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.52 },
    ball: { speed: 1.44 },
    objective: { requiredHits: 15, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 17 },
    stars: { oneStarScore: 1380, twoStarScore: 1630, threeStarScore: 1830 },
    obstacles: [
      { id: 'obs-25-a', type: 'blocker', xPercent: 0.3, yPercent: 0.44, widthPercent: 0.06, heightPercent: 0.024 },
      { id: 'obs-25-b', type: 'blocker', xPercent: 0.5, yPercent: 0.60, widthPercent: 0.07, heightPercent: 0.026 },
      { id: 'obs-25-c', type: 'blocker', xPercent: 0.7, yPercent: 0.44, widthPercent: 0.06, heightPercent: 0.024 },
    ],
  },
  {
    // vertical + movingBlocker — introduces dynamic obstacles mid-progression
    id: 'level-26',
    order: 26,
    title: 'Pulse Rift',
    difficulty: 'hard',
    launcher: { speed: 2.48, moveRangePercent: 0.52 },
    target: { size: 0.32, speed: 1.75, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.45 },
    objective: { requiredHits: 15, requiredPerfectHits: 7, maxMissAllowed: 1, maxShots: 17 },
    stars: { oneStarScore: 1420, twoStarScore: 1670, threeStarScore: 1870 },
    obstacles: [
      { id: 'obs-26-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.13, heightPercent: 0.036, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.10, moveRangePercent: 0.18 },
      { id: 'obs-26-b', type: 'blocker', xPercent: 0.22, yPercent: 0.44, widthPercent: 0.06, heightPercent: 0.024 },
    ],
  },
  {
    id: 'level-27',
    order: 27,
    title: 'Neon Spine',
    difficulty: 'hard',
    launcher: { speed: 2.50, moveRangePercent: 0.54 },
    target: { size: 0.29, speed: 2.22, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.54 },
    ball: { speed: 1.46 },
    objective: { requiredHits: 16, requiredPerfectHits: 7, maxMissAllowed: 1, maxShots: 18 },
    stars: { oneStarScore: 1460, twoStarScore: 1710, threeStarScore: 1910 },
    obstacles: [
      { id: 'obs-27-a', type: 'blocker', xPercent: 0.18, yPercent: 0.46, widthPercent: 0.055, heightPercent: 0.024 },
      { id: 'obs-27-b', type: 'blocker', xPercent: 0.5, yPercent: 0.56, widthPercent: 0.065, heightPercent: 0.026 },
      { id: 'obs-27-c', type: 'blocker', xPercent: 0.82, yPercent: 0.46, widthPercent: 0.055, heightPercent: 0.024 },
    ],
  },
  {
    // hard blink + movingBlocker — two mechanics at once
    id: 'level-28',
    order: 28,
    title: 'Hardline Blink',
    difficulty: 'hard',
    launcher: { speed: 2.52, moveRangePercent: 0.54 },
    target: { size: 0.30, speed: 2.10, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.50, blink: { visibleMs: 1100, hiddenMs: 700 } },
    ball: { speed: 1.47 },
    objective: { requiredHits: 16, requiredPerfectHits: 7, maxMissAllowed: 1, maxShots: 18 },
    stars: { oneStarScore: 1500, twoStarScore: 1750, threeStarScore: 1950 },
    obstacles: [
      { id: 'obs-28-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.54, widthPercent: 0.12, heightPercent: 0.034, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.12, moveRangePercent: 0.16 },
      { id: 'obs-28-b', type: 'blocker', xPercent: 0.66, yPercent: 0.44, widthPercent: 0.055, heightPercent: 0.022 },
    ],
  },
  {
    id: 'level-29',
    order: 29,
    title: 'Edge Pulse',
    difficulty: 'hard',
    launcher: { speed: 2.54, moveRangePercent: 0.56 },
    target: { size: 0.27, speed: 2.26, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.56 },
    ball: { speed: 1.48 },
    objective: { requiredHits: 17, requiredPerfectHits: 8, maxMissAllowed: 1, maxShots: 19 },
    stars: { oneStarScore: 1540, twoStarScore: 1790, threeStarScore: 1990 },
    obstacles: [
      { id: 'obs-29-a', type: 'blocker', xPercent: 0.24, yPercent: 0.56, widthPercent: 0.055, heightPercent: 0.022 },
      { id: 'obs-29-b', type: 'blocker', xPercent: 0.5, yPercent: 0.46, widthPercent: 0.06, heightPercent: 0.024 },
      { id: 'obs-29-c', type: 'blocker', xPercent: 0.76, yPercent: 0.56, widthPercent: 0.055, heightPercent: 0.022 },
    ],
  },
  {
    // pack-03 cap — launcher 2.56 (was 3.02), size 0.26 (was 0.25), hits 17 (was 20)
    id: 'level-30',
    order: 30,
    title: 'Summit Gate',
    difficulty: 'hard',
    launcher: { speed: 2.56, moveRangePercent: 0.57 },
    target: { size: 0.26, speed: 2.30, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.56 },
    ball: { speed: 1.50 },
    objective: { requiredHits: 17, requiredPerfectHits: 8, maxMissAllowed: 1, maxShots: 19 },
    stars: { oneStarScore: 1600, twoStarScore: 1850, threeStarScore: 2050 },
    obstacles: [
      { id: 'obs-30-a', type: 'blocker', xPercent: 0.20, yPercent: 0.5, widthPercent: 0.05, heightPercent: 0.022 },
      { id: 'obs-30-b', type: 'blocker', xPercent: 0.5, yPercent: 0.58, widthPercent: 0.06, heightPercent: 0.024 },
      { id: 'obs-30-c', type: 'blocker', xPercent: 0.80, yPercent: 0.5, widthPercent: 0.05, heightPercent: 0.022 },
    ],
  },
] as const;

const easyLevels = buildEasyLevels(easyThemes);
const mediumLevels = shiftLevels(advancedLevelsBase.slice(0, 10), 40);
const hardLevels = shiftLevels(advancedLevelsBase.slice(10), 40);

const verticalLevels: readonly LevelDefinition[] = [
  {
    id: 'level-71',
    order: 71,
    title: 'Vertical Primer',
    difficulty: 'hard',
    launcher: { speed: 2.10, moveRangePercent: 0.38 },
    target: { size: 0.68, speed: 0.95, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.32 },
    objective: { requiredHits: 9, requiredPerfectHits: 2, maxMissAllowed: 4, maxShots: 13 },
    stars: { oneStarScore: 800, twoStarScore: 1000, threeStarScore: 1200 },
  },
  {
    id: 'level-72',
    order: 72,
    title: 'Vertical Warmup',
    difficulty: 'hard',
    launcher: { speed: 2.22, moveRangePercent: 0.40 },
    target: { size: 0.62, speed: 1.15, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.34 },
    objective: { requiredHits: 10, requiredPerfectHits: 3, maxMissAllowed: 3, maxShots: 14 },
    stars: { oneStarScore: 920, twoStarScore: 1140, threeStarScore: 1360 },
  },
  {
    id: 'level-73',
    order: 73,
    title: 'Vertical Flow',
    difficulty: 'hard',
    launcher: { speed: 2.34, moveRangePercent: 0.42 },
    target: { size: 0.58, speed: 1.38, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.36 },
    objective: { requiredHits: 11, requiredPerfectHits: 3, maxMissAllowed: 2, maxShots: 14 },
    stars: { oneStarScore: 1040, twoStarScore: 1280, threeStarScore: 1520 },
    obstacles: [
      { id: 'obs-73-a', type: 'blocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.12, heightPercent: 0.036 },
    ],
  },
  {
    id: 'level-74',
    order: 74,
    title: 'Vertical Focus',
    difficulty: 'hard',
    launcher: { speed: 2.50, moveRangePercent: 0.44 },
    target: { size: 0.54, speed: 1.62, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.38 },
    objective: { requiredHits: 12, requiredPerfectHits: 4, maxMissAllowed: 2, maxShots: 15 },
    stars: { oneStarScore: 1160, twoStarScore: 1420, threeStarScore: 1680 },
    obstacles: [
      { id: 'obs-74-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.56, widthPercent: 0.13, heightPercent: 0.038, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.11, moveRangePercent: 0.20 },
    ],
  },
  {
    id: 'level-75',
    order: 75,
    title: 'Vertical Final',
    difficulty: 'hard',
    launcher: { speed: 2.66, moveRangePercent: 0.46 },
    target: { size: 0.50, speed: 1.90, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.40 },
    objective: { requiredHits: 13, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 16 },
    stars: { oneStarScore: 1280, twoStarScore: 1560, threeStarScore: 1840 },
    obstacles: [
      { id: 'obs-75-a', type: 'movingBlocker', xPercent: 0.34, yPercent: 0.54, widthPercent: 0.11, heightPercent: 0.036, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.13, moveRangePercent: 0.17 },
      { id: 'obs-75-b', type: 'movingBlocker', xPercent: 0.66, yPercent: 0.54, widthPercent: 0.11, heightPercent: 0.036, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.13, moveRangePercent: 0.17 },
    ],
  },
  {
    id: 'level-76',
    order: 76,
    title: 'Vertical Apex',
    difficulty: 'hard',
    levelType: 'boss',
    launcher: { speed: 2.90, moveRangePercent: 0.50 },
    target: { size: 0.40, speed: 2.20, movementAxis: 'vertical', movementBehavior: 'bounce', moveRangePercent: 0 },
    ball: { speed: 1.44 },
    objective: { requiredHits: 8, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 12 },
    stars: { oneStarScore: 1400, twoStarScore: 1720, threeStarScore: 2000 },
    obstacles: [
      { id: 'obs-76-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.14, heightPercent: 0.04, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.17, moveRangePercent: 0.22 },
    ],
  },
];

const blinkLevels: readonly LevelDefinition[] = [
  {
    id: 'level-77',
    order: 77,
    title: 'Blink Primer',
    difficulty: 'hard',
    launcher: { speed: 2.15, moveRangePercent: 0.38 },
    target: { size: 0.68, speed: 1.20, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.30, blink: { visibleMs: 1800, hiddenMs: 400 } },
    ball: { speed: 1.32 },
    objective: { requiredHits: 8, requiredPerfectHits: 2, maxMissAllowed: 4, maxShots: 13 },
    stars: { oneStarScore: 840, twoStarScore: 1060, threeStarScore: 1260 },
  },
  {
    id: 'level-78',
    order: 78,
    title: 'Blink Warmup',
    difficulty: 'hard',
    launcher: { speed: 2.28, moveRangePercent: 0.40 },
    target: { size: 0.62, speed: 1.32, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.34, blink: { visibleMs: 1400, hiddenMs: 500 } },
    ball: { speed: 1.34 },
    objective: { requiredHits: 9, requiredPerfectHits: 3, maxMissAllowed: 3, maxShots: 13 },
    stars: { oneStarScore: 960, twoStarScore: 1200, threeStarScore: 1420 },
  },
  {
    id: 'level-79',
    order: 79,
    title: 'Blink Flow',
    difficulty: 'hard',
    launcher: { speed: 2.42, moveRangePercent: 0.44 },
    target: { size: 0.56, speed: 1.52, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.38, blink: { visibleMs: 1100, hiddenMs: 600 } },
    ball: { speed: 1.36 },
    objective: { requiredHits: 10, requiredPerfectHits: 3, maxMissAllowed: 2, maxShots: 14 },
    stars: { oneStarScore: 1080, twoStarScore: 1340, threeStarScore: 1580 },
    obstacles: [
      { id: 'obs-79-a', type: 'blocker', xPercent: 0.5, yPercent: 0.54, widthPercent: 0.10, heightPercent: 0.034 },
    ],
  },
  {
    id: 'level-80',
    order: 80,
    title: 'Blink Focus',
    difficulty: 'hard',
    launcher: { speed: 2.58, moveRangePercent: 0.48 },
    target: { size: 0.50, speed: 1.76, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.42, blink: { visibleMs: 900, hiddenMs: 700 } },
    ball: { speed: 1.38 },
    objective: { requiredHits: 11, requiredPerfectHits: 4, maxMissAllowed: 2, maxShots: 15 },
    stars: { oneStarScore: 1200, twoStarScore: 1480, threeStarScore: 1740 },
    obstacles: [
      { id: 'obs-80-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.56, widthPercent: 0.12, heightPercent: 0.036, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.14, moveRangePercent: 0.18 },
    ],
  },
  {
    id: 'level-81',
    order: 81,
    title: 'Blink Final',
    difficulty: 'hard',
    launcher: { speed: 2.74, moveRangePercent: 0.52 },
    target: { size: 0.44, speed: 2.02, movementAxis: 'horizontal', movementBehavior: 'loop', moveRangePercent: 0.46, blink: { visibleMs: 700, hiddenMs: 800 } },
    ball: { speed: 1.40 },
    objective: { requiredHits: 12, requiredPerfectHits: 5, maxMissAllowed: 1, maxShots: 15 },
    stars: { oneStarScore: 1320, twoStarScore: 1620, threeStarScore: 1900 },
    obstacles: [
      { id: 'obs-81-a', type: 'movingBlocker', xPercent: 0.35, yPercent: 0.54, widthPercent: 0.10, heightPercent: 0.034, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.15, moveRangePercent: 0.17 },
      { id: 'obs-81-b', type: 'blocker', xPercent: 0.65, yPercent: 0.46, widthPercent: 0.09, heightPercent: 0.032 },
    ],
  },
  {
    id: 'level-82',
    order: 82,
    title: 'Phantom Gate',
    difficulty: 'hard',
    levelType: 'boss',
    launcher: { speed: 3.00, moveRangePercent: 0.56 },
    target: { size: 0.38, speed: 2.30, movementAxis: 'horizontal', movementBehavior: 'bounce', moveRangePercent: 0.50, blink: { visibleMs: 600, hiddenMs: 900 } },
    ball: { speed: 1.44 },
    objective: { requiredHits: 8, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 12 },
    stars: { oneStarScore: 1460, twoStarScore: 1800, threeStarScore: 2100 },
    obstacles: [
      { id: 'obs-82-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.14, heightPercent: 0.04, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.19, moveRangePercent: 0.24 },
    ],
  },
];

const diagonalLevels: readonly LevelDefinition[] = [
  {
    id: 'level-83',
    order: 83,
    title: 'Diagonal Primer',
    difficulty: 'hard',
    launcher: { speed: 2.28, moveRangePercent: 0.42 },
    target: { size: 0.62, speed: 1.00, verticalSpeed: 0.80, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.26 },
    ball: { speed: 1.34 },
    objective: { requiredHits: 9, requiredPerfectHits: 2, maxMissAllowed: 4, maxShots: 13 },
    stars: { oneStarScore: 940, twoStarScore: 1180, threeStarScore: 1400 },
  },
  {
    id: 'level-84',
    order: 84,
    title: 'Diagonal Warmup',
    difficulty: 'hard',
    launcher: { speed: 2.44, moveRangePercent: 0.46 },
    target: { size: 0.56, speed: 1.22, verticalSpeed: 1.00, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.30 },
    ball: { speed: 1.36 },
    objective: { requiredHits: 10, requiredPerfectHits: 3, maxMissAllowed: 3, maxShots: 14 },
    stars: { oneStarScore: 1060, twoStarScore: 1320, threeStarScore: 1560 },
  },
  {
    id: 'level-85',
    order: 85,
    title: 'Diagonal Flow',
    difficulty: 'hard',
    launcher: { speed: 2.60, moveRangePercent: 0.50 },
    target: { size: 0.50, speed: 1.46, verticalSpeed: 1.22, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.34 },
    ball: { speed: 1.38 },
    objective: { requiredHits: 11, requiredPerfectHits: 4, maxMissAllowed: 2, maxShots: 15 },
    stars: { oneStarScore: 1180, twoStarScore: 1460, threeStarScore: 1720 },
    obstacles: [
      { id: 'obs-85-a', type: 'blocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.11, heightPercent: 0.034 },
    ],
  },
  {
    id: 'level-86',
    order: 86,
    title: 'Diagonal Focus',
    difficulty: 'hard',
    launcher: { speed: 2.76, moveRangePercent: 0.54 },
    target: { size: 0.44, speed: 1.72, verticalSpeed: 1.44, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.38 },
    ball: { speed: 1.40 },
    objective: { requiredHits: 12, requiredPerfectHits: 5, maxMissAllowed: 2, maxShots: 15 },
    stars: { oneStarScore: 1300, twoStarScore: 1600, threeStarScore: 1880 },
    obstacles: [
      { id: 'obs-86-a', type: 'blocker', xPercent: 0.30, yPercent: 0.5, widthPercent: 0.10, heightPercent: 0.032 },
      { id: 'obs-86-b', type: 'blocker', xPercent: 0.70, yPercent: 0.5, widthPercent: 0.10, heightPercent: 0.032 },
    ],
  },
  {
    id: 'level-87',
    order: 87,
    title: 'Diagonal Final',
    difficulty: 'hard',
    launcher: { speed: 2.90, moveRangePercent: 0.58 },
    target: { size: 0.38, speed: 2.00, verticalSpeed: 1.70, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.42 },
    ball: { speed: 1.42 },
    objective: { requiredHits: 13, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 16 },
    stars: { oneStarScore: 1420, twoStarScore: 1740, threeStarScore: 2040 },
    obstacles: [
      { id: 'obs-87-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.12, heightPercent: 0.036, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.16, moveRangePercent: 0.22 },
    ],
  },
  {
    id: 'level-88',
    order: 88,
    title: "Storm's Eye",
    difficulty: 'hard',
    levelType: 'boss',
    launcher: { speed: 3.10, moveRangePercent: 0.60 },
    target: { size: 0.34, speed: 2.20, verticalSpeed: 1.80, movementAxis: 'diagonal', movementBehavior: 'bounce', moveRangePercent: 0.44, blink: { visibleMs: 700, hiddenMs: 400 } },
    ball: { speed: 1.46 },
    objective: { requiredHits: 8, requiredPerfectHits: 6, maxMissAllowed: 1, maxShots: 12 },
    stars: { oneStarScore: 1580, twoStarScore: 1960, threeStarScore: 2280 },
    obstacles: [
      { id: 'obs-88-a', type: 'movingBlocker', xPercent: 0.5, yPercent: 0.55, widthPercent: 0.14, heightPercent: 0.04, movementAxis: 'horizontal', movementBehavior: 'bounce', speed: 0.19, moveRangePercent: 0.24 },
    ],
  },
];

export const levels: readonly LevelDefinition[] = [
  ...easyLevels,
  ...mediumLevels,
  ...hardLevels,
  ...verticalLevels,
  ...blinkLevels,
  ...diagonalLevels,
];
