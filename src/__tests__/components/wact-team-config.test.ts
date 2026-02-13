import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTTeamConfig } from '../../components/wact-team-config.js';

describe('WACTTeamConfig', () => {
  let el: WACTTeamConfig;

  beforeEach(async () => {
    if (!customElements.get('wact-team-config')) {
      customElements.define('wact-team-config', WACTTeamConfig);
    }
    el = document.createElement('wact-team-config') as WACTTeamConfig;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTTeamConfig.tagName).toBe('wact-team-config');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should return default team config', () => {
    const config = el.teamConfig;
    expect(config.name).toBe('Home Team');
    expect(config.short_name).toBe('HOME');
    expect(config.offense.passing).toBe(50);
    expect(config.defense.blitzing).toBe(50);
    expect(config.coach.risk_taking).toBe(50);
  });

  it('should return updated values from inputs', () => {
    const nameInput = el.root.getElementById('team-config__name') as HTMLInputElement;
    nameInput.value = 'Eagles';

    const passingInput = el.root.querySelector(
      '[data-field="offense.passing"]',
    ) as HTMLInputElement;
    passingInput.value = '85';

    const config = el.teamConfig;
    expect(config.name).toBe('Eagles');
    expect(config.offense.passing).toBe(85);
  });

  it('should toggle to away mode', () => {
    el.away = true;
    const header = el.root.getElementById('team-config__header-label') as HTMLSpanElement;
    expect(header.textContent).toBe('Away');
  });

  it('should toggle back to home mode', () => {
    el.away = true;
    el.away = false;
    const header = el.root.getElementById('team-config__header-label') as HTMLSpanElement;
    expect(header.textContent).toBe('Home');
  });

  it('should have all offense fields', () => {
    const offenseFields = [
      'offense.passing',
      'offense.blocking',
      'offense.rushing',
      'offense.receiving',
      'offense.scrambling',
      'offense.turnovers',
      'offense.field_goals',
      'offense.punting',
      'offense.kickoffs',
      'offense.kick_return_defense',
    ];
    for (const field of offenseFields) {
      const input = el.root.querySelector(`[data-field="${field}"]`) as HTMLInputElement;
      expect(input).not.toBeNull();
    }
  });

  it('should have all defense fields', () => {
    const defenseFields = [
      'defense.blitzing',
      'defense.rush_defense',
      'defense.pass_defense',
      'defense.coverage',
      'defense.turnovers',
      'defense.kick_returning',
    ];
    for (const field of defenseFields) {
      const input = el.root.querySelector(`[data-field="${field}"]`) as HTMLInputElement;
      expect(input).not.toBeNull();
    }
  });

  it('should have all coach fields', () => {
    const coachFields = ['coach.risk_taking', 'coach.run_pass', 'coach.up_tempo'];
    for (const field of coachFields) {
      const input = el.root.querySelector(`[data-field="${field}"]`) as HTMLInputElement;
      expect(input).not.toBeNull();
    }
  });

  it('should return logo URL', () => {
    expect(el.logo).toBe('https://official-flc.com/img/default-club-picture.png');
  });

  it('should toggle section collapse on header click', () => {
    const header = el.root.querySelector('[data-section="offense"]') as HTMLDivElement;
    const content = el.root.getElementById('team-config__offense') as HTMLDivElement;

    header.click();
    expect(content.classList.contains('team-config__section-content--collapsed')).toBe(true);

    header.click();
    expect(content.classList.contains('team-config__section-content--collapsed')).toBe(false);
  });

  it('should have away as an observed attribute', () => {
    expect(WACTTeamConfig.observedAttributes).toContain('away');
  });
});
