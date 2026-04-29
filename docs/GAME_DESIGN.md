# Game Design

## Phase 0 Scope

This foundation is for a 3D forward-rail space shooter. The camera sits behind the player ship, the player stays near the camera, and future enemies, hazards, bullets, and power-ups will move from the front of the rail toward the player.

Phase 0 includes only the playable shell: a black space background, lightweight starfield, placeholder primitive player ship, movement controls, and the baseline HUD. No final assets, enemies, shooting, power-ups, shop, bosses, missions, or audio are added in Phase 0.

## Run Structure

- The full game is planned for 30 stages.
- The player has a maximum of 3 lives for the full run.
- Normal stages should last around 30-40 seconds.
- Every 5th stage is a boss stage.
- Stage rules should become data-driven later so pacing, spawn plans, hazards, rewards, and boss metadata can be tuned without rewriting runtime code.

## Current Player Verb

The current player verbs are movement and shooting. The player ship moves left, right, up, and down across the visible play area using WASD or arrow keys.

Shooting uses Spacebar as the primary fire input. Holding Spacebar fires repeatedly at a controlled cooldown. Pointer press on the screen also triggers a simple single-shot fire input for mouse or touch-friendly html5 embeds. Projectiles are placeholder glowing primitives that travel forward into the scene along the intended enemy approach lane.

## Later Systems

Object pooling is now introduced for player projectiles. Pooling is still required later for enemies, hazards, effects, pickups, and any repeated temporary objects. This is important for smooth iframe/html5 performance and to avoid garbage collection spikes.
