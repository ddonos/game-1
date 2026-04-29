# Rail Space Shooter

A 3D HTML5 iframe-friendly forward-rail arcade shooter foundation built with Vite, TypeScript, and Babylon.js.

The current build contains the project foundation plus early gameplay placeholders: a full-screen Babylon canvas, black space scene, lightweight starfield, camera behind the player, placeholder primitive player ship, movement controls, pooled placeholder projectiles, data-driven stage progression, basic/fast/tank placeholder enemies, enemy shooting, enemy destruction rewards, lives, a 35-second stage timer, stage clear flow, Main Menu, Pause Menu, How to Play panel, Missions placeholder, and game over restart flow. Tank enemies require multiple hits, and the player must dodge enemy projectiles. No final assets are included yet.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Controls

- `WASD` or arrow keys: move.
- `Spacebar`: fire.
- `Escape`: pause/resume during gameplay.
- `Enter`: continue after stage clear.
- `R`: restart after game over.
- Mouse or touch press: fire one shot.

## Assets

All assets must be tracked in `docs/ASSET_REGISTER.md`, including licence and commercial-use notes. Phase 0 through Phase 8 use only runtime placeholders and add no final assets.
