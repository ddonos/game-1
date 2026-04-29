# Stage Design

## Structure

The full game is planned as a 30-stage run with a maximum of 3 lives. The current implementation supports data-driven stage progression with a 35-second normal-stage timer placeholder. Every 5th stage remains planned as a boss stage, but boss behavior is future work.

## Stage Progression

| Stage | Type | Enemy Mix Direction |
| --- | --- | --- |
| 1 | Normal | Basic only |
| 2 | Normal | Basic with early fast enemies |
| 3 | Normal | More fast enemies |
| 4 | Normal | Tanks introduced lightly |
| 5 | Boss planned | Boss flag set; temporary normal spawning |
| 6 | Normal | Faster spawn pace |
| 7 | Normal | More mixed pressure |
| 8 | Normal | Basic/fast/tank mix |
| 9 | Normal | Higher tank presence |
| 10 | Boss planned | Boss flag set; temporary normal spawning |
| 11 | Normal | Increased speed multiplier |
| 12 | Normal | Heavier mixed waves |
| 13 | Normal | More tank pressure |
| 14 | Normal | Shorter spawn intervals |
| 15 | Boss planned | Boss flag set; temporary normal spawning |
| 16 | Normal | Faster overall movement |
| 17 | Normal | Balanced fast/tank pressure |
| 18 | Normal | High mixed intensity |
| 19 | Normal | Tanks become common |
| 20 | Boss planned | Boss flag set; temporary normal spawning |
| 21 | Normal | Late-run pressure starts |
| 22 | Normal | Short spawn intervals |
| 23 | Normal | High speed multiplier |
| 24 | Normal | High tank mix |
| 25 | Boss planned | Boss flag set; temporary normal spawning |
| 26 | Normal | Final stretch pressure |
| 27 | Normal | Very short spawn intervals |
| 28 | Normal | High speed and tank mix |
| 29 | Normal | Peak normal-stage pressure |
| 30 | Boss planned | Boss flag set; temporary normal spawning |

## Future Data-Driven Plan

Stage metadata now lives in TypeScript config and defines duration, boss flag, spawn interval, enemy speed multiplier, weighted enemy mix, reward multipliers, and enemy shooting pressure. Later stages may increase shooting pressure through stage fire-rate multipliers. Later phases should expand this into richer spawn plans, hazard plans, boss behavior, reward tuning, and presentation notes.
