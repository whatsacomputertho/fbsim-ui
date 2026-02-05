import { describe, it, expect } from 'vitest';
import { WACTFeedbackRibbon } from '../../components/wact-feedback-ribbon.js';

describe('WACTFeedbackRibbon', () => {
  let el: WACTFeedbackRibbon;

  beforeEach(async () => {
    if (!customElements.get('wact-feedback-ribbon')) {
      customElements.define('wact-feedback-ribbon', WACTFeedbackRibbon);
    }
    el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  })

  it('should have the correct tag name', () => {
    expect(WACTFeedbackRibbon.tagName).toBe('wact-feedback-ribbon');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should hide progress bar by default (no duration)', () => {
    const progressBar = el.root.getElementById('progress-bar') as HTMLDivElement;
    const progressBarWrapper = el.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    expect(progressBar.style.display).toBe('none');
    expect(progressBarWrapper.style.display).toBe('none');
  });

  it('should hide remove button by default (no removable attr)', () => {
    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    expect(removeButton.style.display).toBe('none');
  });

  it('should show remove button when removable attribute is set', () => {
    el.removable = true;
    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    expect(removeButton.style.display).toBe('block');
  });

  it('should update sidebar and progress bar color when color attribute changes', () => {
    el.color = 'blue';
    const sidebar = el.root.getElementById('color-sidebar') as HTMLDivElement;
    const progressbar = el.root.getElementById('progress-bar') as HTMLDivElement;
    expect(sidebar.style.backgroundColor).toBe('blue');
    expect(progressbar.style.backgroundColor).toBe('blue');
  });

  it('should toggle dark mode class names', () => {
    el.dark = true;
    const ribbonWrapper = el.root.getElementById('ribbon-wrapper') as HTMLDivElement;
    expect(ribbonWrapper.getAttribute('class')).toContain('-dark');

    el.dark = false;
    expect(ribbonWrapper.getAttribute('class')).not.toContain('-dark');
  });

  it('should show progress bar when duration is set', () => {
    el.duration = 10;
    const progressBarWrapper = el.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    expect(progressBarWrapper.style.display).toBe('block');
  });

  it('should remove element when remove button is clicked', () => {
    el.removable = true;
    expect(document.body.contains(el)).toBe(true);

    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    removeButton.click();

    expect(document.body.contains(el)).toBe(false);
  });
});
