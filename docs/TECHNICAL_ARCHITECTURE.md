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
- `src/entities`: runtime entities such as the player ship, pooled projectile visual, and placeholder enemy
- `src/systems`: input, starfield, projectile pooling, enemy pooling/spawning, and later reusable gameplay systems
- `src/config`: constants and later data manifests
- `src/ui`: DOM HUD and styles
- `src/utils`: shared small helpers and types
- `public/assets`: future model, texture, audio, and UI asset folders
- `docs`: design, technical, stage, asset, and changelog documentation

## Performance Notes

The game must run smoothly inside an iframe/html5 environment. The current scene uses a small primitive ship, a lightweight point-based starfield, pooled player projectiles, and pooled placeholder enemies.

Projectile pooling is implemented for player bullets/projectiles. A limited pool is pre-created, inactive projectiles are hidden and skipped, and firing reuses available instances instead of creating and disposing meshes during gameplay. Later phases must extend object pooling to other frequently spawned objects and should avoid per-frame allocations in hot paths.

Enemy pooling is implemented for placeholder enemies. A limited pool is pre-created, inactive enemies are disabled and skipped, and the spawn system reuses available enemies at a readable interval. Enemies spawn from deep space with varied X/Y positions, move toward the player along the Z axis, and deactivate after passing the player.

Combat uses simple bounding-sphere distance checks. Active player projectiles are checked against active enemies for rewards, and active enemies are checked against the player for direct damage. It does not use Babylon mesh collision or a physics engine.

On projectile hit, the combat system deactivates the projectile and enemy, spawns a small pooled placeholder hit burst, records score/currency rewards, and `GameApp` applies those rewards to the shared HUD state. On player hit, the combat system deactivates the enemy and records one life loss.

Player invulnerability is tracked on the player entity after damage. While invulnerable, enemy-player collisions do not reduce lives, and the player ship blinks using generated visibility toggles. Game over is a simple run state in `GameApp`: active gameplay updates pause, spawning/shooting stop, pools are cleared, and a DOM overlay shows final score/currency. Restart via `R` or the overlay button resets run state, clears active pools, resets the player, hides the overlay, and resumes gameplay.

## Input

- WASD and arrow keys move the player.
- Spacebar fires forward into the scene with a cooldown for held firing.
- Pointer press can trigger a simple single shot for mouse or touch embeds.
- R restarts after game over.

## Future Data

The 30-stage plan should become data-driven later. Stage definitions should cover normal stages lasting around 30-40 seconds, boss stages every 5th stage, spawn pacing, rewards, hazards, and stage-specific presentation.

## Assets

No final assets are included through Phase 4. Projectiles, enemies, hit feedback, and invulnerability feedback are placeholder visuals generated from Babylon primitives or code effects for now. No external assets were added. Commercial delivery requires asset licence tracking in `docs/ASSET_REGISTER.md`, including source, author, licence, purchase or attribution notes, and permitted usage.
