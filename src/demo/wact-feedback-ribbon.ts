import { WACTFeedbackRibbon } from '../components/wact-feedback-ribbon.js';

if (!customElements.get(WACTFeedbackRibbon.tagName)) {
  customElements.define(WACTFeedbackRibbon.tagName, WACTFeedbackRibbon);
}
