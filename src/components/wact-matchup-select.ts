import type { MatchupInput } from '../services/types.js';
import type { WACTTeamSelect } from './wact-team-select.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    #matchup-select__wrapper {
      display: flex;
    }

    #matchup-select__home {
      width: 100%;
      padding-right: 1%;
    }

    #matchup-select__away {
      width: 100%;
      padding-left: 1%;
    }

    @media only screen and (max-width: 600px) {
      #matchup-select__wrapper {
        display: block;
      }
    }
  </style>
  <div id="matchup-select__wrapper" class="matchup-select__wrapper">
    <wact-team-select id="matchup-select__home" class="matchup-select__home"></wact-team-select>
    <wact-team-select away id="matchup-select__away" class="matchup-select__away"></wact-team-select>
  </div>
`;

export class WACTMatchupSelect extends HTMLElement {
  static readonly tagName = 'wact-matchup-select' as const;

  readonly root: ShadowRoot;

  private _readyPromise: Promise<void> | null = null;
  private _resolveReady: (() => void) | null = null;
  private _initialized = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.append(template.content.cloneNode(true));
  }

  get homeLogo(): string {
    return (this.root.getElementById('matchup-select__home') as WACTTeamSelect).logo;
  }

  get awayLogo(): string {
    return (this.root.getElementById('matchup-select__away') as WACTTeamSelect).logo;
  }

  get matchup(): MatchupInput {
    const home = (this.root.getElementById('matchup-select__home') as WACTTeamSelect).team;
    const away = (this.root.getElementById('matchup-select__away') as WACTTeamSelect).team;
    return { home, away };
  }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
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
