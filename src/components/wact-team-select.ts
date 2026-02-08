import type { TeamInput } from '../services/types.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    #team-select__header-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__name-input-label {
      width: 100%;
      font-weight: bold;
      font-size: 2em;
    }

    #team-select__name-input {
      width: 100%;
      background-color: rgba(0, 0, 0, 0);
      border-style: solid;
      border-width: 0 0 3px 0;
      transition: all 200ms ease-in-out;
      border-color: black;
      font-size: 1.5em;
    }

    #team-select__name-input:focus, #team-select__name-input:hover {
      border-color: royalblue;
    }

    #team-select__image-wrapper {
      position: relative;
      height: 40vh;
      background-color: rgba(0, 0, 0, 0.7);
      transition: all 100ms ease-in-out;
    }

    #team-select__image-wrapper:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }

    #team-select__logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      z-index: -1;
    }

    #team-select__logo-url-input-wrapper {
      width: 100%;
      position: absolute;
      z-index: 1;
      left: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
    }

    #team-select__logo-url-input {
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      border-style: solid;
      border-color: gray;
      border-width: 0 0 3px 0;
      transition: all 200ms ease-in-out;
      color: white;
      margin-left: 1%;
      font-size: 1.25em;
    }

    #team-select__logo-url-input:focus, #team-select__logo-url-input:hover {
      border-color: royalblue;
    }

    #team-select__logo-url-input-label {
      color: white;
      font-size: 1.25em;
      margin-left: 1%;
    }

    #team-select__offense-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__offense-input-label {
      font-size: 1.5em;
    }

    #team-select__offense-input {
      background-color: rgba(0, 0, 0, 0);
      border-style: solid;
      border-width: 0 0 3px 0;
      transition: all 200ms ease-in-out;
      border-color: black;
      font-size: 1.5em;
    }

    #team-select__offense-input:focus, #team-select__offense-input:hover {
      border-color: royalblue;
    }

    #team-select__defense-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 1%;
      margin-bottom: 1%;
    }

    #team-select__defense-input-label {
      font-size: 1.5em;
    }

    #team-select__defense-input {
      background-color: rgba(0, 0, 0, 0);
      border-style: solid;
      border-width: 0 0 3px 0;
      transition: all 200ms ease-in-out;
      border-color: black;
      font-size: 1.5em;
    }

    #team-select__defense-input:focus, #team-select__defense-input:hover {
      border-color: royalblue;
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
