# MMA Platform Ranking Algorithm

## Overview
The ranking system awards points to fighters based on fight outcomes and recalculates rankings after each fight result is recorded.

---

## Point System
- **KO/Submission Win**: 4 points
- **Decision Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

---

## Tiebreakers
1. **Win Percentage**: Higher win percentage ranks higher.
2. **Recent Activity**: More recent fight activity ranks higher.

---

## Recalculation
- Rankings are recalculated automatically after every fight result is recorded.
- Only fighters with at least one fight are ranked.
- Rankings are per weight class.

---

## Example
If Fighter A wins by KO, they get 4 points. If Fighter B wins by decision, they get 3 points. If two fighters have the same points, the one with a higher win percentage is ranked higher. If still tied, the more recently active fighter is ranked higher.

---

## Implementation Notes
- The algorithm runs as a background service after fight results are updated.
- Rankings are stored in the `Ranking` entity and exposed via the API. 