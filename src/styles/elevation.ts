const REF_ELEVATION_CSS = `
:host {
  /* Light-mode shadows */
  --wact-ref-elevation-level1:      0 2px 8px rgba(0, 0, 0, 0.15);
  --wact-ref-elevation-level2:      2px 2px 5px 2px rgba(0, 0, 0, 0.70);

  /* Dark-mode shadows (higher opacity so they remain visible on dark surfaces) */
  --wact-ref-elevation-level1-dark: 0 2px 8px rgba(0, 0, 0, 0.40);
  --wact-ref-elevation-level2-dark: 2px 2px 5px 2px rgba(0, 0, 0, 0.90);

  /* Negative z-index values */
  --wact-ref-layer-neg-1: -1;

  /* Positive z-index */
  --wact-ref-layer-1:     1;
  --wact-ref-layer-2:     2;
  --wact-ref-layer-3:     3;
  --wact-ref-layer-4:     4;
  --wact-ref-layer-5:     5;
  --wact-ref-layer-6:     6;
  --wact-ref-layer-7:     7;
  --wact-ref-layer-8:     8;
  --wact-ref-layer-9:     9;
  --wact-ref-layer-10:    10;
  --wact-ref-layer-100:   100;
  --wact-ref-layer-1000:  1000;
}
`;

const SYS_ELEVATION_CSS = `
:host {
  --wact-sys-elevation-level1: var(--wact-ref-elevation-level1);
  --wact-sys-elevation-level2: var(--wact-ref-elevation-level2);
  --wact-sys-zindex-dropdown: var(--wact-ref-layer-10);
  --wact-sys-zindex-overlay:  var(--wact-ref-layer-100);
  --wact-sys-zindex-sticky:   var(--wact-ref-layer-1000);
}

@media (prefers-color-scheme: dark) {
  :host {
    --wact-sys-elevation-level1: var(--wact-ref-elevation-level1-dark);
    --wact-sys-elevation-level2: var(--wact-ref-elevation-level2-dark);
  }
}
`;

export const ELEVATION_CSS = REF_ELEVATION_CSS + SYS_ELEVATION_CSS;
