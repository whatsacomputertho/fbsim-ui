const REF_LAYOUT_CSS = `
:host {
    /* Fit parent or no size */
    --wact-ref-layout-none: 0%;
    --wact-ref-layout-fit-container: 100%;

    /* Viewport height */
    --wact-ref-layout-vh-10: 10vh;
    --wact-ref-layout-vh-20: 20vh;
    --wact-ref-layout-vh-30: 30vh;
    --wact-ref-layout-vh-40: 40vh;
    --wact-ref-layout-vh-50: 50vh;
    --wact-ref-layout-vh-60: 60vh;
    --wact-ref-layout-vh-70: 70vh;
    --wact-ref-layout-vh-80: 80vh;
    --wact-ref-layout-vh-90: 90vh;

    /* Viewport width */
    --wact-ref-layout-vw-10: 10vw;
    --wact-ref-layout-vw-20: 20vw;
    --wact-ref-layout-vw-30: 30vw;
    --wact-ref-layout-vw-40: 40vw;
    --wact-ref-layout-vw-50: 50vw;
    --wact-ref-layout-vw-60: 60vw;
    --wact-ref-layout-vw-70: 70vw;
    --wact-ref-layout-vw-80: 80vw;
    --wact-ref-layout-vw-90: 90vw;

    /* Pixel width and height */
    --wact-ref-layout-px-1:     1px;
    --wact-ref-layout-px-2:     2px;
    --wact-ref-layout-px-4:     4px;
    --wact-ref-layout-px-8:     8px;
    --wact-ref-layout-px-16:    16px;
    --wact-ref-layout-px-32:    32px;
    --wact-ref-layout-px-48:    48px;
    --wact-ref-layout-px-64:    64px;
    --wact-ref-layout-px-96:    96px;
    --wact-ref-layout-px-128:   128px;
    --wact-ref-layout-px-160:   160px;
    --wact-ref-layout-px-192:   192px;
    --wact-ref-layout-px-256:   256px;
    --wact-ref-layout-px-320:   320px;
    --wact-ref-layout-px-384:   386px;
    --wact-ref-layout-px-512:   512px;
    --wact-ref-layout-px-600:   600px;
    --wact-ref-layout-px-640:   640px;
    --wact-ref-layout-px-2048:  2048px;
}
`;

const SYS_LAYOUT_CSS = `
:host {
    /* Height and width to fit the parent container */
    --wact-sys-layout-fit-container: var(--wact-ref-layout-fit-container);

    /* Minimum click target height and width */
    --wact-sys-layout-min-target-size: var(--wact-ref-layout-px-48);

    /* Height of large banner */
    --wact-sys-layout-banner-large-height: var(--wact-ref-layout-vh-20);
    --wact-sys-layout-banner-large-max-height: var(--wact-ref-layout-px-160);

    /* Height of field display */
    --wact-sys-layout-field-height: var(--wact-ref-layout-vh-20);
    --wact-sys-layout-field-min-height: var(--wact-ref-layout-px-128);
}

@media only screen and (max-width: 600px) {
    :host {
        --wact-sys-layout-field-min-height: var(--wact-ref-layout-px-96);
    }
}
`;

export const LAYOUT_CSS = REF_LAYOUT_CSS + SYS_LAYOUT_CSS;
