# Technical Architecture

## Stack

- Vite
- TypeScript
- Babylon.js
- DOM HUD overlay above a full-screen WebGL canvas

## Runtime Boundaries

The code keeps scene setup, player entity behavior, input, HUD, configuration, and utility code in separate folders. Future gameplay systems should continue this pattern so simulation state does not become tightly coupled to Babylon mesh instances.

## Folder Layout

- `src/game`: application bootstrap and Babylon scene creation
- `src/entities`: runtime entities such as the player ship and pooled projectile visual
- `src/systems`: input, starfield, projectile pooling, and later reusable gameplay systems
- `src/config`: constants and later data manifests
- `src/ui`: DOM HUD and styles
- `src/utils`: shared small helpers and types
- `public/assets`: future model, texture, audio, and UI asset folders
- `docs`: design, technical, stage, asset, and changelog documentation

## Performance Notes

The game must run smoothly inside an iframe/html5 environment. The current scene uses a small primitive ship, a lightweight point-based starfield, and pooled player projectiles.

Projectile pooling is implemented for player bullets/projectiles. A limited pool is pre-created, inactive projectiles are hidden and skipped, and firing reuses available instances instead of creating and disposing meshes during gameplay. Later phases must extend object pooling to other frequently spawned objects and should avoid per-frame allocations in hot paths.

## Input

- WASD and arrow keys move the player.
- Spacebar fires forward into the scene with a cooldown for held firing.
- Pointer press can trigger a simple single shot for mouse or touch embeds.

## Future Data

The 30-stage plan should become data-driven later. Stage definitions should cover normal stages lasting around 30-40 seconds, boss stages every 5th stage, spawn pacing, rewards, hazards, and stage-specific presentation.

## Assets

No final assets are included through Phase 1. Projectiles are placeholder visuals generated from Babylon primitives for now. Commercial delivery requires asset licence tracking in `docs/ASSET_REGISTER.md`, including source, author, licence, purchase or attribution notes, and permitted usage.
