# Stage Design

## Structure

The full game is planned as a 30-stage run with a maximum of 3 lives. The current implementation supports basic stage progression with a 35-second normal-stage timer placeholder. Every 5th stage remains planned as a boss stage, but boss fights are not implemented yet.

## Stage Map

| Stage | Type |
| --- | --- |
| 1 | Normal |
| 2 | Normal |
| 3 | Normal |
| 4 | Normal |
| 5 | Boss |
| 6 | Normal |
| 7 | Normal |
| 8 | Normal |
| 9 | Normal |
| 10 | Boss |
| 11 | Normal |
| 12 | Normal |
| 13 | Normal |
| 14 | Normal |
| 15 | Boss |
| 16 | Normal |
| 17 | Normal |
| 18 | Normal |
| 19 | Normal |
| 20 | Boss |
| 21 | Normal |
| 22 | Normal |
| 23 | Normal |
| 24 | Normal |
| 25 | Boss |
| 26 | Normal |
| 27 | Normal |
| 28 | Normal |
| 29 | Normal |
| 30 | Boss |

## Future Data-Driven Plan

Later phases should move stage metadata into data files. Those files should define duration, boss status, spawn plans, hazard plans, reward tuning, difficulty changes, and presentation notes. Actual per-stage difficulty configuration is still future work.
