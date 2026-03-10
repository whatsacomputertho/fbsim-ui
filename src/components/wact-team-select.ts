import type { TeamInput } from '../services/types.js';
import { COLOR_CSS, LAYOUT_CSS, MOTION_CSS, TYPEFACE_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${COLOR_CSS}
    ${LAYOUT_CSS}
    ${MOTION_CSS}
    ${TYPEFACE_CSS}

    :host {
      --wact-comp-team-select-on-surface-color:           var(--wact-sys-color-on-surface);
      --wact-comp-team-select-input-outline-color:        var(--wact-sys-color-outline);
      --wact-comp-team-select-input-focus-color:          var(--wact-sys-color-primary);
      --wact-comp-team-select-image-overlay-heavy-color:  var(--wact-sys-color-surface-image-overlay-heavy);
      --wact-comp-team-select-image-overlay-light-color:  var(--wact-sys-color-surface-image-overlay-light);
      --wact-comp-team-select-logo-input-bg-color:        var(--wact-sys-color-surface-image-overlay-medium);
      --wact-comp-team-select-logo-input-on-color:        var(--wact-sys-color-on-image-overlay);
      --wact-comp-team-select-logo-input-outline-color:   var(--wact-ref-palette-neutral50);
      --wact-comp-team-select-banner-height:              var(--wact-ref-layout-vh-40);
      --wact-comp-team-select-z-index-logo:               var(--wact-sys-layer-neg-1);
      --wact-comp-team-select-z-index-content:            var(--wact-sys-layer-1);
      --wact-comp-team-select-input-border-width:         3px;
      --wact-comp-team-select-input-font-size:            var(--wact-sys-typeface-title-large-size);
      --wact-comp-team-select-input-bg:                   var(--wact-sys-color-transparent);
    }

    #team-select__header-wrapper {
      width: var(--wact-sys-layout-fit-container);
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__name-input-label {
      width: var(--wact-sys-layout-fit-container);
      font-weight: var(--wact-sys-typeface-weight-bold);
      font-size: var(--wact-sys-typeface-display-medium-size);
      color: var(--wact-comp-team-select-on-surface-color);
    }

    #team-select__name-input {
      width: var(--wact-sys-layout-fit-container);
      background-color: var(--wact-comp-team-select-input-bg);
      border-style: solid;
      border-width: 0 0 var(--wact-comp-team-select-input-border-width) 0;
      transition: all var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
      border-color: var(--wact-comp-team-select-input-outline-color);
      color: inherit;
      font-size: var(--wact-comp-team-select-input-font-size);
    }

    #team-select__name-input:focus, #team-select__name-input:hover {
      border-color: var(--wact-comp-team-select-input-focus-color);
    }

    #team-select__image-wrapper {
      position: relative;
      height: var(--wact-comp-team-select-banner-height);
      background-color: var(--wact-comp-team-select-image-overlay-heavy-color);
      transition: all var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
    }

    #team-select__image-wrapper:hover {
      background-color: var(--wact-comp-team-select-image-overlay-light-color);
    }

    #team-select__logo {
      width: var(--wact-sys-layout-fit-container);
      height: var(--wact-sys-layout-fit-container);
      object-fit: cover;
      position: absolute;
      z-index: var(--wact-comp-team-select-z-index-logo);
    }

    #team-select__logo-url-input-wrapper {
      width: var(--wact-sys-layout-fit-container);
      position: absolute;
      z-index: var(--wact-comp-team-select-z-index-content);
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
    }

    #team-select__logo-url-input {
      width: var(--wact-sys-layout-fit-container);
      background-color: var(--wact-comp-team-select-logo-input-bg-color);
      border-style: solid;
      border-color: var(--wact-comp-team-select-logo-input-outline-color);
      border-width: 0 0 var(--wact-comp-team-select-input-border-width) 0;
      transition: all var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
      color: var(--wact-comp-team-select-logo-input-on-color);
      margin-left: 1%;
      font-size: var(--wact-sys-typeface-title-small-size);
    }

    #team-select__logo-url-input:focus, #team-select__logo-url-input:hover {
      border-color: var(--wact-comp-team-select-input-focus-color);
    }

    #team-select__logo-url-input-label {
      color: var(--wact-comp-team-select-logo-input-on-color);
      font-size: var(--wact-sys-typeface-title-small-size);
      margin-left: 1%;
    }

    #team-select__offense-wrapper {
      width: var(--wact-sys-layout-fit-container);
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__offense-input-label {
      font-size: var(--wact-sys-typeface-title-large-size);
      color: var(--wact-comp-team-select-on-surface-color);
    }

    #team-select__offense-input {
      background-color: var(--wact-comp-team-select-input-bg);
      border-style: solid;
      border-width: 0 0 var(--wact-comp-team-select-input-border-width) 0;
      transition: all var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
      border-color: var(--wact-comp-team-select-input-outline-color);
      color: inherit;
      font-size: var(--wact-comp-team-select-input-font-size);
    }

    #team-select__offense-input:focus, #team-select__offense-input:hover {
      border-color: var(--wact-comp-team-select-input-focus-color);
    }

    #team-select__defense-wrapper {
      width: var(--wact-sys-layout-fit-container);
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__defense-input-label {
      font-size: var(--wact-sys-typeface-title-large-size);
      color: var(--wact-comp-team-select-on-surface-color);
    }

    #team-select__defense-input {
      background-color: var(--wact-comp-team-select-input-bg);
      border-style: solid;
      border-width: 0 0 var(--wact-comp-team-select-input-border-width) 0;
      transition: all var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
      border-color: var(--wact-comp-team-select-input-outline-color);
      color: inherit;
      font-size: var(--wact-comp-team-select-input-font-size);
    }

    #team-select__defense-input:focus, #team-select__defense-input:hover {
      border-color: var(--wact-comp-team-select-input-focus-color);
    }
  </style>
  <div id="team-select__wrapper" class="team-select__wrapper">
    <div id="team-select__header-wrapper" class="team-select__header-wrapper">
      <label id="team-select__name-input-label" class="team-select__name-input-label">Home</label>
      <input id="team-select__name-input" class="team-select__name-input" type="text" value="Home Team">
    </div>
    <div id="team-select__image-wrapper" class="team-select__image-wrapper">
      <img id="team-select__logo" class="team-select__logo" src="https://official-flc.com/img/default-club-picture.png">
      <div id="team-select__logo-url-input-wrapper" class="team-select__logo-url-input-wrapper">
        <label id="team-select__logo-url-input-label" class="team-select__logo-url-input-label">Url: </label>
        <input id="team-select__logo-url-input" class="team-select__logo-url-input" type="text" value="https://official-flc.com/img/default-club-picture.png">
      </div>
    </div>
    <div id="team-select__offense-wrapper" class="team-select__offense-wrapper">
      <label id="team-select__offense-input-label" class="team-select__offense-input-label">Offense</label>
      <input id="team-select__offense-input" class="team-select__offense-input" type="number" value="50" min="0" max="100">
    </div>
    <div id="team-select__defense-wrapper" class="team-select__defense-wrapper">
      <label id="team-select__defense-input-label" class="team-select__defense-input-label">Defense</label>
      <input id="team-select__defense-input" class="team-select__defense-input" type="number" value="50" min="0" max="100">
    </div>
  </div>
`;

export class WACTTeamSelect extends HTMLElement {
  static readonly tagName = 'wact-team-select' as const;

  readonly root: ShadowRoot;
  private imageUrlTimeout: ReturnType<typeof setTimeout> | null = null;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return ['away'];
  }

  get away(): boolean {
    return this.hasAttribute('away');
  }

  set away(value: boolean) {
    if (value) {
      this.setAttribute('away', '');
    } else {
      this.removeAttribute('away');
    }
  }

  get logo(): string {
    return (
      (this.root.getElementById('team-select__logo') as HTMLImageElement).getAttribute('src') ?? ''
    );
  }

  get team(): TeamInput {
    const name = (this.root.getElementById('team-select__name-input') as HTMLInputElement).value;
    const offenseOverall = parseInt(
      (this.root.getElementById('team-select__offense-input') as HTMLInputElement).value,
    );
    const defenseOverall = parseInt(
      (this.root.getElementById('team-select__defense-input') as HTMLInputElement).value,
    );
    return {
      name,
      offense_overall: offenseOverall,
      defense_overall: defenseOverall,
    };
  }

  private toggleAway(): void {
    const homeAwayText = this.away ? 'Away' : 'Home';
    const header = this.root.getElementById('team-select__name-input-label') as HTMLLabelElement;
    header.innerHTML = homeAwayText;
    const nameInput = this.root.getElementById('team-select__name-input') as HTMLInputElement;
    nameInput.value = `${homeAwayText} Team`;
  }

  private refreshImageUrl(): void {
    if (this.imageUrlTimeout) {
      clearTimeout(this.imageUrlTimeout);
    }
    this.imageUrlTimeout = setTimeout(() => {
      const imageDisplay = this.root.getElementById('team-select__logo') as HTMLImageElement;
      const imageInput = this.root.getElementById(
        'team-select__logo-url-input',
      ) as HTMLInputElement;
      imageDisplay.setAttribute('src', imageInput.value);
    }, 1000);
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    _newValue: string | null,
  ): void {
    if (attribute.toLowerCase() !== 'away') return;
    if (!this.isConnected) return;
    if (typeof this.toggleAway !== 'function') return;
    this.toggleAway();
  }

  connectedCallback(): void {
    if (this._initialized || !this.root) return;
    this._initialized = true;
    const imageUrlInput = this.root.getElementById(
      'team-select__logo-url-input',
    ) as HTMLInputElement;
    imageUrlInput.addEventListener('input', this.refreshImageUrl.bind(this));
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
