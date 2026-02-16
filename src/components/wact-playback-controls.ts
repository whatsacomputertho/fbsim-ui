const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
      --pb-bg: #e8eaf6;
      --pb-text: #1a1a2e;
      --pb-btn-border: #999;
      --pb-btn-hover-bg: #cfd2e8;
      --pb-btn-hover-border: #c5a200;
      --pb-btn-active-bg: #b8bce0;
      --pb-tooltip-bg: #555;
      --pb-tooltip-text: white;
      --pb-menu-bg: #e8eaf6;
      --pb-menu-border: #999;
      --pb-menu-text: #555;
      --pb-menu-hover-bg: #cfd2e8;
      --pb-menu-active: #b8860b;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --pb-bg: #1a1a2e;
        --pb-text: white;
        --pb-btn-border: #555;
        --pb-btn-hover-bg: #16213e;
        --pb-btn-hover-border: #ffd700;
        --pb-btn-active-bg: #0f3460;
        --pb-tooltip-bg: #333;
        --pb-tooltip-text: white;
        --pb-menu-bg: #1a1a2e;
        --pb-menu-border: #555;
        --pb-menu-text: #ccc;
        --pb-menu-hover-bg: #16213e;
        --pb-menu-active: #ffd700;
      }
    }

    #playback__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background-color: var(--pb-bg);
      border-radius: 8px;
      color: var(--pb-text);
      gap: 12px;
    }

    .playback__button {
      background: none;
      border: 2px solid var(--pb-btn-border);
      color: var(--pb-text);
      font-size: 1.1em;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: sans-serif;
    }

    .playback__button:hover:not(:disabled) {
      background-color: var(--pb-btn-hover-bg);
      border-color: var(--pb-btn-hover-border);
    }

    .playback__button:active:not(:disabled) {
      background-color: var(--pb-btn-active-bg);
    }

    .playback__button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    #playback__play-pause {
      width: 48px;
      text-align: center;
      box-sizing: border-box;
      overflow: hidden;
    }

    .playback__button[data-tooltip],
    #playback__speed-display[data-tooltip] {
      position: relative;
    }

    .playback__button[data-tooltip]::after,
    #playback__speed-display[data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: var(--pb-tooltip-bg);
      color: var(--pb-tooltip-text);
      font-size: 0.75em;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 150ms ease;
      margin-bottom: 4px;
    }

    .playback__button[data-tooltip]:hover::after,
    #playback__speed-display[data-tooltip]:hover::after {
      opacity: 1;
    }

    #playback__left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #playback__right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #playback__speed-wrapper {
      position: relative;
    }

    #playback__speed-display {
      background: none;
      border: 2px solid var(--pb-btn-border);
      color: var(--pb-text);
      font-size: 1.1em;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: sans-serif;
      min-width: 48px;
      text-align: center;
    }

    #playback__speed-display:hover:not(:disabled) {
      background-color: var(--pb-btn-hover-bg);
      border-color: var(--pb-btn-hover-border);
    }

    #playback__speed-display:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    #playback__speed-menu {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--pb-menu-bg);
      border: 1px solid var(--pb-menu-border);
      border-radius: 6px;
      padding: 4px 0;
      margin-bottom: 4px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 150ms ease, visibility 150ms ease;
      z-index: 10;
      min-width: 60px;
    }

    #playback__speed-wrapper:hover #playback__speed-menu {
      opacity: 1;
      visibility: visible;
    }

    .playback__speed-option {
      display: block;
      width: 100%;
      padding: 6px 12px;
      background: none;
      border: none;
      color: var(--pb-menu-text);
      font-size: 0.95em;
      cursor: pointer;
      text-align: center;
      font-family: sans-serif;
      white-space: nowrap;
    }

    .playback__speed-option:hover {
      background-color: var(--pb-menu-hover-bg);
      color: var(--pb-menu-active);
    }

    .playback__speed-option--active {
      color: var(--pb-menu-active);
      font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
      #playback__wrapper {
        padding: 6px 10px;
      }

      .playback__button {
        font-size: 0.9em;
        padding: 4px 10px;
      }

      #playback__speed-display {
        font-size: 0.9em;
        padding: 4px 10px;
      }
    }
  </style>
  <div id="playback__wrapper">
    <div id="playback__left">
      <button id="playback__play-pause" class="playback__button" data-tooltip="Play">&#9654;</button>
    </div>
    <div id="playback__right">
      <div id="playback__speed-wrapper">
        <button id="playback__speed-display" data-tooltip="Change speed">2x</button>
        <div id="playback__speed-menu"></div>
      </div>
      <button id="playback__skip" class="playback__button" data-tooltip="Skip to end">&#9197;</button>
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
    const button = this.root.getElementById('playback__play-pause') as HTMLButtonElement;
    if (this.playing) {
      button.innerHTML = '&#9208;';
      button.dataset.tooltip = 'Pause';
    } else {
      button.innerHTML = '&#9654;';
      button.dataset.tooltip = 'Play';
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
    const buttons = this.root.querySelectorAll(
      '.playback__button',
    ) as NodeListOf<HTMLButtonElement>;
    for (const button of buttons) {
      button.disabled = this.disabled;
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

    const playPause = this.root.getElementById('playback__play-pause') as HTMLButtonElement;
    playPause.addEventListener('click', () => {
      if (this.playing) {
        this.playing = false;
        this.dispatchEvent(new CustomEvent('pause'));
      } else {
        this.playing = true;
        this.dispatchEvent(new CustomEvent('play'));
      }
    });

    const skipButton = this.root.getElementById('playback__skip') as HTMLButtonElement;
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
