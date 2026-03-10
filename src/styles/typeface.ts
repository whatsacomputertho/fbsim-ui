const REF_TYPEFACE_CSS = `
:host {
  /* Font and weight */
  --wact-ref-typeface-font-family:    sans-serif;
  --wact-ref-typeface-weight-normal:  normal;
  --wact-ref-typeface-weight-bold:    bold;
  --wact-ref-typeface-weight-italic:  italic;

  /* Font size */
  --wact-ref-typeface-xxs-0:    0.50em;
  --wact-ref-typeface-xxs-1:    0.55em;
  --wact-ref-typeface-xxs-2:    0.60em;
  --wact-ref-typeface-xs-0:     0.65em;
  --wact-ref-typeface-xs-1:     0.70em;
  --wact-ref-typeface-xs-2:     0.75em;
  --wact-ref-typeface-small-0:  0.80em;
  --wact-ref-typeface-small-1:  0.90em;
  --wact-ref-typeface-small-2:  1.00em;
  --wact-ref-typeface-medium-0: 1.10em;
  --wact-ref-typeface-medium-1: 1.30em;
  --wact-ref-typeface-medium-2: 1.50em;
  --wact-ref-typeface-medium-3: 1.70em;
  --wact-ref-typeface-large-0:  1.80em;
  --wact-ref-typeface-large-1:  2.00em;
  --wact-ref-typeface-large-2:  2.20em;
  --wact-ref-typeface-large-3:  2.40em;

  /* Line height */
  --wact-ref-typeface-line-height-body: 1.4;
}
`;

const SYS_TYPEFACE_CSS = `
:host {
  /* Font and weight */
  --wact-sys-typeface-font-family:          var(--wact-ref-typeface-font-family);
  --wact-sys-typeface-weight-normal:        var(--wact-ref-typeface-weight-normal);
  --wact-sys-typeface-weight-bold:          var(--wact-ref-typeface-weight-bold);
  --wact-sys-typeface-weight-italic:        var(--wact-ref-typeface-weight-italic);

  /* Label scale */
  --wact-sys-typeface-label-small-size:     var(--wact-ref-typeface-xs-0);
  --wact-sys-typeface-label-medium-size:    var(--wact-ref-typeface-xs-1);
  --wact-sys-typeface-label-large-size:     var(--wact-ref-typeface-xs-2);

  /* Body scale */
  --wact-sys-typeface-body-small-size:      var(--wact-ref-typeface-small-0);
  --wact-sys-typeface-body-medium-size:     var(--wact-ref-typeface-small-1);
  --wact-sys-typeface-body-large-size:      var(--wact-ref-typeface-small-2);

  /* Title scale */
  --wact-sys-typeface-title-small-size:     var(--wact-ref-typeface-medium-0);
  --wact-sys-typeface-title-medium-size:    var(--wact-ref-typeface-medium-1);
  --wact-sys-typeface-title-large-size:     var(--wact-ref-typeface-medium-2);

  /* Display scale */
  --wact-sys-typeface-display-small-size:   var(--wact-ref-typeface-large-0);
  --wact-sys-typeface-display-medium-size:  var(--wact-ref-typeface-large-1);
  --wact-sys-typeface-display-large-size:   var(--wact-ref-typeface-large-2);

  /* Line height */
  --wact-sys-typeface-line-height-body:     var(--wact-ref-typeface-line-height-body);
}

/* Larger viewports: bump display and title sizes for better visual hierarchy */
@media only screen and (min-width: 1024px) {
  :host {
    /* Title scale */
    --wact-sys-typeface-title-small-size:   var(--wact-ref-typeface-medium-1);
    --wact-sys-typeface-title-medium-size:  var(--wact-ref-typeface-medium-2);
    --wact-sys-typeface-title-large-size:   var(--wact-ref-typeface-medium-3);

    /* Display scale */
    --wact-sys-typeface-display-small-size:   var(--wact-ref-typeface-large-1);
    --wact-sys-typeface-display-medium-size:  var(--wact-ref-typeface-large-2);
    --wact-sys-typeface-display-large-size:   var(--wact-ref-typeface-large-3);
  }
}
`;

export const TYPEFACE_CSS = REF_TYPEFACE_CSS + SYS_TYPEFACE_CSS;
