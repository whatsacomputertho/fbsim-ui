import type { MatchupInput, SimService, SimResult } from '../services/types.js';
import type { WACTMatchupSelect } from './wact-matchup-select.js';
import type { WACTBoxScore } from './wact-box-score.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    #final-score-sim__sim-button-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #final-score-sim__sim-button {
      margin-top: 1%;
      width: 50%;
      font-size: 1.5rem;
      color: yellow;
      background-color: #162267;
      border-radius: 8px;
      transition: all 100ms ease-in-out;
    }

    #final-score-sim__sim-button:hover {
      background-color: rgb(44, 63, 170);
      cursor: pointer;
    }

    #final-score-sim__sim-button:active {
      background-color: rgb(71, 95, 231);
    }

    #final-score-sim__result-wrapper {
      display: none;
      margin-top: 1%;
    }

    #final-score-sim__wrapper {
      margin-bottom: 3%;
    }
  </style>
  <div id="final-score-sim__wrapper" class="final-score-sim__wrapper">
    <wact-matchup-select id="final-score-sim__select" class="final-score-sim__select"></wact-matchup-select>
    <div id="final-score-sim__sim-button-wrapper" class="final-score-sim__sim-button-wrapper">
      <button id="final-score-sim__sim-button" class="final-score-sim__sim-button">Simulate</button>
    </div>
    <div id="final-score-sim__result-wrapper" class="final-score-sim__result-wrapper">
      <wact-box-score id="final-score-sim__result" class="final-score-sim__result"></wact-box-score>
    </div>
  </div>
`;

export class WACTFinalScoreSim extends HTMLElement {
  static readonly tagName = 'wact-final-score-sim' as const;

  readonly root: ShadowRoot;
  private simService: SimService | null = null;

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

  setSimService(service: SimService): void {
    this.simService = service;
  }

  private getMatchup(): MatchupInput | null {
    const matchupSelect = this.root.getElementById(
      'final-score-sim__select',
    ) as WACTMatchupSelect | null;
    return matchupSelect?.matchup ?? null;
  }

  private async getBoxScore(): Promise<void> {
    if (!this.simService) {
      console.error('No simulation service configured for wact-final-score-sim.');
      return;
    }

    if (!this.simService.isReady()) {
      await this.simService.initialize();
    }

    const matchup = this.getMatchup();
    if (!matchup) {
      console.error('Matchup select not yet loaded');
      return;
    }

    try {
      const result = await this.simService.simulateGame(matchup);
      this.displayBoxScore(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  }

  private displayBoxScore(result: SimResult): void {
    const resultWrapper = this.root.getElementById(
      'final-score-sim__result-wrapper',
    ) as HTMLDivElement;
    resultWrapper.style.display = 'none';

    const matchupSelect = this.root.getElementById(
      'final-score-sim__select',
    ) as WACTMatchupSelect;
    const homeLogo = matchupSelect.homeLogo;
    const awayLogo = matchupSelect.awayLogo;

    const boxScore = this.root.getElementById('final-score-sim__result') as WACTBoxScore;
    boxScore.setAttribute('home-team', result.home_team);
    boxScore.setAttribute('away-team', result.away_team);
    boxScore.setAttribute('home-score', String(result.home_score));
    boxScore.setAttribute('away-score', String(result.away_score));
    boxScore.setAttribute('home-logo', homeLogo);
    boxScore.setAttribute('away-logo', awayLogo);

    resultWrapper.style.display = 'block';
  }

  connectedCallback(): void {
    if (this._initialized) return;
    this._initialized = true;
    const simButton = this.root.getElementById(
      'final-score-sim__sim-button',
    ) as HTMLButtonElement;
    simButton.addEventListener('click', () => void this.getBoxScore());
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
