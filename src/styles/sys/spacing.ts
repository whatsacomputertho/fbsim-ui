export const SYS_SPACING_CSS = `
:host {
  --wact-sys-spacing-xs:  var(--wact-ref-spacing-xs);
  --wact-sys-spacing-sm:  var(--wact-ref-spacing-sm);
  --wact-sys-spacing-md:  var(--wact-ref-spacing-md);
  --wact-sys-spacing-lg:  var(--wact-ref-spacing-lg);
  --wact-sys-spacing-xl:  var(--wact-ref-spacing-xl);
  --wact-sys-spacing-2xl: var(--wact-ref-spacing-2xl);
  --wact-sys-spacing-3xl: var(--wact-ref-spacing-3xl);
}

/* Tablet and up: slightly more generous spacing */
@media only screen and (min-width: 768px) {
  :host {
    --wact-sys-spacing-xl:  22px;
    --wact-sys-spacing-2xl: 28px;
    --wact-sys-spacing-3xl: 48px;
  }
}

/* Desktop: full-density spacing */
@media only screen and (min-width: 1024px) {
  :host {
    --wact-sys-spacing-xl:  24px;
    --wact-sys-spacing-2xl: 32px;
    --wact-sys-spacing-3xl: 56px;
  }
}
`;
