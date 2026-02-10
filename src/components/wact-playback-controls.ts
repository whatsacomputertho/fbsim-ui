const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }

    #playback__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      background-color: #1a1a2e;
      border-radius: 8px;
      color: white;
      gap: 12px;
    }

    .playback__button {
      background: none;
      border: 2px solid #555;
      color: white;
      font-size: 1.1em;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: sans-serif;
    }

    .playback__button:hover:not(:disabled) {
      background-color: #16213e;
      border-color: #ffd700;
    }

    .playback__button:active:not(:disabled) {
      background-color: #0f3460;
    }

    .playback__button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
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

    #playback__speed {
      font-size: 0.9em;
      min-width: 32px;
      text-align: center;
    }

    @media only screen and (max-width: 600px) {
      #playback__wrapper {
        padding: 6px 10px;
      }

      .playback__button {
        font-size: 0.9em;
        padding: 4px 10px;
      }
    }
  </style>
  <div id="playback__wrapper">
    <div id="playback__left">
      <button id="playback__play-pause" class="playback__button" title="Play">&#9654;</button>
    </div>
    <div id="playback__right">
      <button id="playback__speed" class="playback__button" title="Change speed">2x</button>
      <button id="playback__skip" class="playback__button" title="Skip to end">&#9197;</button>
    </div>
  </div>
`;

const SPEEDS = [1, 2, 4];

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
      button.innerHTML = '&#9646;&#9646;';
      button.title = 'Pause';
    } else {
      button.innerHTML = '&#9654;';
      button.title = 'Play';
    }
  }

  private updateSpeedDisplay(): void {
    const button = this.root.getElementById('playback__speed') as HTMLButtonElement;
    button.textContent = `${this.speed}x`;
  }

  private updateDisabledState(): void {
    const buttons = this.root.querySelectorAll(
      '.playback__button',
    ) as NodeListOf<HTMLButtonElement>;
    for (const button of buttons) {
      button.disabled = this.disabled;
    }
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

    const speedButton = this.root.getElementById('playback__speed') as HTMLButtonElement;
    speedButton.addEventListener('click', () => {
      this.currentSpeedIndex = (this.currentSpeedIndex + 1) % SPEEDS.length;
      this.setAttribute('speed', String(SPEEDS[this.currentSpeedIndex]));
      this.dispatchEvent(
        new CustomEvent('speed-change', { detail: SPEEDS[this.currentSpeedIndex] }),
      );
    });

    const skipButton = this.root.getElementById('playback__skip') as HTMLButtonElement;
    skipButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('skip-to-end'));
    });

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
