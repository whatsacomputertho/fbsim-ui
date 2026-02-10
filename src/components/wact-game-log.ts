import type { Play, Drive } from '../services/types.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }

    #game-log__wrapper {
      background-color: #1a1a2e;
      color: #ccc;
      border-radius: 8px;
      overflow: hidden;
    }

    #game-log__header {
      padding: 10px 16px;
      font-size: 1.1em;
      font-weight: bold;
      color: white;
      background-color: #16213e;
      border-bottom: 1px solid #333;
    }

    #game-log__drives {
      max-height: 400px;
      overflow-y: auto;
    }

    .game-log__drive {
      border-bottom: 1px solid #333;
    }

    .game-log__drive:last-child {
      border-bottom: none;
    }

    .game-log__drive-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      cursor: pointer;
      transition: background-color 150ms ease;
      user-select: none;
    }

    .game-log__drive-header:hover {
      background-color: #16213e;
    }

    .game-log__drive-result {
      font-weight: bold;
      color: white;
      font-size: 0.95em;
    }

    .game-log__drive-stats {
      font-size: 0.8em;
      color: #999;
      margin-left: 12px;
    }

    .game-log__drive-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .game-log__chevron {
      font-size: 0.8em;
      transition: transform 200ms ease;
      color: #666;
    }

    .game-log__chevron--expanded {
      transform: rotate(180deg);
    }

    .game-log__drive-plays {
      display: none;
      padding: 0 16px 8px 16px;
    }

    .game-log__drive-plays--expanded {
      display: block;
    }

    .game-log__play {
      padding: 6px 0;
      border-top: 1px solid #2a2a3e;
      font-size: 0.85em;
      line-height: 1.4;
    }

    .game-log__play-context {
      color: #888;
      font-size: 0.9em;
    }

    .game-log__play-description {
      color: #ddd;
      margin-top: 2px;
    }

    .game-log__empty {
      padding: 20px 16px;
      text-align: center;
      color: #666;
      font-style: italic;
    }
  </style>
  <div id="game-log__wrapper">
    <div id="game-log__header">Game Log</div>
    <div id="game-log__drives">
      <div id="game-log__empty" class="game-log__empty">No plays yet</div>
    </div>
  </div>
`;

interface DriveData {
  index: number;
  plays: Play[];
  result: string | null;
  expanded: boolean;
  element: HTMLDivElement;
}

export class WACTGameLog extends HTMLElement {
  static readonly tagName = 'wact-game-log' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  private drives: DriveData[] = [];

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [];
  }

  addPlay(play: Play, driveIndex: number): void {
    const emptyEl = this.root.getElementById('game-log__empty');
    if (emptyEl) {
      emptyEl.remove();
    }

    let driveData = this.drives.find((d) => d.index === driveIndex);
    if (!driveData) {
      driveData = this.createDriveEntry(driveIndex);
      this.manageExpansion();
    }

    driveData.plays.push(play);
    this.addPlayToDOM(driveData, play);
    this.updateDriveHeader(driveData);

    const drivesContainer = this.root.getElementById('game-log__drives') as HTMLDivElement;
    drivesContainer.scrollTop = 0;
  }

  completeDrive(driveIndex: number, drive: Drive): void {
    const driveData = this.drives.find((d) => d.index === driveIndex);
    if (!driveData) return;
    driveData.result = this.formatDriveResult(drive.result);
    this.updateDriveHeader(driveData);
  }

  clear(): void {
    this.drives = [];
    const drivesContainer = this.root.getElementById('game-log__drives') as HTMLDivElement;
    drivesContainer.innerHTML =
      '<div id="game-log__empty" class="game-log__empty">No plays yet</div>';
  }

  collapseAll(): void {
    for (const drive of this.drives) {
      this.setDriveExpanded(drive, false);
    }
  }

  private createDriveEntry(driveIndex: number): DriveData {
    const driveEl = document.createElement('div');
    driveEl.className = 'game-log__drive';
    driveEl.dataset.driveIndex = String(driveIndex);

    driveEl.innerHTML = `
      <div class="game-log__drive-header">
        <div class="game-log__drive-left">
          <span class="game-log__drive-result">Drive ${driveIndex + 1} - In Progress</span>
          <span class="game-log__drive-stats"></span>
        </div>
        <span class="game-log__chevron game-log__chevron--expanded">&#9660;</span>
      </div>
      <div class="game-log__drive-plays game-log__drive-plays--expanded"></div>
    `;

    const header = driveEl.querySelector('.game-log__drive-header') as HTMLDivElement;
    const driveData: DriveData = {
      index: driveIndex,
      plays: [],
      result: null,
      expanded: true,
      element: driveEl,
    };

    header.addEventListener('click', () => {
      this.setDriveExpanded(driveData, !driveData.expanded);
    });

    const drivesContainer = this.root.getElementById('game-log__drives') as HTMLDivElement;
    drivesContainer.insertBefore(driveEl, drivesContainer.firstChild);

    this.drives.push(driveData);
    return driveData;
  }

  private addPlayToDOM(driveData: DriveData, play: Play): void {
    const playsContainer = driveData.element.querySelector(
      '.game-log__drive-plays',
    ) as HTMLDivElement;

    const playEl = document.createElement('div');
    playEl.className = 'game-log__play';
    playEl.innerHTML = `
      <div class="game-log__play-context">${this.escapeHtml(play.context_description)}</div>
      <div class="game-log__play-description">${this.escapeHtml(play.description)}</div>
    `;

    playsContainer.insertBefore(playEl, playsContainer.firstChild);
  }

  private updateDriveHeader(driveData: DriveData): void {
    const resultEl = driveData.element.querySelector('.game-log__drive-result') as HTMLSpanElement;
    const statsEl = driveData.element.querySelector('.game-log__drive-stats') as HTMLSpanElement;

    const resultText = driveData.result ?? 'In Progress';
    resultEl.textContent = `Drive ${driveData.index + 1} - ${resultText}`;

    const stats = this.calculateDriveStats(driveData.plays);
    statsEl.textContent = stats;
  }

  private calculateDriveStats(plays: Play[]): string {
    let passYards = 0;
    let rushYards = 0;
    let passAttempts = 0;
    let rushAttempts = 0;

    for (const play of plays) {
      if (play.result.type === 'Pass' || play.result.type === 'QbSpike') {
        passAttempts++;
        passYards += play.result_computed.net_yards;
      } else if (play.result.type === 'Run' || play.result.type === 'QbKneel') {
        rushAttempts++;
        rushYards += play.result_computed.net_yards;
      }
    }

    const parts: string[] = [];
    if (passAttempts > 0) parts.push(`${passYards} pass yds`);
    if (rushAttempts > 0) parts.push(`${rushYards} rush yds`);
    return parts.join(', ');
  }

  private formatDriveResult(result: string): string {
    switch (result) {
      case 'Touchdown':
        return 'Touchdown';
      case 'FieldGoal':
        return 'Field Goal';
      case 'FieldGoalMissed':
        return 'Missed FG';
      case 'Punt':
        return 'Punt';
      case 'Interception':
        return 'Interception';
      case 'PickSix':
        return 'Pick Six';
      case 'Fumble':
        return 'Fumble';
      case 'ScoopAndScore':
        return 'Scoop & Score';
      case 'Downs':
        return 'Turnover on Downs';
      case 'Safety':
        return 'Safety';
      case 'EndOfHalf':
        return 'End of Half';
      default:
        return result;
    }
  }

  private setDriveExpanded(driveData: DriveData, expanded: boolean): void {
    driveData.expanded = expanded;
    const playsContainer = driveData.element.querySelector(
      '.game-log__drive-plays',
    ) as HTMLDivElement;
    const chevron = driveData.element.querySelector('.game-log__chevron') as HTMLSpanElement;

    playsContainer.classList.toggle('game-log__drive-plays--expanded', expanded);
    chevron.classList.toggle('game-log__chevron--expanded', expanded);
  }

  private manageExpansion(): void {
    const expandedDrives = this.drives.filter((d) => d.expanded);
    if (expandedDrives.length > 2) {
      const oldest = expandedDrives.reduce((a, b) => (a.index < b.index ? a : b));
      this.setDriveExpanded(oldest, false);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
