export const SYS_COLOR_CSS = `
:host {
  /* Navigation */
  --wact-sys-color-nav:                     var(--wact-ref-palette-primary28);

  /* Page / Background */
  --wact-sys-color-background:              var(--wact-ref-palette-primary99);
  --wact-sys-color-on-background:           var(--wact-ref-palette-primary20);

  /* Surface */
  --wact-sys-color-surface:                 var(--wact-ref-palette-primary95);
  --wact-sys-color-surface-raised:          var(--wact-ref-palette-primary91);
  --wact-sys-color-surface-recessed:        var(--wact-ref-palette-primary84);
  --wact-sys-color-surface-container-hover: var(--wact-ref-palette-primary93);
  --wact-sys-color-on-surface:              var(--wact-ref-palette-primary20);
  --wact-sys-color-on-surface-variant:      var(--wact-ref-palette-neutral34);
  --wact-sys-color-on-surface-muted:        var(--wact-ref-palette-neutral60);

  /* Interactive (neutral buttons, speed controls) */
  --wact-sys-color-interactive:             var(--wact-ref-palette-primary88);
  --wact-sys-color-interactive-hover:       var(--wact-ref-palette-primary84);
  --wact-sys-color-interactive-active:      var(--wact-ref-palette-primary79);

  /* Primary action (accent buttons) */
  --wact-sys-color-primary:                 var(--wact-ref-palette-primary40);
  --wact-sys-color-primary-hover:           var(--wact-ref-palette-primary50);
  --wact-sys-color-primary-active:          var(--wact-ref-palette-primary60);
  --wact-sys-color-on-primary:              var(--wact-ref-palette-primary99);

  /* Tertiary (gold/highlight/possession) */
  --wact-sys-color-tertiary:                var(--wact-ref-palette-tertiary40);
  --wact-sys-color-tertiary-status:         var(--wact-ref-palette-tertiary36);
  --wact-sys-color-on-tertiary:             var(--wact-ref-palette-primary20);

  /* Destructive */
  --wact-sys-color-destructive:             var(--wact-ref-palette-error40);
  --wact-sys-color-destructive-hover:       var(--wact-ref-palette-error30);
  --wact-sys-color-destructive-active:      var(--wact-ref-palette-error20);
  --wact-sys-color-on-destructive:          var(--wact-ref-palette-primary99);

  /* Error */
  --wact-sys-color-error:                   var(--wact-ref-palette-error40);
  --wact-sys-color-error-container:         var(--wact-ref-palette-error90);
  --wact-sys-color-on-error-container:      var(--wact-ref-palette-error40);

  /* Outline / Borders */
  --wact-sys-color-outline:                 var(--wact-ref-palette-neutral80);
  --wact-sys-color-outline-variant:         var(--wact-ref-palette-neutral74);
  --wact-sys-color-outline-field:           var(--wact-ref-palette-neutral60);
  --wact-sys-color-outline-card:            var(--wact-ref-palette-primary82);

  /* Feedback Ribbon */
  --wact-sys-color-feedback:                var(--wact-ref-palette-neutral83);
  --wact-sys-color-feedback-progress:       var(--wact-ref-palette-neutral75);
  --wact-sys-color-feedback-accent:         var(--wact-ref-palette-error38);

  /* Tooltip */
  --wact-sys-color-tooltip-container:       var(--wact-ref-palette-neutral34);
  --wact-sys-color-on-tooltip:              var(--wact-ref-palette-primary99);

  /* Overlay */
  --wact-sys-color-overlay:                 rgba(0, 0, 0, 0.7);

  /* Field */
  --wact-sys-color-field:                   var(--wact-ref-palette-field40);
}

@media (prefers-color-scheme: dark) {
  :host {
    --wact-sys-color-nav:                     var(--wact-ref-palette-primary5);
    --wact-sys-color-background:              var(--wact-ref-palette-primary10);
    --wact-sys-color-on-background:           var(--wact-ref-palette-primary99);
    --wact-sys-color-surface:                 var(--wact-ref-palette-primary20);
    --wact-sys-color-surface-raised:          var(--wact-ref-palette-primary20);
    --wact-sys-color-surface-recessed:        var(--wact-ref-palette-primary17);
    --wact-sys-color-surface-container-hover: var(--wact-ref-palette-primary23);
    --wact-sys-color-on-surface:              var(--wact-ref-palette-primary99);
    --wact-sys-color-on-surface-variant:      var(--wact-ref-palette-neutral80);
    --wact-sys-color-on-surface-muted:        var(--wact-ref-palette-neutral40);
    --wact-sys-color-interactive:             var(--wact-ref-palette-primary32);
    --wact-sys-color-interactive-hover:       var(--wact-ref-palette-primary43);
    --wact-sys-color-interactive-active:      var(--wact-ref-palette-primary47);
    --wact-sys-color-primary:                 var(--wact-ref-palette-primary30);
    --wact-sys-color-primary-hover:           var(--wact-ref-palette-primary35);
    --wact-sys-color-primary-active:          var(--wact-ref-palette-primary45);
    --wact-sys-color-tertiary:                var(--wact-ref-palette-tertiary82);
    --wact-sys-color-tertiary-status:         var(--wact-ref-palette-tertiary82);
    --wact-sys-color-destructive:             var(--wact-ref-palette-error25);
    --wact-sys-color-destructive-hover:       var(--wact-ref-palette-error30);
    --wact-sys-color-destructive-active:      var(--wact-ref-palette-error40);
    --wact-sys-color-error:                   var(--wact-ref-palette-error70);
    --wact-sys-color-error-container:         var(--wact-ref-palette-error10);
    --wact-sys-color-on-error-container:      var(--wact-ref-palette-error70);
    --wact-sys-color-outline:                 var(--wact-ref-palette-neutral20);
    --wact-sys-color-outline-variant:         var(--wact-ref-palette-neutral20);
    --wact-sys-color-outline-field:           var(--wact-ref-palette-neutral27);
    --wact-sys-color-outline-card:            var(--wact-ref-palette-primary37);
    --wact-sys-color-feedback:                var(--wact-ref-palette-neutral16);
    --wact-sys-color-feedback-progress:       var(--wact-ref-palette-neutral22);
    --wact-sys-color-tooltip-container:       var(--wact-ref-palette-neutral20);
  }
}
`;
