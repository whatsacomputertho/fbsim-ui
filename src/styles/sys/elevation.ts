export const SYS_ELEVATION_CSS = `
:host {
  --wact-sys-elevation-level1: var(--wact-ref-elevation-level1);
  --wact-sys-elevation-level2: var(--wact-ref-elevation-level2);
}

@media (prefers-color-scheme: dark) {
  :host {
    --wact-sys-elevation-level1: var(--wact-ref-elevation-level1-dark);
    --wact-sys-elevation-level2: var(--wact-ref-elevation-level2-dark);
  }
}
`;
