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

  it('should display yard line with team side indicator at 50', () => {
    el.setAttribute('down', '1');
    el.setAttribute('yard-line', '50');
    const yardLine = el.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    expect(yardLine.textContent).toBe('Ball on 50');
  });

  it('should display yard line with home team name when on home side (home-positive-direction)', () => {
    el.setAttribute('home-team', 'PHI');
    el.setAttribute('away-team', 'DAL');
    el.setAttribute('home-positive-direction', '');
    el.setAttribute('down', '1');
    el.setAttribute('yard-line', '25');
    const yardLine = el.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    expect(yardLine.textContent).toBe('Ball on PHI 25');
  });

  it('should display yard line with away team name when on away side (home-positive-direction)', () => {
    el.setAttribute('home-team', 'PHI');
    el.setAttribute('away-team', 'DAL');
    el.setAttribute('home-positive-direction', '');
    el.setAttribute('down', '1');
    el.setAttribute('yard-line', '75');
    const yardLine = el.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    expect(yardLine.textContent).toBe('Ball on DAL 25');
  });

  it('should hide yard-line and down-distance when down is absent', () => {
    el.setAttribute('status', 'Pregame');
    el.setAttribute('quarter', '1');
    el.setAttribute('clock', '1800');
    const yardLine = el.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    const downDist = el.root.getElementById('scoreboard__down-distance') as HTMLSpanElement;
    expect(yardLine.style.display).toBe('none');
    expect(downDist.style.display).toBe('none');
  });

  it('should show yard-line and down-distance when down is present', () => {
    el.setAttribute('down', '2');
    el.setAttribute('distance', '8');
    el.setAttribute('yard-line', '40');
    const yardLine = el.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    const downDist = el.root.getElementById('scoreboard__down-distance') as HTMLSpanElement;
    expect(yardLine.style.display).not.toBe('none');
    expect(downDist.style.display).not.toBe('none');
  });

  it('should have home-positive-direction in observedAttributes', () => {
    expect(WACTScoreboard.observedAttributes).toContain('home-positive-direction');
  });
});
