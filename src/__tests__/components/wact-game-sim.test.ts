import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WACTScoreboard } from '../../components/wact-scoreboard.js';
import { WACTGameLog } from '../../components/wact-game-log.js';
import { WACTGameContext } from '../../components/wact-game-context.js';
import { WACTFieldDisplay } from '../../components/wact-field-display.js';
import { WACTPlaybackControls } from '../../components/wact-playback-controls.js';
import { WACTTeamConfig } from '../../components/wact-team-config.js';
import { WACTMatchupConfig } from '../../components/wact-matchup-config.js';
import { WACTGameSim } from '../../components/wact-game-sim.js';
import type { PlayByPlaySimService, SimResult } from '../../services/types.js';

function createMockService(): PlayByPlaySimService {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    isReady: vi.fn().mockReturnValue(true),
    simulateGame: vi.fn().mockResolvedValue({
      home_team: 'Home Team',
      away_team: 'Away Team',
      home_score: 21,
      away_score: 14,
    } as SimResult),
    createGame: vi.fn().mockReturnValue({
      context: {
        home_team_short: 'HOME',
        away_team_short: 'AWAY',
        quarter: 1,
        half_seconds: 1800,
        down: 1,
        distance: 10,
        yard_line: 25,
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
      },
      latestPlay: undefined,
      driveCount: 0,
      playCount: 0,
      complete: false,
    }),
    simPlay: vi.fn().mockReturnValue({
      context: {
        home_team_short: 'HOME',
        away_team_short: 'AWAY',
        quarter: 1,
        half_seconds: 1790,
        down: 2,
        distance: 5,
        yard_line: 30,
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
      },
      latestPlay: undefined,
      driveCount: 1,
      playCount: 1,
      complete: true,
    }),
    simDrive: vi.fn(),
    simRemainder: vi.fn(),
    getDrive: vi.fn().mockReturnValue({
      plays: [],
      result: 'None',
      complete: false,
      total_yards: 0,
      display: '',
    }),
    getHomeStats: vi.fn().mockReturnValue({
      passing: {
        attempts: 20,
        completions: 12,
        touchdowns: 1,
        interceptions: 0,
        yards: 150,
      },
      rushing: { rushes: 15, fumbles: 0, touchdowns: 1, yards: 80 },
      receiving: {
        targets: 20,
        receptions: 12,
        touchdowns: 1,
        fumbles: 0,
        yards: 150,
      },
    }),
    getAwayStats: vi.fn().mockReturnValue({
      passing: {
        attempts: 18,
        completions: 10,
        touchdowns: 0,
        interceptions: 1,
        yards: 120,
      },
      rushing: { rushes: 12, fumbles: 1, touchdowns: 0, yards: 60 },
      receiving: {
        targets: 18,
        receptions: 10,
        touchdowns: 0,
        fumbles: 0,
        yards: 120,
      },
    }),
    destroyGame: vi.fn(),
    hasActiveGame: vi.fn().mockReturnValue(true),
  };
}

// Register all child custom elements first
const deps = [
  ['wact-scoreboard', WACTScoreboard],
  ['wact-game-log', WACTGameLog],
  ['wact-game-context', WACTGameContext],
  ['wact-field-display', WACTFieldDisplay],
  ['wact-playback-controls', WACTPlaybackControls],
  ['wact-team-config', WACTTeamConfig],
  ['wact-matchup-config', WACTMatchupConfig],
  ['wact-game-sim', WACTGameSim],
] as const;

for (const [tag, Ctor] of deps) {
  if (!customElements.get(tag)) {
    customElements.define(tag, Ctor);
  }
}

describe('WACTGameSim', () => {
  let el: WACTGameSim;

  beforeEach(async () => {
    el = document.createElement('wact-game-sim') as WACTGameSim;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTGameSim.tagName).toBe('wact-game-sim');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should show config view by default', () => {
    const configView = el.root.getElementById('game-sim__config-view') as HTMLDivElement;
    expect(configView.style.display).not.toBe('none');
  });

  it('should have a start button', () => {
    const button = el.root.getElementById('game-sim__start-button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.textContent).toBe('Start Game');
  });

  it('should log error when start clicked without a service', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const button = el.root.getElementById('game-sim__start-button') as HTMLButtonElement;
    button.click();
    expect(errorSpy).toHaveBeenCalledWith(
      'No simulation service configured for wact-game-sim.',
    );
  });

  it('should have playback controls', () => {
    const controls = el.root.getElementById('game-sim__controls');
    expect(controls).not.toBeNull();
  });

  it('should have field display', () => {
    const field = el.root.getElementById('game-sim__field');
    expect(field).not.toBeNull();
  });

  it('should have game context', () => {
    const context = el.root.getElementById('game-sim__context');
    expect(context).not.toBeNull();
  });

  it('should have postgame buttons', () => {
    const summaryBtn = el.root.getElementById('game-sim__summary-button');
    const newGameBtn = el.root.getElementById('game-sim__new-game-button');
    expect(summaryBtn).not.toBeNull();
    expect(newGameBtn).not.toBeNull();
  });

  it('should accept a PlayByPlaySimService', () => {
    const mockService = createMockService();
    el.setSimService(mockService);
    expect(true).toBe(true);
  });
});
