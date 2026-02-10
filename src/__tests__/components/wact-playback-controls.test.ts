import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WACTPlaybackControls } from '../../components/wact-playback-controls.js';

describe('WACTPlaybackControls', () => {
  let el: WACTPlaybackControls;

  beforeEach(async () => {
    if (!customElements.get('wact-playback-controls')) {
      customElements.define('wact-playback-controls', WACTPlaybackControls);
    }
    el = document.createElement('wact-playback-controls') as WACTPlaybackControls;
    document.body.appendChild(el);
    await el.whenReady();
  });

  afterEach(() => {
    el.remove();
  });

  it('should have the correct tag name', () => {
    expect(WACTPlaybackControls.tagName).toBe('wact-playback-controls');
  });

  it('should create a shadow root', () => {
    expect(el.root).toBeDefined();
    expect(el.root.mode).toBe('open');
  });

  it('should dispatch play event when play button clicked', () => {
    const handler = vi.fn();
    el.addEventListener('play', handler);
    const button = el.root.getElementById('playback__play-pause') as HTMLButtonElement;
    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(el.playing).toBe(true);
  });

  it('should dispatch pause event when pause button clicked', () => {
    el.playing = true;
    const handler = vi.fn();
    el.addEventListener('pause', handler);
    const button = el.root.getElementById('playback__play-pause') as HTMLButtonElement;
    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(el.playing).toBe(false);
  });

  it('should cycle through speeds on speed button click', () => {
    const handler = vi.fn();
    el.addEventListener('speed-change', handler);
    const button = el.root.getElementById('playback__speed') as HTMLButtonElement;

    // Default is 2x (index 1), clicking should go to 4x
    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(button.textContent).toBe('4x');

    // Click again should go to 1x
    button.click();
    expect(button.textContent).toBe('1x');

    // Click again should go to 2x
    button.click();
    expect(button.textContent).toBe('2x');
  });

  it('should dispatch skip-to-end event', () => {
    const handler = vi.fn();
    el.addEventListener('skip-to-end', handler);
    const button = el.root.getElementById('playback__skip') as HTMLButtonElement;
    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when disabled attribute is set', () => {
    el.disabled = true;
    const buttons = el.root.querySelectorAll('.playback__button') as NodeListOf<HTMLButtonElement>;
    for (const button of buttons) {
      expect(button.disabled).toBe(true);
    }
  });

  it('should enable buttons when disabled attribute is removed', () => {
    el.disabled = true;
    el.disabled = false;
    const buttons = el.root.querySelectorAll('.playback__button') as NodeListOf<HTMLButtonElement>;
    for (const button of buttons) {
      expect(button.disabled).toBe(false);
    }
  });

  it('should have default speed of 2x', () => {
    expect(el.speed).toBe(2);
  });

  it('should update play/pause button text based on playing state', () => {
    const button = el.root.getElementById('playback__play-pause') as HTMLButtonElement;
    expect(button.title).toBe('Play');

    el.playing = true;
    expect(button.title).toBe('Pause');

    el.playing = false;
    expect(button.title).toBe('Play');
  });
});
