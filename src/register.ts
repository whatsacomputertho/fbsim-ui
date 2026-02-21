import { WACTButton } from './components/wact-button.js';
import { WACTNav } from './components/wact-nav.js';
import { WACTTeamSelect } from './components/wact-team-select.js';
import { WACTMatchupSelect } from './components/wact-matchup-select.js';
import { WACTBoxScore } from './components/wact-box-score.js';
import { WACTFinalScoreSim } from './components/wact-final-score-sim.js';
import { WACTFeedbackRibbon } from './components/wact-feedback-ribbon.js';
import { WACTScoreboard } from './components/wact-scoreboard.js';
import { WACTGameLog } from './components/wact-game-log.js';
import { WACTFieldDisplay } from './components/wact-field-display.js';
import { WACTPlaybackControls } from './components/wact-playback-controls.js';
import { WACTTeamConfig } from './components/wact-team-config.js';
import { WACTMatchupConfig } from './components/wact-matchup-config.js';
import { WACTGameContext } from './components/wact-game-context.js';
import { WACTGameSim } from './components/wact-game-sim.js';

const components = [
  WACTButton,
  WACTNav,
  WACTTeamSelect,
  WACTMatchupSelect,
  WACTBoxScore,
  WACTFinalScoreSim,
  WACTFeedbackRibbon,
  WACTScoreboard,
  WACTGameLog,
  WACTFieldDisplay,
  WACTPlaybackControls,
  WACTTeamConfig,
  WACTMatchupConfig,
  WACTGameContext,
  WACTGameSim,
] as const;

for (const Component of components) {
  if (!customElements.get(Component.tagName)) {
    customElements.define(Component.tagName, Component);
  }
}
