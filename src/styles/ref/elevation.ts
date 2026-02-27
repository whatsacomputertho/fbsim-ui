export const REF_ELEVATION_CSS = `
:host {
  /* Light-mode shadows */
  --wact-ref-elevation-level1:      0 2px 8px rgba(0, 0, 0, 0.15);
  --wact-ref-elevation-level2:      2px 2px 5px 2px rgba(0, 0, 0, 0.70);

  /* Dark-mode shadows (higher opacity so they remain visible on dark surfaces) */
  --wact-ref-elevation-level1-dark: 0 2px 8px rgba(0, 0, 0, 0.40);
  --wact-ref-elevation-level2-dark: 2px 2px 5px 2px rgba(0, 0, 0, 0.90);
}
`;
