import type {
  PlayByPlaySimService,
  GameState,
  MatchupConfig,
  OffensiveStats,
  Drive,
} from '../services/types.js';
import type { GameFile } from '../services/game-file.js';
import type { WACTMatchupConfig } from './wact-matchup-config.js';
import type { WACTFieldDisplay } from './wact-field-display.js';
import type { WACTPlaybackControls } from './wact-playback-controls.js';
import type { WACTGameContext } from './wact-game-context.js';
import type { WACTButton } from './wact-button.js';
import { DESIGN_TOKENS_CSS } from '../styles/index.js';

type SimState = 'select' | 'config' | 'pregame' | 'playing' | 'paused' | 'postgame';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${DESIGN_TOKENS_CSS}

    :host {
      display: block;
      font-family: sans-serif;
      --wact-comp-game-sim-card-container-color:        var(--wact-sys-color-surface);
      --wact-comp-game-sim-card-outline-color:          var(--wact-sys-color-outline-card);
      --wact-comp-game-sim-card-hover-color:            var(--wact-sys-color-surface-container-hover);
      --wact-comp-game-sim-card-active-color:           var(--wact-sys-color-interactive-active);
      --wact-comp-game-sim-card-title-color:            var(--wact-sys-color-on-surface);
      --wact-comp-game-sim-card-subtitle-color:         var(--wact-sys-color-on-surface-variant);
      --wact-comp-game-sim-card-placeholder-color:      var(--wact-sys-color-on-surface-muted);
      --wact-comp-game-sim-card-shape:                  var(--wact-sys-shape-corner-large);
      --wact-comp-game-sim-postgame-container-color:    var(--wact-sys-color-surface);
      --wact-comp-game-sim-postgame-on-container-color: var(--wact-sys-color-on-surface);
      --wact-comp-game-sim-postgame-score-color:        var(--wact-sys-color-on-surface-variant);
      --wact-comp-game-sim-stats-container-color:       var(--wact-sys-color-surface);
      --wact-comp-game-sim-stats-on-container-color:    var(--wact-sys-color-on-surface);
      --wact-comp-game-sim-stats-outline-color:         var(--wact-sys-color-outline);
      --wact-comp-game-sim-stats-header-color:          var(--wact-sys-color-tertiary-status);
      --wact-comp-game-sim-error-label-color:           var(--wact-sys-color-error);
      --wact-comp-game-sim-error-container-color:       var(--wact-sys-color-error-container);
      --wact-comp-game-sim-container-shape:             var(--wact-sys-shape-corner-medium);
    }

    #game-sim__wrapper {
      margin-bottom: 3%;
    }

    /* Select view */
    #game-sim__select-view {
      display: flex;
      flex-direction: row;
      gap: 20px;
      padding: 24px;
    }

    .game-sim__mode-card {
      flex: 1;
      flex-wrap: wrap;
      border-radius: var(--wact-comp-game-sim-card-shape);
      padding: 20px 24px;
      cursor: default;
      transition: background-color 0.15s;
    }

    #game-sim__start-card {
      background-color: var(--wact-comp-game-sim-card-container-color);
      cursor: pointer;
    }

    #game-sim__start-card:hover {
      background-color: var(--wact-comp-game-sim-card-hover-color);
    }

    #game-sim__start-card:active {
      background-color: var(--wact-comp-game-sim-card-active-color);
    }

    #game-sim__replay-card {
      background-color: var(--wact-comp-game-sim-card-container-color);
    }

    #game-sim__replay-card.game-sim__mode-card--active {
      cursor: pointer;
    }

    #game-sim__replay-card.game-sim__mode-card--active:hover {
      background-color: var(--wact-comp-game-sim-card-hover-color);
    }

    #game-sim__replay-card.game-sim__mode-card--active:active {
      background-color: var(--wact-comp-game-sim-card-active-color);
    }

    #game-sim__replay-card:not(.game-sim__mode-card--active) .game-sim__mode-card-title,
    #game-sim__replay-card:not(.game-sim__mode-card--active) .game-sim__mode-card-subtitle,
    #game-sim__replay-card:not(.game-sim__mode-card--active) .game-sim__mode-icon {
      opacity: var(--wact-sys-state-layer-opacity-inactive);
    }

    .game-sim__mode-card-title {
      font-size: 1.4rem;
      font-weight: bold;
      margin-bottom: 6px;
      color: var(--wact-comp-game-sim-card-title-color);
    }

    .game-sim__mode-card-subtitle {
      font-size: 0.9rem;
      color: var(--wact-comp-game-sim-card-subtitle-color);
    }

    .game-sim__mode-card-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 12px;
    }

    .game-sim__replay-status {
      flex: 1;
      min-width: 0;
      font-size: 0.9rem;
      color: var(--wact-comp-game-sim-card-placeholder-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    #game-sim__replay-upload-btn {
      flex-shrink: 0;
      --btn-padding: 12px;
      line-height: 0;
    }

    .game-sim__mode-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wact-comp-game-sim-card-title-color);
    }

    .game-sim__mode-card-icons {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      margin-left: auto;
    }

    @keyframes game-sim-spin {
      to { transform: rotate(360deg); }
    }

    .game-sim__card-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: game-sim-spin 600ms linear infinite;
    }

    #game-sim__file-error {
      display: none;
      color: var(--wact-comp-game-sim-error-label-color);
      font-size: 0.8em;
      margin-top: 10px;
      padding: 6px 10px;
      background-color: var(--wact-comp-game-sim-error-container-color);
      border-radius: var(--wact-comp-game-sim-container-shape);
    }

    /* Config view */
    #game-sim__config-view {
      display: none;
    }

    #game-sim__start-button-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16px;
    }

    #game-sim__start-button {
      width: 50%;
      font-size: 1.5rem;
      --btn-padding: 8px;
    }

    /* Game view */
    #game-sim__game-view {
      display: none;
      flex-direction: column;
      gap: 8px;
    }

    #game-sim__game-layout {
      display: flex;
      gap: 12px;
    }

    #game-sim__game-left {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    #game-sim__game-right {
      flex: 1;
      display: none;
    }

    /* Postgame overlay */
    #game-sim__postgame-overlay {
      display: none;
      background-color: var(--wact-comp-game-sim-postgame-container-color);
      border-radius: var(--wact-comp-game-sim-container-shape);
      padding: 24px;
      text-align: center;
      color: var(--wact-comp-game-sim-postgame-on-container-color);
    }

    #game-sim__winner-banner {
      font-size: 1.6em;
      font-weight: bold;
      margin-bottom: 8px;
    }

    #game-sim__final-score {
      font-size: 1.2em;
      color: var(--wact-comp-game-sim-postgame-score-color);
      margin-bottom: 20px;
    }

    #game-sim__postgame-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 12px;
    }

    .game-sim__postgame-icon-btn {
      font-size: 0.95rem;
      --btn-padding: 8px 14px;
    }

    .game-sim__postgame-icon-btn span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      line-height: 1;
    }

    #game-sim__new-game-button {
      display: block;
      width: 100%;
      font-size: 1rem;
      --btn-padding: 10px;
    }

    /* Stats view */
    #game-sim__stats-view {
      display: none;
      background-color: var(--wact-comp-game-sim-stats-container-color);
      border-radius: var(--wact-comp-game-sim-container-shape);
      padding: 16px;
      color: var(--wact-comp-game-sim-stats-on-container-color);
    }

    #game-sim__stats-view h3 {
      margin-top: 0;
      text-align: center;
    }

    #game-sim__stats-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9em;
    }

    #game-sim__stats-table th,
    #game-sim__stats-table td {
      padding: 6px 12px;
      text-align: center;
      border-bottom: 1px solid var(--wact-comp-game-sim-stats-outline-color);
    }

    #game-sim__stats-table th {
      color: var(--wact-comp-game-sim-stats-header-color);
    }

    #game-sim__stats-back-button {
      display: block;
      margin: 12px auto 0 auto;
      font-size: 0.9rem;
      --btn-padding: 6px 16px;
    }

    #game-sim__error {
      display: none;
      color: var(--wact-comp-game-sim-error-label-color);
      font-size: 0.85em;
      margin-top: 10px;
      padding: 8px 12px;
      background-color: var(--wact-comp-game-sim-error-container-color);
      border-radius: var(--wact-comp-game-sim-container-shape);
      text-align: center;
    }

    @media only screen and (max-width: 600px) {
      #game-sim__select-view {
        flex-direction: column;
      }

      #game-sim__game-layout {
        flex-direction: column;
      }
    }
  </style>
  <div id="game-sim__wrapper">
    <!-- Select view -->
    <div id="game-sim__select-view">
      <!-- Start card -->
      <div id="game-sim__start-card" class="game-sim__mode-card" role="button" tabindex="0">
        <div class="game-sim__mode-card-title">New Game</div>
        <div class="game-sim__mode-card-subtitle">Simulate a new game</div>
        <div class="game-sim__mode-card-row">
          <div class="game-sim__mode-card-icons">
            <div class="game-sim__mode-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Replay card -->
      <div id="game-sim__replay-card" class="game-sim__mode-card">
        <div class="game-sim__mode-card-title">Replay</div>
        <div class="game-sim__mode-card-subtitle">Play-back a game that has already been simulated</div>
        <div class="game-sim__mode-card-row">
          <wact-button id="game-sim__replay-upload-btn" aria-label="Upload game file" tooltip="upload game">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </wact-button>
          <span id="game-sim__replay-status" class="game-sim__replay-status">No game selected</span>
          <div class="game-sim__mode-card-icons">
            <div id="game-sim__replay-arrow" class="game-sim__mode-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
            <div id="game-sim__replay-spinner" class="game-sim__mode-icon" aria-hidden="true" style="display:none">
              <div class="game-sim__card-spinner"></div>
            </div>
          </div>
        </div>
        <input type="file" id="game-sim__file-input" accept=".json,application/json" style="display:none">
        <div id="game-sim__file-error"></div>
      </div>
    </div>

    <!-- Config view -->
    <div id="game-sim__config-view">
      <wact-matchup-config id="game-sim__matchup-config"></wact-matchup-config>
      <div id="game-sim__start-button-wrapper">
        <wact-button id="game-sim__start-button" variant="primary">Start Game</wact-button>
      </div>
      <div id="game-sim__error"></div>
    </div>

    <!-- Game view -->
    <div id="game-sim__game-view">
      <wact-field-display id="game-sim__field"></wact-field-display>
      <wact-playback-controls id="game-sim__controls" disabled></wact-playback-controls>
      <div id="game-sim__game-layout">
        <div id="game-sim__game-left">
          <wact-game-context id="game-sim__context"></wact-game-context>
        </div>
        <div id="game-sim__game-right">
          <!-- Postgame overlay -->
          <div id="game-sim__postgame-overlay">
            <div id="game-sim__winner-banner"></div>
            <div id="game-sim__final-score"></div>
            <div id="game-sim__postgame-actions">
              <wact-button id="game-sim__export-button" class="game-sim__postgame-icon-btn">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Export
                </span>
              </wact-button>
              <wact-button id="game-sim__summary-button" class="game-sim__postgame-icon-btn">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="20" x2="22" y2="20"/><polyline points="4 16 10 9 16 13 22 7"/></svg>
                  Game Summary
                </span>
              </wact-button>
            </div>
            <wact-button id="game-sim__new-game-button" variant="primary">New Game</wact-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats view -->
    <div id="game-sim__stats-view">
      <h3>Game Summary</h3>
      <table id="game-sim__stats-table">
        <thead>
          <tr>
            <th>Stat</th>
            <th id="game-sim__stats-home-header">Home</th>
            <th id="game-sim__stats-away-header">Away</th>
          </tr>
        </thead>
        <tbody id="game-sim__stats-body"></tbody>
      </table>
      <wact-button id="game-sim__stats-back-button">Back</wact-button>
    </div>
  </div>
`;

export class WACTGameSim extends HTMLElement {
  static readonly tagName = 'wact-game-sim' as const;

  readonly root: ShadowRoot;
  private simService: PlayByPlaySimService | null = null;
  private state: SimState = 'select';
  private playbackTimer: ReturnType<typeof setTimeout> | null = null;
  private playbackSpeed = 2;
  private matchupConfig: MatchupConfig | null = null;
  private lastDriveCount = 0;
  private lastHomePositiveDirection: boolean | null = null;
  private mode: 'simulate' | 'playback' = 'simulate';
  private finalGameState: GameState | null = null;
  private selectedGameFile: File | null = null;

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

  setSimService(service: PlayByPlaySimService): void {
    this.simService = service;
  }

  // --- Public API ---

  async loadMatchup(config: MatchupConfig): Promise<void> {
    this.clearTimer();
    if (this.simService?.hasActiveGame()) {
      this.simService.destroyGame();
    }

    if (!this.simService || this.mode === 'playback') {
      const { WasmSimService } = await import('../services/wasm-sim-service.js');
      this.simService = new WasmSimService();
    }

    if (!this.simService.isReady()) {
      await this.simService.initialize();
    }

    const gameState = this.simService.createGame(config);

    this.matchupConfig = config;
    this.mode = 'simulate';
    this.lastDriveCount = 0;
    this.lastHomePositiveDirection = null;
    this.finalGameState = null;

    this.setupScoreboard(gameState);
    this.setupField(gameState.context.home_positive_direction);

    const context = this.root.getElementById('game-sim__context') as WACTGameContext;
    context.scoreboard.setAttribute('status', 'Pregame');
    context.gameLog.clear();
    context.gameLog.setTeamLogos(this.matchupConfig.home.logo, this.matchupConfig.away.logo);

    this.transitionTo('pregame');
  }

  async loadGameFile(source: File | GameFile): Promise<void> {
    let gameFile: GameFile;

    if (source instanceof File) {
      const text = await source.text();
      let parsed: GameFile;
      try {
        parsed = JSON.parse(text) as GameFile;
      } catch {
        throw new Error('Invalid game file: not valid JSON.');
      }
      if (!parsed || parsed.version !== 1) {
        throw new Error('Invalid game file: unsupported version or format.');
      }
      gameFile = parsed;
    } else {
      gameFile = source;
    }

    this.clearTimer();
    if (this.simService?.hasActiveGame()) {
      this.simService.destroyGame();
    }

    const { PlaybackSimService } = await import('../services/playback-sim-service.js');
    const svc = new PlaybackSimService();
    this.simService = svc;
    this.mode = 'playback';
    this.matchupConfig = gameFile.matchupConfig;
    this.lastDriveCount = 0;
    this.lastHomePositiveDirection = null;
    this.finalGameState = null;

    const gameState = svc.loadGame(gameFile);

    this.setupScoreboard(gameState);
    this.setupField(gameState.context.home_positive_direction);

    const context = this.root.getElementById('game-sim__context') as WACTGameContext;
    context.scoreboard.setAttribute('status', 'Pregame');
    context.gameLog.clear();
    context.gameLog.setTeamLogos(this.matchupConfig.home.logo, this.matchupConfig.away.logo);

    this.transitionTo('pregame');
  }

  async exportGame(filename?: string): Promise<void> {
    if (!this.simService || !this.matchupConfig || !this.finalGameState) return;

    const drives: Drive[] = [];
    for (let i = 0; i < this.finalGameState.driveCount; i++) {
      drives.push(this.simService.getDrive(i));
    }

    const gameFile: GameFile = {
      version: 1,
      matchupConfig: this.matchupConfig,
      drives,
      finalContext: this.finalGameState.context,
      homeStats: this.simService.getHomeStats(),
      awayStats: this.simService.getAwayStats(),
    };

    const { downloadGameFile } = await import('../services/game-file.js');
    downloadGameFile(gameFile, filename);
  }

  // --- Internal UI methods ---

  private resetSelectView(): void {
    this.selectedGameFile = null;
    const replayCard = this.root.getElementById('game-sim__replay-card') as HTMLElement | null;
    const statusEl = this.root.getElementById('game-sim__replay-status') as HTMLElement | null;
    const fileError = this.root.getElementById('game-sim__file-error') as HTMLElement | null;
    const arrow = this.root.getElementById('game-sim__replay-arrow') as HTMLElement | null;
    const spinner = this.root.getElementById('game-sim__replay-spinner') as HTMLElement | null;
    if (replayCard) {
      replayCard.classList.remove('game-sim__mode-card--active');
      replayCard.removeAttribute('role');
      replayCard.removeAttribute('tabindex');
    }
    if (statusEl) statusEl.textContent = 'No game selected';
    if (fileError) {
      fileError.style.display = 'none';
      fileError.textContent = '';
    }
    if (arrow) arrow.style.display = 'flex';
    if (spinner) spinner.style.display = 'none';
  }

  private transitionTo(newState: SimState): void {
    this.state = newState;

    const selectView = this.root.getElementById('game-sim__select-view') as HTMLDivElement;
    const configView = this.root.getElementById('game-sim__config-view') as HTMLDivElement;
    const gameView = this.root.getElementById('game-sim__game-view') as HTMLDivElement;
    const statsView = this.root.getElementById('game-sim__stats-view') as HTMLDivElement;
    const postgameOverlay = this.root.getElementById(
      'game-sim__postgame-overlay',
    ) as HTMLDivElement;
    const controls = this.root.getElementById('game-sim__controls') as WACTPlaybackControls;

    const gameRight = this.root.getElementById('game-sim__game-right') as HTMLDivElement;

    selectView.style.display = 'none';
    configView.style.display = 'none';
    gameView.style.display = 'none';
    statsView.style.display = 'none';
    postgameOverlay.style.display = 'none';
    gameRight.style.display = 'none';

    switch (newState) {
      case 'select':
        selectView.style.display = 'flex';
        this.resetSelectView();
        break;
      case 'config':
        configView.style.display = 'block';
        break;
      case 'pregame':
        gameView.style.display = 'flex';
        controls.disabled = false;
        controls.playing = false;
        break;
      case 'playing':
        gameView.style.display = 'flex';
        controls.disabled = false;
        controls.playing = true;
        break;
      case 'paused':
        gameView.style.display = 'flex';
        controls.disabled = false;
        controls.playing = false;
        break;
      case 'postgame':
        gameView.style.display = 'flex';
        gameRight.style.display = 'block';
        postgameOverlay.style.display = 'block';
        controls.disabled = true;
        controls.playing = false;
        break;
    }
  }

  private async startGame(): Promise<void> {
    const startButton = this.root.getElementById('game-sim__start-button') as WACTButton;
    const errorEl = this.root.getElementById('game-sim__error') as HTMLDivElement;

    startButton.startLoading();

    const matchupConfigEl = this.root.getElementById(
      'game-sim__matchup-config',
    ) as WACTMatchupConfig;
    const config = matchupConfigEl.matchupConfig;

    try {
      await this.loadMatchup(config);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      startButton.stopLoading();
      return;
    }

    errorEl.textContent = '';
    errorEl.style.display = 'none';
    startButton.reset();
  }

  private async startPlaybackFromFile(file: File): Promise<void> {
    const arrow = this.root.getElementById('game-sim__replay-arrow') as HTMLDivElement;
    const spinner = this.root.getElementById('game-sim__replay-spinner') as HTMLDivElement;
    const fileError = this.root.getElementById('game-sim__file-error') as HTMLDivElement;

    fileError.style.display = 'none';
    arrow.style.display = 'none';
    spinner.style.display = 'flex';

    try {
      await this.loadGameFile(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      fileError.textContent = message;
      fileError.style.display = 'block';
      spinner.style.display = 'none';
      arrow.style.display = 'flex';
    }
  }

  private async handleExportClick(): Promise<void> {
    const exportBtn = this.root.getElementById('game-sim__export-button') as WACTButton;
    exportBtn.startLoading();
    await this.exportGame();
    exportBtn.stopLoading('Exported!', 1500);
  }

  private setupScoreboard(gameState: GameState): void {
    const context = this.root.getElementById('game-sim__context') as WACTGameContext;
    const scoreboard = context.scoreboard;

    scoreboard.setAttribute('home-team', this.matchupConfig!.home.short_name);
    scoreboard.setAttribute('away-team', this.matchupConfig!.away.short_name);
    scoreboard.setAttribute('home-logo', this.matchupConfig!.home.logo);
    scoreboard.setAttribute('away-logo', this.matchupConfig!.away.logo);
    scoreboard.setAttribute('home-score', String(gameState.context.home_score));
    scoreboard.setAttribute('away-score', String(gameState.context.away_score));
    scoreboard.setAttribute('quarter', String(gameState.context.quarter));
    scoreboard.setAttribute('clock', String(gameState.context.half_seconds));
    scoreboard.setAttribute('down', String(gameState.context.down));
    scoreboard.setAttribute('distance', String(gameState.context.distance));
    scoreboard.setAttribute('yard-line', String(gameState.context.yard_line));
    scoreboard.setAttribute(
      'home-positive-direction',
      String(gameState.context.home_positive_direction),
    );
    if (gameState.context.home_possession) {
      scoreboard.setAttribute('home-possession', '');
    } else {
      scoreboard.removeAttribute('home-possession');
    }
  }

  private setupField(homePositiveDirection: boolean): void {
    const field = this.root.getElementById('game-sim__field') as WACTFieldDisplay;
    field.clear();

    const homeColor = this.matchupConfig!.home.color;
    const awayColor = this.matchupConfig!.away.color;

    // setAttribute stores colors for use in drive rect coloring
    field.setAttribute('home-color', homeColor);
    field.setAttribute('away-color', awayColor);

    // Set endzone labels and colors. Left endzone is yard 0, right is yard 100.
    // When home_positive_direction is true, home scores toward yard 100,
    // so left (yard 0) = home's own endzone, right (yard 100) = away's.
    // When false, away is on the left, home on the right.
    const leftEndzone = field.root.getElementById('field__endzone-home') as HTMLDivElement;
    const rightEndzone = field.root.getElementById('field__endzone-away') as HTMLDivElement;
    if (homePositiveDirection) {
      leftEndzone.textContent = this.matchupConfig!.home.short_name;
      leftEndzone.style.backgroundColor = homeColor;
      rightEndzone.textContent = this.matchupConfig!.away.short_name;
      rightEndzone.style.backgroundColor = awayColor;
    } else {
      leftEndzone.textContent = this.matchupConfig!.away.short_name;
      leftEndzone.style.backgroundColor = awayColor;
      rightEndzone.textContent = this.matchupConfig!.home.short_name;
      rightEndzone.style.backgroundColor = homeColor;
    }
  }

  private updateFromGameState(gameState: GameState): void {
    const context = this.root.getElementById('game-sim__context') as WACTGameContext;
    const scoreboard = context.scoreboard;
    const gameLog = context.gameLog;
    const field = this.root.getElementById('game-sim__field') as WACTFieldDisplay;

    // Update scoreboard
    scoreboard.setAttribute('home-score', String(gameState.context.home_score));
    scoreboard.setAttribute('away-score', String(gameState.context.away_score));
    scoreboard.setAttribute('quarter', String(gameState.context.quarter));
    scoreboard.setAttribute('clock', String(gameState.context.half_seconds));
    scoreboard.setAttribute('down', String(gameState.context.down));
    scoreboard.setAttribute('distance', String(gameState.context.distance));
    scoreboard.setAttribute('yard-line', String(gameState.context.yard_line));
    scoreboard.setAttribute(
      'home-positive-direction',
      String(gameState.context.home_positive_direction),
    );
    scoreboard.setAttribute('status', '');

    if (gameState.context.home_possession) {
      scoreboard.setAttribute('home-possession', '');
    } else {
      scoreboard.removeAttribute('home-possession');
    }

    // Always update ball position and first-down line immediately
    field.updateMarkers(gameState.context);

    // Update game log
    if (gameState.latestPlay) {
      const currentDriveIndex = Math.max(0, gameState.driveCount - 1);
      gameLog.addPlay(gameState.latestPlay, currentDriveIndex);

      // Check if a drive completed based on drive result
      const currentDrive = this.simService!.getDrive(currentDriveIndex);
      if (currentDrive.result !== 'None') {
        gameLog.completeDrive(currentDriveIndex, currentDrive);
      }

      // Detect field flip at quarter change
      if (
        this.lastHomePositiveDirection !== null &&
        gameState.latestPlay.context.home_positive_direction !==
          gameState.context.home_positive_direction
      ) {
        if (gameState.complete || gameState.context.game_over) {
          field.showTextOverlay('End of Game', '#ffffff', 1000);
        } else {
          field.showTextOverlay('End of Quarter', '#ffffff', 1000);
        }
        field.flipEndzones();
      }
      this.lastHomePositiveDirection = gameState.context.home_positive_direction;

      // Trigger field animations based on play result
      this.triggerPlayAnimation(field, gameState);

      // Fade out drive rects on drive change
      if (gameState.driveCount > this.lastDriveCount && this.lastDriveCount > 0) {
        field.fadeOutDrive(() => {
          if (gameState.driveCount > 0) {
            const idx = gameState.driveCount - 1;
            const drive = this.simService!.getDrive(idx);
            field.setDrive(drive.plays, gameState.context);
          }
        });
        this.lastDriveCount = gameState.driveCount;
        return;
      }

      this.lastDriveCount = gameState.driveCount;

      // Fade out rects immediately when ball resets (punt, kickoff, FG, XP)
      // rather than waiting for driveCount to change on the next simPlay()
      const resetTypes = ['Punt', 'Kickoff', 'FieldGoal', 'ExtraPoint'];
      if (resetTypes.includes(gameState.latestPlay.result.type)) {
        field.fadeOutDrive();
        return;
      }
    }

    // Update field rects (skip at game over / end of half to avoid phantom rects after direction flip)
    if (
      gameState.driveCount > 0 &&
      !gameState.complete &&
      !gameState.context.game_over &&
      !gameState.context.end_of_half
    ) {
      const currentDriveIndex = gameState.driveCount - 1;
      const currentDrive = this.simService!.getDrive(currentDriveIndex);
      field.setDrive(currentDrive.plays, gameState.context);
    }
  }

  private triggerPlayAnimation(field: WACTFieldDisplay, gameState: GameState): void {
    if (!gameState.latestPlay) return;
    const play = gameState.latestPlay;
    const rc = play.result_computed;

    if (rc.offense_score === 'Touchdown') {
      field.showAnimation('touchdown', { possession: play.context.home_possession });
    } else if (rc.offense_score === 'FieldGoal') {
      field.showAnimation('field-goal-made', { yardLine: play.context.yard_line });
    } else if (play.result.type === 'FieldGoal' && !play.result.data.made) {
      field.showAnimation('field-goal-missed', { yardLine: play.context.yard_line });
    } else if (rc.offense_score === 'ExtraPoint') {
      field.showAnimation('extra-point-made', {});
    } else if (play.result.type === 'ExtraPoint' && !play.result.data.made) {
      field.showAnimation('extra-point-missed', {});
    } else if (rc.defense_score === 'Safety') {
      field.showAnimation('safety', { possession: play.context.home_possession });
    } else if (play.result.type === 'Pass' && play.result.data.interception) {
      field.showAnimation('turnover', { type: 'Interception' });
    } else if (play.result.type === 'Pass' && play.result.data.fumble) {
      field.showAnimation('turnover', { type: 'Fumble' });
    } else if (play.result.type === 'Run' && play.result.data.fumble) {
      field.showAnimation('turnover', { type: 'Fumble' });
    } else if (play.result.type === 'Punt' && play.result.data.fumble) {
      field.showAnimation('turnover', { type: 'Fumble' });
    } else if (play.result.type === 'Kickoff' && play.result.data.fumble) {
      field.showAnimation('turnover', { type: 'Fumble' });
    } else if (rc.punt) {
      field.showAnimation('punt', {
        fromYard: play.context.yard_line,
        toYard: gameState.context.yard_line,
      });
    }
  }

  private calculateWaitTime(gameState: GameState): number {
    if (!gameState.latestPlay) return 500;

    const playDuration = gameState.latestPlay.result_computed.play_duration;
    let postPlayDuration = 30;

    if (gameState.latestPlay.post_play.type === 'BetweenPlay') {
      postPlayDuration = Math.max(20, gameState.latestPlay.post_play_computed.play_duration);
    }

    return ((playDuration + postPlayDuration) * 250) / this.playbackSpeed;
  }

  private scheduleNextPlay(): void {
    if (this.state !== 'playing' || !this.simService?.hasActiveGame()) {
      return;
    }

    const gameState = this.simService.simPlay();
    this.updateFromGameState(gameState);

    if (gameState.complete || gameState.context.game_over) {
      this.onGameComplete(gameState);
      return;
    }

    const waitTime = this.calculateWaitTime(gameState);
    this.playbackTimer = setTimeout(() => this.scheduleNextPlay(), waitTime);
  }

  private onGameComplete(gameState: GameState): void {
    // Complete the last drive
    if (gameState.driveCount > 0) {
      const lastDriveIndex = gameState.driveCount - 1;
      const lastDrive = this.simService!.getDrive(lastDriveIndex);
      const context = this.root.getElementById('game-sim__context') as WACTGameContext;
      context.gameLog.completeDrive(lastDriveIndex, lastDrive);
      context.gameLog.collapseAll();
      context.scoreboard.setAttribute('status', 'Final');
    }

    // Clear any lingering field animations so they don't replay on view toggle
    const field = this.root.getElementById('game-sim__field') as WACTFieldDisplay;
    field.clearAnimations();

    this.showPostgame(gameState);
  }

  private showPostgame(gameState: GameState): void {
    this.finalGameState = gameState;

    const winnerBanner = this.root.getElementById('game-sim__winner-banner') as HTMLDivElement;
    const finalScore = this.root.getElementById('game-sim__final-score') as HTMLDivElement;

    const homeScore = gameState.context.home_score;
    const awayScore = gameState.context.away_score;
    const homeName = this.matchupConfig!.home.name;
    const awayName = this.matchupConfig!.away.name;

    if (homeScore > awayScore) {
      winnerBanner.textContent = `${homeName} Win!`;
    } else if (awayScore > homeScore) {
      winnerBanner.textContent = `${awayName} Win!`;
    } else {
      winnerBanner.textContent = 'Tie Game!';
    }

    finalScore.textContent = `${homeName} ${homeScore} - ${awayName} ${awayScore}`;

    this.transitionTo('postgame');
  }

  private skipToEnd(): void {
    this.clearTimer();

    if (!this.simService?.hasActiveGame()) return;

    const gameState = this.simService.simRemainder();

    // Update all drives in the game log
    const context = this.root.getElementById('game-sim__context') as WACTGameContext;

    // Add all plays from drives we haven't processed yet
    for (let i = this.lastDriveCount; i < gameState.driveCount; i++) {
      const drive = this.simService.getDrive(i);
      for (const play of drive.plays) {
        context.gameLog.addPlay(play, i);
      }
      context.gameLog.completeDrive(i, drive);
    }

    // Also complete any previously-started but uncompleted drives
    if (this.lastDriveCount > 0) {
      const prevDrive = this.simService.getDrive(this.lastDriveCount - 1);
      if (prevDrive.complete) {
        context.gameLog.completeDrive(this.lastDriveCount - 1, prevDrive);
      }
    }

    this.lastDriveCount = gameState.driveCount;

    // Update scoreboard
    this.updateFromGameState(gameState);

    this.onGameComplete(gameState);
  }

  private showStats(): void {
    if (!this.simService?.hasActiveGame()) return;

    const homeStats = this.simService.getHomeStats();
    const awayStats = this.simService.getAwayStats();

    const homeHeader = this.root.getElementById(
      'game-sim__stats-home-header',
    ) as HTMLTableCellElement;
    const awayHeader = this.root.getElementById(
      'game-sim__stats-away-header',
    ) as HTMLTableCellElement;
    homeHeader.textContent = this.matchupConfig!.home.short_name;
    awayHeader.textContent = this.matchupConfig!.away.short_name;

    const tbody = this.root.getElementById('game-sim__stats-body') as HTMLTableSectionElement;
    tbody.innerHTML = '';

    const statsRows = this.buildStatsRows(homeStats, awayStats);
    for (const row of statsRows) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.label}</td><td>${row.home}</td><td>${row.away}</td>`;
      tbody.appendChild(tr);
    }

    const gameView = this.root.getElementById('game-sim__game-view') as HTMLDivElement;
    const statsView = this.root.getElementById('game-sim__stats-view') as HTMLDivElement;
    gameView.style.display = 'none';
    statsView.style.display = 'block';
  }

  private buildStatsRows(
    home: OffensiveStats,
    away: OffensiveStats,
  ): { label: string; home: string; away: string }[] {
    return [
      {
        label: 'Passing',
        home: `${home.passing.completions}/${home.passing.attempts}, ${home.passing.yards} yds`,
        away: `${away.passing.completions}/${away.passing.attempts}, ${away.passing.yards} yds`,
      },
      {
        label: 'Pass TDs',
        home: String(home.passing.touchdowns),
        away: String(away.passing.touchdowns),
      },
      {
        label: 'Interceptions',
        home: String(home.passing.interceptions),
        away: String(away.passing.interceptions),
      },
      {
        label: 'Rushing',
        home: `${home.rushing.rushes} att, ${home.rushing.yards} yds`,
        away: `${away.rushing.rushes} att, ${away.rushing.yards} yds`,
      },
      {
        label: 'Rush TDs',
        home: String(home.rushing.touchdowns),
        away: String(away.rushing.touchdowns),
      },
      {
        label: 'Fumbles',
        home: String(home.rushing.fumbles + home.receiving.fumbles),
        away: String(away.rushing.fumbles + away.receiving.fumbles),
      },
      {
        label: 'Total Yards',
        home: String(home.passing.yards + home.rushing.yards),
        away: String(away.passing.yards + away.rushing.yards),
      },
    ];
  }

  private hideStats(): void {
    const gameView = this.root.getElementById('game-sim__game-view') as HTMLDivElement;
    const statsView = this.root.getElementById('game-sim__stats-view') as HTMLDivElement;
    gameView.style.display = 'flex';
    statsView.style.display = 'none';

    // Clear field animations so they don't replay when game view reappears
    const field = this.root.getElementById('game-sim__field') as WACTFieldDisplay;
    field.clearAnimations();
  }

  private newGame(): void {
    this.clearTimer();
    if (this.simService?.hasActiveGame()) {
      this.simService.destroyGame();
    }
    this.simService = null;
    this.lastDriveCount = 0;
    this.lastHomePositiveDirection = null;
    this.matchupConfig = null;
    this.finalGameState = null;
    this.mode = 'simulate';
    this.transitionTo('select');
  }

  private clearTimer(): void {
    if (this.playbackTimer !== null) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;

    // Initialize display state via inline styles
    this.transitionTo(this.state);

    // Select view — Start card
    const startCard = this.root.getElementById('game-sim__start-card') as HTMLElement;
    startCard.addEventListener('click', () => this.transitionTo('config'));
    startCard.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.transitionTo('config');
      }
    });

    // Select view — Replay card
    const replayCard = this.root.getElementById('game-sim__replay-card') as HTMLElement;
    const fileInput = this.root.getElementById('game-sim__file-input') as HTMLInputElement;
    const uploadBtn = this.root.getElementById('game-sim__replay-upload-btn') as WACTButton;

    uploadBtn.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
    });

    fileInput.addEventListener('change', () => {
      const statusEl = this.root.getElementById('game-sim__replay-status') as HTMLElement;
      const fileError = this.root.getElementById('game-sim__file-error') as HTMLDivElement;
      fileError.style.display = 'none';
      if (fileInput.files && fileInput.files.length > 0) {
        this.selectedGameFile = fileInput.files[0];
        statusEl.textContent = fileInput.files[0].name;
        replayCard.classList.add('game-sim__mode-card--active');
        replayCard.setAttribute('role', 'button');
        replayCard.setAttribute('tabindex', '0');
      } else {
        this.selectedGameFile = null;
        statusEl.textContent = 'No game selected';
        replayCard.classList.remove('game-sim__mode-card--active');
        replayCard.removeAttribute('role');
        replayCard.removeAttribute('tabindex');
      }
      fileInput.value = '';
    });

    replayCard.addEventListener('click', () => {
      if (!this.selectedGameFile) return;
      void this.startPlaybackFromFile(this.selectedGameFile);
    });

    replayCard.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (!this.selectedGameFile) return;
      e.preventDefault();
      void this.startPlaybackFromFile(this.selectedGameFile);
    });

    // Start button
    const startButton = this.root.getElementById('game-sim__start-button') as HTMLElement;
    startButton.addEventListener('click', () => void this.startGame());

    // Playback controls
    const controls = this.root.getElementById('game-sim__controls') as WACTPlaybackControls;
    controls.addEventListener('play', () => {
      if (this.state === 'pregame' || this.state === 'paused') {
        this.transitionTo('playing');
        this.scheduleNextPlay();
      }
    });

    controls.addEventListener('pause', () => {
      if (this.state === 'playing') {
        this.clearTimer();
        this.transitionTo('paused');
      }
    });

    controls.addEventListener('speed-change', ((e: CustomEvent) => {
      this.playbackSpeed = e.detail as number;
    }) as EventListener);

    controls.addEventListener('skip-to-end', () => {
      this.skipToEnd();
    });

    // Postgame buttons
    const summaryButton = this.root.getElementById('game-sim__summary-button') as HTMLElement;
    summaryButton.addEventListener('click', () => this.showStats());

    const newGameButton = this.root.getElementById('game-sim__new-game-button') as HTMLElement;
    newGameButton.addEventListener('click', () => this.newGame());

    const exportButton = this.root.getElementById('game-sim__export-button') as HTMLElement;
    exportButton.addEventListener('click', () => void this.handleExportClick());

    // Stats back button
    const statsBackButton = this.root.getElementById('game-sim__stats-back-button') as HTMLElement;
    statsBackButton.addEventListener('click', () => this.hideStats());

    this._readyPromise = new Promise((r) => (this._resolveReady = r));
    this._resolveReady?.();
  }

  disconnectedCallback(): void {
    this.clearTimer();
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
