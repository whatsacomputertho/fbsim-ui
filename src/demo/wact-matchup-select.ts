import { WACTTeamSelect } from '../components/wact-team-select.js';
import { WACTMatchupSelect } from '../components/wact-matchup-select.js';

if (!customElements.get(WACTTeamSelect.tagName)) {
  customElements.define(WACTTeamSelect.tagName, WACTTeamSelect);
}
if (!customElements.get(WACTMatchupSelect.tagName)) {
  customElements.define(WACTMatchupSelect.tagName, WACTMatchupSelect);
}
