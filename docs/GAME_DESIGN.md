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
- Every 5th stage is planned as a boss stage, but boss stages are not implemented yet.
- Stage rules should become data-driven later so pacing, spawn plans, hazards, rewards, and boss metadata can be tuned without rewriting runtime code.

## Current Player Verb

The current player verbs are movement and shooting. The player ship moves left, right, up, and down across the visible play area using WASD or arrow keys.

Shooting uses Spacebar as the primary fire input. Holding Spacebar fires repeatedly at a controlled cooldown. Pointer press on the screen also triggers a simple single-shot fire input for mouse or touch-friendly html5 embeds. Projectiles are placeholder glowing primitives that travel forward into the scene along the intended enemy approach lane.

## Current Enemy Behavior

Placeholder enemies now spawn from the front/deep space area at varied X and Y positions within the visible play area. They move toward the player along the Z axis and deactivate after passing the player.

Player projectiles can now destroy enemies with simple forgiving collision. Destroyed enemies grant score and currency immediately, and the HUD updates as rewards are earned.

Enemies can now damage the player on direct collision. A collision removes the enemy, reduces lives by 1, and briefly activates player invulnerability so overlapping enemies cannot drain multiple lives immediately.

Enemies currently do not shoot. Enemy visuals, hit feedback, and invulnerability feedback are generated Babylon primitives/code effects only and are not final assets.

## Current Stage Flow

The HUD shows the remaining stage time. During active gameplay, the timer counts down from 35 seconds. When it reaches 0, active gameplay pauses, enemies/projectiles are cleared, and the Stage Clear overlay appears. Continuing advances to the next stage, resets the timer, resets player position, and keeps score, currency, and remaining lives.

Game over still has priority: if lives reach 0 before the timer ends, the game over flow appears instead of stage clear.

## Later Systems

Object pooling is now introduced for player projectiles and placeholder enemies. Pooling is still required later for hazards, effects, pickups, and any repeated temporary objects. This is important for smooth iframe/html5 performance and to avoid garbage collection spikes.
