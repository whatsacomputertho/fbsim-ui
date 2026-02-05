import { describe, it, expect, beforeAll } from 'vitest';
import { WACTFeedbackRibbon } from '../../components/wact-feedback-ribbon.js';

describe('WACTFeedbackRibbon', () => {
  beforeAll(() => {
    if (!customElements.get('wact-feedback-ribbon')) {
      customElements.define('wact-feedback-ribbon', WACTFeedbackRibbon);
    }
  });

  it('should have the correct tag name', () => {
    expect(WACTFeedbackRibbon.tagName).toBe('wact-feedback-ribbon');
  });

  it('should create a shadow root', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should hide progress bar by default (no duration)', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    const progressBar = el.root.getElementById('progress-bar') as HTMLDivElement;
    const progressBarWrapper = el.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    expect(progressBar.style.display).toBe('none');
    expect(progressBarWrapper.style.display).toBe('none');
  });

  it('should hide remove button by default (no removable attr)', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    expect(removeButton.style.display).toBe('none');
  });

  it('should show remove button when removable attribute is set', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);

    el.removable = true;
    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    expect(removeButton.style.display).toBe('block');

    el.remove();
  });

  it('should update sidebar and progress bar color when color attribute changes', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);

    el.color = 'blue';
    const sidebar = el.root.getElementById('color-sidebar') as HTMLDivElement;
    const progressbar = el.root.getElementById('progress-bar') as HTMLDivElement;
    expect(sidebar.style.backgroundColor).toBe('blue');
    expect(progressbar.style.backgroundColor).toBe('blue');

    el.remove();
  });

  it('should toggle dark mode class names', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);

    el.dark = true;
    const ribbonWrapper = el.root.getElementById('ribbon-wrapper') as HTMLDivElement;
    expect(ribbonWrapper.getAttribute('class')).toContain('-dark');

    el.dark = false;
    expect(ribbonWrapper.getAttribute('class')).not.toContain('-dark');

    el.remove();
  });

  it('should remove element when remove button is clicked', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);

    el.removable = true;
    expect(document.body.contains(el)).toBe(true);

    const removeButton = el.root.getElementById('remove-button') as HTMLButtonElement;
    removeButton.click();

    expect(document.body.contains(el)).toBe(false);
  });

  it('should show progress bar when duration is set', () => {
    const el = document.createElement('wact-feedback-ribbon') as WACTFeedbackRibbon;
    document.body.appendChild(el);

    el.duration = 10;
    const progressBarWrapper = el.root.getElementById('progress-bar-wrapper') as HTMLDivElement;
    expect(progressBarWrapper.style.display).toBe('block');

    el.remove();
  });
});
