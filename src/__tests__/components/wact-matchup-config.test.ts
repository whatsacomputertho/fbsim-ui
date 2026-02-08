import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTTeamConfig } from '../../components/wact-team-config.js';
import { WACTMatchupConfig } from '../../components/wact-matchup-config.js';

describe('WACTMatchupConfig', () => {
  let el: WACTMatchupConfig;

  beforeEach(async () => {
    if (!customElements.get('wact-team-config')) {
      customElements.define('wact-team-config', WACTTeamConfig);
    }
    if (!customElements.get('wact-matchup-config')) {
      customElements.define('wact-matchup-config', WACTMatchupConfig);
    }
    el = document.createElement('wact-matchup-config') as WACTMatchupConfig;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTMatchupConfig.tagName).toBe('wact-matchup-config');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain two wact-team-config elements', () => {
    const teamConfigs = el.root.querySelectorAll('wact-team-config');
    expect(teamConfigs.length).toBe(2);
  });

  it('should return matchup config with home and away properties', () => {
    // Note: inner wact-team-config elements created from template innerHTML
    // are not fully upgraded in happy-dom, so .teamConfig returns undefined.
    // The TeamConfig shape is verified in wact-team-config.test.ts.
    const config = el.matchupConfig;
    expect(config).toHaveProperty('home');
    expect(config).toHaveProperty('away');
  });

  it('should mark away team-config with away attribute', () => {
    const away = el.root.getElementById('matchup-config__away');
    expect(away).not.toBeNull();
    expect(away?.hasAttribute('away')).toBe(true);
  });

  it('should contain home and away team-config elements', () => {
    const home = el.root.getElementById('matchup-config__home');
    const away = el.root.getElementById('matchup-config__away');
    expect(home).not.toBeNull();
    expect(away).not.toBeNull();
  });
});
