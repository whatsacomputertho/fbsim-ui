import { DESIGN_TOKENS_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${DESIGN_TOKENS_CSS}

    :host {
      display: inline-block;
      padding: 0;
      --wact-comp-button-container-color:         var(--wact-sys-color-interactive);
      --wact-comp-button-container-color-hover:   var(--wact-sys-color-interactive-hover);
      --wact-comp-button-container-color-active:  var(--wact-sys-color-interactive-active);
      --wact-comp-button-label-color:             var(--wact-sys-color-on-surface);
      --wact-comp-button-container-shape:         var(--wact-sys-shape-corner-medium);
      --wact-comp-button-tooltip-container-color: var(--wact-sys-color-tooltip-container);
      --wact-comp-button-tooltip-label-color:     var(--wact-sys-color-on-tooltip);
      --wact-comp-button-tooltip-label-size:      var(--wact-sys-typescale-label-medium-size);
      --wact-comp-button-tooltip-container-shape: var(--wact-sys-shape-corner-extra-small);
    }

    :host([variant="primary"]) {
      --wact-comp-button-container-color:        var(--wact-sys-color-primary);
      --wact-comp-button-container-color-hover:  var(--wact-sys-color-primary-hover);
      --wact-comp-button-container-color-active: var(--wact-sys-color-primary-active);
      --wact-comp-button-label-color:            var(--wact-sys-color-on-primary);
    }

    :host([variant="destructive"]) {
      --wact-comp-button-container-color:        var(--wact-sys-color-destructive);
      --wact-comp-button-container-color-hover:  var(--wact-sys-color-destructive-hover);
      --wact-comp-button-container-color-active: var(--wact-sys-color-destructive-active);
      --wact-comp-button-label-color:            var(--wact-sys-color-on-destructive);
    }

    #btn {
      display: block;
      width: 100%;
      font: inherit;
      font-size: inherit;
      padding: var(--btn-padding, 8px);
      margin: 0;
      color: var(--wact-comp-button-label-color);
      background-color: var(--wact-comp-button-container-color);
      border: none;
      border-radius: var(--wact-comp-button-container-shape);
      cursor: pointer;
      transition: all var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      box-sizing: border-box;
      position: relative;
      line-height: inherit;
    }

    #btn:hover:not(:disabled) {
      background-color: var(--wact-comp-button-container-color-hover);
    }

    #btn:active:not(:disabled) {
      background-color: var(--wact-comp-button-container-color-active);
    }

    #btn:disabled {
      opacity: var(--wact-sys-state-layer-opacity-disabled);
      cursor: not-allowed;
    }

    .hidden {
      display: none !important;
    }

    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid var(--wact-comp-button-label-color);
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
      background: var(--wact-comp-button-tooltip-container-color);
      color: var(--wact-comp-button-tooltip-label-color);
      font-size: var(--wact-comp-button-tooltip-label-size);
      border-radius: var(--wact-comp-button-tooltip-container-shape);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      margin-bottom: 4px;
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
