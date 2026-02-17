import { WACTButton } from '../components/wact-button.js';
import { WACTFeedbackRibbon } from '../components/wact-feedback-ribbon.js';

if (!customElements.get(WACTButton.tagName)) {
  customElements.define(WACTButton.tagName, WACTButton);
}
if (!customElements.get(WACTFeedbackRibbon.tagName)) {
  customElements.define(WACTFeedbackRibbon.tagName, WACTFeedbackRibbon);
}
