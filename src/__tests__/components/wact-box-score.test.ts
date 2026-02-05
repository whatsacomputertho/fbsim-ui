import { describe, it, expect, beforeAll } from 'vitest';
import { WACTBoxScore } from '../../components/wact-box-score.js';

describe('WACTBoxScore', () => {
  beforeAll(() => {
    if (!customElements.get('wact-box-score')) {
      customElements.define('wact-box-score', WACTBoxScore);
    }
  });

  it('should have the correct tag name', () => {
    expect(WACTBoxScore.tagName).toBe('wact-box-score');
  });

  it('should create a shadow root', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should update home team text when attribute changes', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('home-team', 'Eagles');
    const homeTeam = el.root.getElementById('box-score__home-team') as HTMLParagraphElement;
    expect(homeTeam.innerHTML).toBe('Eagles');

    el.remove();
  });

  it('should update away team text when attribute changes', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('away-team', 'Cowboys');
    const awayTeam = el.root.getElementById('box-score__away-team') as HTMLParagraphElement;
    expect(awayTeam.innerHTML).toBe('Cowboys');

    el.remove();
  });

  it('should update scores and calculate winner when home wins', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('home-score', '28');
    el.setAttribute('away-score', '14');

    const homeWrapper = el.root.getElementById('box-score__home-wrapper') as HTMLDivElement;
    const homeScoreWrapper = el.root.getElementById(
      'box-score__home-score-wrapper',
    ) as HTMLDivElement;
    const awayWrapper = el.root.getElementById('box-score__away-wrapper') as HTMLDivElement;
    const awayScoreWrapper = el.root.getElementById(
      'box-score__away-score-wrapper',
    ) as HTMLDivElement;

    expect(homeWrapper.style.backgroundColor).toBe('rgba(0, 63, 0, 0.7)');
    expect(homeScoreWrapper.style.borderColor).toBe('lime');
    expect(awayWrapper.style.backgroundColor).toBe('rgba(63, 0, 0, 0.7)');
    expect(awayScoreWrapper.style.borderColor).toBe('red');

    el.remove();
  });

  it('should update scores and calculate winner when away wins', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('home-score', '10');
    el.setAttribute('away-score', '24');

    const homeWrapper = el.root.getElementById('box-score__home-wrapper') as HTMLDivElement;
    const homeScoreWrapper = el.root.getElementById(
      'box-score__home-score-wrapper',
    ) as HTMLDivElement;
    const awayWrapper = el.root.getElementById('box-score__away-wrapper') as HTMLDivElement;
    const awayScoreWrapper = el.root.getElementById(
      'box-score__away-score-wrapper',
    ) as HTMLDivElement;

    expect(homeWrapper.style.backgroundColor).toBe('rgba(63, 0, 0, 0.7)');
    expect(homeScoreWrapper.style.borderColor).toBe('red');
    expect(awayWrapper.style.backgroundColor).toBe('rgba(0, 63, 0, 0.7)');
    expect(awayScoreWrapper.style.borderColor).toBe('lime');

    el.remove();
  });

  it('should show gray for tied scores', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('home-score', '17');
    el.setAttribute('away-score', '17');

    const homeScoreWrapper = el.root.getElementById(
      'box-score__home-score-wrapper',
    ) as HTMLDivElement;
    const awayScoreWrapper = el.root.getElementById(
      'box-score__away-score-wrapper',
    ) as HTMLDivElement;

    expect(homeScoreWrapper.style.borderColor).toBe('gray');
    expect(awayScoreWrapper.style.borderColor).toBe('gray');

    el.remove();
  });

  it('should update logo src when logo attribute changes', () => {
    const el = document.createElement('wact-box-score') as WACTBoxScore;
    document.body.appendChild(el);

    el.setAttribute('home-logo', 'https://example.com/home.png');
    const homeLogo = el.root.getElementById('box-score__home-logo') as HTMLImageElement;
    expect(homeLogo.getAttribute('src')).toBe('https://example.com/home.png');

    el.remove();
  });
});
