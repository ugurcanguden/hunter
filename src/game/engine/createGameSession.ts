import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { createInitialSessionState } from '@centerhit-game/models/gameSessionModels';

export function createGameSession(level: LevelDefinition) {
  return createInitialSessionState(level);
}
