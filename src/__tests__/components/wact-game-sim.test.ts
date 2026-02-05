import { describe, it, expect, vi, beforeAll } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';
import { WACTMatchupSelect } from '../../components/wact-matchup-select.js';
import { WACTBoxScore } from '../../components/wact-box-score.js';
import { WACTGameSim } from '../../components/wact-game-sim.js';
import type { SimService, MatchupInput, SimResult } from '../../services/types.js';

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
  beforeAll(() => {
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
  });

  it('should have the correct tag name', () => {
    expect(WACTGameSim.tagName).toBe('wact-game-sim');
  });

  it('should create a shadow root with a simulate button', () => {
    const el = document.createElement('wact-game-sim') as WACTGameSim;
    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.textContent).toBe('Simulate');
  });

  it('should log error when simulate clicked without a service', async () => {
    const el = document.createElement('wact-game-sim') as WACTGameSim;
    document.body.appendChild(el);

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    // Wait for async click handler
    await new Promise((r) => setTimeout(r, 0));

    expect(errorSpy).toHaveBeenCalledWith('No simulation service configured for wact-game-sim.');

    errorSpy.mockRestore();
    el.remove();
  });

  it('should call simulateGame on the service when simulate is clicked', async () => {
    const el = document.createElement('wact-game-sim') as WACTGameSim;
    document.body.appendChild(el);

    const mockService = createMockService();
    el.setSimService(mockService);

    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockService.simulateGame).toHaveBeenCalledTimes(1);
    const callArg = (mockService.simulateGame as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as MatchupInput;
    expect(callArg).toHaveProperty('home');
    expect(callArg).toHaveProperty('away');

    el.remove();
  });

  it('should display box score after successful simulation', async () => {
    const el = document.createElement('wact-game-sim') as WACTGameSim;
    document.body.appendChild(el);

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

    el.remove();
  });

  it('should initialize service if not ready when simulate is clicked', async () => {
    const el = document.createElement('wact-game-sim') as WACTGameSim;
    document.body.appendChild(el);

    const mockService = createMockService();
    (mockService.isReady as ReturnType<typeof vi.fn>).mockReturnValue(false);
    el.setSimService(mockService);

    const button = el.root.getElementById('game-sim__sim-button') as HTMLButtonElement;
    button.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockService.initialize).toHaveBeenCalledTimes(1);

    el.remove();
  });
});
