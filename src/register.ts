import { WACTNav } from './components/wact-nav.js';
import { WACTTeamSelect } from './components/wact-team-select.js';
import { WACTMatchupSelect } from './components/wact-matchup-select.js';
import { WACTBoxScore } from './components/wact-box-score.js';
import { WACTGameSim } from './components/wact-game-sim.js';
import { WACTFeedbackRibbon } from './components/wact-feedback-ribbon.js';

const components = [
  WACTNav,
  WACTTeamSelect,
  WACTMatchupSelect,
  WACTBoxScore,
  WACTGameSim,
  WACTFeedbackRibbon,
] as const;

for (const Component of components) {
  if (!customElements.get(Component.tagName)) {
    customElements.define(Component.tagName, Component);
  }
}
