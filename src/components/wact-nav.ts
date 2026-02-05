const template = document.createElement('template');
template.innerHTML = `
  <style>
    .navbar-wrapper {
      height: 10vh;
      background-color: #162267;
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

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this._readyPromise = new Promise(r => (this._resolveReady = r));
    this._resolveReady?.();
  }

  whenReady(): Promise<void> {
    if (!this._readyPromise) {
      this._readyPromise = new Promise(resolve => {
        this._resolveReady = resolve;
      });
    }
    return this._readyPromise;
  }
}
