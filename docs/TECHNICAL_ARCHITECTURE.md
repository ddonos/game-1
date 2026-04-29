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

Stage timing is handled by `StageSystem`. It owns the current stage countdown and exposes a simple completion signal. `GameApp` wires that into run progression state: active gameplay updates the timer, stage clear pauses gameplay, clears active pools, shows a DOM Stage Clear overlay, and waits for Enter or the Continue button. Continuing increments the stage, resets the timer to 35 seconds, resets the player position, preserves lives/score/currency, hides the overlay, and resumes gameplay. If the cleared stage is the configured final planned stage, the same overlay shows a temporary Run Complete message.

Stage data lives in `src/config/stageConfigs.ts`. Each stage config defines stage number, duration, spawn interval, enemy speed multiplier, weighted enemy type rules, reward multipliers, and whether the stage is a planned boss stage. Enemy archetype data lives in `src/config/enemyTypes.ts` with health, speed multiplier, rewards, collision radius, color, and placeholder scale.

Enemy spawning is weighted by the active stage config. `EnemyPool` keeps pooled enemy instances and applies the selected archetype plus current stage multipliers on spawn. Enemy destruction is health-based: projectile hits reduce health, and rewards by enemy type are granted only when health reaches zero.

Enemy firing rules live on enemy archetype config, with per-type stage unlocks, cooldowns, projectile speed, collision radius, scale, and color. Stage config includes an enemy fire-rate multiplier for later-stage pressure. `EnemyProjectilePool` pre-creates a limited pool of generated projectiles, updates only active projectiles, and clears them on stage clear, game over, run restart, main menu return, and run complete.

Enemy projectile-player collision uses active-only bounding-sphere distance checks with no physics engine or mesh collision. When an enemy projectile hits, combat deactivates it, records one life loss, and the existing player invulnerability/blink flow prevents repeated immediate damage. Enemy projectile updates and enemy firing are state-gated and run only while `GameApp` is in `playing`.

Power-up config lives in `src/config/powerUps.ts`. `PowerUpPool` pre-creates generated pickup visuals, spawns them from deep space on a weighted timer, updates only active pickups, and uses active-only bounding-sphere collision against the player. `EffectSystem` owns temporary player effect state for rapid fire, shield, and score multiplier, plus pending instant repair. Effect timers update only during `playing`, so pause freezes power-up movement and effect duration.

Shield interaction is handled before life loss is consumed: combat records pending damage, then `EffectSystem` blocks it while the shield timer is active before `GameApp` reduces lives and starts invulnerability. Shield is time-based and is not consumed on hit. Score multiplier is applied to pending enemy-destruction score before the HUD state is updated. Active power-ups are cleared on stage clear, run complete, game over, restart, and main menu return; active effects are cleared on game over, restart, and main menu return.

Menu overlays are DOM/CSS modules under `src/ui`: Main Menu, Pause Menu, Game Over, and Stage Clear. `GameApp` owns a small run state union: `mainMenu`, `playing`, `paused`, `stageClear`, `gameOver`, and `runComplete`. Gameplay updates are state-gated so spawning, shooting, movement, combat, hit bursts, and stage timing run only in `playing`. Escape toggles pause only from active gameplay; it does not pause from Main Menu, Game Over, Stage Clear, or Run Complete.

## Input

- WASD and arrow keys move the player.
- Spacebar fires forward into the scene with a cooldown for held firing.
- Pointer press can trigger a simple single shot for mouse or touch embeds.
- Escape pauses/resumes during active gameplay.
- R restarts after game over.
- Enter continues after stage clear.

## Future Data

The 30-stage plan should become data-driven later. Stage definitions should cover normal stages lasting around 30-40 seconds, boss stages every 5th stage, spawn pacing, rewards, hazards, and stage-specific presentation.

## Assets

No final assets are included through Phase 9. Projectiles, enemy projectiles, enemies, power-ups, hit feedback, invulnerability feedback, and menu/progression overlays are placeholder visuals generated from Babylon primitives, code effects, or DOM/CSS for now. No external assets were added. Commercial delivery requires asset licence tracking in `docs/ASSET_REGISTER.md`, including source, author, licence, purchase or attribution notes, and permitted usage.
