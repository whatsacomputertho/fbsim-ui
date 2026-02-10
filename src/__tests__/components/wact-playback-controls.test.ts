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

  it('should dispatch speed-change event when speed option is clicked', () => {
    const handler = vi.fn();
    el.addEventListener('speed-change', handler);
    const menu = el.root.getElementById('playback__speed-menu') as HTMLDivElement;
    const options = menu.querySelectorAll(
      '.playback__speed-option',
    ) as NodeListOf<HTMLButtonElement>;

    // Click 5x option (index 2)
    options[2].click();
    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toBe(5);

    const display = el.root.getElementById('playback__speed-display') as HTMLButtonElement;
    expect(display.textContent).toBe('5x');
  });

  it('should render speed menu with correct options', () => {
    const menu = el.root.getElementById('playback__speed-menu') as HTMLDivElement;
    const options = menu.querySelectorAll(
      '.playback__speed-option',
    ) as NodeListOf<HTMLButtonElement>;
    expect(options.length).toBe(5);
    expect(options[0].textContent).toBe('1x');
    expect(options[1].textContent).toBe('2x');
    expect(options[2].textContent).toBe('5x');
    expect(options[3].textContent).toBe('10x');
    expect(options[4].textContent).toBe('100x');
  });

  it('should highlight the active speed option', () => {
    const menu = el.root.getElementById('playback__speed-menu') as HTMLDivElement;
    const options = menu.querySelectorAll(
      '.playback__speed-option',
    ) as NodeListOf<HTMLButtonElement>;
    // Default is 2x (index 1)
    expect(options[1].classList.contains('playback__speed-option--active')).toBe(true);
    expect(options[0].classList.contains('playback__speed-option--active')).toBe(false);
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
    const speedDisplay = el.root.getElementById('playback__speed-display') as HTMLButtonElement;
    expect(speedDisplay.disabled).toBe(true);
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
