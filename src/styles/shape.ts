const REF_SHAPE_CSS = `
:host {
  --wact-ref-shape-corner-micro:       2px;
  --wact-ref-shape-corner-extra-small: 4px;
  --wact-ref-shape-corner-small:       6px;
  --wact-ref-shape-corner-medium:      8px;
  --wact-ref-shape-corner-large:       12px;
  --wact-ref-shape-corner-full:        50%;
}
`;

const SYS_SHAPE_CSS = `
:host {
  --wact-sys-shape-corner-micro:       var(--wact-ref-shape-corner-micro);
  --wact-sys-shape-corner-extra-small: var(--wact-ref-shape-corner-extra-small);
  --wact-sys-shape-corner-small:       var(--wact-ref-shape-corner-small);
  --wact-sys-shape-corner-medium:      var(--wact-ref-shape-corner-medium);
  --wact-sys-shape-corner-large:       var(--wact-ref-shape-corner-large);
  --wact-sys-shape-corner-full:        var(--wact-ref-shape-corner-full);
}
`;

export const SHAPE_CSS = REF_SHAPE_CSS + SYS_SHAPE_CSS;
