# FootballSim UI Design Specification

A design specification for the FootballSim UI components

## Contents

- [Requirements](#requirements)
    - [1: Consistency](#1-consistency)
        - [1.1: Color Palette](#11-color-palette)
        - [1.2: Typography](#12-typography)
        - [1.3: Iconography](#13-iconography)
        - [1.4: Spacing](#14-spacing)
        - [1.5: Error Handling](#15-error-handling)
    - [2: Responsiveness](#2-responsiveness)
        - [2.1: Visual Stability](#21-visual-stability)
        - [2.2: Long Operations](#22-long-operations)
    - [3: Accessibility](#3-accessibility)
        - [3.1: WCAG Standard](#31-wcag-standard)
        - [3.2: ARIA](#32-aria)
        - [3.3: Target Sizes](#33-target-sizes)
        - [3.4: Navigation](#34-navigation)
        - [3.5: Text](#35-text)
    - [4: Adaptability](#4-adaptability)
        - [4.1: User Preferences](#41-user-preferences)
        - [4.2: Devices](#42-devices)
    - [5: Design Guidelines](#5-design-guidelines)
        - [5.1: Apple HIG](#51-apple-hig)
        - [5.2: Google Material Design](#52-google-material-design)

## Requirements

The following requirements govern the design of the FootballSim UI components. They MUST be followed for all new developments within the FootballSim UI.

### 1: Consistency

The design of the FootballSim UI MUST remain consistent across all UI components.

#### 1.1: Color Palette

- The FootballSim UI color palette MUST be defined as design tokens
- The FootballSim UI MUST support both a dark mode and a light mode
- The FootballSim UI MUST support a high-contrast mode for both dark and light mode
    - Note: high-contrast mode is not yet implemented; it is a planned future requirement
- FootballSim UI display modes MUST toggle based on host system preferences (`prefers-color-scheme`), MUST NOT be stored within the FootballSim application

Colors are organized below by semantic role. Each token lists its light mode value followed by its dark mode value.

**Background**

| Role | Light | Dark |
|------|-------|------|
| Page base | `#ffffff` | `#11111f` |
| Navigation | `#162267` | `#020210` |
| Surface (primary) | `#f0f0f5` | `#1a1a2e` |
| Surface (raised) | `#e8eaf6` | `#1a1a2e` |
| Surface (recessed) | `#cfd2e8` | `#16213e` |
| Interactive (default) | `#dde0ed` | `#2f2f3f` |
| Interactive (hover) | `#cfd2e8` | `#3f3f4f` |
| Interactive (active/pressed) | `#b8bce0` | `#4f4f5f` |
| Card (hover) | `#e8e8f0` | `#22223a` |
| Error | `#ffe6e6` | `#3a1a1a` |
| Feedback ribbon | `#d3d3d3` | `#282828` |
| Feedback ribbon progress | `#c0c0c0` | `#383838` |

**Text**

| Role | Light | Dark |
|------|-------|------|
| Primary | `#1a1a2e` | `#ffffff` |
| Secondary | `#555555` | `#cccccc` |
| Muted / placeholder | `#999999` | `#666666` |
| Error | `#cc0000` | `#ff6666` |

**Accent**

| Role | Light | Dark |
|------|-------|------|
| Primary (action blue) | `#3a58b0` | `#2c4494` |
| Primary hover | `#4a68c0` | `#3c54a4` |
| Primary active | `#5a78d0` | `#4c64b4` |
| Highlight / possession | `#c5a200` | `#ffd700` |
| Status / active indicator | `#b8860b` | `#ffd700` |
| Destructive | `#cc0000` | `#8b0000` |
| Destructive hover | `#a00000` | `#a00000` |
| Destructive active | `#800000` | `#cc0000` |
| Feedback ribbon sidebar | `#c00000` | `#c00000` |

**Border**

| Role | Light | Dark |
|------|-------|------|
| Standard | `#cccccc` | `#333333` |
| Subtle | `#bbbbbb` | `#333333` |
| Field display | `#999999` | `#444444` |
| Card | `#d0d0d8` | `#3a3a4e` |

**Field**

| Role | Value (both modes) |
|------|-------------------|
| Playing surface | `#2d7a2d` |

#### 1.2: Typography

- The FootballSim UI typography MUST be defined as design tokens
- The FootballSim UI MUST use a system sans-serif font stack
    - MUST NOT bundle or load custom web fonts
- Font sizes MUST use relative units (`em`) so they scale with the user's browser default

**Font family**

- All components: `sans-serif` (resolved by the host operating system to the appropriate system UI font)

**Type scale**

The following sizes are defined relative to the inherited base font size of the component:

| Role | Size | Usage |
|------|------|-------|
| Label (extra small) | `0.7em` | Field endzone labels |
| Label (small) | `0.75em`–`0.85em` | Tooltips, error messages, small metadata |
| Body (secondary) | `0.9em`–`0.95em` | Subtitles, game log play descriptions, speed options |
| Body (default) | `1em` | Standard text |
| Body (large) | `1.1em` | Scoreboard team names, playback control buttons |
| Subtitle | `1.2em` | Postgame final score line |
| Title (medium) | `1.4em` | Mode card titles (Start / Replay) |
| Title (large) | `1.5em`–`1.6em` | Postgame winner banner, Start Game button |

**Font weight**

- `bold` — headings, scoreboard team names, game log drive headers, mode card titles, postgame winner banner
- `normal` — all other body text and labels

#### 1.3: Iconography

- Iconography MUST be visually consistent across all FootballSim UI components
- Icons MUST be labeled as decorative (`aria-hidden="true"`) when they do not convey information to a screen reader that is not already communicated by accompanying text or an accessible label on a parent element
- Interactive icon buttons without visible text MUST have an accessible label (`aria-label`)

**Icon styles**

The FootballSim UI uses two icon styles:

1. **Unicode symbols** — used in playback controls for broadly-supported, semantically meaningful glyphs:
    - Play: `▶` (`U+25B6`)
    - Skip to end: `⏭` (`U+23ED`)

2. **Inline SVG (Feather-style)** — used for navigation, mode selection, and upload affordances. All SVG icons follow these conventions:
    - `viewBox="0 0 24 24"` with a 24×24 coordinate space
    - `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`
    - `stroke-linecap="round"`, `stroke-linejoin="round"`
    - Rendered at `20px` × `20px` within touch targets

**Touch target sizing**

- Icons placed inside interactive buttons MUST be contained in a touch target that meets the minimum size defined in [3.3: Target Sizes](#33-target-sizes)
- Circular icon buttons (e.g. mode card icons): `44px` × `44px`, `border-radius: 50%`

#### 1.4: Spacing

- The FootballSim UI spacing system MUST be defined as design tokens
- All spacing values MUST be multiples of `4px`

**Spacing scale**

| Token | Value | Usage |
|-------|-------|-------|
| xs | `4px` | Tooltip offset, small internal padding |
| sm | `8px` | Default button padding, gap between tightly grouped elements |
| md | `12px` | Gap between mid-level elements (e.g. scoreboard columns) |
| lg | `16px` | Standard section padding, gap between components |
| xl | `20px`–`24px` | Card padding, select-view outer padding |
| 2xl | `40px` | Large decorative padding (e.g. centered content areas) |

**Border radius scale**

| Token | Value | Usage |
|-------|-------|-------|
| sm | `4px` | Small chips, logo images, speed menu items |
| md | `6px` | Error message containers, tooltips |
| default | `8px` | Buttons, scoreboard, game log, playback bar, field display |
| lg | `12px` | Mode selection cards |

**Responsive breakpoint**

- Compact / medium boundary: `600px`
    - Below `600px`: single-column layout, reduced padding and font sizes
    - At or above `600px`: multi-column layout permitted

#### 1.5: Error Handling

- The FootballSim UI MUST surface error messages inline, adjacent to the action that triggered the error
- Error messages MUST be hidden by default and MUST only appear when an error has occurred
- Error messages MUST be dismissible or MUST automatically clear when the user successfully retries the action
- Error containers MUST use the error color tokens defined in [1.1: Color Palette](#11-color-palette)

**Error container style**

```
color:            var(--gs-error-text)   (#cc0000 light / #ff6666 dark)
background-color: var(--gs-error-bg)    (#ffe6e6 light / #3a1a1a dark)
border-radius:    6px
padding:          6px 10px – 8px 12px (depending on context)
font-size:        0.8em – 0.85em
```

**Error placement**

- Form validation errors (e.g. matchup config): displayed below the form, above the submit button
- File load errors (e.g. Replay card): displayed below the file action row, within the card
- All error elements use `display: none` as their initial state and switch to `display: block` on error

---

### 2: Responsiveness

The FootballSim UI components MUST be responsive to user input.

#### 2.1: Visual Stability

- Animations MUST appear visually smooth
- Components MUST NOT instantly transition between states (i.e. open/closed, etc.)

#### 2.2: Long operations

- Buttons which trigger long inputs MUST display a loading spinner while the input is processing
    - MAY display confirmation text when it completes
- Text and visual containers which display content that must be loaded over the network MUST perform an idle loading animation while content is loading

---

### 3: Accessibility

The FootballSim UI components MUST be accessible to people with sensory disabilities.

#### 3.1: WCAG Standard

- The FootballSim UI components MUST comply with level AA of [the WCAG 2.1 standard](https://www.w3.org/TR/WCAG21/)
    - Note - many of the following subsections on Accessibility are duplicates of requirements from the WCAG standard given particular emphasis in this document

#### 3.2: ARIA

- The FootballSim UI components MUST use landmark roles wherever applicable
- The FootballSim UI components MUST use accessibility labels when landmark roles appear multiple times
    - MUST NOT repeat landmark roles in accessibility labels
- Interactive FootballSim UI components MUST be assigned an ARIA role
- Tooltips and accessibility labels MUST be added to each of the following types of elements
    - Interactive icons or buttons with no visible text or not enough context in the text
    - Interactive images
    - Visual cues
    - Meaningful icons and images (status, diagrams, illustrations)
    - Generic links
- Accessibility labels SHOULD describe the action performed by an interactive element
    - SHOULD NOT describe the type of element or visual description of the element
- Icons that do not enhance visually-impaired user experience MUST be labeled as decorative

#### 3.3: Target Sizes

- Target sizes across the FootballSim UI components MUST equal or exceed 48 x 48dp
- Targets across the FootballSim UI MUST be separated by at least 8dp

#### 3.4: Navigation

- The FootballSim UI components MUST use heading tags (`h1`, `h2`, ...) to establish hierarchy
    - MUST NOT skip heading levels
    - MUST use exactly one `h1` per page
- Important options in the FootballSim UI SHOULD be placed at the top or bottom of the screen
- The top-down structure of the DOM SHOULD align with the visual representation of the FootballSim UI
- Initial focus in the FootballSim UI MUST align with the most common user action
    - MUST apply to both pages and components with multiple interactive elements
- The primary and secondary user journeys MUST be navigatable using keyboard-only and mouse-only for all FootballSim components with multiple interactive elements

#### 3.5: Text

- The FootballSim UI components MUST support text resizing of at least 200%
    - Text containers MUST respond to text resizing via increase in size, reflow, or scrolling
    - Icon containers MUST NOT respond to text resizing unless they also contain text
- Wrapped or truncated text MUST be visible to a screen reader
- Container components SHOULD extend vertically or horizontally to display more text where applicable
- Text MUST NOT be wrapped or truncated without a means of expanding the text to view that which is hidden
    - An ellipsis (`...`) MAY be used to replace truncated text if the text is available through a tooltip or link

---

### 4: Adaptability

The FootballSim UI should be designed to adapt to various device sizes and contexts

#### 4.1: User Preferences

- The FootballSim UI components SHOULD respect host system preferences wherever applicable
- Display mode (dark / light) MUST be driven by `prefers-color-scheme` and MUST NOT be overridden by application state
- The FootballSim UI MUST NOT store user preference state internally; all preference signals MUST originate from the host environment

#### 4.2: Devices

- The FootballSim UI components MUST be responsive for desktop, mobile, and tablet device sizes
- The FootballSim UI MUST either show/hide, levitate, or re-flow panes and components on window resize
    - MUST NOT relocate components between panes on window resize
- The FootballSim UI MUST use only 1 pane on compact (under 600dp) and medium (600-839dp) window sizes
    - SHOULD use 2 panes, MAY use at most 3 panes on expanded and large (840-1199dp) window sizes

---

### 5: Design Guidelines

The FootballSim UI components SHOULD comply with platform design guidelines

#### 5.1 Apple HIG

- The FootballSim UI components SHOULD comply with [the Apple Human Interface Guideline (HIG)](https://developer.apple.com/design/human-interface-guidelines)
- The FootballSim UI components MAY choose to borrow some aspects of the Apple HIG while ignoring others

#### 5.2 Google Material Design

- The FootballSim UI components SHOULD comply with [the Google Material Design Guideline](https://m3.material.io/)
- The FootballSim UI components MAY choose to borrow some aspects of the Google Material Design Guideline while ignoring others
- The FootballSim UI components MUST use design tokens to manage design decisions across various contexts
    - For reference, see [material-foundation/material-tokens](https://github.com/material-foundation/material-tokens)
- The FootballSim UI components with multiple interactive elements MUST define primary and secondary user journeys where applicable
