import { describe, it, expect, beforeAll } from 'vitest';
import { WACTTeamSelect } from '../../components/wact-team-select.js';

describe('WACTTeamSelect', () => {
  beforeAll(() => {
    if (!customElements.get('wact-team-select')) {
      customElements.define('wact-team-select', WACTTeamSelect);
    }
  });

  it('should have the correct tag name', () => {
    expect(WACTTeamSelect.tagName).toBe('wact-team-select');
  });

  it('should create a shadow root', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should return default home team values', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    document.body.appendChild(el);

    const team = el.team;
    expect(team.name).toBe('Home Team');
    expect(team.offense_overall).toBe(50);
    expect(team.defense_overall).toBe(50);

    el.remove();
  });

  it('should default to home mode', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    expect(el.away).toBe(false);
  });

  it('should toggle to away mode via attribute', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    document.body.appendChild(el);

    el.away = true;
    expect(el.away).toBe(true);

    const label = el.root.getElementById('team-select__name-input-label') as HTMLLabelElement;
    expect(label.innerHTML).toBe('Away');

    const nameInput = el.root.getElementById('team-select__name-input') as HTMLInputElement;
    expect(nameInput.value).toBe('Away Team');

    el.remove();
  });

  it('should return a valid TeamInput shape', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    const team = el.team;
    expect(team).toHaveProperty('name');
    expect(team).toHaveProperty('offense_overall');
    expect(team).toHaveProperty('defense_overall');
    expect(typeof team.name).toBe('string');
    expect(typeof team.offense_overall).toBe('number');
    expect(typeof team.defense_overall).toBe('number');
  });

  it('should return logo src', () => {
    const el = document.createElement('wact-team-select') as WACTTeamSelect;
    expect(el.logo).toContain('default-club-picture.png');
  });
});
