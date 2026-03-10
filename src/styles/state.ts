const REF_STATE_CSS = `
:host {
  --wact-ref-state-layer-opacity-disabled: 0.4;
  --wact-ref-state-layer-opacity-inactive: 0.45;
}
`;

const SYS_STATE_CSS = `
:host {
  --wact-sys-state-layer-opacity-disabled: var(--wact-ref-state-layer-opacity-disabled);
  --wact-sys-state-layer-opacity-inactive: var(--wact-ref-state-layer-opacity-inactive);
}
`;

export const STATE_CSS = REF_STATE_CSS + SYS_STATE_CSS;
