# FBSim UI

> A library of ES and NodeJS-compatible web components used across FootballSim UI implementations

## Overview

Browser-native web components written in TypeScript. These components interact with a service abstraction layer with implementations for both the [FBSim Core WASM library](https://github.com/whatsacomputertho/fbsim-core) (for local in-browser use) and the [FBSim REST API](https://github.com/whatsacomputertho/fbsim-api) (for use over the network).

## Usage

### Component Demos

Each web component has a dedicated demo page for viewing it in isolation during development. Run the Vite dev server with hot-reload:

```sh
make dev
```

This starts a local server (default `http://localhost:5173`). The root page links to each component demo:

- [`demo/wact-nav.html`](demo/wact-nav.html) — Sticky navigation bar
- [`demo/wact-team-select.html`](demo/wact-team-select.html) — Team selection inputs
- [`demo/wact-matchup-select.html`](demo/wact-matchup-select.html) — Home/away matchup selection
- [`demo/wact-box-score.html`](demo/wact-box-score.html) — Game score display
- [`demo/wact-game-sim.html`](demo/wact-game-sim.html) — Full simulation orchestrator
- [`demo/wact-feedback-ribbon.html`](demo/wact-feedback-ribbon.html) — Feedback/notification ribbon

Changes to source files in `src/` are reflected in the browser in real-time via Vite's hot module replacement.

### Development Recipes

Various `make` recipes are defined in this project's [Makefile](Makefile) which are used in CI and are useful locally for development
- `dev`: Starts the Vite dev server with hot-reload for component demos
- `dependencies`: Runs `npm ci` to install required dev and prod dependencies
- `test`: Runs `npx vitest run` to run the unit tests for each web component
- `build`: Compiles the library into ES and Node-compatible distributions and tests the distributions
- `sec`: Runs `npm audit` to audit the project's dependencies
