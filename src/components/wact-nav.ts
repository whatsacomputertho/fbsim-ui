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

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [];
  }
}
