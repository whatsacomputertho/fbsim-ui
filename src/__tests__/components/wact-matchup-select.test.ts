import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';
import { WACTMatchupSelect } from '../../components/wact-matchup-select.js';

describe('WACTMatchupSelect', () => {
  let el: WACTMatchupSelect;

  beforeEach(async () => {
    if (!customElements.get('wact-team-select')) {
      customElements.define('wact-team-select', WACTTeamSelect);
    }
    if (!customElements.get('wact-matchup-select')) {
      customElements.define('wact-matchup-select', WACTMatchupSelect);
    }
    el = document.createElement('wact-matchup-select') as WACTMatchupSelect;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTMatchupSelect.tagName).toBe('wact-matchup-select');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain home and away team select elements', () => {
    const home = el.root.getElementById('matchup-select__home');
    const away = el.root.getElementById('matchup-select__away');
    expect(home).not.toBeNull();
    expect(away).not.toBeNull();
    expect(away?.hasAttribute('away')).toBe(true);
  });

  it('should return a matchup with home and away properties', () => {
    // Note: inner wact-team-select elements created from template innerHTML
    // are not fully upgraded in happy-dom, so .team returns undefined.
    // The TeamInput shape is verified in wact-team-select.test.ts.
    const matchup = el.matchup;
    expect(matchup).toHaveProperty('home');
    expect(matchup).toHaveProperty('away');
  });
});
