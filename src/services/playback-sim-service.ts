import type {
  PlayByPlaySimService,
  MatchupConfig,
  GameState,
  GameContext,
  Drive,
  DriveResult,
  OffensiveStats,
  SimResult,
  MatchupInput,
} from './types.js';
import type { GameFile } from './game-file.js';
import type { Play } from './types.js';

export class PlaybackSimService implements PlayByPlaySimService {
  private _drives: Drive[] = [];
  private _allPlays: Play[] = [];
  private _playDriveMap: number[] = [];
  private _finalContext: GameContext = null!;
  private _homeStats: OffensiveStats = null!;
  private _awayStats: OffensiveStats = null!;
  private _currentPlayGlobalIndex = -1;
  private _currentPlayIndexWithinDrive = -1;
  private _active = false;

  loadGame(gameFile: GameFile): GameState {
    this._drives = gameFile.drives;
    this._allPlays = [];
    this._playDriveMap = [];

    for (let i = 0; i < gameFile.drives.length; i++) {
      for (const play of gameFile.drives[i].plays) {
        this._allPlays.push(play);
        this._playDriveMap.push(i);
      }
    }

    this._finalContext = gameFile.finalContext;
    this._homeStats = gameFile.homeStats;
    this._awayStats = gameFile.awayStats;
    this._currentPlayGlobalIndex = -1;
    this._currentPlayIndexWithinDrive = -1;
    this._active = true;

    return {
      context: this._allPlays[0].context,
      latestPlay: undefined,
      driveCount: 0,
      playCount: 0,
      complete: false,
    };
  }

  createGame(_config: MatchupConfig): GameState {
    throw new Error('PlaybackSimService does not support createGame(). Use loadGame() instead.');
  }

  simPlay(): GameState {
    if (!this._active) {
      throw new Error('No active game. Call loadGame() first.');
    }

    const idx = this._currentPlayGlobalIndex + 1;
    if (idx >= this._allPlays.length) {
      throw new Error('Game is already complete.');
    }

    const driveIndex = this._playDriveMap[idx];
    const prevDriveIndex =
      this._currentPlayGlobalIndex >= 0 ? this._playDriveMap[this._currentPlayGlobalIndex] : -1;

    if (driveIndex !== prevDriveIndex) {
      this._currentPlayIndexWithinDrive = 0;
    } else {
      this._currentPlayIndexWithinDrive++;
    }

    this._currentPlayGlobalIndex = idx;

    const currentPlay = this._allPlays[idx];
    const isLast = idx === this._allPlays.length - 1;
    const afterContext = isLast ? this._finalContext : this._allPlays[idx + 1].context;

    return {
      context: afterContext,
      latestPlay: currentPlay,
      driveCount: driveIndex + 1,
      playCount: idx + 1,
      complete: isLast,
    };
  }

  simDrive(): GameState {
    if (!this._active) {
      throw new Error('No active game. Call loadGame() first.');
    }

    let state = this.simPlay();

    while (!state.complete) {
      const nextIdx = this._currentPlayGlobalIndex + 1;
      if (nextIdx >= this._allPlays.length) break;
      if (this._playDriveMap[nextIdx] !== this._playDriveMap[this._currentPlayGlobalIndex]) break;
      state = this.simPlay();
    }

    return state;
  }

  simRemainder(): GameState {
    if (!this._active) {
      throw new Error('No active game. Call loadGame() first.');
    }
    if (this._currentPlayGlobalIndex >= this._allPlays.length - 1) {
      throw new Error('Game is already complete.');
    }

    let state: GameState;
    do {
      state = this.simPlay();
    } while (this._currentPlayGlobalIndex < this._allPlays.length - 1);

    return state;
  }

  getDrive(index: number): Drive {
    const currentDriveIndex =
      this._currentPlayGlobalIndex >= 0 ? this._playDriveMap[this._currentPlayGlobalIndex] : -1;

    const isComplete = this._currentPlayGlobalIndex === this._allPlays.length - 1;

    if (isComplete || index < currentDriveIndex) {
      return this._drives[index];
    }

    if (index === currentDriveIndex) {
      return {
        ...this._drives[index],
        plays: this._drives[index].plays.slice(0, this._currentPlayIndexWithinDrive + 1),
        result: 'None' as DriveResult,
        complete: false,
      };
    }

    return this._drives[index];
  }

  getHomeStats(): OffensiveStats {
    return this._homeStats;
  }

  getAwayStats(): OffensiveStats {
    return this._awayStats;
  }

  destroyGame(): void {
    this._drives = [];
    this._allPlays = [];
    this._playDriveMap = [];
    this._currentPlayGlobalIndex = -1;
    this._currentPlayIndexWithinDrive = -1;
    this._active = false;
  }

  hasActiveGame(): boolean {
    return this._active;
  }

  isReady(): boolean {
    return true;
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async simulateGame(_matchup: MatchupInput): Promise<SimResult> {
    throw new Error('PlaybackSimService does not support simulateGame().');
  }
}
