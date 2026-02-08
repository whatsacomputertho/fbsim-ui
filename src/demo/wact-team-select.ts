import { WACTTeamSelect } from '../components/wact-team-select.js';

if (!customElements.get(WACTTeamSelect.tagName)) {
  customElements.define(WACTTeamSelect.tagName, WACTTeamSelect);
}
