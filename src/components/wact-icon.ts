import { MOTION_CSS, SHAPE_CSS } from '../styles/index.js';
import { arrowRight } from './icons/arrow-right.js';
import { chart } from './icons/chart.js';
import { pause } from './icons/pause.js';
import { play } from './icons/play.js';
import { skip } from './icons/skip.js';
import { spinner } from './icons/spinner.js';
import { upload } from './icons/upload.js';

const ICONS: Record<string, string> = {
  'arrow-right': arrowRight,
  chart,
  pause,
  play,
  skip,
  spinner,
  upload,
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${MOTION_CSS}
    ${SHAPE_CSS}

    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      width: var(--wact-comp-icon-size, 1em);
      height: var(--wact-comp-icon-size, 1em);
    }

    .icon__spinner {
      display: block;
      width: var(--wact-comp-icon-size, 1em);
      height: var(--wact-comp-icon-size, 1em);
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: var(--wact-sys-shape-corner-full);
      animation: spin var(--wact-sys-motion-duration-long1) var(--wact-sys-motion-easing-linear) infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
  <span id="icon__container"></span>
`;

export class WACTIcon extends HTMLElement {
  static readonly tagName = 'wact-icon' as const;

  readonly root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return ['icon'];
  }

  get icon(): string {
    return this.getAttribute('icon') ?? '';
  }

  set icon(value: string) {
    this.setAttribute('icon', value);
  }

  private render(): void {
    const container = this.root.getElementById('icon__container') as HTMLSpanElement;
    container.innerHTML = ICONS[this.icon] ?? '';
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    _newValue: string | null,
  ): void {
    if (attribute === 'icon') {
      this.render();
    }
  }

  connectedCallback(): void {
    this.render();
  }
}
