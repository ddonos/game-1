# Game Design

## Phase 0 Scope

This foundation is for a 3D forward-rail space shooter. The camera sits behind the player ship, the player stays near the camera, and future enemies, hazards, bullets, and power-ups will move from the front of the rail toward the player.

Phase 0 includes only the playable shell: a black space background, lightweight starfield, placeholder primitive player ship, movement controls, and the baseline HUD. No final assets, enemies, shooting, power-ups, shop, bosses, missions, or audio are added in Phase 0.

## Run Structure

- The full game is planned for 30 stages.
- The player has a maximum of 3 lives for the full run.
- Game over occurs when lives reach 0.
- Normal stages currently use a 35-second timer placeholder.
- Stage clear occurs when the timer reaches 0.
- Score, currency, and remaining lives carry into the next stage.
- Stage progression is now data-driven through per-stage configuration.
- Every 5th stage is marked as a planned boss stage, but boss fights are not implemented yet.

## Current Player Verb

The current player verbs are movement and shooting. The player ship moves left, right, up, and down across the visible play area using WASD or arrow keys.

Shooting uses Spacebar as the primary fire input. Holding Spacebar fires repeatedly at a configurable cooldown. Pointer press on the screen also triggers a simple single-shot fire input for mouse or touch-friendly html5 embeds. The base fire rate is intentionally moderate so rapid fire and future shop fire-rate upgrades have room to feel valuable. Projectiles are placeholder glowing primitives that travel forward into the scene along the intended enemy approach lane.

## Current Enemy Behavior

Placeholder enemies now spawn from the front/deep space area at varied X and Y positions within the visible play area. They move toward the player along the Z axis and deactivate after passing the player.

Player projectiles can now destroy enemies with simple forgiving collision. Destroyed enemies grant score and currency immediately, and the HUD updates as rewards are earned.

Enemies can now damage the player on direct collision. A collision removes the enemy, reduces lives by 1, and briefly activates player invulnerability so overlapping enemies cannot drain multiple lives immediately.

Enemies can now shoot generated placeholder projectiles. Enemy projectiles travel toward the player/camera side, can damage the player, and trigger the same invulnerability window as direct enemy contact.

Enemy shooting is still placeholder/generated visual only. Bosses, shop, missions, power-ups, final assets, and richer enemy behaviors remain future work.

## Enemy Variants

Three generated placeholder enemy variants now exist:

- Basic: balanced speed, normal reward, and 1 hit point.
- Fast: faster, smaller, lower reward, and 1 hit point.
- Tank: slower, larger, higher reward, and multiple hit points.

Projectile hits reduce enemy health. Score and currency are granted only when an enemy is destroyed.

## Current Stage Flow

The HUD shows the remaining stage time. During active gameplay, the timer counts down from 35 seconds. When it reaches 0, active gameplay pauses, enemies/projectiles are cleared, and the Stage Clear overlay appears. Continuing advances to the next stage, resets the timer, resets player position, and keeps score, currency, and remaining lives.

Game over still has priority: if lives reach 0 before the timer ends, the game over flow appears instead of stage clear.

## Power-Ups

Generated placeholder power-ups now spawn from deep space, move toward the player, and are collected by direct player contact. Current power-ups are repair, rapid fire, shield, and score multiplier.

- Repair restores 1 life immediately and cannot exceed the 3-life maximum.
- Rapid fire temporarily reduces the player fire cooldown.
- Shield blocks player damage from enemy contact and enemy projectiles for its active duration.
- Score multiplier temporarily increases score gained from destroyed enemies.

Temporary effects expire automatically. Shop and permanent upgrades are still future work; future fire-rate upgrades should reduce the cooldown further while respecting the configured minimums.

## Menus

The game now starts from a Main Menu instead of immediately starting gameplay. The Main Menu includes Play, How to Play, and a Missions placeholder panel. The How to Play panel lists movement, firing, survival, enemy destruction, enemy avoidance, and stage-clear goals. The Missions panel is placeholder only and does not implement mission logic yet.

Pause Menu is available only during active gameplay with Escape. While Main Menu or Pause Menu is active, gameplay systems do not run: the player cannot shoot, enemies do not spawn or move, projectiles do not advance, and the stage timer does not count down.

## Later Systems

Object pooling is now introduced for player projectiles, enemy projectiles, placeholder enemies, and power-ups. Pooling is still required later for hazards, effects, pickups, and any repeated temporary objects. This is important for smooth iframe/html5 performance and to avoid garbage collection spikes.
