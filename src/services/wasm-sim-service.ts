import type { SimService, MatchupInput, SimResult } from './types.js';

export class WasmSimService implements SimService {
  private initialized = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private coreModule: any = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const core = await import('@whatsacomputertho/fbsim-core/web');

    if (typeof core.default === 'function') {
      await core.default();
    }

    this.coreModule = core;
    this.initialized = true;
  }

  isReady(): boolean {
    return this.initialized;
  }

  async simulateGame(matchup: MatchupInput): Promise<SimResult> {
    if (!this.coreModule) {
      throw new Error('WasmSimService not initialized. Call initialize() first.');
    }

    const { FootballTeam, GameSession, Rng } = this.coreModule;

    const shortName = (name: string): string => name.substring(0, 4).toUpperCase();

    const homeTeam = FootballTeam.fromOveralls(
      matchup.home.name,
      shortName(matchup.home.name),
      matchup.home.offense_overall,
      matchup.home.defense_overall,
    );

    const awayTeam = FootballTeam.fromOveralls(
      matchup.away.name,
      shortName(matchup.away.name),
      matchup.away.offense_overall,
      matchup.away.defense_overall,
    );

    const rng = new Rng();
    const session = new GameSession(homeTeam, awayTeam);
    session.simGame(rng);

    const result: SimResult = {
      home_team: matchup.home.name,
      away_team: matchup.away.name,
      home_score: session.homeScore,
      away_score: session.awayScore,
    };

    session.free();
    homeTeam.free();
    awayTeam.free();
    rng.free();

    return result;
  }
}
