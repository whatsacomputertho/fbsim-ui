import type { MatchupConfig } from '../services/types.js';
import type { WACTTeamConfig } from './wact-team-config.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    #matchup-config__wrapper {
      display: flex;
    }

    #matchup-config__home {
      width: 100%;
      padding-right: 1%;
    }

    #matchup-config__away {
      width: 100%;
      padding-left: 1%;
    }

    @media only screen and (max-width: 600px) {
      #matchup-config__wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #matchup-config__home {
        padding-right: 0;
      }
      #matchup-config__away {
        padding-left: 0;
      }
    }
  </style>
  <div id="matchup-config__wrapper" class="matchup-config__wrapper">
    <wact-team-config id="matchup-config__home" class="matchup-config__home"></wact-team-config>
    <wact-team-config away id="matchup-config__away" class="matchup-config__away"></wact-team-config>
  </div>
`;

export class WACTMatchupConfig extends HTMLElement {
  static readonly tagName = 'wact-matchup-config' as const;

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
    return (this.root.getElementById('matchup-config__home') as WACTTeamConfig).logo;
  }

  get awayLogo(): string {
    return (this.root.getElementById('matchup-config__away') as WACTTeamConfig).logo;
  }

  get matchupConfig(): MatchupConfig {
    const home = (this.root.getElementById('matchup-config__home') as WACTTeamConfig).teamConfig;
    const away = (this.root.getElementById('matchup-config__away') as WACTTeamConfig).teamConfig;
    return { home, away };
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
