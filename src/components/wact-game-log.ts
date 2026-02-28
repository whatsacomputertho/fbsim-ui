import type { Play, Drive } from '../services/types.js';
import { DESIGN_TOKENS_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${DESIGN_TOKENS_CSS}

    :host {
      display: block;
      font-family: var(--wact-sys-typescale-font-family);
      --wact-comp-game-log-container-color:         var(--wact-sys-color-surface);
      --wact-comp-game-log-on-container-color:      var(--wact-sys-color-on-surface-variant);
      --wact-comp-game-log-header-container-color:  var(--wact-sys-color-interactive);
      --wact-comp-game-log-on-header-color:         var(--wact-sys-color-on-surface);
      --wact-comp-game-log-divider-color:           var(--wact-sys-color-outline);
      --wact-comp-game-log-drive-hover-color:       var(--wact-sys-color-surface-recessed);
      --wact-comp-game-log-drive-result-color:      var(--wact-sys-color-on-surface);
      --wact-comp-game-log-drive-stats-color:       var(--wact-sys-color-on-surface-muted);
      --wact-comp-game-log-chevron-color:           var(--wact-sys-color-on-surface-muted);
      --wact-comp-game-log-play-divider-color:      var(--wact-sys-color-outline-card);
      --wact-comp-game-log-play-context-color:      var(--wact-sys-color-on-surface-muted);
      --wact-comp-game-log-play-desc-color:         var(--wact-sys-color-on-surface);
      --wact-comp-game-log-empty-color:             var(--wact-sys-color-on-surface-muted);
      --wact-comp-game-log-container-shape:         var(--wact-sys-shape-corner-medium);
      --wact-comp-game-log-max-height:              400px;
      --wact-comp-game-log-max-height-expanded:     2000px;
      --wact-comp-game-log-icon-size:               28px;
      --wact-comp-game-log-row-gap:                 2px;
      --wact-comp-game-log-play-font-style:         italic;
    }

    #game-log__wrapper {
      background-color: var(--wact-comp-game-log-container-color);
      color: var(--wact-comp-game-log-on-container-color);
      border-radius: var(--wact-comp-game-log-container-shape);
      overflow: hidden;
    }

    #game-log__header {
      padding: var(--wact-sys-spacing-sm) var(--wact-sys-spacing-lg);
      font-size: var(--wact-sys-typescale-body-large-size);
      font-weight: var(--wact-sys-typescale-weight-bold);
      color: var(--wact-comp-game-log-on-header-color);
      background-color: var(--wact-comp-game-log-header-container-color);
      border-bottom: 1px solid var(--wact-comp-game-log-divider-color);
    }

    #game-log__drives {
      max-height: var(--wact-comp-game-log-max-height);
      overflow-y: auto;
    }

    .game-log__drive {
      border-bottom: 1px solid var(--wact-comp-game-log-divider-color);
    }

    .game-log__drive:last-child {
      border-bottom: none;
    }

    .game-log__drive-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--wact-sys-spacing-sm) var(--wact-sys-spacing-lg);
      cursor: pointer;
      transition: background-color var(--wact-sys-motion-duration-short1) var(--wact-sys-motion-easing-standard);
      user-select: none;
      gap: var(--wact-sys-spacing-sm);
    }

    .game-log__drive-header:hover {
      background-color: var(--wact-comp-game-log-drive-hover-color);
    }

    .game-log__drive-logo {
      width: var(--wact-comp-game-log-icon-size);
      height: var(--wact-comp-game-log-icon-size);
      object-fit: contain;
      border-radius: var(--wact-sys-shape-corner-extra-small);
      flex-shrink: 0;
    }

    .game-log__drive-info {
      flex: 1;
      min-width: 0;
    }

    .game-log__drive-result {
      font-weight: var(--wact-sys-typescale-weight-bold);
      color: var(--wact-comp-game-log-drive-result-color);
      font-size: var(--wact-sys-typescale-body-medium-size);
    }

    .game-log__drive-stats {
      font-size: var(--wact-sys-typescale-body-small-size);
      color: var(--wact-comp-game-log-drive-stats-color);
      margin-top: var(--wact-comp-game-log-row-gap);
    }

    .game-log__chevron {
      font-size: var(--wact-sys-typescale-body-small-size);
      transition: transform var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
      color: var(--wact-comp-game-log-chevron-color);
    }

    .game-log__chevron--expanded {
      transform: rotate(180deg);
    }

    .game-log__drive-plays {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--wact-sys-motion-duration-medium1) var(--wact-sys-motion-easing-standard), padding-bottom var(--wact-sys-motion-duration-medium1) var(--wact-sys-motion-easing-standard);
      padding: 0 var(--wact-sys-spacing-lg);
    }

    .game-log__drive-plays--expanded {
      max-height: var(--wact-comp-game-log-max-height-expanded);
      padding: 0 var(--wact-sys-spacing-lg) var(--wact-sys-spacing-sm) var(--wact-sys-spacing-lg);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .game-log__play {
      padding: var(--wact-sys-spacing-xs) 0;
      border-top: 1px solid var(--wact-comp-game-log-play-divider-color);
      font-size: var(--wact-sys-typescale-body-small-size);
      line-height: var(--wact-sys-typescale-line-height-body);
      animation: fadeIn var(--wact-sys-motion-duration-short2) var(--wact-sys-motion-easing-standard);
    }

    .game-log__play-context {
      color: var(--wact-comp-game-log-play-context-color);
      font-size: var(--wact-sys-typescale-body-medium-size);
    }

    .game-log__play-description {
      color: var(--wact-comp-game-log-play-desc-color);
      margin-top: var(--wact-comp-game-log-row-gap);
    }

    .game-log__empty {
      padding: var(--wact-sys-spacing-xl) var(--wact-sys-spacing-lg);
      text-align: center;
      color: var(--wact-comp-game-log-empty-color);
      font-style: var(--wact-comp-game-log-play-font-style);
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
  private homeLogo = '';
  private awayLogo = '';

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  static get observedAttributes(): string[] {
    return [];
  }

  setTeamLogos(homeLogo: string, awayLogo: string): void {
    this.homeLogo = homeLogo;
    this.awayLogo = awayLogo;
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
        <img class="game-log__drive-logo" src="" alt="">
        <div class="game-log__drive-info">
          <div class="game-log__drive-result">Drive ${driveIndex + 1} - In Progress</div>
          <div class="game-log__drive-stats"></div>
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

    let desc = play.description;
    if (desc.startsWith(play.context_description)) {
      desc = desc.slice(play.context_description.length).replace(/^[\s\-\u2013\u2014:]+/, '');
    }

    const playEl = document.createElement('div');
    playEl.className = 'game-log__play';
    playEl.innerHTML = `
      <div class="game-log__play-context">${this.escapeHtml(play.context_description)}</div>
      <div class="game-log__play-description">${this.escapeHtml(desc)}</div>
    `;

    playsContainer.insertBefore(playEl, playsContainer.firstChild);
  }

  private updateDriveHeader(driveData: DriveData): void {
    const resultEl = driveData.element.querySelector('.game-log__drive-result') as HTMLDivElement;
    const statsEl = driveData.element.querySelector('.game-log__drive-stats') as HTMLDivElement;

    const resultText = driveData.result ?? 'In Progress';
    resultEl.textContent = `Drive ${driveData.index + 1} - ${resultText}`;

    const stats = this.calculateDriveStats(driveData.plays);
    statsEl.textContent = stats;

    // Update logo based on most recent play's possession
    if (driveData.plays.length > 0) {
      const latestPlay = driveData.plays[driveData.plays.length - 1];
      const logoEl = driveData.element.querySelector('.game-log__drive-logo') as HTMLImageElement;
      logoEl.src = latestPlay.context.home_possession ? this.homeLogo : this.awayLogo;
    }
  }

  private calculateDriveStats(plays: Play[]): string {
    let passYards = 0;
    let rushYards = 0;
    let passAttempts = 0;
    let passCompletions = 0;
    let rushAttempts = 0;
    let totalYards = 0;
    let playCount = 0;

    for (const play of plays) {
      if (play.result.type === 'Pass' || play.result.type === 'QbSpike') {
        passAttempts++;
        passYards += play.result_computed.net_yards;
        if (play.result.type === 'Pass' && play.result.data.complete) {
          passCompletions++;
        }
        totalYards += play.result_computed.net_yards;
        playCount++;
      } else if (play.result.type === 'Run' || play.result.type === 'QbKneel') {
        rushAttempts++;
        rushYards += play.result_computed.net_yards;
        totalYards += play.result_computed.net_yards;
        playCount++;
      }
    }

    if (playCount === 0) return '';

    const parts: string[] = [];
    parts.push(`${playCount} play${playCount !== 1 ? 's' : ''}, ${totalYards} yards`);
    if (passAttempts > 0)
      parts.push(`Passing: ${passCompletions}/${passAttempts}, ${passYards} yards`);
    if (rushAttempts > 0) parts.push(`Rushing: ${rushAttempts} rush, ${rushYards} yards`);
    return parts.join(' | ');
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
