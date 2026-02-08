import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';

describe('WACTTeamSelect', () => {
  let el: WACTTeamSelect;

  beforeEach(async () => {
    if (!customElements.get('wact-team-select')) {
      customElements.define('wact-team-select', WACTTeamSelect);
    }
    el = document.createElement('wact-team-select') as WACTTeamSelect;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTTeamSelect.tagName).toBe('wact-team-select');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should return default home team values', () => {
    const team = el.team;
    expect(team.name).toBe('Home Team');
    expect(team.offense_overall).toBe(50);
    expect(team.defense_overall).toBe(50);
  });

  it('should default to home mode', () => {
    expect(el.away).toBe(false);
  });

  it('should toggle to away mode via attribute', () => {
    el.away = true;
    expect(el.away).toBe(true);

    const label = el.root.getElementById('team-select__name-input-label') as HTMLLabelElement;
    expect(label.innerHTML).toBe('Away');

    const nameInput = el.root.getElementById('team-select__name-input') as HTMLInputElement;
    expect(nameInput.value).toBe('Away Team');
  });

  it('should return a valid TeamInput shape', () => {
    const team = el.team;
    expect(team).toHaveProperty('name');
    expect(team).toHaveProperty('offense_overall');
    expect(team).toHaveProperty('defense_overall');
    expect(typeof team.name).toBe('string');
    expect(typeof team.offense_overall).toBe('number');
    expect(typeof team.defense_overall).toBe('number');
  });

  it('should return logo src', () => {
    expect(el.logo).toContain('default-club-picture.png');
  });
});
