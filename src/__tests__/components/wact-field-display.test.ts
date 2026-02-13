import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WACTFieldDisplay } from '../../components/wact-field-display.js';

describe('WACTFieldDisplay', () => {
  let el: WACTFieldDisplay;

  beforeEach(async () => {
    if (!customElements.get('wact-field-display')) {
      customElements.define('wact-field-display', WACTFieldDisplay);
    }
    el = document.createElement('wact-field-display') as WACTFieldDisplay;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTFieldDisplay.tagName).toBe('wact-field-display');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should render yard lines', () => {
    const lines = el.root.querySelectorAll('.field__yard-line');
    expect(lines.length).toBe(9);
  });

  it('should render yard labels', () => {
    const labels = el.root.querySelectorAll('.field__yard-label');
    expect(labels.length).toBe(9);
    expect(labels[4].textContent).toBe('50');
  });

  it('should show ball marker when setBallPosition is called', () => {
    el.setBallPosition(50, true);
    const marker = el.root.getElementById('field__ball-marker') as HTMLDivElement;
    expect(marker.style.display).toBe('block');
    expect(marker.style.left).toBe('50%');
  });

  it('should show first down line when setFirstDownLine is called', () => {
    el.setFirstDownLine(35);
    const line = el.root.getElementById('field__first-down-line') as HTMLDivElement;
    expect(line.style.display).toBe('block');
    expect(line.style.left).toBe('35%');
  });

  it('should hide first down line for end zone yard lines', () => {
    el.setFirstDownLine(0);
    const line = el.root.getElementById('field__first-down-line') as HTMLDivElement;
    expect(line.style.display).toBe('none');
  });

  it('should clear all overlays', () => {
    el.setBallPosition(50, true);
    el.setFirstDownLine(60);
    el.clear();
    const marker = el.root.getElementById('field__ball-marker') as HTMLDivElement;
    const line = el.root.getElementById('field__first-down-line') as HTMLDivElement;
    expect(marker.style.display).toBe('none');
    expect(line.style.display).toBe('none');
  });

  it('should update endzone colors when attributes change', () => {
    el.setAttribute('home-color', '#ff0000');
    const homeEndzone = el.root.getElementById('field__endzone-home') as HTMLDivElement;
    expect(homeEndzone.style.backgroundColor).toBe('#ff0000');

    el.setAttribute('away-color', '#0000ff');
    const awayEndzone = el.root.getElementById('field__endzone-away') as HTMLDivElement;
    expect(awayEndzone.style.backgroundColor).toBe('#0000ff');
  });

  it('should have observedAttributes for home-color and away-color', () => {
    expect(WACTFieldDisplay.observedAttributes).toContain('home-color');
    expect(WACTFieldDisplay.observedAttributes).toContain('away-color');
  });
});
