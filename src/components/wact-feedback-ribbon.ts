const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
    }

    .feedback-ribbon__ribbon-progress-wrapper {
      box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.7);
    }

    .feedback-ribbon__ribbon-wrapper, .feedback-ribbon__ribbon-wrapper-dark {
      display: grid;
      grid-template-columns: 2% 90% 8%;
    }

    .feedback-ribbon__ribbon-wrapper {
      background-color: #d3d3d3;
    }

    .feedback-ribbon__ribbon-wrapper-dark {
      background-color: #282828;
    }

    .feedback-ribbon__color-sidebar, .feedback-ribbon__color-sidebar-dark {
      background-color: #C00000;
    }

    .feedback-ribbon__feedback-text-wrapper, .feedback-ribbon__feedback-text-wrapper-dark {
      padding: 2%;
    }

    .feedback-ribbon__feedback-text-dark {
      color: #f5f5f5;
    }

    .feedback-ribbon__remove-button, .feedback-ribbon__remove-button-dark {
      border: none;
    }

    .feedback-ribbon__remove-button:hover, .feedback-ribbon__remove-button-dark:hover {
      cursor: pointer;
    }

    .feedback-ribbon__remove-button {
      background-color: #d3d3d3;
    }

    .feedback-ribbon__remove-button:hover {
      background-color: #c3c3c3;
    }

    .feedback-ribbon__remove-button:active {
      background-color: #b3b3b3;
    }

    .feedback-ribbon__remove-button-dark {
      background-color: #282828;
      color: #f5f5f5;
    }

    .feedback-ribbon__remove-button-dark:hover {
      background-color: #383838;
    }

    .feedback-ribbon__remove-button-dark:active {
      background-color: #484848;
    }

    .feedback-ribbon__progress-bar-wrapper, .feedback-ribbon__progress-bar-wrapper-dark {
      height: 10px;
    }

    .feedback-ribbon__progress-bar-wrapper {
      background-color: #c0c0c0;
    }

    .feedback-ribbon__progress-bar-wrapper-dark {
      background-color: #383838;
    }

    .feedback-ribbon__progress-bar, .feedback-ribbon__progress-bar-dark {
      background-color: #C00000;
      height: 10px;
      width: 0px;
      transition-duration: 1000ms;
      transition-timing-function: linear;
    }
  </style>
  <div id="ribbon-progress-wrapper" class="feedback-ribbon__ribbon-progress-wrapper">
    <div id="ribbon-wrapper" class="feedback-ribbon__ribbon-wrapper">
      <div id="color-sidebar" class="feedback-ribbon__color-sidebar"></div>
      <div class="feedback-ribbon__feedback-text-wrapper">
        <slot class="feedback-ribbon__feedback-text">Put your feedback here</slot>
      </div>
      <button id="remove-button" class="feedback-ribbon__remove-button">
        &times;
      </button>
    </div>
    <div id="progress-bar-wrapper" class="feedback-ribbon__progress-bar-wrapper">
      <div id="progress-bar" class="feedback-ribbon__progress-bar"></div>
    </div>
  </div>
`;

const OBSERVED_ATTRIBUTES = ['color', 'dark', 'duration', 'removable'] as const;

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

  get dark(): boolean {
    return this.hasAttribute('dark');
  }

  set dark(value: boolean) {
    if (value) {
      this.setAttribute('dark', '');
    } else {
      this.removeAttribute('dark');
    }
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

  private static getChildrenRecursive(element: Element, includeElement: boolean = true): Element[] {
    const recursiveChildren: Element[] = [];

    if (includeElement) {
      recursiveChildren.push(element);
    }

    if (element.children.length === 0) {
      return recursiveChildren;
    }

    for (let i = 0; i < element.children.length; i++) {
      recursiveChildren.push(element.children[i]);
      const subChildren = WACTFeedbackRibbon.getChildrenRecursive(element.children[i], false);
      recursiveChildren.push(...subChildren);
    }

    return recursiveChildren;
  }

  private toggleDarkMode(): void {
    const wrapper = this.root.getElementById('ribbon-progress-wrapper') as HTMLDivElement;
    const wrapperChildren = WACTFeedbackRibbon.getChildrenRecursive(wrapper);

    for (const child of wrapperChildren) {
      const childClass = child.getAttribute('class');
      if (!childClass) continue;

      if (this.dark) {
        if (!childClass.endsWith('-dark')) {
          child.setAttribute('class', childClass + '-dark');
        }
      } else {
        if (childClass.endsWith('-dark')) {
          child.setAttribute('class', childClass.replace(/-dark$/, ''));
        }
      }
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
    const removeButton = this.root.getElementById('remove-button') as HTMLButtonElement;
    removeButton.style.display = 'block';
    const ribbonWrapper = this.root.getElementById('ribbon-wrapper') as HTMLDivElement;
    ribbonWrapper.style.gridTemplateColumns = '2% 90% 8%';
  }

  private removeRemoveButton(): void {
    const removeButton = this.root.getElementById('remove-button') as HTMLButtonElement;
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
      case 'dark':
        this.toggleDarkMode();
        break;
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

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    const removeButton = this.root.getElementById('remove-button') as HTMLButtonElement;
    removeButton.addEventListener('click', this.removeElement.bind(this));

    if (this.duration == null) {
      this.removeProgressbar();
    }

    if (!this.removable) {
      this.removeRemoveButton();
    }
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
