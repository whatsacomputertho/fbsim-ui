export const SYS_COLOR_CSS = `
:host {
  /* Navigation */
  --wact-sys-color-nav:                            var(--wact-ref-palette-primary28);

  /* Page / Background */
  --wact-sys-color-background:                     var(--wact-ref-palette-primary99);
  --wact-sys-color-on-background:                  var(--wact-ref-palette-primary20);

  /* Surface */
  --wact-sys-color-surface:                        var(--wact-ref-palette-primary95);
  --wact-sys-color-surface-raised:                 var(--wact-ref-palette-primary91);
  --wact-sys-color-surface-recessed:               var(--wact-ref-palette-primary84);
  --wact-sys-color-surface-container-hover:        var(--wact-ref-palette-primary93);
  --wact-sys-color-on-surface:                     var(--wact-ref-palette-primary20);
  --wact-sys-color-on-surface-variant:             var(--wact-ref-palette-neutral34);
  --wact-sys-color-on-surface-muted:               var(--wact-ref-palette-neutral60);

  /* Image / logo overlays */
  --wact-sys-color-surface-image-overlay-heavy:    var(--wact-ref-palette-transparent70);
  --wact-sys-color-surface-image-overlay-medium:   var(--wact-ref-palette-transparent50);
  --wact-sys-color-surface-image-overlay-light:    var(--wact-ref-palette-transparent20);
  --wact-sys-color-on-image-overlay:               var(--wact-ref-palette-primary99);

  /* Interactive (neutral buttons, speed controls) */
  --wact-sys-color-interactive:                    var(--wact-ref-palette-primary88);
  --wact-sys-color-interactive-hover:              var(--wact-ref-palette-primary84);
  --wact-sys-color-interactive-active:             var(--wact-ref-palette-primary79);

  /* Primary action (accent buttons) */
  --wact-sys-color-primary:                        var(--wact-ref-palette-primary40);
  --wact-sys-color-primary-hover:                  var(--wact-ref-palette-primary50);
  --wact-sys-color-primary-active:                 var(--wact-ref-palette-primary60);
  --wact-sys-color-on-primary:                     var(--wact-ref-palette-primary99);

  /* Tertiary (gold/highlight/possession) */
  --wact-sys-color-tertiary:                       var(--wact-ref-palette-tertiary40);
  --wact-sys-color-tertiary-status:                var(--wact-ref-palette-tertiary36);
  --wact-sys-color-on-tertiary:                    var(--wact-ref-palette-primary20);

  /* Destructive */
  --wact-sys-color-destructive:                    var(--wact-ref-palette-error40);
  --wact-sys-color-destructive-hover:              var(--wact-ref-palette-error30);
  --wact-sys-color-destructive-active:             var(--wact-ref-palette-error20);
  --wact-sys-color-on-destructive:                 var(--wact-ref-palette-primary99);

  /* Error */
  --wact-sys-color-error:                          var(--wact-ref-palette-error40);
  --wact-sys-color-error-container:                var(--wact-ref-palette-error90);
  --wact-sys-color-on-error-container:             var(--wact-ref-palette-error40);

  /* Outline / Borders */
  --wact-sys-color-outline:                        var(--wact-ref-palette-neutral80);
  --wact-sys-color-outline-variant:                var(--wact-ref-palette-neutral74);
  --wact-sys-color-outline-field:                  var(--wact-ref-palette-neutral60);
  --wact-sys-color-outline-card:                   var(--wact-ref-palette-primary82);

  /* Feedback Ribbon */
  --wact-sys-color-feedback:                       var(--wact-ref-palette-neutral83);
  --wact-sys-color-feedback-progress:              var(--wact-ref-palette-neutral75);
  --wact-sys-color-feedback-accent:                var(--wact-ref-palette-error38);

  /* Tooltip */
  --wact-sys-color-tooltip-container:              var(--wact-ref-palette-neutral34);
  --wact-sys-color-on-tooltip:                     var(--wact-ref-palette-primary99);

  /* Overlay (generic dark scrim) */
  --wact-sys-color-overlay:                        var(--wact-ref-palette-transparent70);

  /* Field */
  --wact-sys-color-field:                          var(--wact-ref-palette-field40);
  --wact-sys-color-on-field:                       var(--wact-ref-palette-field-on);
  --wact-sys-color-field-line:                     var(--wact-ref-palette-field-line);
  --wact-sys-color-field-label:                    var(--wact-ref-palette-field-label);

  /* Ball */
  --wact-sys-color-ball:                           var(--wact-ref-palette-ball60);
  --wact-sys-color-on-ball:                        var(--wact-ref-palette-ball-outline);

  /* Game result states (win / lose / tie) */
  --wact-sys-color-win-overlay:                    var(--wact-ref-palette-success-overlay);
  --wact-sys-color-win-outline:                    var(--wact-ref-palette-success-border);
  --wact-sys-color-lose-overlay:                   var(--wact-ref-palette-defeat-overlay);
  --wact-sys-color-lose-outline:                   var(--wact-ref-palette-defeat-border);
  --wact-sys-color-tie-overlay:                    var(--wact-ref-palette-transparent70);
  --wact-sys-color-tie-outline:                    var(--wact-ref-palette-neutral50);

  /* Transparent */
  --wact-sys-color-transparent:                    var(--wact-ref-palette-transparent0);
}

/* ── Dark mode ─────────────────────────────────────────────────────────────── */
@media (prefers-color-scheme: dark) {
  :host {
    --wact-sys-color-nav:                            var(--wact-ref-palette-primary5);
    --wact-sys-color-background:                     var(--wact-ref-palette-primary10);
    --wact-sys-color-on-background:                  var(--wact-ref-palette-primary99);
    --wact-sys-color-surface:                        var(--wact-ref-palette-primary20);
    --wact-sys-color-surface-raised:                 var(--wact-ref-palette-primary20);
    --wact-sys-color-surface-recessed:               var(--wact-ref-palette-primary17);
    --wact-sys-color-surface-container-hover:        var(--wact-ref-palette-primary23);
    --wact-sys-color-on-surface:                     var(--wact-ref-palette-primary99);
    --wact-sys-color-on-surface-variant:             var(--wact-ref-palette-neutral80);
    --wact-sys-color-on-surface-muted:               var(--wact-ref-palette-neutral40);
    --wact-sys-color-interactive:                    var(--wact-ref-palette-primary32);
    --wact-sys-color-interactive-hover:              var(--wact-ref-palette-primary43);
    --wact-sys-color-interactive-active:             var(--wact-ref-palette-primary47);
    --wact-sys-color-primary:                        var(--wact-ref-palette-primary30);
    --wact-sys-color-primary-hover:                  var(--wact-ref-palette-primary35);
    --wact-sys-color-primary-active:                 var(--wact-ref-palette-primary45);
    --wact-sys-color-tertiary:                       var(--wact-ref-palette-tertiary82);
    --wact-sys-color-tertiary-status:                var(--wact-ref-palette-tertiary82);
    --wact-sys-color-destructive:                    var(--wact-ref-palette-error25);
    --wact-sys-color-destructive-hover:              var(--wact-ref-palette-error30);
    --wact-sys-color-destructive-active:             var(--wact-ref-palette-error40);
    --wact-sys-color-error:                          var(--wact-ref-palette-error70);
    --wact-sys-color-error-container:                var(--wact-ref-palette-error10);
    --wact-sys-color-on-error-container:             var(--wact-ref-palette-error70);
    --wact-sys-color-outline:                        var(--wact-ref-palette-neutral20);
    --wact-sys-color-outline-variant:                var(--wact-ref-palette-neutral20);
    --wact-sys-color-outline-field:                  var(--wact-ref-palette-neutral27);
    --wact-sys-color-outline-card:                   var(--wact-ref-palette-primary37);
    --wact-sys-color-feedback:                       var(--wact-ref-palette-neutral16);
    --wact-sys-color-feedback-progress:              var(--wact-ref-palette-neutral22);
    --wact-sys-color-tooltip-container:              var(--wact-ref-palette-neutral20);
  }
}

/* ── High-contrast (light) ──────────────────────────────────────────────────── */
@media (prefers-contrast: more) {
  :host {
    --wact-sys-color-on-background:                  var(--wact-ref-palette-primary5);
    --wact-sys-color-on-surface:                     var(--wact-ref-palette-primary5);
    --wact-sys-color-on-surface-variant:             var(--wact-ref-palette-neutral16);
    --wact-sys-color-on-surface-muted:               var(--wact-ref-palette-neutral27);
    --wact-sys-color-outline:                        var(--wact-ref-palette-neutral27);
    --wact-sys-color-outline-variant:                var(--wact-ref-palette-neutral34);
    --wact-sys-color-outline-field:                  var(--wact-ref-palette-neutral40);
    --wact-sys-color-outline-card:                   var(--wact-ref-palette-primary47);
    --wact-sys-color-primary:                        var(--wact-ref-palette-primary28);
    --wact-sys-color-primary-hover:                  var(--wact-ref-palette-primary35);
  }
}

/* ── High-contrast (dark) ───────────────────────────────────────────────────── */
@media (prefers-color-scheme: dark) and (prefers-contrast: more) {
  :host {
    --wact-sys-color-on-background:                  var(--wact-ref-palette-primary99);
    --wact-sys-color-on-surface:                     var(--wact-ref-palette-primary99);
    --wact-sys-color-on-surface-variant:             var(--wact-ref-palette-neutral83);
    --wact-sys-color-on-surface-muted:               var(--wact-ref-palette-neutral75);
    --wact-sys-color-outline:                        var(--wact-ref-palette-neutral80);
    --wact-sys-color-outline-variant:                var(--wact-ref-palette-neutral74);
    --wact-sys-color-outline-field:                  var(--wact-ref-palette-neutral60);
    --wact-sys-color-outline-card:                   var(--wact-ref-palette-primary82);
  }
}
`;
