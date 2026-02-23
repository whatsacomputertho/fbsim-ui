import type { Drive, GameContext, OffensiveStats, MatchupConfig } from './types.js';

export interface GameFile {
  version: 1;
  matchupConfig: MatchupConfig;
  drives: Drive[];
  finalContext: GameContext;
  homeStats: OffensiveStats;
  awayStats: OffensiveStats;
}

export function downloadGameFile(gameFile: GameFile, filename?: string): void {
  const blob = new Blob([JSON.stringify(gameFile, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `game-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
