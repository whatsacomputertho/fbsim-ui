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
      transition: left 300ms ease;
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
      transition: left 300ms ease;
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
      transition: opacity 200ms ease;
    }

    @keyframes endzoneFlash {
      0%, 100% { opacity: 0; }
      25%, 75% { opacity: 0.6; }
    }

    @keyframes textOverlay {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes fadeOutRects {
      from { opacity: 0.5; }
      to { opacity: 0; }
    }

    #field__animation-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 8;
      pointer-events: none;
    }

    #field__text-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;
      pointer-events: none;
      font-size: 1.4em;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
      white-space: nowrap;
      opacity: 0;
    }

    .field__endzone-flash {
      position: absolute;
      top: 0;
      height: 100%;
      animation: endzoneFlash 1.2s ease forwards;
    }

    .field__endzone-flash--home {
      left: 0;
      width: 8%;
    }

    .field__endzone-flash--away {
      right: 0;
      width: 8%;
    }

    .field__drive-fade-out {
      animation: fadeOutRects 400ms ease forwards;
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
    <div id="field__animation-overlay"></div>
    <div id="field__text-overlay"></div>
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

    const resetTypes = new Set(['Kickoff', 'Punt', 'BetweenPlay', 'FieldGoal', 'ExtraPoint']);

    // Determine offense color from the drive's first scrimmage play, not from
    // the post-play context which may already reflect flipped possession after
    // a punt/kickoff.
    const firstScrimmagePlay = plays.find((p) => !resetTypes.has(p.result.type));
    const driveHomePossession = firstScrimmagePlay
      ? firstScrimmagePlay.context.home_possession
      : context.home_possession;
    const offenseColor = driveHomePossession ? homeColor : awayColor;

    const currentDirection = context.home_positive_direction;

    for (let i = 0; i < plays.length; i++) {
      const play = plays[i];
      if (resetTypes.has(play.result.type)) continue;

      // Use the next play in the *unfiltered* array for endYard so that
      // when a reset-type play follows (e.g. Punt), we get the pre-punt
      // yard line (= correct end of this play) instead of context.yard_line
      // which reflects the post-punt position.
      const nextPlay = i < plays.length - 1 ? plays[i + 1] : null;

      // Mirror each yard line independently based on whether its source's
      // direction matches the current field direction.
      let startYard = play.context.yard_line;
      if (play.context.home_positive_direction !== currentDirection) {
        startYard = 100 - startYard;
      }

      let endYard: number;
      if (nextPlay) {
        endYard = nextPlay.context.yard_line;
        if (nextPlay.context.home_positive_direction !== currentDirection) {
          endYard = 100 - endYard;
        }
      } else {
        // context is always in the current direction
        endYard = context.yard_line;
      }

      if (startYard === endYard) continue;

      const isTurnover = play.result_computed.turnover;
      const isLoss = play.result_computed.net_yards < 0;
      const color = isTurnover || isLoss ? '#cc0000' : offenseColor;

      const startPct = this.yardLineToPercent(startYard);
      const endPct = this.yardLineToPercent(endYard);
      const leftPct = Math.min(startPct, endPct);
      const widthPct = Math.abs(endPct - startPct);

      if (widthPct > 0) {
        const rect = document.createElement('div');
        rect.className = 'field__play-rect';
        rect.style.left = `${leftPct}%`;
        rect.style.width = `${Math.max(widthPct, 0.5)}%`;
        rect.style.backgroundColor = color;
        overlay.appendChild(rect);
      }
    }

  }

  updateMarkers(context: GameContext): void {
    this.setBallPosition(context.yard_line, context.home_positive_direction);

    const firstDownLine = this.root.getElementById('field__first-down-line') as HTMLDivElement;
    if (
      !context.next_play_kickoff &&
      !context.game_over &&
      !context.end_of_half &&
      !context.next_play_extra_point
    ) {
      const firstDownYard =
        context.yard_line +
        (context.home_positive_direction === context.home_possession
          ? context.distance
          : -context.distance);
      this.setFirstDownLine(firstDownYard);
    } else {
      firstDownLine.style.display = 'none';
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

  showAnimation(type: string, details: { possession?: boolean; yardLine?: number; fromYard?: number; toYard?: number; type?: string }): void {
    const homeColor = this.getAttribute('home-color') ?? '#1a5276';
    const awayColor = this.getAttribute('away-color') ?? '#922b21';

    switch (type) {
      case 'touchdown': {
        const isHome = details.possession ?? true;
        const color = isHome ? homeColor : awayColor;
        this.flashEndzone(isHome ? 'away' : 'home', color, 1200);
        this.showTextOverlay('TOUCHDOWN!', '#ffd700', 1200);
        break;
      }
      case 'field-goal-made':
        this.showTextOverlay('Field goal GOOD!', '#00cc44', 1000);
        break;
      case 'field-goal-missed':
        this.showTextOverlay('Field goal NO GOOD!', '#cc4444', 1000);
        break;
      case 'punt':
        this.showTextOverlay('Punt', '#cc4444', 800);
        break;
      case 'extra-point-made':
        this.showTextOverlay('Extra Point GOOD!', '#00cc44', 800);
        break;
      case 'extra-point-missed':
        this.showTextOverlay('Extra Point NO GOOD!', '#cc4444', 800);
        break;
      case 'safety': {
        const safetyIsHome = details.possession ?? true;
        const safetyColor = safetyIsHome ? homeColor : awayColor;
        this.flashEndzone(safetyIsHome ? 'home' : 'away', safetyColor, 1200);
        this.showTextOverlay('SAFETY!', '#ffd700', 1200);
        break;
      }
      case 'turnover': {
        const label = details.type === 'Interception' ? 'INTERCEPTION' : 'FUMBLE';
        this.showTextOverlay(label, '#cc4444', 1000);
        break;
      }
    }
  }

  showTextOverlay(text: string, color: string, duration: number): void {
    const overlay = this.root.getElementById('field__text-overlay') as HTMLDivElement;
    overlay.textContent = text;
    overlay.style.color = color;
    overlay.style.animation = 'none';
    // Force reflow
    void overlay.offsetWidth;
    overlay.style.animation = `textOverlay ${duration}ms ease forwards`;
  }

  flashEndzone(side: 'home' | 'away', color: string, duration: number): void {
    const animOverlay = this.root.getElementById('field__animation-overlay') as HTMLDivElement;
    const flash = document.createElement('div');
    flash.className = `field__endzone-flash field__endzone-flash--${side}`;
    flash.style.backgroundColor = color;
    flash.style.animationDuration = `${duration}ms`;
    animOverlay.appendChild(flash);
    setTimeout(() => flash.remove(), duration);
  }

  fadeOutDrive(callback?: () => void): void {
    const overlay = this.root.getElementById('field__drive-overlay') as HTMLDivElement;
    const rects = overlay.querySelectorAll('.field__play-rect');
    if (rects.length === 0) {
      callback?.();
      return;
    }
    for (const rect of rects) {
      rect.classList.add('field__drive-fade-out');
    }
    setTimeout(() => {
      overlay.innerHTML = '';
      callback?.();
    }, 400);
  }

  clearAnimations(): void {
    const textOverlay = this.root.getElementById('field__text-overlay') as HTMLDivElement;
    textOverlay.style.animation = 'none';
    textOverlay.textContent = '';

    const animOverlay = this.root.getElementById('field__animation-overlay') as HTMLDivElement;
    animOverlay.innerHTML = '';
  }

  clear(): void {
    const overlay = this.root.getElementById('field__drive-overlay') as HTMLDivElement;
    overlay.innerHTML = '';

    const marker = this.root.getElementById('field__ball-marker') as HTMLDivElement;
    marker.style.display = 'none';

    const line = this.root.getElementById('field__first-down-line') as HTMLDivElement;
    line.style.display = 'none';

    this.clearAnimations();
  }

  flipEndzones(): void {
    const left = this.root.getElementById('field__endzone-home') as HTMLDivElement;
    const right = this.root.getElementById('field__endzone-away') as HTMLDivElement;

    const tmpText = left.textContent;
    left.textContent = right.textContent;
    right.textContent = tmpText;

    const tmpColor = left.style.backgroundColor;
    left.style.backgroundColor = right.style.backgroundColor;
    right.style.backgroundColor = tmpColor;
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
