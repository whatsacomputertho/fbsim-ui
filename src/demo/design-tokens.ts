import { DESIGN_TOKENS_CSS } from '../styles/index.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${DESIGN_TOKENS_CSS}

    :host {
      display: block;
      background-color: var(--wact-sys-color-background);
      color: var(--wact-sys-color-on-background);
      font-family: var(--wact-sys-typescale-font-family);
    }

    .dt-page {
      padding: var(--wact-sys-spacing-2xl);
      max-width: 1100px;
      margin: 0 auto;
    }

    /* ── Section ── */
    .dt-section {
      margin-bottom: 48px;
    }

    .dt-section-title {
      font-size: var(--wact-sys-typescale-title-medium-size);
      font-weight: var(--wact-sys-typescale-weight-bold);
      margin: 0 0 var(--wact-sys-spacing-xs) 0;
      color: var(--wact-sys-color-on-background);
    }

    .dt-section-desc {
      font-size: var(--wact-sys-typescale-body-medium-size);
      color: var(--wact-sys-color-on-surface-muted);
      margin: 0 0 var(--wact-sys-spacing-lg) 0;
    }

    .dt-section-divider {
      border: none;
      border-top: 1px solid var(--wact-sys-color-outline);
      margin: 0 0 var(--wact-sys-spacing-lg) 0;
    }

    .dt-family-title {
      font-size: var(--wact-sys-typescale-body-medium-size);
      font-weight: var(--wact-sys-typescale-weight-bold);
      color: var(--wact-sys-color-on-surface-variant);
      margin: var(--wact-sys-spacing-lg) 0 var(--wact-sys-spacing-sm) 0;
    }

    /* ── Palette swatches ── */
    .dt-swatch-strip {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-swatch {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wact-sys-spacing-xs);
      width: 64px;
    }

    .dt-swatch-color {
      width: 64px;
      height: 52px;
      border-radius: var(--wact-sys-shape-corner-small);
      border: 1px solid var(--wact-sys-color-outline-variant);
    }

    .dt-swatch-name {
      font-size: 0.65em;
      color: var(--wact-sys-color-on-surface-muted);
      text-align: center;
      font-family: monospace;
      line-height: 1.3;
      word-break: break-word;
    }

    /* ── System color roles ── */
    .dt-color-groups {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--wact-sys-spacing-xl);
    }

    .dt-color-group-title {
      font-size: var(--wact-sys-typescale-body-small-size);
      font-weight: var(--wact-sys-typescale-weight-bold);
      color: var(--wact-sys-color-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 var(--wact-sys-spacing-sm) 0;
    }

    .dt-color-role-list {
      display: flex;
      flex-direction: column;
      gap: var(--wact-sys-spacing-xs);
    }

    .dt-color-role {
      display: flex;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-color-role-swatch {
      width: 36px;
      height: 36px;
      border-radius: var(--wact-sys-shape-corner-extra-small);
      border: 1px solid var(--wact-sys-color-outline-variant);
      flex-shrink: 0;
    }

    .dt-color-role-info {
      min-width: 0;
    }

    .dt-color-role-name {
      font-size: 0.68em;
      color: var(--wact-sys-color-on-surface);
      font-family: monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Typography ── */
    .dt-type-scale {
      display: flex;
      flex-direction: column;
      gap: var(--wact-sys-spacing-md);
    }

    .dt-type-row {
      display: grid;
      grid-template-columns: 240px 1fr;
      align-items: baseline;
      gap: var(--wact-sys-spacing-lg);
      padding-bottom: var(--wact-sys-spacing-md);
      border-bottom: 1px solid var(--wact-sys-color-outline-variant);
    }

    .dt-type-row:last-child {
      border-bottom: none;
    }

    .dt-type-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .dt-type-token {
      font-size: 0.68em;
      font-family: monospace;
      color: var(--wact-sys-color-on-surface-muted);
    }

    .dt-type-value {
      font-size: 0.68em;
      font-family: monospace;
      color: var(--wact-sys-color-tertiary-status);
    }

    .dt-type-sample {
      color: var(--wact-sys-color-on-background);
    }

    /* font-family & weight rows */
    .dt-type-row--baseline {
      align-items: center;
    }

    /* ── Shape ── */
    .dt-shapes {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wact-sys-spacing-2xl);
      align-items: flex-end;
    }

    .dt-shape {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-shape-box {
      width: 80px;
      height: 80px;
      background: var(--wact-sys-color-primary);
    }

    .dt-shape-label {
      font-size: 0.68em;
      color: var(--wact-sys-color-on-surface-muted);
      font-family: monospace;
      text-align: center;
    }

    /* ── Motion ── */
    .dt-motion-rows {
      display: flex;
      flex-direction: column;
      gap: var(--wact-sys-spacing-md);
    }

    .dt-motion-row {
      display: grid;
      grid-template-columns: 300px 1fr;
      align-items: center;
      gap: var(--wact-sys-spacing-lg);
    }

    .dt-motion-label {
      font-size: 0.68em;
      font-family: monospace;
      color: var(--wact-sys-color-on-surface-muted);
    }

    .dt-motion-track {
      height: 10px;
      background: var(--wact-sys-color-surface-recessed);
      border-radius: var(--wact-sys-shape-corner-full);
      overflow: hidden;
    }

    .dt-motion-fill {
      height: 100%;
      background: var(--wact-sys-color-primary);
      border-radius: var(--wact-sys-shape-corner-full);
      animation-name: dt-fill;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    @keyframes dt-fill {
      from { width: 5%; }
      to   { width: 95%; }
    }

    /* Motion duration classes */
    .dt-fill--short1-std  { animation-duration: var(--wact-sys-motion-duration-short1);  animation-timing-function: var(--wact-sys-motion-easing-standard); }
    .dt-fill--short2-std  { animation-duration: var(--wact-sys-motion-duration-short2);  animation-timing-function: var(--wact-sys-motion-easing-standard); }
    .dt-fill--medium1-std { animation-duration: var(--wact-sys-motion-duration-medium1); animation-timing-function: var(--wact-sys-motion-easing-standard); }
    .dt-fill--medium2-std { animation-duration: var(--wact-sys-motion-duration-medium2); animation-timing-function: var(--wact-sys-motion-easing-standard); }
    .dt-fill--short1-lin  { animation-duration: var(--wact-sys-motion-duration-short1);  animation-timing-function: var(--wact-sys-motion-easing-linear); }
    .dt-fill--medium1-lin { animation-duration: var(--wact-sys-motion-duration-medium1); animation-timing-function: var(--wact-sys-motion-easing-linear); }

    /* ── Elevation ── */
    .dt-elevations {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wact-sys-spacing-2xl);
      align-items: center;
    }

    .dt-elevation {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-elevation-card {
      width: 120px;
      height: 72px;
      background: var(--wact-sys-color-surface);
      border-radius: var(--wact-sys-shape-corner-medium);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--wact-sys-typescale-label-medium-size);
      color: var(--wact-sys-color-on-surface-muted);
    }

    .dt-elevation-card--0    { box-shadow: none; }
    .dt-elevation-card--1    { box-shadow: var(--wact-sys-elevation-level1); }
    .dt-elevation-card--2    { box-shadow: var(--wact-sys-elevation-level2); }

    .dt-elevation-label {
      font-size: 0.68em;
      color: var(--wact-sys-color-on-surface-muted);
      font-family: monospace;
      text-align: center;
    }

    /* ── State layers ── */
    .dt-states {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wact-sys-spacing-2xl);
    }

    .dt-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-state-block {
      width: 80px;
      height: 80px;
      background: var(--wact-sys-color-primary);
      border-radius: var(--wact-sys-shape-corner-medium);
    }

    .dt-state-block--full     { opacity: 1; }
    .dt-state-block--inactive { opacity: var(--wact-sys-state-layer-opacity-inactive); }
    .dt-state-block--disabled { opacity: var(--wact-sys-state-layer-opacity-disabled); }

    .dt-state-label {
      font-size: 0.68em;
      color: var(--wact-sys-color-on-surface-muted);
      font-family: monospace;
      text-align: center;
    }

    /* ── Spacing ── */
    .dt-spacings {
      display: flex;
      flex-direction: column;
      gap: var(--wact-sys-spacing-sm);
    }

    .dt-spacing-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      align-items: center;
      gap: var(--wact-sys-spacing-lg);
    }

    .dt-spacing-label {
      font-size: 0.68em;
      font-family: monospace;
      color: var(--wact-sys-color-on-surface-muted);
    }

    .dt-spacing-track {
      height: 20px;
      background: var(--wact-sys-color-surface-recessed);
      border-radius: var(--wact-sys-shape-corner-small);
      overflow: hidden;
    }

    .dt-spacing-bar {
      height: 100%;
      background: var(--wact-sys-color-interactive-active);
      border-radius: var(--wact-sys-shape-corner-small);
    }

    .dt-spacing-bar--xs  { width: var(--wact-sys-spacing-xs);  }
    .dt-spacing-bar--sm  { width: var(--wact-sys-spacing-sm);  }
    .dt-spacing-bar--md  { width: var(--wact-sys-spacing-md);  }
    .dt-spacing-bar--lg  { width: var(--wact-sys-spacing-lg);  }
    .dt-spacing-bar--xl  { width: var(--wact-sys-spacing-xl);  }
    .dt-spacing-bar--2xl { width: var(--wact-sys-spacing-2xl); }
  </style>
  <div class="dt-page">

    <!-- ═══════════════════════════════════════════════════════════
         REFERENCE PALETTE
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Reference Palette</h2>
      <p class="dt-section-desc">Raw palette values — mode-independent constants that underpin all semantic tokens. These are never used directly in components.</p>
      <hr class="dt-section-divider">

      <p class="dt-family-title">Primary (navy → white blue)</p>
      <div class="dt-swatch-strip">
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary5)"></div><div class="dt-swatch-name">primary5</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary10)"></div><div class="dt-swatch-name">primary10</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary17)"></div><div class="dt-swatch-name">primary17</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary20)"></div><div class="dt-swatch-name">primary20</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary23)"></div><div class="dt-swatch-name">primary23</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary28)"></div><div class="dt-swatch-name">primary28</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary30)"></div><div class="dt-swatch-name">primary30</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary32)"></div><div class="dt-swatch-name">primary32</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary35)"></div><div class="dt-swatch-name">primary35</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary37)"></div><div class="dt-swatch-name">primary37</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary40)"></div><div class="dt-swatch-name">primary40</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary43)"></div><div class="dt-swatch-name">primary43</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary45)"></div><div class="dt-swatch-name">primary45</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary47)"></div><div class="dt-swatch-name">primary47</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary50)"></div><div class="dt-swatch-name">primary50</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary60)"></div><div class="dt-swatch-name">primary60</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary79)"></div><div class="dt-swatch-name">primary79</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary82)"></div><div class="dt-swatch-name">primary82</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary84)"></div><div class="dt-swatch-name">primary84</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary88)"></div><div class="dt-swatch-name">primary88</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary91)"></div><div class="dt-swatch-name">primary91</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary93)"></div><div class="dt-swatch-name">primary93</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary95)"></div><div class="dt-swatch-name">primary95</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-primary99)"></div><div class="dt-swatch-name">primary99</div></div>
      </div>

      <p class="dt-family-title">Neutral (pure grays)</p>
      <div class="dt-swatch-strip">
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral16)"></div><div class="dt-swatch-name">neutral16</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral20)"></div><div class="dt-swatch-name">neutral20</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral22)"></div><div class="dt-swatch-name">neutral22</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral27)"></div><div class="dt-swatch-name">neutral27</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral34)"></div><div class="dt-swatch-name">neutral34</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral40)"></div><div class="dt-swatch-name">neutral40</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral60)"></div><div class="dt-swatch-name">neutral60</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral74)"></div><div class="dt-swatch-name">neutral74</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral75)"></div><div class="dt-swatch-name">neutral75</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral80)"></div><div class="dt-swatch-name">neutral80</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral83)"></div><div class="dt-swatch-name">neutral83</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-neutral100)"></div><div class="dt-swatch-name">neutral100</div></div>
      </div>

      <p class="dt-family-title">Error (reds)</p>
      <div class="dt-swatch-strip">
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error10)"></div><div class="dt-swatch-name">error10</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error20)"></div><div class="dt-swatch-name">error20</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error25)"></div><div class="dt-swatch-name">error25</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error30)"></div><div class="dt-swatch-name">error30</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error38)"></div><div class="dt-swatch-name">error38</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error40)"></div><div class="dt-swatch-name">error40</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error70)"></div><div class="dt-swatch-name">error70</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-error90)"></div><div class="dt-swatch-name">error90</div></div>
      </div>

      <p class="dt-family-title">Tertiary (gold)</p>
      <div class="dt-swatch-strip">
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-tertiary36)"></div><div class="dt-swatch-name">tertiary36</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-tertiary40)"></div><div class="dt-swatch-name">tertiary40</div></div>
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-tertiary82)"></div><div class="dt-swatch-name">tertiary82</div></div>
      </div>

      <p class="dt-family-title">Field</p>
      <div class="dt-swatch-strip">
        <div class="dt-swatch"><div class="dt-swatch-color" style="background:var(--wact-ref-palette-field40)"></div><div class="dt-swatch-name">field40</div></div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         SYSTEM COLORS
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">System Colors</h2>
      <p class="dt-section-desc">Semantic color roles that adapt to the current color scheme (light / dark). Swatches reflect the active mode.</p>
      <hr class="dt-section-divider">

      <div class="dt-color-groups">

        <!-- Navigation -->
        <div>
          <p class="dt-color-group-title">Navigation</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-nav)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-nav</div></div></div>
          </div>
        </div>

        <!-- Page / Background -->
        <div>
          <p class="dt-color-group-title">Page / Background</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-background)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-background</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-background)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-background</div></div></div>
          </div>
        </div>

        <!-- Surface -->
        <div>
          <p class="dt-color-group-title">Surface</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-surface)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-surface</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-surface-raised)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-surface-raised</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-surface-recessed)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-surface-recessed</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-surface-container-hover)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-surface-container-hover</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-surface)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-surface</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-surface-variant)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-surface-variant</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-surface-muted)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-surface-muted</div></div></div>
          </div>
        </div>

        <!-- Interactive -->
        <div>
          <p class="dt-color-group-title">Interactive</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-interactive)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-interactive</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-interactive-hover)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-interactive-hover</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-interactive-active)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-interactive-active</div></div></div>
          </div>
        </div>

        <!-- Primary -->
        <div>
          <p class="dt-color-group-title">Primary</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-primary)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-primary</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-primary-hover)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-primary-hover</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-primary-active)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-primary-active</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-primary)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-primary</div></div></div>
          </div>
        </div>

        <!-- Tertiary -->
        <div>
          <p class="dt-color-group-title">Tertiary</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-tertiary)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-tertiary</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-tertiary-status)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-tertiary-status</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-tertiary)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-tertiary</div></div></div>
          </div>
        </div>

        <!-- Destructive -->
        <div>
          <p class="dt-color-group-title">Destructive</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-destructive)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-destructive</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-destructive-hover)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-destructive-hover</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-destructive-active)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-destructive-active</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-destructive)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-destructive</div></div></div>
          </div>
        </div>

        <!-- Error -->
        <div>
          <p class="dt-color-group-title">Error</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-error)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-error</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-error-container)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-error-container</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-error-container)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-error-container</div></div></div>
          </div>
        </div>

        <!-- Outline -->
        <div>
          <p class="dt-color-group-title">Outline</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-outline)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-outline</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-outline-variant)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-outline-variant</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-outline-field)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-outline-field</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-outline-card)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-outline-card</div></div></div>
          </div>
        </div>

        <!-- Feedback -->
        <div>
          <p class="dt-color-group-title">Feedback</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-feedback)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-feedback</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-feedback-progress)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-feedback-progress</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-feedback-accent)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-feedback-accent</div></div></div>
          </div>
        </div>

        <!-- Tooltip & Overlay -->
        <div>
          <p class="dt-color-group-title">Tooltip &amp; Overlay</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-tooltip-container)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-tooltip-container</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-on-tooltip)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-on-tooltip</div></div></div>
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-overlay)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-overlay</div></div></div>
          </div>
        </div>

        <!-- Field -->
        <div>
          <p class="dt-color-group-title">Field</p>
          <div class="dt-color-role-list">
            <div class="dt-color-role"><div class="dt-color-role-swatch" style="background:var(--wact-sys-color-field)"></div><div class="dt-color-role-info"><div class="dt-color-role-name">--wact-sys-color-field</div></div></div>
          </div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         TYPOGRAPHY
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Typography</h2>
      <p class="dt-section-desc">Type scale — font family, weights, and size ramp. All sizes are relative (em) so they scale with the host font.</p>
      <hr class="dt-section-divider">

      <div class="dt-type-scale">

        <!-- font-family -->
        <div class="dt-type-row dt-type-row--baseline">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-font-family</div>
            <div class="dt-type-value">sans-serif</div>
          </div>
          <div class="dt-type-sample" style="font-family:var(--wact-sys-typescale-font-family)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <!-- weights -->
        <div class="dt-type-row dt-type-row--baseline">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-weight-normal</div>
            <div class="dt-type-value">normal</div>
          </div>
          <div class="dt-type-sample" style="font-weight:var(--wact-sys-typescale-weight-normal)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row dt-type-row--baseline">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-weight-bold</div>
            <div class="dt-type-value">bold</div>
          </div>
          <div class="dt-type-sample" style="font-weight:var(--wact-sys-typescale-weight-bold)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <!-- sizes -->
        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-label-small-size</div>
            <div class="dt-type-value">0.7em — field labels</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-label-small-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-label-medium-size</div>
            <div class="dt-type-value">0.75em — tooltips, metadata</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-label-medium-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-body-small-size</div>
            <div class="dt-type-value">0.85em — error messages</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-body-small-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-body-medium-size</div>
            <div class="dt-type-value">0.9em — secondary body, play descriptions</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-body-medium-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-body-default-size</div>
            <div class="dt-type-value">1em — standard body</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-body-default-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-body-large-size</div>
            <div class="dt-type-value">1.1em — scoreboard team names</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-body-large-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-title-small-size</div>
            <div class="dt-type-value">1.2em — final score line</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-title-small-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-title-medium-size</div>
            <div class="dt-type-value">1.4em — mode card titles</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-title-medium-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

        <div class="dt-type-row">
          <div class="dt-type-meta">
            <div class="dt-type-token">--wact-sys-typescale-title-large-size</div>
            <div class="dt-type-value">1.5em — start button, postgame winner</div>
          </div>
          <div class="dt-type-sample" style="font-size:var(--wact-sys-typescale-title-large-size)">The quick brown fox jumps over the lazy dog.</div>
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         SHAPE
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Shape</h2>
      <p class="dt-section-desc">Corner radius scale following MD3 naming. Used for buttons, cards, tooltips, and container shapes.</p>
      <hr class="dt-section-divider">

      <div class="dt-shapes">
        <div class="dt-shape">
          <div class="dt-shape-box" style="border-radius:var(--wact-sys-shape-corner-extra-small)"></div>
          <div class="dt-shape-label">extra-small<br>4px</div>
        </div>
        <div class="dt-shape">
          <div class="dt-shape-box" style="border-radius:var(--wact-sys-shape-corner-small)"></div>
          <div class="dt-shape-label">small<br>6px</div>
        </div>
        <div class="dt-shape">
          <div class="dt-shape-box" style="border-radius:var(--wact-sys-shape-corner-medium)"></div>
          <div class="dt-shape-label">medium<br>8px</div>
        </div>
        <div class="dt-shape">
          <div class="dt-shape-box" style="border-radius:var(--wact-sys-shape-corner-large)"></div>
          <div class="dt-shape-label">large<br>12px</div>
        </div>
        <div class="dt-shape">
          <div class="dt-shape-box" style="border-radius:var(--wact-sys-shape-corner-full)"></div>
          <div class="dt-shape-label">full<br>50%</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         MOTION
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Motion</h2>
      <p class="dt-section-desc">Duration and easing tokens. Each bar animates using the specified duration and easing — faster bars use shorter durations.</p>
      <hr class="dt-section-divider">

      <div class="dt-motion-rows">
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-short1 · easing-standard<br>(150ms · ease)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--short1-std"></div></div>
        </div>
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-short1 · easing-linear<br>(150ms · linear)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--short1-lin"></div></div>
        </div>
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-short2 · easing-standard<br>(200ms · ease)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--short2-std"></div></div>
        </div>
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-medium1 · easing-standard<br>(300ms · ease)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--medium1-std"></div></div>
        </div>
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-medium1 · easing-linear<br>(300ms · linear)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--medium1-lin"></div></div>
        </div>
        <div class="dt-motion-row">
          <div class="dt-motion-label">--wact-sys-motion-duration-medium2 · easing-standard<br>(400ms · ease)</div>
          <div class="dt-motion-track"><div class="dt-motion-fill dt-fill--medium2-std"></div></div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         ELEVATION
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Elevation</h2>
      <p class="dt-section-desc">Box shadow levels used for menus, dropdowns, and feedback ribbons.</p>
      <hr class="dt-section-divider">

      <div class="dt-elevations">
        <div class="dt-elevation">
          <div class="dt-elevation-card dt-elevation-card--0">No shadow</div>
          <div class="dt-elevation-label">level0 (none)</div>
        </div>
        <div class="dt-elevation">
          <div class="dt-elevation-card dt-elevation-card--1">Level 1</div>
          <div class="dt-elevation-label">--wact-sys-elevation-level1<br>menus &amp; dropdowns</div>
        </div>
        <div class="dt-elevation">
          <div class="dt-elevation-card dt-elevation-card--2">Level 2</div>
          <div class="dt-elevation-label">--wact-sys-elevation-level2<br>feedback ribbon</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         STATE LAYERS
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">State Layers</h2>
      <p class="dt-section-desc">Opacity values applied to elements in disabled or inactive states.</p>
      <hr class="dt-section-divider">

      <div class="dt-states">
        <div class="dt-state">
          <div class="dt-state-block dt-state-block--full"></div>
          <div class="dt-state-label">opacity: 1<br>(active)</div>
        </div>
        <div class="dt-state">
          <div class="dt-state-block dt-state-block--inactive"></div>
          <div class="dt-state-label">--wact-sys-state-layer-opacity-inactive<br>0.45</div>
        </div>
        <div class="dt-state">
          <div class="dt-state-block dt-state-block--disabled"></div>
          <div class="dt-state-label">--wact-sys-state-layer-opacity-disabled<br>0.4</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         SPACING
    ═══════════════════════════════════════════════════════════ -->
    <section class="dt-section">
      <h2 class="dt-section-title">Spacing</h2>
      <p class="dt-section-desc">4px-grid spacing scale. Bar widths are proportional to the token value.</p>
      <hr class="dt-section-divider">

      <div class="dt-spacings">
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-xs · 4px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--xs"></div></div>
        </div>
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-sm · 8px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--sm"></div></div>
        </div>
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-md · 12px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--md"></div></div>
        </div>
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-lg · 16px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--lg"></div></div>
        </div>
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-xl · 20px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--xl"></div></div>
        </div>
        <div class="dt-spacing-row">
          <div class="dt-spacing-label">--wact-sys-spacing-2xl · 40px</div>
          <div class="dt-spacing-track"><div class="dt-spacing-bar dt-spacing-bar--2xl"></div></div>
        </div>
      </div>
    </section>

  </div>
`;

class WACTDesignTokens extends HTMLElement {
  static readonly tagName = 'wact-design-tokens' as const;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
  }
}

if (!customElements.get(WACTDesignTokens.tagName)) {
  customElements.define(WACTDesignTokens.tagName, WACTDesignTokens);
}
