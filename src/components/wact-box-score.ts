const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      --bs-overlay-bg: rgba(0, 0, 0, 0.7);
      --bs-border-color: gray;
      --bs-text: white;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --bs-overlay-bg: rgba(0, 0, 0, 0.7);
        --bs-border-color: #666;
        --bs-text: white;
      }
    }

    #box-score__wrapper {
      display: flex;
    }

    #box-score__home-wrapper, #box-score__away-wrapper {
      position: relative;
      width: 100%;
      height: 20vh;
      background-color: var(--bs-overlay-bg);
    }

    #box-score__home-logo, #box-score__away-logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      z-index: -1;
    }

    #box-score__home-score-wrapper, #box-score__away-score-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-style: solid;
      border-color: var(--bs-border-color);
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }

    #box-score__home-score-wrapper {
      border-width: 0 0 0 16px;
    }

    #box-score__away-score-wrapper {
      border-width: 0 16px 0 0;
    }

    #box-score__home-team, #box-score__away-team {
      color: var(--bs-text);
      font-size: 2em;
      margin: 0;
      margin-left: 5%;
      margin-right: 5%;
    }

    #box-score__home-score, #box-score__away-score {
      color: var(--bs-text);
      font-size: 2em;
      margin: 0;
      margin-left: 5%;
      margin-right: 5%;
    }

    @media only screen and (max-width: 600px) {
      #box-score__wrapper {
        display: block;
      }

      #box-score__away-score-wrapper {
        border-width: 0 0 0 16px;
      }
    }
  </style>
  <div id="box-score__wrapper" class="box-score__wrapper">
    <div id="box-score__home-wrapper" class="box-score__home-wrapper">
      <img id="box-score__home-logo" class="box-score__home-logo" src="https://official-flc.com/img/default-club-picture.png">
      <div id="box-score__home-score-wrapper" class="box-score__home-score-wrapper">
        <p id="box-score__home-team" class="box-score__home-team">Home Team</p>
        <p id="box-score__home-score" class="box-score__home-score">0</p>
      </div>
    </div>
    <div id="box-score__away-wrapper" class="box-score__away-wrapper">
      <img id="box-score__away-logo" class="box-score__away-logo" src="https://official-flc.com/img/default-club-picture.png">
      <div id="box-score__away-score-wrapper" class="box-score__away-score-wrapper">
        <p id="box-score__away-team" class="box-score__away-team">Away Team</p>
        <p id="box-score__away-score" class="box-score__away-score">0</p>
      </div>
    </div>
  </div>
`;

export class WACTBoxScore extends HTMLElement {
  static readonly tagName = 'wact-box-score' as const;

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
    return ['home-team', 'home-logo', 'home-score', 'away-team', 'away-logo', 'away-score'];
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

  calculateWinner(): void {
    const homeScore = parseInt(
      (this.root.getElementById('box-score__home-score') as HTMLParagraphElement).innerHTML,
    );
    const awayScore = parseInt(
      (this.root.getElementById('box-score__away-score') as HTMLParagraphElement).innerHTML,
    );

    const homeWrapper = this.root.getElementById('box-score__home-wrapper') as HTMLDivElement;
    const homeScoreWrapper = this.root.getElementById(
      'box-score__home-score-wrapper',
    ) as HTMLDivElement;
    const awayWrapper = this.root.getElementById('box-score__away-wrapper') as HTMLDivElement;
    const awayScoreWrapper = this.root.getElementById(
      'box-score__away-score-wrapper',
    ) as HTMLDivElement;

    if (homeScore > awayScore) {
      homeWrapper.style.backgroundColor = 'rgba(0, 63, 0, 0.7)';
      homeScoreWrapper.style.borderColor = 'lime';
      awayWrapper.style.backgroundColor = 'rgba(63, 0, 0, 0.7)';
      awayScoreWrapper.style.borderColor = 'red';
    } else if (awayScore > homeScore) {
      homeWrapper.style.backgroundColor = 'rgba(63, 0, 0, 0.7)';
      homeScoreWrapper.style.borderColor = 'red';
      awayWrapper.style.backgroundColor = 'rgba(0, 63, 0, 0.7)';
      awayScoreWrapper.style.borderColor = 'lime';
    } else {
      homeWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      homeScoreWrapper.style.borderColor = 'gray';
      awayWrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      awayScoreWrapper.style.borderColor = 'gray';
    }
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    newValue: string | null,
  ): void {
    if (!this.root) return;
    switch (attribute.toLowerCase()) {
      case 'home-team':
        (this.root.getElementById('box-score__home-team') as HTMLParagraphElement).innerHTML =
          newValue ?? '';
        break;
      case 'home-logo':
        (this.root.getElementById('box-score__home-logo') as HTMLImageElement).setAttribute(
          'src',
          newValue ?? '',
        );
        break;
      case 'home-score':
        (this.root.getElementById('box-score__home-score') as HTMLParagraphElement).innerHTML =
          String(parseInt(newValue ?? '0'));
        this.calculateWinner();
        break;
      case 'away-team':
        (this.root.getElementById('box-score__away-team') as HTMLParagraphElement).innerHTML =
          newValue ?? '';
        break;
      case 'away-logo':
        (this.root.getElementById('box-score__away-logo') as HTMLImageElement).setAttribute(
          'src',
          newValue ?? '',
        );
        break;
      case 'away-score':
        (this.root.getElementById('box-score__away-score') as HTMLParagraphElement).innerHTML =
          String(parseInt(newValue ?? '0'));
        this.calculateWinner();
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
