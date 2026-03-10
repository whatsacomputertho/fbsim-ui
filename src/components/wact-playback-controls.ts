import { COLOR_CSS, ELEVATION_CSS, SHAPE_CSS, SPACING_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${COLOR_CSS}
    ${ELEVATION_CSS}
    ${SHAPE_CSS}
    ${SPACING_CSS}

    :host {
      display: block;
      font-family: var(--wact-sys-typeface-font-family);
      --wact-comp-playback-controls-container-color:         var(--wact-sys-color-surface-raised);
      --wact-comp-playback-controls-on-container-color:      var(--wact-sys-color-on-surface);
      --wact-comp-playback-controls-speed-container-color:   var(--wact-sys-color-interactive);
      --wact-comp-playback-controls-speed-hover-color:       var(--wact-sys-color-interactive-hover);
      --wact-comp-playback-controls-speed-active-color:      var(--wact-sys-color-interactive-active);
      --wact-comp-playback-controls-menu-container-color:    var(--wact-sys-color-interactive);
      --wact-comp-playback-controls-menu-label-color:        var(--wact-sys-color-on-surface-variant);
      --wact-comp-playback-controls-menu-hover-color:        var(--wact-sys-color-interactive-hover);
      --wact-comp-playback-controls-menu-active-label-color: var(--wact-sys-color-tertiary-status);
      --wact-comp-playback-controls-container-shape:         var(--wact-sys-shape-corner-medium);
      --wact-comp-playback-controls-menu-shadow:             var(--wact-sys-elevation-level1);
      --wact-comp-playback-controls-menu-zindex:             var(--wact-sys-zindex-dropdown);
      --wact-comp-playback-controls-btn-size:                var(--wact-sys-layout-min-target-size);
      --wact-comp-playback-controls-label-min-width:         var(--wact-ref-layout-px-64);
      --wact-comp-playback-controls-btn-padding:             6px 14px;
      --wact-comp-playback-controls-btn-padding-compact:     4px 10px;
      --wact-comp-playback-controls-speed-padding-h:         10px;
    }

    #playback__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--wact-sys-spacing-sm) var(--wact-sys-spacing-lg);
      background-color: var(--wact-comp-playback-controls-container-color);
      border-radius: var(--wact-comp-playback-controls-container-shape);
      color: var(--wact-comp-playback-controls-on-container-color);
      gap: var(--wact-sys-spacing-md);
    }

    .playback__button {
      font-size: var(--wact-sys-typeface-body-large-size);
      --btn-padding: var(--wact-comp-playback-controls-btn-padding);
      font-family: var(--wact-sys-typeface-font-family);
    }

    #playback__play-pause {
      width: var(--wact-comp-playback-controls-btn-size);
      text-align: center;
      box-sizing: border-box;
    }

    #playback__left {
      display: flex;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    #playback__right {
      display: flex;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    #playback__speed-wrapper {
      position: relative;
    }

    #playback__speed-display {
      background-color: var(--wact-comp-playback-controls-speed-container-color);
      border: none;
      color: var(--wact-comp-playback-controls-on-container-color);
      font-size: var(--wact-sys-typeface-body-large-size);
      padding: var(--wact-comp-playback-controls-btn-padding);
      border-radius: var(--wact-comp-playback-controls-container-shape);
      cursor: pointer;
      transition: all var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      font-family: var(--wact-sys-typeface-font-family);
      min-width: var(--wact-comp-playback-controls-btn-size);
      height: var(--wact-comp-playback-controls-btn-size);
      text-align: center;
    }

    #playback__speed-display:hover:not(:disabled) {
      background-color: var(--wact-comp-playback-controls-speed-hover-color);
    }

    #playback__speed-display:active:not(:disabled) {
      background-color: var(--wact-comp-playback-controls-speed-active-color);
    }

    #playback__speed-display:disabled {
      opacity: var(--wact-sys-state-layer-opacity-disabled);
      cursor: not-allowed;
    }

    #playback__speed-menu {
      position: absolute;
      bottom: var(--wact-sys-layout-fit-container);
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--wact-comp-playback-controls-menu-container-color);
      border: none;
      border-radius: var(--wact-comp-playback-controls-container-shape);
      padding: var(--wact-sys-spacing-xs) 0;
      margin-bottom: var(--wact-sys-spacing-xs);
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard), visibility var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      z-index: var(--wact-comp-playback-controls-menu-zindex);
      min-width: var(--wact-comp-playback-controls-label-min-width);
      box-shadow: var(--wact-comp-playback-controls-menu-shadow);
    }

    #playback__speed-wrapper:hover #playback__speed-menu {
      opacity: 1;
      visibility: visible;
    }

    .playback__speed-option {
      display: block;
      width: var(--wact-sys-layout-fit-container);
      padding: var(--wact-sys-spacing-xs) var(--wact-sys-spacing-md);
      background: none;
      border: none;
      color: var(--wact-comp-playback-controls-menu-label-color);
      font-size: var(--wact-sys-typeface-body-medium-size);
      cursor: pointer;
      text-align: center;
      font-family: var(--wact-sys-typeface-font-family);
      white-space: nowrap;
      transition: background-color var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      border-radius: var(--wact-sys-shape-corner-extra-small);
    }

    .playback__speed-option:hover {
      background-color: var(--wact-comp-playback-controls-menu-hover-color);
      color: var(--wact-comp-playback-controls-menu-active-label-color);
    }

    .playback__speed-option--active {
      color: var(--wact-comp-playback-controls-menu-active-label-color);
      font-weight: var(--wact-sys-typeface-weight-bold);
    }

    @media only screen and (max-width: 600px) {
      #playback__wrapper {
        padding: var(--wact-sys-spacing-xs) var(--wact-sys-spacing-md);
      }

      .playback__button {
        font-size: var(--wact-sys-typeface-body-medium-size);
        --btn-padding: var(--wact-comp-playback-controls-btn-padding-compact);
      }

      #playback__speed-display {
        font-size: var(--wact-sys-typeface-body-medium-size);
        padding: var(--wact-comp-playback-controls-btn-padding-compact);
      }
    }
  </style>
  <div id="playback__wrapper">
    <div id="playback__left">
      <wact-button id="playback__play-pause" class="playback__button" tooltip="Play">&#9654;</wact-button>
    </div>
    <div id="playback__right">
      <div id="playback__speed-wrapper">
        <button id="playback__speed-display">2x</button>
        <div id="playback__speed-menu"></div>
      </div>
      <wact-button id="playback__skip" class="playback__button" tooltip="Skip to end">&#9197;</wact-button>
    </div>
  </div>
`;

const SPEEDS = [1, 2, 5, 10, 100];

export class WACTPlaybackControls extends HTMLElement {
  static readonly tagName = 'wact-playback-controls' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;
  private currentSpeedIndex = 1;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return ['playing', 'speed', 'disabled'];
  }

  get playing(): boolean {
    return this.hasAttribute('playing');
  }

  set playing(value: boolean) {
    if (value) {
      this.setAttribute('playing', '');
    } else {
      this.removeAttribute('playing');
    }
  }

  get speed(): number {
    return SPEEDS[this.currentSpeedIndex];
  }

  set speed(value: number) {
    const index = SPEEDS.indexOf(value);
    if (index !== -1) {
      this.currentSpeedIndex = index;
      this.setAttribute('speed', String(value));
    }
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  private updatePlayPauseButton(): void {
    const button = this.root.getElementById('playback__play-pause') as HTMLElement;
    if (this.playing) {
      button.innerHTML = '&#9208;';
      button.setAttribute('tooltip', 'Pause');
    } else {
      button.innerHTML = '&#9654;';
      button.setAttribute('tooltip', 'Play');
    }
  }

  private updateSpeedDisplay(): void {
    const display = this.root.getElementById('playback__speed-display') as HTMLButtonElement;
    display.textContent = `${this.speed}x`;
    this.renderSpeedMenu();
  }

  private renderSpeedMenu(): void {
    const menu = this.root.getElementById('playback__speed-menu') as HTMLDivElement;
    menu.innerHTML = '';
    for (let i = 0; i < SPEEDS.length; i++) {
      const option = document.createElement('button');
      option.className = 'playback__speed-option';
      if (i === this.currentSpeedIndex) {
        option.classList.add('playback__speed-option--active');
      }
      option.textContent = `${SPEEDS[i]}x`;
      option.addEventListener('click', () => {
        this.currentSpeedIndex = i;
        this.setAttribute('speed', String(SPEEDS[i]));
        this.dispatchEvent(new CustomEvent('speed-change', { detail: SPEEDS[i] }));
      });
      menu.appendChild(option);
    }
  }

  private updateDisabledState(): void {
    const buttons = this.root.querySelectorAll('.playback__button') as NodeListOf<HTMLElement>;
    for (const button of buttons) {
      if (this.disabled) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
    }
    const speedDisplay = this.root.getElementById('playback__speed-display') as HTMLButtonElement;
    speedDisplay.disabled = this.disabled;
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    _newValue: string | null,
  ): void {
    if (!this.root) return;
    switch (attribute.toLowerCase()) {
      case 'playing':
        this.updatePlayPauseButton();
        break;
      case 'speed': {
        const val = parseInt(_newValue ?? '2');
        const idx = SPEEDS.indexOf(val);
        if (idx !== -1) this.currentSpeedIndex = idx;
        this.updateSpeedDisplay();
        break;
      }
      case 'disabled':
        this.updateDisabledState();
        break;
    }
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;

    const playPause = this.root.getElementById('playback__play-pause') as HTMLElement;
    playPause.addEventListener('click', () => {
      if (this.playing) {
        this.playing = false;
        this.dispatchEvent(new CustomEvent('pause'));
      } else {
        this.playing = true;
        this.dispatchEvent(new CustomEvent('play'));
      }
    });

    const skipButton = this.root.getElementById('playback__skip') as HTMLElement;
    skipButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('skip-to-end'));
    });

    this.renderSpeedMenu();

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
