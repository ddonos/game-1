# Game Changelog

## Phase 9A

### What Changed

- Fixed shield behavior so it blocks all player damage for its full active duration.
- Shield no longer deactivates after the first blocked direct enemy hit or enemy projectile hit.
- Existing hit cleanup remains: direct enemy collisions still deactivate enemies, and enemy projectile hits still deactivate projectiles.
- Invulnerability is not triggered when shield blocks damage.

### Files Changed

- `src/systems/EffectSystem.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Shield visuals remain a placeholder HUD timer only.

### Next Recommended Step

- Add a lightweight in-scene shield visual around the player while shield is active.

## Phase 9

### What Changed

- Added generated placeholder power-up entity visuals.
- Added pooled `PowerUpPool` with reusable active/inactive pickups.
- Added weighted power-up spawning from deep space.
- Added player collection using simple bounding-sphere collision.
- Added repair, rapid fire, shield, and score multiplier power-up types.
- Added temporary effect handling through `EffectSystem`.
- Rapid fire temporarily reduces player fire cooldown.
- Shield absorbs/prevents damage from direct enemy contact and enemy projectiles.
- Score multiplier increases score gained from enemy destruction.
- Repair restores 1 life without exceeding the 3-life maximum.
- Added a compact HUD effects display with remaining effect time.
- Power-up updates and effect timers are state-gated to active gameplay.

### Files Changed

- `src/config/powerUps.ts`
- `src/entities/PowerUp.ts`
- `src/game/GameApp.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/EffectSystem.ts`
- `src/systems/PowerUpPool.ts`
- `src/systems/ProjectilePool.ts`
- `src/ui/hud.ts`
- `src/ui/styles.css`
- `src/utils/types.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/STAGE_DESIGN.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Power-up visuals and tuning are placeholders.
- Shop, permanent upgrades, boss fights, mission logic, audio, saving/loading, leaderboard, and final assets are not implemented in Phase 9.
- Power-up frequency is global for now rather than stage-specific.

### Next Recommended Step

- Add stage-tuned pickup frequency or a first pass at mission tracking.

## Phase 8

### What Changed

- Added generated placeholder enemy projectiles.
- Added `EnemyProjectilePool` with pre-created reusable projectiles.
- Added enemy firing rules to enemy archetype config.
- Added stage fire-rate multiplier support for later-stage shooting pressure.
- Active enemies can now fire pooled projectiles toward the player.
- Added enemy projectile-player bounding-sphere collision.
- Enemy projectile hits reduce lives, update HUD, trigger invulnerability, and can trigger game over.
- Enemy projectiles are cleared on stage clear, game over, run complete, restart, and main menu return.
- Enemy firing and enemy projectile updates are state-gated to active gameplay only.

### Files Changed

- `src/config/enemyTypes.ts`
- `src/config/gameConfig.ts`
- `src/config/stageConfigs.ts`
- `src/entities/Enemy.ts`
- `src/entities/EnemyProjectile.ts`
- `src/game/GameApp.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/EnemyPool.ts`
- `src/systems/EnemyProjectilePool.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/STAGE_DESIGN.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Boss fights, shop, mission logic, power-ups, audio, saving/loading, leaderboard, and final assets are not implemented in Phase 8.
- Enemy projectile visuals and firing patterns are placeholders.
- Boss stages remain marked only and use temporary normal spawning.

### Next Recommended Step

- Add richer scripted spawn and firing patterns from stage config, or begin a boss-stage placeholder flow.

## Phase 7

### What Changed

- Added typed data-driven configuration for all 30 planned stages.
- Stage configs now include duration, spawn interval, enemy speed multiplier, enemy type weights, reward multipliers, and boss-stage flags.
- Marked stages 5, 10, 15, 20, 25, and 30 as planned boss stages in config only.
- Added basic, fast, and tank enemy archetype config.
- Enemy spawning now uses current stage weighted enemy type rules.
- Enemy spawn intervals and speed scaling now come from the active stage config.
- Added enemy health; tanks require multiple projectile hits before destruction.
- Rewards now come from enemy type config and are scaled by the active stage config.
- Added generated placeholder visual differences for enemy variants using color and scale.

### Files Changed

- `src/config/enemyTypes.ts`
- `src/config/gameConfig.ts`
- `src/config/stageConfigs.ts`
- `src/entities/Enemy.ts`
- `src/game/GameApp.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/EnemyPool.ts`
- `src/systems/StageSystem.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/STAGE_DESIGN.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Boss stages are marked in config but boss fights are not implemented.
- Enemy shooting, shop, mission logic, power-ups, audio, saving/loading, leaderboard, and final assets are not implemented in Phase 7.
- Stage configs are TypeScript data for now rather than external JSON or tooling-driven content.

### Next Recommended Step

- Add boss-stage placeholder flow or richer scripted spawn patterns from stage config.

## Phase 6

### What Changed

- Added a Main Menu overlay shown before gameplay starts.
- Main Menu includes Play, How to Play, Missions placeholder, and footer text.
- Added How to Play guidance for movement, firing, survival, rewards, enemy avoidance, and stage clearing.
- Added Missions placeholder panel with example mission text.
- Added a Pause Menu overlay available only during active gameplay with Escape.
- Pause Menu supports Resume, Restart Run, and Back to Main Menu.
- Replaced fragile menu/progression booleans with explicit run states: `mainMenu`, `playing`, `paused`, `stageClear`, `gameOver`, and `runComplete`.
- Gameplay updates are gated so movement, shooting, spawning, combat, hit bursts, and timer updates run only while playing.
- Back to Main Menu clears active gameplay objects, resets the run, hides gameplay overlays, and shows Main Menu.

### Files Changed

- `src/game/GameApp.ts`
- `src/main.ts`
- `src/systems/InputController.ts`
- `src/ui/hud.ts`
- `src/ui/mainMenuOverlay.ts`
- `src/ui/pauseMenuOverlay.ts`
- `src/ui/styles.css`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Missions are placeholder text only and have no logic.
- Shop, power-ups, boss stages, enemy shooting, audio, saving/loading, leaderboard, and final assets are not implemented in Phase 6.
- Menus use generated DOM/CSS only and are not final art.

### Next Recommended Step

- Add data-driven stage configuration or the first real mission tracking pass.

## Phase 5

### What Changed

- Added a stage timer system with a configurable 35-second normal-stage placeholder duration.
- Added remaining stage time to the HUD.
- Timer counts down only during active gameplay.
- Added stage clear state when the timer reaches 0.
- Stage clear stops gameplay, enemy spawning, and player shooting, then clears active enemies/projectiles/hit bursts.
- Added a simple DOM Stage Clear overlay with cleared stage, score, currency, lives, Continue button, and Enter instruction.
- Added continue-to-next-stage flow that increments stage, resets timer/player position, and preserves lives, score, and currency.
- Added temporary Run Complete handling for clearing the final planned stage.

### Files Changed

- `src/config/gameConfig.ts`
- `src/game/GameApp.ts`
- `src/main.ts`
- `src/systems/InputController.ts`
- `src/systems/StageSystem.ts`
- `src/ui/hud.ts`
- `src/ui/stageClearOverlay.ts`
- `src/ui/styles.css`
- `src/utils/types.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/STAGE_DESIGN.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Boss stages and boss fights are still not implemented.
- Per-stage difficulty, stage-specific spawn plans, missions, shop, power-ups, audio, and final assets are not implemented in Phase 5.
- Run Complete is a temporary overlay state, not a final ending sequence.

### Next Recommended Step

- Add data-driven stage configuration for duration, spawn pacing, and difficulty scaling.

## Phase 4

### What Changed

- Added enemy-player collision using active-enemy bounding-sphere distance checks.
- Enemy contact now deactivates the enemy, reduces player lives by 1, and updates the HUD immediately.
- Added a 1.5 second player invulnerability window after damage.
- Added lightweight player blinking during invulnerability.
- Added game over state when lives reach 0.
- Game over stops active gameplay updates, enemy spawning, and player shooting.
- Added a simple DOM game over overlay with final score, final currency, and restart controls.
- Added restart via `R` or the overlay Restart button.
- Restart resets lives, score, currency, stage, active pools, player position, and overlay visibility.

### Files Changed

- `src/config/gameConfig.ts`
- `src/entities/HitBurst.ts`
- `src/entities/PlayerShip.ts`
- `src/game/GameApp.ts`
- `src/main.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/EnemyPool.ts`
- `src/systems/HitFeedbackPool.ts`
- `src/systems/InputController.ts`
- `src/systems/ProjectilePool.ts`
- `src/ui/gameOverOverlay.ts`
- `src/ui/styles.css`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Enemies still do not shoot.
- Stage timer, stage clear, bosses, missions, shop, power-ups, audio, and final assets are not implemented in Phase 4.
- Game over and invulnerability visuals are generated placeholders.

### Next Recommended Step

- Add a simple stage timer and stage clear flow for normal stages.

## Phase 3

### What Changed

- Added simple projectile-enemy collision using bounding-sphere distance checks.
- Active projectiles are checked only against active enemies; no mesh collision or physics engine is used.
- Projectile hits now deactivate the projectile and enemy so both pools remain reusable.
- Destroyed enemies grant score and currency rewards from config.
- HUD score and currency update immediately after rewards are applied.
- Added a tiny pooled placeholder hit burst for lightweight destruction feedback.

### Files Changed

- `src/config/gameConfig.ts`
- `src/entities/Enemy.ts`
- `src/entities/HitBurst.ts`
- `src/entities/Projectile.ts`
- `src/game/GameApp.ts`
- `src/systems/CombatSystem.ts`
- `src/systems/EnemyPool.ts`
- `src/systems/HitFeedbackPool.ts`
- `src/systems/ProjectilePool.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Enemies do not shoot or damage the player yet.
- Lives loss, game over, stage timer, bosses, missions, shop, power-ups, audio, and final assets are not implemented in Phase 3.
- Hit feedback is a generated placeholder, not a final explosion or effect system.

### Next Recommended Step

- Add player damage from enemies that pass or contact the player, including lives and game-over flow.

## Phase 2

### What Changed

- Added a placeholder enemy entity built from Babylon primitives.
- Added enemy pooling so enemies are pre-created, hidden while inactive, and reused.
- Added a spawn system that creates readable enemy waves from the front/deep space area.
- Enemies spawn at varied X/Y positions, move toward the player along the Z axis, and deactivate after passing the player.
- Added enemy configuration for speed, pool size, spawn interval, spawn bounds, and deactivation distance.

### Files Changed

- `src/config/gameConfig.ts`
- `src/entities/Enemy.ts`
- `src/game/GameApp.ts`
- `src/systems/EnemyPool.ts`
- `docs/GAME_DESIGN.md`
- `docs/TECHNICAL_ARCHITECTURE.md`
- `docs/ASSET_REGISTER.md`
- `docs/CHANGELOG_GAME.md`
- `README.md`

### Tests/Build Commands Run

- `npm run build`

### Known Issues

- Enemies do not collide with projectiles yet.
- Enemies do not shoot, damage the player, grant score, or grant currency.
- Bosses, missions, shop, power-ups, audio, and final assets are not implemented in Phase 2.
- Enemy visuals are generated placeholders, not final assets.

### Next Recommended Step

- Add projectile-enemy collision with pooled enemy deactivation and basic score updates.

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
