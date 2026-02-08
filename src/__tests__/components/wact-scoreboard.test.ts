import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTScoreboard } from '../../components/wact-scoreboard.js';

describe('WACTScoreboard', () => {
  let el: WACTScoreboard;

  beforeEach(async () => {
    if (!customElements.get('wact-scoreboard')) {
      customElements.define('wact-scoreboard', WACTScoreboard);
    }
    el = document.createElement('wact-scoreboard') as WACTScoreboard;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTScoreboard.tagName).toBe('wact-scoreboard');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should update home team name when attribute changes', () => {
    el.setAttribute('home-team', 'PHI');
    const name = el.root.getElementById('scoreboard__home-name') as HTMLSpanElement;
    expect(name.textContent).toBe('PHI');
  });

  it('should update away team name when attribute changes', () => {
    el.setAttribute('away-team', 'DAL');
    const name = el.root.getElementById('scoreboard__away-name') as HTMLSpanElement;
    expect(name.textContent).toBe('DAL');
  });

  it('should update home score when attribute changes', () => {
    el.setAttribute('home-score', '21');
    const score = el.root.getElementById('scoreboard__home-score') as HTMLSpanElement;
    expect(score.textContent).toBe('21');
  });

  it('should update away score when attribute changes', () => {
    el.setAttribute('away-score', '14');
    const score = el.root.getElementById('scoreboard__away-score') as HTMLSpanElement;
    expect(score.textContent).toBe('14');
  });

  it('should show possession indicator on home side', () => {
    el.setAttribute('home-possession', '');
    const home = el.root.getElementById('scoreboard__home') as HTMLDivElement;
    const away = el.root.getElementById('scoreboard__away') as HTMLDivElement;
    expect(home.classList.contains('scoreboard__team--possession')).toBe(true);
    expect(away.classList.contains('scoreboard__team--possession')).toBe(false);
  });

  it('should show possession indicator on away side when home-possession removed', () => {
    el.setAttribute('home-possession', '');
    el.removeAttribute('home-possession');
    const home = el.root.getElementById('scoreboard__home') as HTMLDivElement;
    const away = el.root.getElementById('scoreboard__away') as HTMLDivElement;
    expect(home.classList.contains('scoreboard__team--possession')).toBe(false);
    expect(away.classList.contains('scoreboard__team--possession')).toBe(true);
  });

  it('should display quarter in context bar', () => {
    el.setAttribute('quarter', '2');
    const quarter = el.root.getElementById('scoreboard__quarter') as HTMLSpanElement;
    expect(quarter.textContent).toBe('2Q');
  });

  it('should display clock in MM:SS format', () => {
    el.setAttribute('clock', '1800');
    const clock = el.root.getElementById('scoreboard__clock') as HTMLSpanElement;
    expect(clock.textContent).toBe('15:00');
  });

  it('should display down and distance', () => {
    el.setAttribute('down', '3');
    el.setAttribute('distance', '7');
    const dd = el.root.getElementById('scoreboard__down-distance') as HTMLSpanElement;
    expect(dd.textContent).toBe('3rd & 7');
  });

  it('should display status text', () => {
    el.setAttribute('status', 'Pregame');
    const status = el.root.getElementById('scoreboard__status') as HTMLSpanElement;
    expect(status.textContent).toBe('Pregame');
  });

  it('should have getter/setter for homeTeam', () => {
    el.homeTeam = 'Eagles';
    expect(el.homeTeam).toBe('Eagles');
  });

  it('should have getter/setter for awayScore', () => {
    el.awayScore = '28';
    expect(el.awayScore).toBe('28');
  });

  it('should update home logo src when attribute changes', () => {
    el.setAttribute('home-logo', 'https://example.com/home.png');
    const logo = el.root.getElementById('scoreboard__home-logo') as HTMLImageElement;
    expect(logo.src).toBe('https://example.com/home.png');
  });
});
