import type { WACTScoreboard } from './wact-scoreboard.js';
import type { WACTGameLog } from './wact-game-log.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    #game-context__wrapper {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  </style>
  <div id="game-context__wrapper">
    <wact-scoreboard id="game-context__scoreboard"></wact-scoreboard>
    <wact-game-log id="game-context__game-log"></wact-game-log>
  </div>
`;

export class WACTGameContext extends HTMLElement {
  static readonly tagName = 'wact-game-context' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  get scoreboard(): WACTScoreboard {
    return this.root.getElementById('game-context__scoreboard') as WACTScoreboard;
  }

  get gameLog(): WACTGameLog {
    return this.root.getElementById('game-context__game-log') as WACTGameLog;
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;
    this._readyPromise = new Promise((r) => (this._resolveReady = r));
    this._resolveReady?.();
  }

  whenReady(): Promise<void> {
    if (!this._readyPromise) {
      this._readyPromise = new Promise((resolve) => {
        this._resolveReady = resolve;
      });
    }
    return this._readyPromise;
  }
}
