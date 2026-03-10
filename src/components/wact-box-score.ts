import { COLOR_CSS } from '../styles/index.js';
import { ELEVATION_CSS } from '../styles/index.js';
import { LAYOUT_CSS } from '../styles/index.js';
import { SPACING_CSS } from '../styles/index.js';
import { TYPEFACE_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${COLOR_CSS}
    ${ELEVATION_CSS}
    ${LAYOUT_CSS}
    ${SPACING_CSS}
    ${TYPEFACE_CSS}

    :host {
      /* Color palette */
      --wact-comp-box-score-overlay-color:      var(--wact-sys-color-overlay);
      --wact-comp-box-score-outline-color:      var(--wact-sys-color-outline-variant);
      --wact-comp-box-score-on-overlay-color:   var(--wact-sys-color-on-image-overlay);
      --wact-comp-box-score-win-overlay-color:  var(--wact-sys-color-win-overlay);
      --wact-comp-box-score-win-outline-color:  var(--wact-sys-color-win-outline);
      --wact-comp-box-score-lose-overlay-color: var(--wact-sys-color-lose-overlay);
      --wact-comp-box-score-lose-outline-color: var(--wact-sys-color-lose-outline);
      --wact-comp-box-score-tie-overlay-color:  var(--wact-sys-color-tie-overlay);
      --wact-comp-box-score-tie-outline-color:  var(--wact-sys-color-tie-outline);

      /* Layout */
      --wact-comp-box-score-size:               var(--wact-ref-layout-fit-container);
      --wact-comp-box-score-panel-height:       var(--wact-sys-layout-banner-large-height);
      --wact-comp-box-score-panel-min-height:   var(--wact-sys-typeface-display-large-size);
      --wact-comp-box-score-panel-max-height:   var(--wact-sys-layout-banner-large-max-height);
      --wact-comp-box-score-text-margin:        var(--wact-ref-spacing-md);
      --wact-comp-box-score-accent-width:       var(--wact-sys-spacing-lg);

      /* Typeface */
      --wact-comp-box-score-font-size:          var(--wact-sys-typeface-display-medium-size);

      /* Elevation */
      --wact-comp-box-score-z-index-logo:       var(--wact-sys-layer-neg-1);
    }

    #box-score__wrapper {
      display: flex;
    }

    #box-score__home-wrapper, #box-score__away-wrapper {
      position:         relative;
      width:            var(--wact-comp-box-score-size);
      height:           var(--wact-comp-box-score-panel-height);
      min-height:       var(--wact-comp-box-score-panel-min-height);
      max-height:       var(--wact-comp-box-score-panel-max-height);
      background-color: var(--wact-comp-box-score-overlay-color);
    }

    #box-score__home-logo, #box-score__away-logo {
      position:   absolute;
      object-fit: cover;
      width:      var(--wact-comp-box-score-size);
      height:     var(--wact-comp-box-score-size);
      z-index:    var(--wact-comp-box-score-z-index-logo);
    }

    #box-score__home-score-wrapper, #box-score__away-score-wrapper {
      display:            flex;
      justify-content:    center;
      align-items:        center;
      width:              var(--wact-comp-box-score-size);
      height:             var(--wact-comp-box-score-size);
      border-style:       solid;
      border-color:       var(--wact-comp-box-score-outline-color);
      box-sizing:         border-box;
      -moz-box-sizing:    border-box;
      -webkit-box-sizing: border-box;
    }

    #box-score__home-score-wrapper {
      border-width: 0 0 0 var(--wact-comp-box-score-accent-width);
    }

    #box-score__away-score-wrapper {
      border-width: 0 var(--wact-comp-box-score-accent-width) 0 0;
    }

    #box-score__home-team, #box-score__away-team {
      color:        var(--wact-comp-box-score-on-overlay-color);
      font-size:    var(--wact-comp-box-score-font-size);
      margin:       0;
      margin-left:  var(--wact-comp-box-score-text-margin);
      margin-right: var(--wact-comp-box-score-text-margin);
    }

    #box-score__home-score, #box-score__away-score {
      color:        var(--wact-comp-box-score-on-overlay-color);
      font-size:    var(--wact-comp-box-score-font-size);
      margin:       0;
      margin-left:  var(--wact-comp-box-score-text-margin);
      margin-right: var(--wact-comp-box-score-text-margin);
    }

    @media only screen and (max-width: 600px) {
      #box-score__wrapper {
        display: block;
      }

      #box-score__away-score-wrapper {
        border-width: 0 0 0 var(--wact-comp-box-score-accent-width);
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

    const style = getComputedStyle(this);
    const winOverlay = style.getPropertyValue('--wact-comp-box-score-win-overlay-color').trim();
    const winOutline = style.getPropertyValue('--wact-comp-box-score-win-outline-color').trim();
    const loseOverlay = style.getPropertyValue('--wact-comp-box-score-lose-overlay-color').trim();
    const loseOutline = style.getPropertyValue('--wact-comp-box-score-lose-outline-color').trim();
    const tieOverlay = style.getPropertyValue('--wact-comp-box-score-tie-overlay-color').trim();
    const tieOutline = style.getPropertyValue('--wact-comp-box-score-tie-outline-color').trim();

    if (homeScore > awayScore) {
      homeWrapper.style.backgroundColor = winOverlay;
      homeScoreWrapper.style.borderColor = winOutline;
      awayWrapper.style.backgroundColor = loseOverlay;
      awayScoreWrapper.style.borderColor = loseOutline;
    } else if (awayScore > homeScore) {
      homeWrapper.style.backgroundColor = loseOverlay;
      homeScoreWrapper.style.borderColor = loseOutline;
      awayWrapper.style.backgroundColor = winOverlay;
      awayScoreWrapper.style.borderColor = winOutline;
    } else {
      homeWrapper.style.backgroundColor = tieOverlay;
      homeScoreWrapper.style.borderColor = tieOutline;
      awayWrapper.style.backgroundColor = tieOverlay;
      awayScoreWrapper.style.borderColor = tieOutline;
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
