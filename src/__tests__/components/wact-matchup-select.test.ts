import { describe, it, expect, beforeAll } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';
import { WACTMatchupSelect } from '../../components/wact-matchup-select.js';

describe('WACTMatchupSelect', () => {
  beforeAll(() => {
    if (!customElements.get('wact-team-select')) {
      customElements.define('wact-team-select', WACTTeamSelect);
    }
    if (!customElements.get('wact-matchup-select')) {
      customElements.define('wact-matchup-select', WACTMatchupSelect);
    }
  });

  it('should have the correct tag name', () => {
    expect(WACTMatchupSelect.tagName).toBe('wact-matchup-select');
  });

  it('should create a shadow root', () => {
    const el = document.createElement('wact-matchup-select') as WACTMatchupSelect;
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain home and away team select elements', () => {
    const el = document.createElement('wact-matchup-select') as WACTMatchupSelect;
    document.body.appendChild(el);

    const home = el.root.getElementById('matchup-select__home');
    const away = el.root.getElementById('matchup-select__away');
    expect(home).not.toBeNull();
    expect(away).not.toBeNull();
    expect(away?.hasAttribute('away')).toBe(true);

    el.remove();
  });

  it('should return a valid MatchupInput shape', () => {
    const el = document.createElement('wact-matchup-select') as WACTMatchupSelect;
    document.body.appendChild(el);

    const matchup = el.matchup;
    expect(matchup).toHaveProperty('home');
    expect(matchup).toHaveProperty('away');
    expect(matchup.home).toHaveProperty('name');
    expect(matchup.home).toHaveProperty('offense_overall');
    expect(matchup.home).toHaveProperty('defense_overall');
    expect(matchup.away).toHaveProperty('name');
    expect(matchup.away).toHaveProperty('offense_overall');
    expect(matchup.away).toHaveProperty('defense_overall');

    el.remove();
  });
});
