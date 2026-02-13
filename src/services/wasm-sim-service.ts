import type {
  SimService,
  PlayByPlaySimService,
  MatchupInput,
  MatchupConfig,
  SimResult,
  GameState,
  GameContext,
  Drive,
  OffensiveStats,
} from './types.js';

export class WasmSimService implements SimService, PlayByPlaySimService {
  private initialized = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private coreModule: any = null;

  // Play-by-play state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private simulator: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private game: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private homeTeam: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private awayTeam: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rng: any = null;
  private context: GameContext | null = null;

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

    const { FootballTeam, GameSimulator, Game, Rng, createGameContext } = this.coreModule;

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
    const simulator = new GameSimulator();
    const game = new Game();
    const context = createGameContext();

    const finalContext = simulator.simGame(homeTeam, awayTeam, context, game, rng);

    const result: SimResult = {
      home_team: matchup.home.name,
      away_team: matchup.away.name,
      home_score: finalContext.home_score,
      away_score: finalContext.away_score,
    };

    game.free();
    simulator.free();
    homeTeam.free();
    awayTeam.free();
    rng.free();

    return result;
  }

  createGame(config: MatchupConfig): GameState {
    if (!this.coreModule) {
      throw new Error('WasmSimService not initialized. Call initialize() first.');
    }

    this.destroyGame();

    const { FootballTeam, GameSimulator, Game, Rng, createGameContext } = this.coreModule;

    this.homeTeam = FootballTeam.fromJSON({
      name: config.home.name,
      short_name: config.home.short_name,
      offense: config.home.offense,
      defense: config.home.defense,
      coach: config.home.coach,
    });

    this.awayTeam = FootballTeam.fromJSON({
      name: config.away.name,
      short_name: config.away.short_name,
      offense: config.away.offense,
      defense: config.away.defense,
      coach: config.away.coach,
    });

    this.rng = new Rng();
    this.simulator = new GameSimulator();
    this.game = new Game();
    this.context = createGameContext() as GameContext;
    this.context.home_team_short = config.home.short_name;
    this.context.away_team_short = config.away.short_name;

    return this.buildGameState();
  }

  simPlay(): GameState {
    this.ensureActiveGame();
    this.context = this.simulator.simPlay(
      this.homeTeam,
      this.awayTeam,
      this.context,
      this.game,
      this.rng,
    ) as GameContext;
    return this.buildGameState();
  }

  simDrive(): GameState {
    this.ensureActiveGame();
    this.context = this.simulator.simDrive(
      this.homeTeam,
      this.awayTeam,
      this.context,
      this.game,
      this.rng,
    ) as GameContext;
    return this.buildGameState();
  }

  simRemainder(): GameState {
    this.ensureActiveGame();
    this.context = this.simulator.simGame(
      this.homeTeam,
      this.awayTeam,
      this.context,
      this.game,
      this.rng,
    ) as GameContext;
    return this.buildGameState();
  }

  getDrive(index: number): Drive {
    this.ensureActiveGame();
    return this.game.getDrive(index) as Drive;
  }

  getHomeStats(): OffensiveStats {
    this.ensureActiveGame();
    return this.game.homeStats() as OffensiveStats;
  }

  getAwayStats(): OffensiveStats {
    this.ensureActiveGame();
    return this.game.awayStats() as OffensiveStats;
  }

  destroyGame(): void {
    if (this.game) {
      this.game.free();
      this.game = null;
    }
    if (this.simulator) {
      this.simulator.free();
      this.simulator = null;
    }
    if (this.homeTeam) {
      this.homeTeam.free();
      this.homeTeam = null;
    }
    if (this.awayTeam) {
      this.awayTeam.free();
      this.awayTeam = null;
    }
    if (this.rng) {
      this.rng.free();
      this.rng = null;
    }
    this.context = null;
  }

  hasActiveGame(): boolean {
    return this.game !== null && this.context !== null;
  }

  private ensureActiveGame(): void {
    if (!this.hasActiveGame()) {
      throw new Error('No active game. Call createGame() first.');
    }
  }

  private buildGameState(): GameState {
    return {
      context: this.context!,
      latestPlay: this.game.getLatestPlay() ?? undefined,
      driveCount: this.game.driveCount,
      playCount: this.game.playCount,
      complete: this.game.complete,
    };
  }
}
