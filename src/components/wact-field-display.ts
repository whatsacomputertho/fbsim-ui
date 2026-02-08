import type { Play, GameContext } from '../services/types.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }

    #field__wrapper {
      position: relative;
      width: 100%;
      height: 120px;
      background-color: #2d7a2d;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #444;
    }

    #field__endzone-home {
      position: absolute;
      left: 0;
      top: 0;
      width: 8%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7em;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.6);
      writing-mode: vertical-lr;
      text-orientation: mixed;
    }

    #field__endzone-away {
      position: absolute;
      right: 0;
      top: 0;
      width: 8%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7em;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.6);
      writing-mode: vertical-lr;
      text-orientation: mixed;
    }

    #field__playing-area {
      position: absolute;
      left: 8%;
      top: 0;
      width: 84%;
      height: 100%;
    }

    .field__yard-line {
      position: absolute;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .field__yard-label {
      position: absolute;
      bottom: 2px;
      font-size: 0.6em;
      color: rgba(255, 255, 255, 0.5);
      transform: translateX(-50%);
    }

    #field__first-down-line {
      position: absolute;
      top: 0;
      width: 2px;
      height: 100%;
      background-color: #ffd700;
      display: none;
      z-index: 3;
    }

    #field__ball-marker {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #8B4513;
      border: 2px solid white;
      border-radius: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: none;
      z-index: 5;
    }

    #field__drive-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .field__play-rect {
      position: absolute;
      top: 15%;
      height: 70%;
      opacity: 0.5;
      border-radius: 2px;
    }

    @media only screen and (max-width: 600px) {
      #field__wrapper {
        height: 80px;
      }

      .field__yard-label {
        font-size: 0.5em;
      }
    }
  </style>
  <div id="field__wrapper">
    <div id="field__endzone-home">HOME</div>
    <div id="field__playing-area">
      <div id="field__drive-overlay"></div>
      <div id="field__first-down-line"></div>
      <div id="field__ball-marker"></div>
    </div>
    <div id="field__endzone-away">AWAY</div>
  </div>
`;

export class WACTFieldDisplay extends HTMLElement {
  static readonly tagName = 'wact-field-display' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
    this.renderYardLines();
  }

  static get observedAttributes(): string[] {
    return ['home-color', 'away-color'];
  }

  private yardLineToPercent(yardLine: number): number {
    return (yardLine / 100) * 100;
  }

  private renderYardLines(): void {
    const playingArea = this.root.getElementById('field__playing-area') as HTMLDivElement;
    const yardNumbers = [10, 20, 30, 40, 50, 40, 30, 20, 10];

    for (let i = 1; i <= 9; i++) {
      const percent = (i / 10) * 100;

      const line = document.createElement('div');
      line.className = 'field__yard-line';
      line.style.left = `${percent}%`;
      playingArea.appendChild(line);

      const label = document.createElement('div');
      label.className = 'field__yard-label';
      label.style.left = `${percent}%`;
      label.textContent = String(yardNumbers[i - 1]);
      playingArea.appendChild(label);
    }
  }

  setDrive(plays: Play[], context: GameContext): void {
    const overlay = this.root.getElementById('field__drive-overlay') as HTMLDivElement;
    overlay.innerHTML = '';

    const homeColor = this.getAttribute('home-color') ?? '#1a5276';
    const awayColor = this.getAttribute('away-color') ?? '#922b21';
    const offenseColor = context.home_possession ? homeColor : awayColor;

    let currentYard = plays.length > 0 ? plays[0].context.yard_line : context.yard_line;

    for (const play of plays) {
      if (
        play.result.type === 'Kickoff' ||
        play.result.type === 'Punt' ||
        play.result.type === 'BetweenPlay'
      ) {
        continue;
      }

      const netYards = play.result_computed.net_yards;
      if (netYards === 0) {
        currentYard = play.context.yard_line + netYards;
        continue;
      }

      const isTurnover = play.result_computed.turnover;
      const isNegative = netYards < 0;
      const color = isNegative || isTurnover ? '#cc0000' : offenseColor;

      const startPercent = this.yardLineToPercent(currentYard);
      const endPercent = this.yardLineToPercent(currentYard + netYards);

      const leftPercent = Math.min(startPercent, endPercent);
      const widthPercent = Math.abs(endPercent - startPercent);

      if (widthPercent > 0) {
        const rect = document.createElement('div');
        rect.className = 'field__play-rect';
        rect.style.left = `${leftPercent}%`;
        rect.style.width = `${Math.max(widthPercent, 0.5)}%`;
        rect.style.backgroundColor = color;
        overlay.appendChild(rect);
      }

      currentYard = currentYard + netYards;
    }

    this.setBallPosition(context.yard_line, context.home_positive_direction);

    if (!context.next_play_kickoff) {
      const firstDownYard = context.yard_line + (context.home_positive_direction === context.home_possession ? context.distance : -context.distance);
      this.setFirstDownLine(firstDownYard);
    }
  }

  setBallPosition(yardLine: number, _homePositiveDirection: boolean): void {
    const marker = this.root.getElementById('field__ball-marker') as HTMLDivElement;
    marker.style.left = `${this.yardLineToPercent(yardLine)}%`;
    marker.style.display = 'block';
  }

  setFirstDownLine(yardLine: number): void {
    const line = this.root.getElementById('field__first-down-line') as HTMLDivElement;
    if (yardLine <= 0 || yardLine >= 100) {
      line.style.display = 'none';
      return;
    }
    line.style.left = `${this.yardLineToPercent(yardLine)}%`;
    line.style.display = 'block';
  }

  clear(): void {
    const overlay = this.root.getElementById('field__drive-overlay') as HTMLDivElement;
    overlay.innerHTML = '';

    const marker = this.root.getElementById('field__ball-marker') as HTMLDivElement;
    marker.style.display = 'none';

    const line = this.root.getElementById('field__first-down-line') as HTMLDivElement;
    line.style.display = 'none';
  }

  attributeChangedCallback(
    attribute: string,
    _previousValue: string | null,
    newValue: string | null,
  ): void {
    if (!this.root) return;
    switch (attribute.toLowerCase()) {
      case 'home-color': {
        const homeEndzone = this.root.getElementById('field__endzone-home') as HTMLDivElement;
        homeEndzone.style.backgroundColor = newValue ?? '#1a5276';
        break;
      }
      case 'away-color': {
        const awayEndzone = this.root.getElementById('field__endzone-away') as HTMLDivElement;
        awayEndzone.style.backgroundColor = newValue ?? '#922b21';
        break;
      }
    }
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
