const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      --nav-bg: #e8eaf6;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --nav-bg: #162267;
      }
    }

    .navbar-wrapper {
      height: 10vh;
      background-color: var(--nav-bg);
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
    }
    ::slotted(img) {
      max-height: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1) brightness(0.2);
    }

    @media (prefers-color-scheme: dark) {
      ::slotted(img) {
        filter: none;
      }
    }
  </style>
  <nav id="navbar-wrapper" class="navbar-wrapper">
    <slot></slot>
  </nav>
`;

export class WACTNav extends HTMLElement {
  static readonly tagName = 'wact-nav' as const;

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
    return [];
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
