export const SYS_TYPESCALE_CSS = `
:host {
  /* Font and weight */
  --wact-sys-typescale-font-family:           var(--wact-ref-typescale-font-family);
  --wact-sys-typescale-weight-normal:         var(--wact-ref-typescale-weight-normal);
  --wact-sys-typescale-weight-bold:           var(--wact-ref-typescale-weight-bold);

  /* Label scale */
  --wact-sys-typescale-label-small-size:      var(--wact-ref-typescale-label-small-size);
  --wact-sys-typescale-label-medium-size:     var(--wact-ref-typescale-label-medium-size);

  /* Body scale */
  --wact-sys-typescale-body-small-size:       var(--wact-ref-typescale-body-small-size);
  --wact-sys-typescale-body-medium-size:      var(--wact-ref-typescale-body-medium-size);
  --wact-sys-typescale-body-default-size:     var(--wact-ref-typescale-body-default-size);
  --wact-sys-typescale-body-large-size:       var(--wact-ref-typescale-body-large-size);

  /* Title scale */
  --wact-sys-typescale-title-small-size:      var(--wact-ref-typescale-title-small-size);
  --wact-sys-typescale-title-medium-size:     var(--wact-ref-typescale-title-medium-size);
  --wact-sys-typescale-title-large-size:      var(--wact-ref-typescale-title-large-size);

  /* Display scale */
  --wact-sys-typescale-display-small-size:    var(--wact-ref-typescale-display-small-size);
  --wact-sys-typescale-display-medium-size:   var(--wact-ref-typescale-display-medium-size);

  /* Line height */
  --wact-sys-typescale-line-height-body:      var(--wact-ref-typescale-line-height-body);
}

/* Larger viewports: bump display and title sizes for better visual hierarchy */
@media only screen and (min-width: 1024px) {
  :host {
    --wact-sys-typescale-title-medium-size:   1.50em;
    --wact-sys-typescale-title-large-size:    1.75em;
    --wact-sys-typescale-display-small-size:  2.00em;
    --wact-sys-typescale-display-medium-size: 2.40em;
  }
}
`;
