const REF_MOTION_CSS = `
:host {
  --wact-ref-motion-duration-short1:  150ms;
  --wact-ref-motion-duration-short2:  200ms;
  --wact-ref-motion-duration-medium1: 300ms;
  --wact-ref-motion-duration-medium2: 400ms;
  --wact-ref-motion-duration-long1:   600ms;
  --wact-ref-motion-duration-long2:   1000ms;
  --wact-ref-motion-duration-long3:   1200ms;
  --wact-ref-motion-easing-standard:  ease;
  --wact-ref-motion-easing-linear:    linear;
}
`;

const SYS_MOTION_CSS = `
:host {
  --wact-sys-motion-duration-short1:  var(--wact-ref-motion-duration-short1);
  --wact-sys-motion-duration-short2:  var(--wact-ref-motion-duration-short2);
  --wact-sys-motion-duration-medium1: var(--wact-ref-motion-duration-medium1);
  --wact-sys-motion-duration-medium2: var(--wact-ref-motion-duration-medium2);
  --wact-sys-motion-duration-long1:   var(--wact-ref-motion-duration-long1);
  --wact-sys-motion-duration-long2:   var(--wact-ref-motion-duration-long2);
  --wact-sys-motion-duration-long3:   var(--wact-ref-motion-duration-long3);
  --wact-sys-motion-easing-standard:  var(--wact-ref-motion-easing-standard);
  --wact-sys-motion-easing-linear:    var(--wact-ref-motion-easing-linear);
}

/* Users who prefer reduced motion get near-instant transitions */
@media (prefers-reduced-motion: reduce) {
  :host {
    --wact-sys-motion-duration-short1:  1ms;
    --wact-sys-motion-duration-short2:  1ms;
    --wact-sys-motion-duration-medium1: 1ms;
    --wact-sys-motion-duration-medium2: 1ms;
    --wact-sys-motion-duration-long1:   1ms;
    --wact-sys-motion-duration-long2:   1ms;
    --wact-sys-motion-duration-long3:   1ms;
  }
}
`;

export const MOTION_CSS = REF_MOTION_CSS + SYS_MOTION_CSS;
