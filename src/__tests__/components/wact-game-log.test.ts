import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTGameLog } from '../../components/wact-game-log.js';
import type { Play, Drive, GameContext } from '../../services/types.js';

function createMockContext(overrides?: Partial<GameContext>): GameContext {
  return {
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
    ...overrides,
  };
}

function createMockPlay(overrides?: Partial<Play>): Play {
  return {
    context: createMockContext(),
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
    context_description: 'Q1 15:00 1st & 10 at HOME 25',
    ...overrides,
  };
}

describe('WACTGameLog', () => {
  let el: WACTGameLog;

  beforeEach(async () => {
    if (!customElements.get('wact-game-log')) {
      customElements.define('wact-game-log', WACTGameLog);
    }
    el = document.createElement('wact-game-log') as WACTGameLog;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTGameLog.tagName).toBe('wact-game-log');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should show empty state initially', () => {
    const empty = el.root.getElementById('game-log__empty');
    expect(empty).not.toBeNull();
    expect(empty!.textContent).toBe('No plays yet');
  });

  it('should remove empty state after adding a play', () => {
    el.addPlay(createMockPlay(), 0);
    const empty = el.root.getElementById('game-log__empty');
    expect(empty).toBeNull();
  });

  it('should create a drive entry when adding a play to a new drive', () => {
    el.addPlay(createMockPlay(), 0);
    const drives = el.root.querySelectorAll('.game-log__drive');
    expect(drives.length).toBe(1);
  });

  it('should add plays to the same drive', () => {
    el.addPlay(createMockPlay(), 0);
    el.addPlay(createMockPlay({ description: 'Pass for 10 yards' }), 0);
    const drives = el.root.querySelectorAll('.game-log__drive');
    expect(drives.length).toBe(1);
    const plays = drives[0].querySelectorAll('.game-log__play');
    expect(plays.length).toBe(2);
  });

  it('should show drive result after completing drive', () => {
    el.addPlay(createMockPlay(), 0);
    const drive: Drive = {
      plays: [createMockPlay()],
      result: 'Punt',
      complete: true,
      total_yards: 5,
      display: 'Drive 1',
    };
    el.completeDrive(0, drive);
    const resultEl = el.root.querySelector('.game-log__drive-result') as HTMLSpanElement;
    expect(resultEl.textContent).toContain('Punt');
  });

  it('should clear all drives', () => {
    el.addPlay(createMockPlay(), 0);
    el.addPlay(createMockPlay(), 1);
    el.clear();
    const drives = el.root.querySelectorAll('.game-log__drive');
    expect(drives.length).toBe(0);
    const empty = el.root.getElementById('game-log__empty');
    expect(empty).not.toBeNull();
  });

  it('should collapse all drives', () => {
    el.addPlay(createMockPlay(), 0);
    el.addPlay(createMockPlay(), 1);
    el.collapseAll();
    const expandedPlays = el.root.querySelectorAll('.game-log__drive-plays--expanded');
    expect(expandedPlays.length).toBe(0);
  });

  it('should display most recent drive at top', () => {
    el.addPlay(createMockPlay(), 0);
    el.addPlay(createMockPlay(), 1);
    const drives = el.root.querySelectorAll('.game-log__drive');
    expect(drives[0].getAttribute('data-drive-index')).toBe('1');
    expect(drives[1].getAttribute('data-drive-index')).toBe('0');
  });

  it('should toggle drive expansion on header click', () => {
    el.addPlay(createMockPlay(), 0);
    const header = el.root.querySelector('.game-log__drive-header') as HTMLDivElement;
    const playsContainer = el.root.querySelector('.game-log__drive-plays') as HTMLDivElement;

    expect(playsContainer.classList.contains('game-log__drive-plays--expanded')).toBe(true);

    header.click();
    expect(playsContainer.classList.contains('game-log__drive-plays--expanded')).toBe(false);

    header.click();
    expect(playsContainer.classList.contains('game-log__drive-plays--expanded')).toBe(true);
  });
});
