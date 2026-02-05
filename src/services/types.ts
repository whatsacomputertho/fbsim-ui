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
