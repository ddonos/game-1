# Technical Architecture

## Stack

- Vite
- TypeScript
- Babylon.js
- DOM HUD overlay above a full-screen WebGL canvas

## Runtime Boundaries

The Phase 0 code keeps scene setup, player entity behavior, input, HUD, configuration, and utility code in separate folders. Future gameplay systems should continue this pattern so simulation state does not become tightly coupled to Babylon mesh instances.

## Folder Layout

- `src/game`: application bootstrap and Babylon scene creation
- `src/entities`: runtime entities such as the player ship
- `src/systems`: input, starfield, and later reusable gameplay systems
- `src/config`: constants and later data manifests
- `src/ui`: DOM HUD and styles
- `src/utils`: shared small helpers and types
- `public/assets`: future model, texture, audio, and UI asset folders
- `docs`: design, technical, stage, asset, and changelog documentation

## Performance Notes

The game must run smoothly inside an iframe/html5 environment. Phase 0 uses a small primitive ship and a lightweight point-based starfield. Later phases must use object pooling for frequently spawned objects and should avoid per-frame allocations in hot paths.

## Future Data

The 30-stage plan should become data-driven later. Stage definitions should cover normal stages lasting around 30-40 seconds, boss stages every 5th stage, spawn pacing, rewards, hazards, and stage-specific presentation.

## Assets

No final assets are included in Phase 0. Commercial delivery requires asset licence tracking in `docs/ASSET_REGISTER.md`, including source, author, licence, purchase or attribution notes, and permitted usage.
