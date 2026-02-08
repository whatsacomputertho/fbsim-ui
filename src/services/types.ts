import type {
  GameContext,
  Play,
  Drive,
  DriveResult,
  OffensiveStats,
} from '@whatsacomputertho/fbsim-core/web';

export type { GameContext, Play, Drive, DriveResult, OffensiveStats };

export interface TeamInput {
  name: string;
  offense_overall: number;
  defense_overall: number;
}

export interface MatchupInput {
  home: TeamInput;
  away: TeamInput;
}

export interface SimResult {
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
}

export interface SimService {
  initialize(): Promise<void>;
  isReady(): boolean;
  simulateGame(matchup: MatchupInput): Promise<SimResult>;
}

export interface TeamConfig {
  name: string;
  short_name: string;
  logo: string;
  offense: {
    passing: number;
    blocking: number;
    rushing: number;
    receiving: number;
    scrambling: number;
    turnovers: number;
    field_goals: number;
    punting: number;
    kickoffs: number;
    kick_return_defense: number;
  };
  defense: {
    blitzing: number;
    rush_defense: number;
    pass_defense: number;
    coverage: number;
    turnovers: number;
    kick_returning: number;
  };
  coach: {
    risk_taking: number;
    run_pass: number;
    up_tempo: number;
  };
}

export interface MatchupConfig {
  home: TeamConfig;
  away: TeamConfig;
}

export interface GameState {
  context: GameContext;
  latestPlay: Play | undefined;
  driveCount: number;
  playCount: number;
  complete: boolean;
}

export interface PlayByPlaySimService extends SimService {
  createGame(config: MatchupConfig): GameState;
  simPlay(): GameState;
  simDrive(): GameState;
  simRemainder(): GameState;
  getDrive(index: number): Drive;
  getHomeStats(): OffensiveStats;
  getAwayStats(): OffensiveStats;
  destroyGame(): void;
  hasActiveGame(): boolean;
}
