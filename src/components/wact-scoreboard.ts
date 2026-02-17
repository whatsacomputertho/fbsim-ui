const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
      --sb-bg: #e8eaf6;
      --sb-text: #1a1a2e;
      --sb-context-bg: #cfd2e8;
      --sb-context-text: #555;
      --sb-divider: #bbb;
      --sb-border: #bbb;
      --sb-possession: #c5a200;
      --sb-status: #b8860b;
      --sb-flash: #c5a200;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --sb-bg: #1a1a2e;
        --sb-text: white;
        --sb-context-bg: #16213e;
        --sb-context-text: #ccc;
        --sb-divider: #333;
        --sb-border: #333;
        --sb-possession: #ffd700;
        --sb-status: #ffd700;
        --sb-flash: #ffd700;
      }
    }

    #scoreboard__wrapper {
      background-color: var(--sb-bg);
      color: var(--sb-text);
      border-radius: 8px;
      overflow: hidden;
    }

    #scoreboard__teams {
      display: flex;
      justify-content: center;
      align-items: stretch;
    }

    .scoreboard__team {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
      border-left: 4px solid transparent;
      transition: border-color 200ms ease-in-out;
    }

    .scoreboard__team--home {
      justify-content: flex-start;
    }

    .scoreboard__team--away {
      justify-content: flex-end;
      flex-direction: row-reverse;
      border-left: none;
      border-right: 4px solid transparent;
    }

    .scoreboard__team--possession {
      border-color: var(--sb-possession);
    }

    .scoreboard__team-logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 4px;
    }

    .scoreboard__team-name {
      font-size: 1.1em;
      font-weight: bold;
    }

    .scoreboard__team-score {
      font-size: 1.8em;
      font-weight: bold;
      margin-left: auto;
      transition: color 300ms ease, text-shadow 300ms ease;
    }

    .scoreboard__team--away .scoreboard__team-score {
      margin-left: 0;
      margin-right: auto;
    }

    .scoreboard__team-score--flash {
      color: var(--sb-flash);
      text-shadow: 0 0 8px var(--sb-flash);
    }

    #scoreboard__divider {
      width: 2px;
      background-color: var(--sb-divider);
      align-self: stretch;
    }

    #scoreboard__context {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      background-color: var(--sb-context-bg);
      font-size: 0.9em;
      color: var(--sb-context-text);
      border-top: 1px solid var(--sb-border);
    }

    .scoreboard__context-item {
      white-space: nowrap;
      transition: opacity 150ms ease;
    }

    #scoreboard__status {
      font-weight: bold;
      color: var(--sb-status);
    }

    @media only screen and (max-width: 600px) {
      .scoreboard__team {
        padding: 8px 10px;
        gap: 8px;
      }

      .scoreboard__team-logo {
        width: 28px;
        height: 28px;
      }

      .scoreboard__team-name {
        font-size: 0.9em;
      }

      .scoreboard__team-score {
        font-size: 1.4em;
      }

      #scoreboard__context {
        gap: 8px;
        font-size: 0.8em;
        flex-wrap: wrap;
      }
    }
  </style>
  <div id="scoreboard__wrapper">
    <div id="scoreboard__teams">
      <div id="scoreboard__home" class="scoreboard__team scoreboard__team--home">
        <img id="scoreboard__home-logo" class="scoreboard__team-logo" src="" alt="">
        <span id="scoreboard__home-name" class="scoreboard__team-name">HOME</span>
        <span id="scoreboard__home-score" class="scoreboard__team-score">0</span>
      </div>
      <div id="scoreboard__divider"></div>
      <div id="scoreboard__away" class="scoreboard__team scoreboard__team--away">
        <img id="scoreboard__away-logo" class="scoreboard__team-logo" src="" alt="">
        <span id="scoreboard__away-name" class="scoreboard__team-name">AWAY</span>
        <span id="scoreboard__away-score" class="scoreboard__team-score">0</span>
      </div>
    </div>
    <div id="scoreboard__context">
      <span id="scoreboard__quarter" class="scoreboard__context-item"></span>
      <span id="scoreboard__clock" class="scoreboard__context-item"></span>
      <span id="scoreboard__yard-line" class="scoreboard__context-item"></span>
      <span id="scoreboard__down-distance" class="scoreboard__context-item"></span>
      <span id="scoreboard__status" class="scoreboard__context-item"></span>
    </div>
  </div>
`;

export class WACTScoreboard extends HTMLElement {
  static readonly tagName = 'wact-scoreboard' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [
      'home-team',
      'home-logo',
      'home-score',
      'away-team',
      'away-logo',
      'away-score',
      'home-possession',
      'home-positive-direction',
      'quarter',
      'clock',
      'yard-line',
      'down',
      'distance',
      'status',
    ];
  }

  get homeTeam(): string | null {
    return this.getAttribute('home-team');
  }

  set homeTeam(value: string) {
    this.setAttribute('home-team', value);
  }

  get homeLogo(): string | null {
    return this.getAttribute('home-logo');
  }

  set homeLogo(value: string) {
    this.setAttribute('home-logo', value);
  }

  get homeScore(): string | null {
    return this.getAttribute('home-score');
  }

  set homeScore(value: string) {
    this.setAttribute('home-score', value);
  }

  get awayTeam(): string | null {
    return this.getAttribute('away-team');
  }

  set awayTeam(value: string) {
    this.setAttribute('away-team', value);
  }

  get awayLogo(): string | null {
    return this.getAttribute('away-logo');
  }

  set awayLogo(value: string) {
    this.setAttribute('away-logo', value);
  }

  get awayScore(): string | null {
    return this.getAttribute('away-score');
  }

  set awayScore(value: string) {
    this.setAttribute('away-score', value);
  }

  private formatClock(quarter: number, halfSeconds: number): string {
    let clockTotal: number;
    if (halfSeconds < 900 || (halfSeconds == 900 && quarter % 2 == 0 && quarter <= 4)) {
      clockTotal = halfSeconds;
    } else {
      clockTotal = halfSeconds - 900;
    }
    const minutes = Math.floor(clockTotal / 60);
    const seconds = clockTotal % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  private formatQuarter(q: number): string {
    if (q < 5) {
      return `${q}Q`;
    } else {
      return `OT${q - 4}`;
    }
  }

  private formatDown(down: number): string {
    let downPrefix: string;
    switch (down) {
      case 1:
        downPrefix = 'st';
        break;
      case 2:
        downPrefix = 'nd';
        break;
      case 3:
        downPrefix = 'rd';
        break;
      default:
        downPrefix = 'th';
        break;
    }
    return `${down}${downPrefix}`;
  }

  private formatYardLine(yardLine: number): string {
    const homeTeam = this.getAttribute('home-team') ?? 'HOME';
    const awayTeam = this.getAttribute('away-team') ?? 'AWAY';
    const homePositiveDirection = this.hasAttribute('home-positive-direction');

    if (yardLine === 50) {
      return 'Ball on 50';
    }

    if (yardLine < 50) {
      // Ball is on the home-endzone side (yard_line 0 = home endzone)
      const displayYard = yardLine;
      const sideName = homePositiveDirection ? homeTeam : awayTeam;
      return `Ball on ${sideName} ${displayYard}`;
    }

    // yardLine > 50: ball is on the away-endzone side
    const displayYard = 100 - yardLine;
    const sideName = homePositiveDirection ? awayTeam : homeTeam;
    return `Ball on ${sideName} ${displayYard}`;
  }

  private updatePossession(): void {
    const homePoss = this.hasAttribute('home-possession');
    const homeEl = this.root.getElementById('scoreboard__home') as HTMLDivElement;
    const awayEl = this.root.getElementById('scoreboard__away') as HTMLDivElement;
    homeEl.classList.toggle('scoreboard__team--possession', homePoss);
    awayEl.classList.toggle('scoreboard__team--possession', !homePoss);
  }

  private updateContextBar(): void {
    const quarter = this.getAttribute('quarter');
    const clock = this.getAttribute('clock');
    const yardLine = this.getAttribute('yard-line');
    const down = this.getAttribute('down');
    const distance = this.getAttribute('distance');
    const status = this.getAttribute('status');

    const quarterEl = this.root.getElementById('scoreboard__quarter') as HTMLSpanElement;
    const clockEl = this.root.getElementById('scoreboard__clock') as HTMLSpanElement;
    const yardLineEl = this.root.getElementById('scoreboard__yard-line') as HTMLSpanElement;
    const downDistEl = this.root.getElementById('scoreboard__down-distance') as HTMLSpanElement;
    const statusEl = this.root.getElementById('scoreboard__status') as HTMLSpanElement;

    const quarterValue = quarter ? parseInt(quarter) : 0;
    quarterEl.textContent = quarter ? this.formatQuarter(quarterValue) : '';
    clockEl.textContent = clock ? this.formatClock(quarterValue, parseInt(clock)) : '';

    if (down) {
      yardLineEl.style.display = '';
      downDistEl.style.display = '';
      yardLineEl.textContent = yardLine ? this.formatYardLine(parseInt(yardLine)) : '';
      downDistEl.textContent =
        down && distance ? `${this.formatDown(parseInt(down))} & ${distance}` : '';
    } else {
      yardLineEl.style.display = 'none';
      downDistEl.style.display = 'none';
    }

    statusEl.textContent = status ?? '';
  }

  private flashScore(scoreEl: HTMLSpanElement): void {
    scoreEl.classList.add('scoreboard__team-score--flash');
    setTimeout(() => {
      scoreEl.classList.remove('scoreboard__team-score--flash');
    }, 300);
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    newValue: string | null,
  ): void {
    if (!this.root) return;
    switch (attribute.toLowerCase()) {
      case 'home-team':
        (this.root.getElementById('scoreboard__home-name') as HTMLSpanElement).textContent =
          newValue ?? '';
        this.updateContextBar();
        break;
      case 'home-logo':
        (this.root.getElementById('scoreboard__home-logo') as HTMLImageElement).src =
          newValue ?? '';
        break;
      case 'home-score': {
        const homeScoreEl = this.root.getElementById('scoreboard__home-score') as HTMLSpanElement;
        homeScoreEl.textContent = newValue ?? '0';
        if (_previousValue !== null && _previousValue !== newValue) {
          this.flashScore(homeScoreEl);
        }
        break;
      }
      case 'away-team':
        (this.root.getElementById('scoreboard__away-name') as HTMLSpanElement).textContent =
          newValue ?? '';
        this.updateContextBar();
        break;
      case 'away-logo':
        (this.root.getElementById('scoreboard__away-logo') as HTMLImageElement).src =
          newValue ?? '';
        break;
      case 'away-score': {
        const awayScoreEl = this.root.getElementById('scoreboard__away-score') as HTMLSpanElement;
        awayScoreEl.textContent = newValue ?? '0';
        if (_previousValue !== null && _previousValue !== newValue) {
          this.flashScore(awayScoreEl);
        }
        break;
      }
      case 'home-possession':
        this.updatePossession();
        break;
      case 'home-positive-direction':
      case 'quarter':
      case 'clock':
      case 'yard-line':
      case 'down':
      case 'distance':
      case 'status':
        this.updateContextBar();
        break;
    }
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
