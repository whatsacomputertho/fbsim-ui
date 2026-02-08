import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';
import { WACTMatchupSelect } from '../../components/wact-matchup-select.js';
import { WACTBoxScore } from '../../components/wact-box-score.js';
import { WACTGameSim } from '../../components/wact-game-sim.js';
import type { SimService, SimResult } from '../../services/types.js';

const defaultMatchup = {
  home: { name: 'Home Team', offense_overall: 50, defense_overall: 50 },
  away: { name: 'Away Team', offense_overall: 50, defense_overall: 50 },
};

function createMockService(result?: SimResult): SimService {
  return {
    initialize: vi.fn().mockResolvedValue(undefined),
    isReady: vi.fn().mockReturnValue(true),
    simulateGame: vi.fn().mockResolvedValue(
      result ?? {
        home_team: 'Home Team',
        away_team: 'Away Team',
        home_score: 21,
        away_score: 14,
      },
    ),
  };
}

describe('WACTGameSim', () => {
  let el: WACTGameSim;

  beforeEach(async () => {
    if (!customElements.get('wact-team-select')) {
      customElements.define('wact-team-select', WACTTeamSelect);
    }
    if (!customElements.get('wact-matchup-select')) {
      customElements.define('wact-matchup-select', WACTMatchupSelect);
    }
    if (!customElements.get('wact-box-score')) {
      customElements.define('wact-box-score', WACTBoxScore);
    }
    if (!customElements.get('wact-game-sim')) {
      customElements.define('wact-game-sim', WACTGameSim);
    }
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

  it('should create a shadow root with a simulate button', () => {
    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.textContent).toBe('Simulate');
  });

  it('should log error when simulate clicked without a service', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(errorSpy).toHaveBeenCalledWith('No simulation service configured for wact-game-sim.');
  });

  it('should call simulateGame on the service when simulate is clicked', async () => {
    // Spy on getMatchup to bypass happy-dom template upgrade limitation
    vi.spyOn(el as unknown as { getMatchup: () => unknown }, 'getMatchup').mockReturnValue(
      defaultMatchup,
    );

    const mockService = createMockService();
    el.setSimService(mockService);

    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockService.simulateGame).toHaveBeenCalledTimes(1);
    expect(mockService.simulateGame).toHaveBeenCalledWith(defaultMatchup);
  });

  it('should display box score after successful simulation', async () => {
    vi.spyOn(el as unknown as { getMatchup: () => unknown }, 'getMatchup').mockReturnValue(
      defaultMatchup,
    );

    const mockService = createMockService({
      home_team: 'Eagles',
      away_team: 'Cowboys',
      home_score: 31,
      away_score: 17,
    });
    el.setSimService(mockService);

    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    const resultWrapper = el.root.getElementById('game-sim__result-wrapper') as HTMLDivElement;
    expect(resultWrapper.style.display).toBe('block');

    const boxScore = el.root.getElementById('game-sim__result') as WACTBoxScore;
    expect(boxScore.getAttribute('home-team')).toBe('Eagles');
    expect(boxScore.getAttribute('away-team')).toBe('Cowboys');
    expect(boxScore.getAttribute('home-score')).toBe('31');
    expect(boxScore.getAttribute('away-score')).toBe('17');
  });

  it('should initialize service if not ready when simulate is clicked', async () => {
    vi.spyOn(el as unknown as { getMatchup: () => unknown }, 'getMatchup').mockReturnValue(
      defaultMatchup,
    );

    const mockService = createMockService();
    (mockService.isReady as ReturnType<typeof vi.fn>).mockReturnValue(false);
    el.setSimService(mockService);

    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockService.initialize).toHaveBeenCalledTimes(1);
  });
});
