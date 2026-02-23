import { describe, it, expect, beforeEach } from 'vitest';
import { PlaybackSimService } from '../../services/playback-sim-service.js';
import type { GameFile } from '../../services/game-file.js';
import type {
  GameContext,
  Play,
  Drive,
  OffensiveStats,
  MatchupConfig,
} from '../../services/types.js';

function makeContext(overrides?: Partial<GameContext>): GameContext {
  return {
    home_team_short: 'HOME',
    away_team_short: 'AWAY',
    quarter: 1,
    half_seconds: 1800,
    down: 1,
    distance: 10,
    yard_line: 20,
    home_score: 0,
    away_score: 0,
    home_timeouts: 3,
    away_timeouts: 3,
    home_positive_direction: true,
    home_opening_kickoff: true,
    home_possession: true,
    last_play_turnover: false,
    last_play_incomplete: false,
    last_play_out_of_bounds: false,
    last_play_timeout: false,
    last_play_kickoff: false,
    last_play_punt: false,
    next_play_extra_point: false,
    next_play_kickoff: false,
    neutral_site: false,
    end_of_half: false,
    game_over: false,
    ...overrides,
  };
}

function makePlay(overrides?: Partial<Play>): Play {
  return {
    context: makeContext(),
    result: {
      type: 'Run',
      data: {
        yards_gained: 5,
        play_duration: 6,
        fumble: false,
        return_yards: 0,
        out_of_bounds: false,
        touchdown: false,
        safety: false,
        two_point_conversion: false,
      },
    },
    result_computed: {
      net_yards: 5,
      play_duration: 6,
      turnover: false,
      offense_score: 'None',
      defense_score: 'None',
      offense_timeout: false,
      defense_timeout: false,
      incomplete: false,
      out_of_bounds: false,
      touchback: false,
      kickoff: false,
      punt: false,
      next_play_kickoff: false,
      next_play_extra_point: false,
    },
    post_play: {
      type: 'BetweenPlay',
      data: {
        duration: 25,
        offense_timeout: false,
        defense_timeout: false,
        up_tempo: false,
        defense_not_set: false,
        critical_down: false,
      },
    },
    post_play_computed: {
      net_yards: 0,
      play_duration: 25,
      turnover: false,
      offense_score: 'None',
      defense_score: 'None',
      offense_timeout: false,
      defense_timeout: false,
      incomplete: false,
      out_of_bounds: false,
      touchback: false,
      kickoff: false,
      punt: false,
      next_play_kickoff: false,
      next_play_extra_point: false,
    },
    description: 'Rush for 5 yards',
    context_description: 'Q1 15:00 1st & 10 at HOME 20',
    ...overrides,
  };
}

function makeStats(): OffensiveStats {
  return {
    passing: { attempts: 10, completions: 6, touchdowns: 1, interceptions: 0, yards: 80 },
    rushing: { rushes: 8, fumbles: 0, touchdowns: 0, yards: 40 },
    receiving: { targets: 10, receptions: 6, touchdowns: 1, fumbles: 0, yards: 80 },
  };
}

const minimalMatchupConfig: MatchupConfig = {
  home: {
    name: 'Home Team',
    short_name: 'HOME',
    logo: '',
    color: '#ff0000',
    offense: {
      passing: 75,
      blocking: 70,
      rushing: 72,
      receiving: 73,
      scrambling: 60,
      turnovers: 80,
      field_goals: 78,
      punting: 70,
      kickoffs: 72,
      kick_return_defense: 68,
    },
    defense: {
      blitzing: 70,
      rush_defense: 72,
      pass_defense: 75,
      coverage: 73,
      turnovers: 68,
      kick_returning: 65,
    },
    coach: { risk_taking: 50, run_pass: 50, up_tempo: 50 },
  },
  away: {
    name: 'Away Team',
    short_name: 'AWAY',
    logo: '',
    color: '#0000ff',
    offense: {
      passing: 70,
      blocking: 68,
      rushing: 65,
      receiving: 70,
      scrambling: 58,
      turnovers: 75,
      field_goals: 72,
      punting: 68,
      kickoffs: 70,
      kick_return_defense: 65,
    },
    defense: {
      blitzing: 68,
      rush_defense: 70,
      pass_defense: 72,
      coverage: 70,
      turnovers: 65,
      kick_returning: 62,
    },
    coach: { risk_taking: 50, run_pass: 50, up_tempo: 50 },
  },
};

// Fixture: 2 drives × 2 plays each
function makeGameFile(): GameFile {
  const ctx0 = makeContext({ yard_line: 20, quarter: 1, half_seconds: 1800 });
  const ctx1 = makeContext({ yard_line: 25, quarter: 1, half_seconds: 1760 });
  const ctx2 = makeContext({ yard_line: 30, quarter: 2, half_seconds: 900 });
  const ctx3 = makeContext({ yard_line: 35, quarter: 2, half_seconds: 860 });
  const finalCtx = makeContext({ yard_line: 50, quarter: 4, half_seconds: 0, game_over: true });

  const play0 = makePlay({ context: ctx0, description: 'Play 0' });
  const play1 = makePlay({ context: ctx1, description: 'Play 1' });
  const play2 = makePlay({ context: ctx2, description: 'Play 2' });
  const play3 = makePlay({ context: ctx3, description: 'Play 3' });

  const drive0: Drive = {
    plays: [play0, play1],
    result: 'Punt' as Drive['result'],
    complete: true,
    total_yards: 5,
    display: 'Drive 1',
  };
  const drive1: Drive = {
    plays: [play2, play3],
    result: 'Touchdown' as Drive['result'],
    complete: true,
    total_yards: 5,
    display: 'Drive 2',
  };

  return {
    version: 1,
    matchupConfig: minimalMatchupConfig,
    drives: [drive0, drive1],
    finalContext: finalCtx,
    homeStats: makeStats(),
    awayStats: makeStats(),
  };
}

describe('PlaybackSimService', () => {
  let svc: PlaybackSimService;
  let gameFile: GameFile;

  beforeEach(() => {
    svc = new PlaybackSimService();
    gameFile = makeGameFile();
  });

  describe('isReady / initialize / simulateGame', () => {
    it('isReady() returns true', () => {
      expect(svc.isReady()).toBe(true);
    });

    it('initialize() resolves immediately', async () => {
      await expect(svc.initialize()).resolves.toBeUndefined();
    });

    it('simulateGame() throws', async () => {
      await expect(svc.simulateGame(minimalMatchupConfig as never)).rejects.toThrow();
    });

    it('createGame() throws', () => {
      expect(() => svc.createGame(minimalMatchupConfig)).toThrow();
    });
  });

  describe('hasActiveGame', () => {
    it('returns false before loadGame()', () => {
      expect(svc.hasActiveGame()).toBe(false);
    });

    it('returns true after loadGame()', () => {
      svc.loadGame(gameFile);
      expect(svc.hasActiveGame()).toBe(true);
    });

    it('returns false after destroyGame()', () => {
      svc.loadGame(gameFile);
      svc.destroyGame();
      expect(svc.hasActiveGame()).toBe(false);
    });
  });

  describe('loadGame()', () => {
    it('returns correct initial GameState', () => {
      const state = svc.loadGame(gameFile);
      expect(state.context).toBe(gameFile.drives[0].plays[0].context);
      expect(state.latestPlay).toBeUndefined();
      expect(state.driveCount).toBe(0);
      expect(state.playCount).toBe(0);
      expect(state.complete).toBe(false);
    });
  });

  describe('simPlay()', () => {
    it('returns correct state for first play', () => {
      svc.loadGame(gameFile);
      const state = svc.simPlay();
      expect(state.latestPlay).toBe(gameFile.drives[0].plays[0]);
      expect(state.context).toBe(gameFile.drives[0].plays[1].context);
      expect(state.driveCount).toBe(1);
      expect(state.playCount).toBe(1);
      expect(state.complete).toBe(false);
    });

    it('returns correct state for second play (still drive 0)', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      const state = svc.simPlay();
      expect(state.latestPlay).toBe(gameFile.drives[0].plays[1]);
      expect(state.context).toBe(gameFile.drives[1].plays[0].context);
      expect(state.driveCount).toBe(1);
      expect(state.playCount).toBe(2);
      expect(state.complete).toBe(false);
    });

    it('returns correct state crossing drive boundary', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      svc.simPlay();
      const state = svc.simPlay();
      expect(state.latestPlay).toBe(gameFile.drives[1].plays[0]);
      expect(state.driveCount).toBe(2);
      expect(state.complete).toBe(false);
    });

    it('returns complete=true and finalContext on last play', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      svc.simPlay();
      svc.simPlay();
      const state = svc.simPlay();
      expect(state.latestPlay).toBe(gameFile.drives[1].plays[1]);
      expect(state.context).toBe(gameFile.finalContext);
      expect(state.driveCount).toBe(2);
      expect(state.complete).toBe(true);
    });
  });

  describe('getDrive()', () => {
    it('returns partial drive (1 play) after first simPlay()', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      const drive = svc.getDrive(0);
      expect(drive.plays.length).toBe(1);
      expect(drive.plays[0]).toBe(gameFile.drives[0].plays[0]);
      expect(drive.result).toBe('None');
      expect(drive.complete).toBe(false);
    });

    it('returns partial drive (2 plays) after second simPlay() within same drive', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      svc.simPlay();
      const drive = svc.getDrive(0);
      expect(drive.plays.length).toBe(2);
      expect(drive.result).toBe('None');
      expect(drive.complete).toBe(false);
    });

    it('returns full completed drive once we advance to the next drive', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      svc.simPlay();
      svc.simPlay(); // first play of drive 1 — drive 0 is now past
      const drive = svc.getDrive(0);
      expect(drive.result).toBe('Punt');
      expect(drive.complete).toBe(true);
      expect(drive.plays.length).toBe(2);
    });

    it('returns full drives after simRemainder()', () => {
      svc.loadGame(gameFile);
      svc.simRemainder();
      const drive0 = svc.getDrive(0);
      const drive1 = svc.getDrive(1);
      expect(drive0.complete).toBe(true);
      expect(drive0.result).toBe('Punt');
      expect(drive1.complete).toBe(true);
      expect(drive1.result).toBe('Touchdown');
    });
  });

  describe('simDrive()', () => {
    it('advances to end of first drive from pre-game', () => {
      svc.loadGame(gameFile);
      const state = svc.simDrive();
      expect(state.driveCount).toBe(1);
      expect(state.latestPlay).toBe(gameFile.drives[0].plays[1]);
      expect(state.complete).toBe(false);
    });

    it('advances to end of second drive from after first drive', () => {
      svc.loadGame(gameFile);
      svc.simDrive();
      const state = svc.simDrive();
      expect(state.driveCount).toBe(2);
      expect(state.latestPlay).toBe(gameFile.drives[1].plays[1]);
      expect(state.complete).toBe(true);
    });
  });

  describe('simRemainder()', () => {
    it('advances to game complete from pre-game', () => {
      svc.loadGame(gameFile);
      const state = svc.simRemainder();
      expect(state.complete).toBe(true);
      expect(state.context).toBe(gameFile.finalContext);
    });

    it('advances to game complete from mid-game', () => {
      svc.loadGame(gameFile);
      svc.simPlay();
      const state = svc.simRemainder();
      expect(state.complete).toBe(true);
    });
  });

  describe('getHomeStats / getAwayStats', () => {
    it('returns stored stats from game file', () => {
      svc.loadGame(gameFile);
      expect(svc.getHomeStats()).toBe(gameFile.homeStats);
      expect(svc.getAwayStats()).toBe(gameFile.awayStats);
    });
  });
});
