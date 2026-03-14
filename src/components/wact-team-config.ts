import type { TeamConfig } from '../services/types.js';
import {
  COLOR_CSS,
  ELEVATION_CSS,
  LAYOUT_CSS,
  MOTION_CSS,
  SHAPE_CSS,
  SPACING_CSS,
  TYPEFACE_CSS,
} from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${COLOR_CSS}
    ${ELEVATION_CSS}
    ${LAYOUT_CSS}
    ${MOTION_CSS}
    ${SHAPE_CSS}
    ${SPACING_CSS}
    ${TYPEFACE_CSS}

    :host {
      display: block;
      font-family: var(--wact-sys-typescale-font-family);
      --wact-comp-team-config-container-color:            var(--wact-sys-color-surface);
      --wact-comp-team-config-on-container-color:         var(--wact-sys-color-on-surface);
      --wact-comp-team-config-label-color:                var(--wact-sys-color-on-surface-muted);
      --wact-comp-team-config-input-outline-color:        var(--wact-sys-color-outline);
      --wact-comp-team-config-input-focus-color:          var(--wact-sys-color-primary);
      --wact-comp-team-config-section-header-color:       var(--wact-sys-color-on-surface);
      --wact-comp-team-config-section-hover-color:        var(--wact-sys-color-primary);
      --wact-comp-team-config-error-label-color:          var(--wact-sys-color-error);
      --wact-comp-team-config-error-container-color:      var(--wact-sys-color-error-container);
      --wact-comp-team-config-image-shape:                var(--wact-sys-shape-corner-extra-small);
      --wact-comp-team-config-error-shape:                var(--wact-sys-shape-corner-extra-small);
      --wact-comp-team-config-container-shape:            var(--wact-sys-shape-corner-medium);
      --wact-comp-team-config-image-overlay-heavy-color:  var(--wact-sys-color-surface-image-overlay-heavy);
      --wact-comp-team-config-image-overlay-light-color:  var(--wact-sys-color-surface-image-overlay-light);
      --wact-comp-team-config-logo-input-bg-color:        var(--wact-sys-color-surface-image-overlay-medium);
      --wact-comp-team-config-logo-input-on-color:        var(--wact-sys-color-on-image-overlay);
      --wact-comp-team-config-logo-input-outline-color:   var(--wact-ref-palette-neutral50);
      --wact-comp-team-config-banner-height:              25vh;
      --wact-comp-team-config-banner-height-mobile:       20vh;
      --wact-comp-team-config-z-index-logo:               0;
      --wact-comp-team-config-z-index-overlay:            1;
      --wact-comp-team-config-z-index-content:            2;
      --wact-comp-team-config-row-gap:                    var(--wact-sys-spacing-xs);
      --wact-comp-team-config-input-padding:              var(--wact-sys-spacing-xs);
      --wact-comp-team-config-input-font-size:            var(--wact-sys-typescale-body-default-size);
      --wact-comp-team-config-input-height:               var(--wact-ref-layout-px-32);
      --wact-comp-team-config-btn-margin-top:             var(--wact-sys-spacing-sm);
      --wact-comp-team-config-btn-padding:                var(--wact-sys-spacing-lg);
      --wact-comp-team-config-btn-font-size:              var(--wact-sys-typescale-body-medium-size);
    }

    #team-config__wrapper {
      background-color: var(--wact-comp-team-config-container-color);
      border-radius: var(--wact-comp-team-config-container-shape);
      padding: var(--wact-sys-spacing-lg);
      color: var(--wact-comp-team-config-on-container-color);
    }

    #team-config__header-wrapper {
      width: var(--wact-ref-layout-fit-container);
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--wact-sys-spacing-sm);
    }

    #team-config__header-label {
      font-weight: var(--wact-sys-typescale-weight-bold);
      font-size: var(--wact-sys-typescale-title-large-size);
    }

    .team-config__row {
      display: flex;
      gap: var(--wact-sys-spacing-sm);
      margin-bottom: var(--wact-sys-spacing-sm);
    }

    .team-config__row > * {
      flex: 1;
    }

    .team-config__input-group {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--wact-sys-spacing-xs);
    }

    .team-config__input-group label {
      font-size: var(--wact-sys-typescale-body-small-size);
      color: var(--wact-comp-team-config-label-color);
      margin-bottom: var(--wact-comp-team-config-row-gap);
    }

    .team-config__input-group input[type="text"],
    .team-config__input-group input[type="number"] {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      border-bottom: 2px solid var(--wact-comp-team-config-input-outline-color);
      padding: var(--wact-comp-team-config-input-padding);
      font-size: var(--wact-comp-team-config-input-font-size);
      color: inherit;
      transition: border-color var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    .team-config__input-group input[type="text"]:focus,
    .team-config__input-group input[type="text"]:hover,
    .team-config__input-group input[type="number"]:focus,
    .team-config__input-group input[type="number"]:hover {
      border-color: var(--wact-comp-team-config-input-focus-color);
      outline: none;
    }

    @media (prefers-color-scheme: dark) {
      .team-config__input-group input[type="number"] {
        color-scheme: dark;
      }
    }

    .team-config__input-group input[type="color"] {
      width: var(--wact-ref-layout-fit-container);
      height: var(--wact-comp-team-config-input-height);
      padding: 0;
      border: 2px solid var(--wact-comp-team-config-input-outline-color);
      border-radius: var(--wact-comp-team-config-image-shape);
      cursor: pointer;
      background: none;
    }

    .team-config__input-group input[type="color"]:hover {
      border-color: var(--wact-comp-team-config-input-focus-color);
    }

    #team-config__image-wrapper {
      position: relative;
      height: var(--wact-comp-team-config-banner-height);
      transition: all var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      margin-bottom: var(--wact-sys-spacing-md);
      border-radius: var(--wact-comp-team-config-image-shape);
      overflow: hidden;
    }

    #team-config__logo {
      width: var(--wact-ref-layout-fit-container);
      height: var(--wact-ref-layout-fit-container);
      object-fit: cover;
      position: absolute;
      z-index: var(--wact-comp-team-config-z-index-logo);
    }

    #team-config__image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--wact-ref-layout-fit-container);
      height: var(--wact-ref-layout-fit-container);
      z-index: var(--wact-comp-team-config-z-index-overlay);
      background-color: var(--wact-comp-team-config-image-overlay-heavy-color);
      transition: background-color var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      pointer-events: none;
    }

    #team-config__image-wrapper:hover #team-config__image-overlay {
      background-color: var(--wact-comp-team-config-image-overlay-light-color);
    }

    #team-config__logo-url-wrapper {
      width: var(--wact-ref-layout-fit-container);
      position: absolute;
      z-index: var(--wact-comp-team-config-z-index-content);
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
    }

    #team-config__logo-url-label {
      color: var(--wact-comp-team-config-logo-input-on-color);
      font-size: var(--wact-sys-typescale-body-medium-size);
      margin-left: var(--wact-sys-spacing-xs);
    }

    #team-config__logo-url-input {
      flex: 1;
      background-color: var(--wact-comp-team-config-logo-input-bg-color);
      border: none;
      border-bottom: 2px solid var(--wact-comp-team-config-logo-input-outline-color);
      color: var(--wact-comp-team-config-logo-input-on-color);
      padding: var(--wact-sys-spacing-xs);
      font-size: var(--wact-sys-typescale-body-medium-size);
      transition: border-color var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    #team-config__logo-url-input:focus,
    #team-config__logo-url-input:hover {
      border-color: var(--wact-comp-team-config-input-focus-color);
      outline: none;
    }

    .team-config__section-header {
      font-weight: var(--wact-sys-typescale-weight-bold);
      font-size: var(--wact-sys-typescale-body-default-size);
      margin-top: var(--wact-sys-spacing-md);
      margin-bottom: var(--wact-sys-spacing-xs);
      color: var(--wact-comp-team-config-section-header-color);
      cursor: pointer;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: color var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    .team-config__section-header:hover {
      color: var(--wact-comp-team-config-section-hover-color);
    }

    .team-config__section-chevron {
      font-size: var(--wact-sys-typescale-label-small-size);
      transition: transform var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    .team-config__section-chevron--collapsed {
      transform: rotate(-90deg);
    }

    .team-config__section-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--wact-sys-spacing-xs) var(--wact-sys-spacing-md);
      max-height: var(--wact-ref-layout-px-512);
      overflow: hidden;
      transition: max-height var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    .team-config__section-content--collapsed {
      max-height: 0;
    }

    #team-config__load-btn {
      display: block;
      width: fit-content;
      margin: var(--wact-comp-team-config-btn-margin-top) auto 0;
      position: relative;
      z-index: var(--wact-sys-zindex-dropdown);
      --btn-padding: var(--wact-comp-team-config-btn-padding);
      font-size: var(--wact-comp-team-config-btn-font-size);
    }

    #team-config__file-input {
      display: none;
    }

    #team-config__error {
      display: none;
      color: var(--wact-comp-team-config-error-label-color);
      font-size: var(--wact-sys-typescale-body-small-size);
      margin-top: var(--wact-sys-spacing-xs);
      padding: var(--wact-sys-spacing-xs) var(--wact-sys-spacing-sm);
      background-color: var(--wact-comp-team-config-error-container-color);
      border-radius: var(--wact-comp-team-config-error-shape);
    }

    @media only screen and (max-width: 600px) {
      .team-config__section-content {
        grid-template-columns: 1fr;
      }

      #team-config__image-wrapper {
        height: var(--wact-comp-team-config-banner-height-mobile);
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
    <wact-button id="team-config__load-btn" tooltip="Load from file"><wact-icon icon="upload"></wact-icon></wact-button>
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

    const loadBtn = this.root.getElementById('team-config__load-btn') as HTMLElement;
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
