import { describe, it, expect, beforeAll } from 'vitest';
import { WACTNav } from '../../components/wact-nav.js';

describe('WACTNav', () => {
  let el: WACTNav;

  beforeAll(async () => {
    if (!customElements.get('wact-nav')) {
      customElements.define('wact-nav', WACTNav);
    }
    el = document.createElement('wact-nav') as WACTNav;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTNav.tagName).toBe('wact-nav');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain the navbar wrapper', () => {
    const navbar = el.root.getElementById('navbar-wrapper');
    expect(navbar).not.toBeNull();
    expect(navbar?.tagName.toLowerCase()).toBe('nav');
  });

  it('should contain a slot for content projection', () => {
    const slot = el.root.querySelector('slot');
    expect(slot).not.toBeNull();
  });
});
