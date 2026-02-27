export const SYS_MOTION_CSS = `
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
