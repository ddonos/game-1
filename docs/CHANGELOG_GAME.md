# Game Changelog

## Phase 1

### What Changed

- Added Spacebar player firing with a controlled cooldown for held fire.
- Added simple pointer press firing for mouse or touch-friendly embeds.
- Added glowing placeholder player projectiles that travel forward into the scene.
- Added projectile pooling so shots reuse pre-created meshes instead of creating and disposing objects during gameplay.
- Added projectile deactivation after maximum travel distance.

### Files Changed

- `src/config/gameConfig.ts`
- `src/entities/PlayerShip.ts`
- `src/entities/Projectile.ts`
- `src/game/GameApp.ts`
- `src/systems/InputController.ts`
- `src/systems/ProjectilePool.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Projectiles do not collide with anything yet.
- No enemies, scoring, audio, power-ups, missions, shop, or bosses are implemented in Phase 1.
- Projectile visuals are generated placeholders, not final assets.

### Next Recommended Step

- Add a minimal enemy placeholder and collision pass using pooled enemy objects.

## Phase 0

- Created initial Vite, TypeScript, and Babylon.js project foundation.
- Added a full-screen canvas suitable for iframe/html5 embedding.
- Added a black space scene with a lightweight starfield.
- Added a camera positioned behind the player and looking forward.
- Added a placeholder player ship built from simple Babylon primitives.
- Added WASD and arrow-key movement clamped to the visible play area.
- Added a simple DOM HUD showing Lives: 3, Score: 0, Currency: 0, and Stage: 1.
- Added documentation for the 30-stage structure, 3 lives maximum, boss stages every 5th stage, normal 30-40 second stage duration, future data-driven stage definitions, required object pooling, asset licence tracking, and the absence of final assets in Phase 0.
