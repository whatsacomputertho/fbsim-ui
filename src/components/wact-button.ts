const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      --btn-bg: #dde0ed;
      --btn-bg-hover: #cfd2e8;
      --btn-bg-active: #b8bce0;
      --btn-text: inherit;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --btn-bg: #2f2f3f;
        --btn-bg-hover: #3f3f4f;
        --btn-bg-active: #4f4f5f;
        --btn-text: inherit;
      }
    }

    :host([variant="primary"]) {
      --btn-bg: #3a58b0;
      --btn-bg-hover: #4a68c0;
      --btn-bg-active: #5a78d0;
      --btn-text: white;
    }

    @media (prefers-color-scheme: dark) {
      :host([variant="primary"]) {
        --btn-bg: #2c4494;
        --btn-bg-hover: #3c54a4;
        --btn-bg-active: #4c64b4;
        --btn-text: white;
      }
    }

    :host([variant="destructive"]) {
      --btn-bg: #cc0000;
      --btn-bg-hover: #a00000;
      --btn-bg-active: #800000;
      --btn-text: white;
    }

    @media (prefers-color-scheme: dark) {
      :host([variant="destructive"]) {
        --btn-bg: #8b0000;
        --btn-bg-hover: #a00000;
        --btn-bg-active: #cc0000;
        --btn-text: white;
      }
    }

    #btn {
      display: block;
      width: 100%;
      font: inherit;
      font-size: inherit;
      padding: var(--btn-padding, 8px);
      margin: 0;
      color: var(--btn-text);
      background-color: var(--btn-bg);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 150ms ease;
      box-sizing: border-box;
      position: relative;
      line-height: inherit;
    }

    :host {
      padding: 0;
    }

    #btn:hover:not(:disabled) {
      background-color: var(--btn-bg-hover);
    }

    #btn:active:not(:disabled) {
      background-color: var(--btn-bg-active);
    }

    #btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .hidden {
      display: none !important;
    }

    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid var(--btn-text);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 600ms linear infinite;
      display: inline-block;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    #btn[data-tooltip]::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      background: #555;
      color: white;
      font-size: 0.75em;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 150ms ease;
      margin-bottom: 4px;
    }

    @media (prefers-color-scheme: dark) {
      #btn[data-tooltip]::after {
        background: #333;
      }
    }

    #btn:hover:not(:disabled)[data-tooltip]::after {
      opacity: 1;
    }
  </style>
  <button part="button" id="btn">
    <span id="btn-content"><slot></slot></span>
    <span id="btn-spinner" class="spinner hidden"></span>
    <span id="btn-confirm" class="hidden"></span>
  </button>
`;

export class WACTButton extends HTMLElement {
  static readonly tagName = 'wact-button' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;
  private _confirmTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return ['variant', 'tooltip', 'disabled'];
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

  private syncDisabled(): void {
    const btn = this.root.getElementById('btn') as HTMLButtonElement;
    btn.disabled = this.disabled;
  }

  private syncTooltip(): void {
    const btn = this.root.getElementById('btn') as HTMLButtonElement;
    const tooltip = this.getAttribute('tooltip');
    if (tooltip) {
      btn.dataset.tooltip = tooltip;
    } else {
      delete btn.dataset.tooltip;
    }
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    _newValue: string | null,
  ): void {
    if (!this.root) return;
    switch (attribute.toLowerCase()) {
      case 'disabled':
        this.syncDisabled();
        break;
      case 'tooltip':
        this.syncTooltip();
        break;
    }
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;

    this.syncDisabled();
    this.syncTooltip();

    this._readyPromise = new Promise((r) => (this._resolveReady = r));
    this._resolveReady?.();
  }

  startLoading(): void {
    const btn = this.root.getElementById('btn') as HTMLButtonElement;
    const content = this.root.getElementById('btn-content') as HTMLSpanElement;
    const spinner = this.root.getElementById('btn-spinner') as HTMLSpanElement;
    const confirm = this.root.getElementById('btn-confirm') as HTMLSpanElement;

    content.classList.add('hidden');
    confirm.classList.add('hidden');
    spinner.classList.remove('hidden');
    btn.disabled = true;
  }

  stopLoading(confirmText?: string, duration?: number): void {
    const spinner = this.root.getElementById('btn-spinner') as HTMLSpanElement;
    spinner.classList.add('hidden');

    if (confirmText) {
      const content = this.root.getElementById('btn-content') as HTMLSpanElement;
      const confirm = this.root.getElementById('btn-confirm') as HTMLSpanElement;

      content.classList.add('hidden');
      confirm.textContent = confirmText;
      confirm.classList.remove('hidden');

      const ms = duration ?? 1500;
      if (ms !== 0) {
        this._confirmTimeout = setTimeout(() => this.reset(), ms);
      }
    } else {
      this.reset();
    }
  }

  reset(): void {
    if (this._confirmTimeout !== null) {
      clearTimeout(this._confirmTimeout);
      this._confirmTimeout = null;
    }

    const btn = this.root.getElementById('btn') as HTMLButtonElement;
    const content = this.root.getElementById('btn-content') as HTMLSpanElement;
    const spinner = this.root.getElementById('btn-spinner') as HTMLSpanElement;
    const confirm = this.root.getElementById('btn-confirm') as HTMLSpanElement;

    spinner.classList.add('hidden');
    confirm.classList.add('hidden');
    content.classList.remove('hidden');
    btn.disabled = this.disabled;
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
