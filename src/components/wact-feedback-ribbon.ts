import { COLOR_CSS, ELEVATION_CSS, LAYOUT_CSS, MOTION_CSS, SPACING_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${COLOR_CSS}
    ${ELEVATION_CSS}
    ${LAYOUT_CSS}
    ${MOTION_CSS}
    ${SPACING_CSS}

    :host {
      display: block;
      width: 100%;
      --wact-comp-feedback-ribbon-container-color:    var(--wact-sys-color-feedback);
      --wact-comp-feedback-ribbon-on-container-color: var(--wact-sys-color-on-surface);
      --wact-comp-feedback-ribbon-progress-color:     var(--wact-sys-color-feedback-progress);
      --wact-comp-feedback-ribbon-accent-color:       var(--wact-sys-color-feedback-accent);
      --wact-comp-feedback-ribbon-shadow:             var(--wact-sys-elevation-level2);
      --wact-comp-feedback-ribbon-progress-height:    10px;
    }

    .feedback-ribbon__ribbon-progress-wrapper {
      box-shadow: var(--wact-comp-feedback-ribbon-shadow);
    }

    .feedback-ribbon__ribbon-wrapper {
      min-height: var(--wact-sys-layout-min-target-size);
      display: grid;
      grid-template-columns: 2% 90% 8%;
      background-color: var(--wact-comp-feedback-ribbon-container-color);
    }

    .feedback-ribbon__color-sidebar {
      background-color: var(--wact-comp-feedback-ribbon-accent-color);
    }

    .feedback-ribbon__feedback-text-wrapper {
      display: flex;
      align-items: center;
      padding: var(--wact-sys-spacing-sm);
      color: var(--wact-comp-feedback-ribbon-on-container-color);
    }

    .feedback-ribbon__remove-button {
      display: block;
      --btn-padding: 0;
    }

    .feedback-ribbon__remove-button::part(button) {
      border-radius: 0;
      height: 100%;
    }

    .feedback-ribbon__progress-bar-wrapper {
      height: var(--wact-comp-feedback-ribbon-progress-height);
      background-color: var(--wact-comp-feedback-ribbon-progress-color);
    }

    .feedback-ribbon__progress-bar {
      background-color: var(--wact-comp-feedback-ribbon-accent-color);
      height: var(--wact-comp-feedback-ribbon-progress-height);
      width: 0px;
      transition-duration: var(--wact-sys-motion-duration-long2);
      transition-timing-function: var(--wact-sys-motion-easing-linear);
    }
  </style>
  <div id="ribbon-progress-wrapper" class="feedback-ribbon__ribbon-progress-wrapper">
    <div id="ribbon-wrapper" class="feedback-ribbon__ribbon-wrapper">
      <div id="color-sidebar" class="feedback-ribbon__color-sidebar"></div>
      <div class="feedback-ribbon__feedback-text-wrapper">
        <slot class="feedback-ribbon__feedback-text">Put your feedback here</slot>
      </div>
      <wact-button id="remove-button" class="feedback-ribbon__remove-button" variant="destructive">
        &times;
      </wact-button>
    </div>
    <div id="progress-bar-wrapper" class="feedback-ribbon__progress-bar-wrapper">
      <div id="progress-bar" class="feedback-ribbon__progress-bar"></div>
    </div>
  </div>
`;

const OBSERVED_ATTRIBUTES = ['color', 'duration', 'removable'] as const;

export class WACTFeedbackRibbon extends HTMLElement {
  static readonly tagName = 'wact-feedback-ribbon' as const;

  readonly root: ShadowRoot;
  private incrementTimeout: ReturnType<typeof setTimeout> | null = null;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [...OBSERVED_ATTRIBUTES];
  }

  get color(): string | null {
    return this.getAttribute('color');
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }

  get duration(): number | null {
    if (!this.hasAttribute('duration')) {
      return null;
    }
    return Number(this.getAttribute('duration'));
  }

  set duration(value: number) {
    this.setAttribute('duration', String(value));
  }

  get removable(): boolean {
    return this.hasAttribute('removable');
  }

  set removable(value: boolean) {
    if (value) {
      this.setAttribute('removable', '');
    } else {
      this.removeAttribute('removable');
    }
  }

  private toggleColor(_previousValue: string | null, newValue: string | null): void {
    const sidebar = this.root.getElementById('color-sidebar') as HTMLDivElement;
    const progressbar = this.root.getElementById('progress-bar') as HTMLDivElement;
    sidebar.style.backgroundColor = newValue ?? '';
    progressbar.style.backgroundColor = newValue ?? '';
  }

  private removeProgressbar(): void {
    const progressbar = this.root.getElementById('progress-bar') as HTMLDivElement;
    progressbar.style.display = 'none';
    const progressbarWrapper = this.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    progressbarWrapper.style.display = 'none';
  }

  private addProgressbar(): void {
    const progressbarWrapper = this.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    progressbarWrapper.style.display = 'block';
    const progressbar = this.root.getElementById('progress-bar') as HTMLDivElement;
    progressbar.style.display = 'block';
  }

  private incrementProgressbar(timeElapsed: number = 0): void {
    const progressbar = this.root.getElementById('progress-bar') as HTMLDivElement;
    const duration = this.duration;
    if (duration == null) return;

    const progressbarNewWidth = ((timeElapsed + 1) / duration) * 100;

    window.requestAnimationFrame(() => {
      progressbar.style.width = progressbarNewWidth + '%';
    });

    if (timeElapsed + 1 < duration) {
      this.incrementTimeout = setTimeout(() => {
        this.incrementProgressbar(timeElapsed + 1);
      }, 1000);
    } else {
      this.incrementTimeout = setTimeout(() => {
        this.removeElement();
      }, 1000);
    }
  }

  private addRemoveButton(): void {
    const removeButton = this.root.getElementById('remove-button') as HTMLElement;
    removeButton.style.display = 'block';
    const ribbonWrapper = this.root.getElementById('ribbon-wrapper') as HTMLDivElement;
    ribbonWrapper.style.gridTemplateColumns = '2% 90% 8%';
  }

  private removeRemoveButton(): void {
    const removeButton = this.root.getElementById('remove-button') as HTMLElement;
    removeButton.style.display = 'none';
    const ribbonWrapper = this.root.getElementById('ribbon-wrapper') as HTMLDivElement;
    ribbonWrapper.style.gridTemplateColumns = '2% 98%';
  }

  private removeElement(): void {
    if (this.incrementTimeout) {
      clearTimeout(this.incrementTimeout);
    }
    this.remove();
  }

  attributeChangedCallback(
    attribute: string,
    previousValue: string | null,
    newValue: string | null,
  ): void {
    switch (attribute.toLowerCase()) {
      case 'color':
        this.toggleColor(previousValue, newValue);
        break;
      case 'duration':
        if (newValue == null) {
          this.removeProgressbar();
          return;
        }
        if (previousValue == null) {
          this.addProgressbar();
        }
        if (this.incrementTimeout == null) {
          this.incrementTimeout = setTimeout(() => this.incrementProgressbar(), 100);
        }
        break;
      case 'removable':
        if (newValue == null) {
          this.removeRemoveButton();
        } else if (previousValue == null) {
          this.addRemoveButton();
        }
        break;
    }
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;

    const removeButton = this.root.getElementById('remove-button') as HTMLElement;
    removeButton.addEventListener('click', this.removeElement.bind(this));

    if (this.duration == null) {
      this.removeProgressbar();
    }

    if (!this.removable) {
      this.removeRemoveButton();
    }
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
