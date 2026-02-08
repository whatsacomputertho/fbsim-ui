import { WACTBoxScore } from '../components/wact-box-score.js';

if (!customElements.get(WACTBoxScore.tagName)) {
  customElements.define(WACTBoxScore.tagName, WACTBoxScore);
}
