import { describe, it, expect, beforeAll } from 'vitest';
import { WACTNav } from '../../components/wact-nav.js';

describe('WACTNav', () => {
  beforeAll(() => {
    if (!customElements.get('wact-nav')) {
      customElements.define('wact-nav', WACTNav);
    }
  });

  it('should have the correct tag name', () => {
    expect(WACTNav.tagName).toBe('wact-nav');
  });

  it('should create a shadow root', () => {
    const el = document.createElement('wact-nav') as WACTNav;
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should contain the navbar wrapper', () => {
    const el = document.createElement('wact-nav') as WACTNav;
    const navbar = el.root.getElementById('navbar-wrapper');
    expect(navbar).not.toBeNull();
    expect(navbar?.tagName.toLowerCase()).toBe('nav');
  });

  it('should contain a slot for content projection', () => {
    const el = document.createElement('wact-nav') as WACTNav;
    const slot = el.root.querySelector('slot');
    expect(slot).not.toBeNull();
  });
});
