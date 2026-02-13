import type { TeamConfig } from '../services/types.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }

    #team-config__wrapper {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
    }

    #team-config__header-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    #team-config__header-label {
      font-weight: bold;
      font-size: 1.5em;
    }

    .team-config__row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .team-config__row > * {
      flex: 1;
    }

    .team-config__input-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 6px;
    }

    .team-config__input-group label {
      font-size: 0.8em;
      color: #666;
      margin-bottom: 2px;
    }

    .team-config__input-group input[type="text"],
    .team-config__input-group input[type="number"] {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      border-bottom: 2px solid #ccc;
      padding: 4px 2px;
      font-size: 1em;
      transition: border-color 200ms ease;
    }

    .team-config__input-group input[type="text"]:focus,
    .team-config__input-group input[type="text"]:hover,
    .team-config__input-group input[type="number"]:focus,
    .team-config__input-group input[type="number"]:hover {
      border-color: royalblue;
      outline: none;
    }

    .team-config__input-group input[type="color"] {
      width: 100%;
      height: 32px;
      padding: 0;
      border: 2px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      background: none;
    }

    .team-config__input-group input[type="color"]:hover {
      border-color: royalblue;
    }

    #team-config__image-wrapper {
      position: relative;
      height: 25vh;
      transition: all 100ms ease-in-out;
      margin-bottom: 12px;
      border-radius: 4px;
      overflow: hidden;
    }

    #team-config__logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      z-index: 0;
    }

    #team-config__image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.7);
      transition: background-color 100ms ease-in-out;
      pointer-events: none;
    }

    #team-config__image-wrapper:hover #team-config__image-overlay {
      background-color: rgba(0, 0, 0, 0.2);
    }

    #team-config__logo-url-wrapper {
      width: 100%;
      position: absolute;
      z-index: 2;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
    }

    #team-config__logo-url-label {
      color: white;
      font-size: 0.9em;
      margin-left: 4px;
    }

    #team-config__logo-url-input {
      flex: 1;
      background-color: rgba(0, 0, 0, 0.5);
      border: none;
      border-bottom: 2px solid gray;
      color: white;
      padding: 4px;
      font-size: 0.9em;
      transition: border-color 200ms ease;
    }

    #team-config__logo-url-input:focus,
    #team-config__logo-url-input:hover {
      border-color: royalblue;
      outline: none;
    }

    .team-config__section-header {
      font-weight: bold;
      font-size: 1em;
      margin-top: 12px;
      margin-bottom: 6px;
      color: #333;
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .team-config__section-header:hover {
      color: royalblue;
    }

    .team-config__section-chevron {
      font-size: 0.7em;
      transition: transform 200ms ease;
    }

    .team-config__section-chevron--collapsed {
      transform: rotate(-90deg);
    }

    .team-config__section-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 12px;
    }

    .team-config__section-content--collapsed {
      display: none;
    }

    #team-config__load-btn {
      margin-top: 8px;
      padding: 6px 16px;
      font-size: 0.9em;
      background-color: #162267;
      color: yellow;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 150ms ease;
    }

    #team-config__load-btn:hover {
      background-color: rgb(44, 63, 170);
    }

    #team-config__file-input {
      display: none;
    }

    #team-config__error {
      display: none;
      color: #cc0000;
      font-size: 0.85em;
      margin-top: 6px;
      padding: 4px 8px;
      background-color: #ffe6e6;
      border-radius: 4px;
    }

    @media only screen and (max-width: 600px) {
      .team-config__section-content {
        grid-template-columns: 1fr;
      }

      #team-config__image-wrapper {
        height: 20vh;
      }
    }
  </style>
  <div id="team-config__wrapper">
    <div id="team-config__header-wrapper">
      <span id="team-config__header-label">Home</span>
    </div>
    <div class="team-config__row">
      <div class="team-config__input-group">
        <label for="team-config__name">Team Name</label>
        <input id="team-config__name" type="text" value="Home Team">
      </div>
      <div class="team-config__input-group">
        <label for="team-config__short-name">Abbreviation</label>
        <input id="team-config__short-name" type="text" value="HOME" maxlength="4">
      </div>
      <div class="team-config__input-group">
        <label for="team-config__color">Color</label>
        <input id="team-config__color" type="color" value="#1a5276">
      </div>
    </div>
    <div id="team-config__image-wrapper">
      <img id="team-config__logo" src="https://official-flc.com/img/default-club-picture.png" alt="">
      <div id="team-config__image-overlay"></div>
      <div id="team-config__logo-url-wrapper">
        <label id="team-config__logo-url-label" for="team-config__logo-url-input">Url:</label>
        <input id="team-config__logo-url-input" type="text" value="https://official-flc.com/img/default-club-picture.png">
      </div>
    </div>
    <button id="team-config__load-btn">Load from File</button>
    <input id="team-config__file-input" type="file" accept=".json">
    <div id="team-config__error"></div>

    <div class="team-config__section-header" data-section="offense">
      <span>Offense</span>
      <span class="team-config__section-chevron">&#9660;</span>
    </div>
    <div id="team-config__offense" class="team-config__section-content">
      <div class="team-config__input-group"><label>Passing</label><input data-field="offense.passing" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Blocking</label><input data-field="offense.blocking" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Rushing</label><input data-field="offense.rushing" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Receiving</label><input data-field="offense.receiving" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Scrambling</label><input data-field="offense.scrambling" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Turnovers</label><input data-field="offense.turnovers" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Field Goals</label><input data-field="offense.field_goals" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Punting</label><input data-field="offense.punting" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Kickoffs</label><input data-field="offense.kickoffs" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Kick Return Def</label><input data-field="offense.kick_return_defense" type="number" value="50" min="0" max="100"></div>
    </div>

    <div class="team-config__section-header" data-section="defense">
      <span>Defense</span>
      <span class="team-config__section-chevron">&#9660;</span>
    </div>
    <div id="team-config__defense" class="team-config__section-content">
      <div class="team-config__input-group"><label>Blitzing</label><input data-field="defense.blitzing" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Rush Defense</label><input data-field="defense.rush_defense" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Pass Defense</label><input data-field="defense.pass_defense" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Coverage</label><input data-field="defense.coverage" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Turnovers</label><input data-field="defense.turnovers" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Kick Returning</label><input data-field="defense.kick_returning" type="number" value="50" min="0" max="100"></div>
    </div>

    <div class="team-config__section-header" data-section="coach">
      <span>Coach</span>
      <span class="team-config__section-chevron">&#9660;</span>
    </div>
    <div id="team-config__coach" class="team-config__section-content">
      <div class="team-config__input-group"><label>Risk Taking</label><input data-field="coach.risk_taking" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Run/Pass</label><input data-field="coach.run_pass" type="number" value="50" min="0" max="100"></div>
      <div class="team-config__input-group"><label>Up Tempo</label><input data-field="coach.up_tempo" type="number" value="50" min="0" max="100"></div>
    </div>
  </div>
`;

export class WACTTeamConfig extends HTMLElement {
  static readonly tagName = 'wact-team-config' as const;

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
      (this.root.getElementById('team-config__logo') as HTMLImageElement).getAttribute('src') ?? ''
    );
  }

  get teamConfig(): TeamConfig {
    const name = (this.root.getElementById('team-config__name') as HTMLInputElement).value;
    const shortName = (this.root.getElementById('team-config__short-name') as HTMLInputElement)
      .value;
    const logo =
      (this.root.getElementById('team-config__logo') as HTMLImageElement).getAttribute('src') ?? '';
    const color = (this.root.getElementById('team-config__color') as HTMLInputElement).value;

    const getField = (field: string): number => {
      const input = this.root.querySelector(`[data-field="${field}"]`) as HTMLInputElement;
      return parseInt(input.value) || 50;
    };

    return {
      name,
      short_name: shortName,
      logo,
      color,
      offense: {
        passing: getField('offense.passing'),
        blocking: getField('offense.blocking'),
        rushing: getField('offense.rushing'),
        receiving: getField('offense.receiving'),
        scrambling: getField('offense.scrambling'),
        turnovers: getField('offense.turnovers'),
        field_goals: getField('offense.field_goals'),
        punting: getField('offense.punting'),
        kickoffs: getField('offense.kickoffs'),
        kick_return_defense: getField('offense.kick_return_defense'),
      },
      defense: {
        blitzing: getField('defense.blitzing'),
        rush_defense: getField('defense.rush_defense'),
        pass_defense: getField('defense.pass_defense'),
        coverage: getField('defense.coverage'),
        turnovers: getField('defense.turnovers'),
        kick_returning: getField('defense.kick_returning'),
      },
      coach: {
        risk_taking: getField('coach.risk_taking'),
        run_pass: getField('coach.run_pass'),
        up_tempo: getField('coach.up_tempo'),
      },
    };
  }

  private toggleAway(): void {
    const homeAwayText = this.away ? 'Away' : 'Home';
    const header = this.root.getElementById('team-config__header-label') as HTMLSpanElement;
    header.textContent = homeAwayText;
    const nameInput = this.root.getElementById('team-config__name') as HTMLInputElement;
    nameInput.value = `${homeAwayText} Team`;
    const shortInput = this.root.getElementById('team-config__short-name') as HTMLInputElement;
    shortInput.value = homeAwayText.substring(0, 4).toUpperCase();
    const colorInput = this.root.getElementById('team-config__color') as HTMLInputElement;
    colorInput.value = this.away ? '#922b21' : '#1a5276';
  }

  private refreshImageUrl(): void {
    if (this.imageUrlTimeout) {
      clearTimeout(this.imageUrlTimeout);
    }
    this.imageUrlTimeout = setTimeout(() => {
      const imageDisplay = this.root.getElementById('team-config__logo') as HTMLImageElement;
      const imageInput = this.root.getElementById(
        'team-config__logo-url-input',
      ) as HTMLInputElement;
      imageDisplay.setAttribute('src', imageInput.value);
    }, 500);
  }

  private setErrorMessage(message: string): void {
    const errorEl = this.root.getElementById('team-config__error') as HTMLDivElement;
    if (message) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    } else {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private populateFromJSON(data: any): void {
    if (data.name) {
      (this.root.getElementById('team-config__name') as HTMLInputElement).value = data.name;
    }
    if (data.short_name) {
      (this.root.getElementById('team-config__short-name') as HTMLInputElement).value =
        data.short_name;
    }

    if (data.color) {
      (this.root.getElementById('team-config__color') as HTMLInputElement).value = data.color;
    }

    if (data.logo) {
      if (this.imageUrlTimeout) {
        clearTimeout(this.imageUrlTimeout);
        this.imageUrlTimeout = null;
      }
      const imageInput = this.root.getElementById(
        'team-config__logo-url-input',
      ) as HTMLInputElement;
      imageInput.value = data.logo;
      const imageDisplay = this.root.getElementById('team-config__logo') as HTMLImageElement;
      imageDisplay.setAttribute('src', data.logo);
    }

    const sections = ['offense', 'defense', 'coach'] as const;
    for (const section of sections) {
      if (data[section]) {
        for (const [key, value] of Object.entries(data[section])) {
          const input = this.root.querySelector(
            `[data-field="${section}.${key}"]`,
          ) as HTMLInputElement | null;
          if (input && typeof value === 'number') {
            input.value = String(value);
          }
        }
      }
    }
  }

  private handleFileLoad(): void {
    const fileInput = this.root.getElementById('team-config__file-input') as HTMLInputElement;
    fileInput.click();
  }

  private handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e): void => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (!data.offense && !data.defense && !data.coach) {
          const msg = `Invalid team config in "${file.name}": missing offense, defense, or coach sections.`;
          console.error(msg);
          this.setErrorMessage(msg);
          return;
        }

        this.populateFromJSON(data);
        this.setErrorMessage('');
      } catch (err) {
        const msg = `Failed to load "${file.name}": invalid JSON format.`;
        console.error(msg, err);
        this.setErrorMessage(msg);
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private setupSectionToggles(): void {
    const headers = this.root.querySelectorAll(
      '.team-config__section-header',
    ) as NodeListOf<HTMLDivElement>;
    for (const header of headers) {
      header.addEventListener('click', () => {
        const sectionName = header.dataset.section;
        if (!sectionName) return;
        const content = this.root.getElementById(`team-config__${sectionName}`) as HTMLDivElement;
        const chevron = header.querySelector('.team-config__section-chevron') as HTMLSpanElement;
        content.classList.toggle('team-config__section-content--collapsed');
        chevron.classList.toggle('team-config__section-chevron--collapsed');
      });
    }
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
      'team-config__logo-url-input',
    ) as HTMLInputElement;
    imageUrlInput.addEventListener('input', this.refreshImageUrl.bind(this));
    imageUrlInput.addEventListener('change', this.refreshImageUrl.bind(this));

    const loadBtn = this.root.getElementById('team-config__load-btn') as HTMLButtonElement;
    loadBtn.addEventListener('click', () => this.handleFileLoad());

    const fileInput = this.root.getElementById('team-config__file-input') as HTMLInputElement;
    fileInput.addEventListener('change', (e) => this.handleFileChange(e));

    this.setupSectionToggles();
    this.refreshImageUrl();

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
