import { WACTNav } from '../components/wact-nav.js';

if (!customElements.get(WACTNav.tagName)) {
  customElements.define(WACTNav.tagName, WACTNav);
}
