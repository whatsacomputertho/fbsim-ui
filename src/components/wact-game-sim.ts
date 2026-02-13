import type {
  PlayByPlaySimService,
  GameState,
  MatchupConfig,
  OffensiveStats,
} from '../services/types.js';
import type { WACTMatchupConfig } from './wact-matchup-config.js';
import type { WACTFieldDisplay } from './wact-field-display.js';
import type { WACTPlaybackControls } from './wact-playback-controls.js';
import type { WACTGameContext } from './wact-game-context.js';

type SimState = 'config' | 'pregame' | 'playing' | 'paused' | 'postgame';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: sans-serif;
    }

    #game-sim__wrapper {
      margin-bottom: 3%;
    }

    /* Config view */
    #game-sim__config-view {
      display: block;
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
      color: yellow;
      background-color: #162267;
      border-radius: 8px;
      transition: all 100ms ease-in-out;
      padding: 8px;
      border: none;
      cursor: pointer;
    }

    #game-sim__start-button:hover {
      background-color: rgb(44, 63, 170);
    }

    #game-sim__start-button:active {
      background-color: rgb(71, 95, 231);
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
      background-color: rgba(0, 0, 0, 0.85);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      color: white;
    }

    #game-sim__winner-banner {
      font-size: 1.6em;
      font-weight: bold;
      margin-bottom: 8px;
    }

    #game-sim__final-score {
      font-size: 1.2em;
      color: #ccc;
      margin-bottom: 20px;
    }

    .game-sim__postgame-button {
      font-size: 1rem;
      padding: 8px 20px;
      margin: 6px;
      border: 2px solid #555;
      background-color: #162267;
      color: yellow;
      border-radius: 8px;
      cursor: pointer;
      transition: all 100ms ease-in-out;
    }

    .game-sim__postgame-button:hover {
      background-color: rgb(44, 63, 170);
      border-color: #ffd700;
    }

    /* Stats view */
    #game-sim__stats-view {
      display: none;
      background-color: #1a1a2e;
      border-radius: 8px;
      padding: 16px;
      color: white;
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
      border-bottom: 1px solid #333;
    }

    #game-sim__stats-table th {
      color: #ffd700;
    }

    #game-sim__stats-back-button {
      display: block;
      margin: 12px auto 0 auto;
      font-size: 0.9rem;
      padding: 6px 16px;
      border: 2px solid #555;
      background-color: #162267;
      color: yellow;
      border-radius: 8px;
      cursor: pointer;
      transition: all 100ms ease-in-out;
    }

    #game-sim__stats-back-button:hover {
      background-color: rgb(44, 63, 170);
      border-color: #ffd700;
    }

    @media only screen and (max-width: 600px) {
      #game-sim__game-layout {
        flex-direction: column;
      }
    }
  </style>
  <div id="game-sim__wrapper">
    <!-- Config view -->
    <div id="game-sim__config-view">
      <wact-matchup-config id="game-sim__matchup-config"></wact-matchup-config>
      <div id="game-sim__start-button-wrapper">
        <button id="game-sim__start-button">Start Game</button>
      </div>
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
            <button id="game-sim__summary-button" class="game-sim__postgame-button">Game Summary</button>
            <button id="game-sim__new-game-button" class="game-sim__postgame-button">Simulate New Game</button>
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
      <button id="game-sim__stats-back-button">Back</button>
    </div>
  </div>
`;

export class WACTGameSim extends HTMLElement {
  static readonly tagName = 'wact-game-sim' as const;

  readonly root: ShadowRoot;
  private simService: PlayByPlaySimService | null = null;
  private state: SimState = 'config';
  private playbackTimer: ReturnType<typeof setTimeout> | null = null;
  private playbackSpeed = 2;
  private matchupConfig: MatchupConfig | null = null;
  private lastDriveCount = 0;
  private lastHomePositiveDirection: boolean | null = null;

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

  private transitionTo(newState: SimState): void {
    this.state = newState;

    const configView = this.root.getElementById('game-sim__config-view') as HTMLDivElement;
    const gameView = this.root.getElementById('game-sim__game-view') as HTMLDivElement;
    const statsView = this.root.getElementById('game-sim__stats-view') as HTMLDivElement;
    const postgameOverlay = this.root.getElementById(
      'game-sim__postgame-overlay',
    ) as HTMLDivElement;
    const controls = this.root.getElementById('game-sim__controls') as WACTPlaybackControls;

    const gameRight = this.root.getElementById('game-sim__game-right') as HTMLDivElement;

    configView.style.display = 'none';
    gameView.style.display = 'none';
    statsView.style.display = 'none';
    postgameOverlay.style.display = 'none';
    gameRight.style.display = 'none';

    switch (newState) {
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

  private startGame(): void {
    if (!this.simService) {
      console.error('No simulation service configured for wact-game-sim.');
      return;
    }

    const matchupConfigEl = this.root.getElementById(
      'game-sim__matchup-config',
    ) as WACTMatchupConfig;
    this.matchupConfig = matchupConfigEl.matchupConfig;

    if (!this.simService.isReady()) {
      console.error('Simulation service not ready.');
      return;
    }

    const gameState = this.simService.createGame(this.matchupConfig);
    this.lastDriveCount = 0;

    this.setupScoreboard(gameState);
    this.setupField(gameState.context.home_positive_direction);

    const context = this.root.getElementById('game-sim__context') as WACTGameContext;
    context.scoreboard.setAttribute('status', 'Pregame');
    context.gameLog.clear();
    context.gameLog.setTeamLogos(this.matchupConfig!.home.logo, this.matchupConfig!.away.logo);

    this.transitionTo('pregame');
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
    this.lastDriveCount = 0;
    this.lastHomePositiveDirection = null;
    this.matchupConfig = null;
    this.transitionTo('config');
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

    // Start button
    const startButton = this.root.getElementById('game-sim__start-button') as HTMLButtonElement;
    startButton.addEventListener('click', () => this.startGame());

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
    const summaryButton = this.root.getElementById('game-sim__summary-button') as HTMLButtonElement;
    summaryButton.addEventListener('click', () => this.showStats());

    const newGameButton = this.root.getElementById(
      'game-sim__new-game-button',
    ) as HTMLButtonElement;
    newGameButton.addEventListener('click', () => this.newGame());

    // Stats back button
    const statsBackButton = this.root.getElementById(
      'game-sim__stats-back-button',
    ) as HTMLButtonElement;
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
