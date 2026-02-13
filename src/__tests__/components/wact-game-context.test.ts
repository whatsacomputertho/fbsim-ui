import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTScoreboard } from '../../components/wact-scoreboard.js';
import { WACTGameLog } from '../../components/wact-game-log.js';
import { WACTGameContext } from '../../components/wact-game-context.js';

describe('WACTGameContext', () => {
  let el: WACTGameContext;

  beforeEach(async () => {
    if (!customElements.get('wact-scoreboard')) {
      customElements.define('wact-scoreboard', WACTScoreboard);
    }
    if (!customElements.get('wact-game-log')) {
      customElements.define('wact-game-log', WACTGameLog);
    }
    if (!customElements.get('wact-game-context')) {
      customElements.define('wact-game-context', WACTGameContext);
    }
    el = document.createElement('wact-game-context') as WACTGameContext;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTGameContext.tagName).toBe('wact-game-context');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain a wact-scoreboard element', () => {
    const scoreboard = el.root.getElementById('game-context__scoreboard');
    expect(scoreboard).not.toBeNull();
  });

  it('should contain a wact-game-log element', () => {
    const gameLog = el.root.getElementById('game-context__game-log');
    expect(gameLog).not.toBeNull();
  });

  it('should expose scoreboard via getter', () => {
    expect(el.scoreboard).not.toBeNull();
  });

  it('should expose gameLog via getter', () => {
    expect(el.gameLog).not.toBeNull();
  });
});
