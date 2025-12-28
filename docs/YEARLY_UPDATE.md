# Yearly Update Guide

How to update the Abfallkalender with new dates each year.

## 1. Get the New Calendar

Download the new "Abfall-Sammelkalender" PDF from [lyss.ch](https://www.lyss.ch/de/abfallwirtschaft).

## 2. Update the Data File

Edit `data/2025.json` (rename to the new year, e.g., `data/2026.json`):

```json
{
  "year": 2026,
  "lyss": {
    "streets": [...],  // Usually unchanged
    "schedules": {
      "papier": {
        "1": ["2026-01-...", ...],
        "2": ["2026-01-...", ...],
        "3": ["2026-01-...", ...],
        "4": ["2026-01-...", ...]
      },
      "karton": {
        "1": ["2026-01-...", ...],
        "2": ["2026-01-...", ...],
        "3": ["2026-01-...", ...],
        "4": ["2026-01-...", ...]
      }
    }
  },
  "busswil": {
    "schedules": {
      "papier": {
        "0": ["2026-01-...", ...]
      },
      "karton": {
        "0": ["2026-01-...", ...]
      }
    }
  }
}
```

### Where to Find the Dates

From the PDF:
- **Lyss Papier**: "Strassenverzeichnis 1/2/3+4" rows under "Papier"
- **Lyss Karton**: "Strassenverzeichnis 1/2/3+4" rows under "Karton"
- **Busswil**: "Sammeltage Busswil" section → "Papier/Karton" row

### Date Format

Use ISO format: `YYYY-MM-DD` (e.g., `2026-01-17`)

## 3. Seed the Database

```bash
# Local database
pnpm seed

# Remote (production) database
pnpm seed:remote
```

## 4. Deploy

```bash
pnpm release
```

## 5. Verify

Visit the live site and:
- Check Lyss tab with a street selection
- Check Busswil tab
- Verify dates match the PDF

## Notes

- Streets rarely change; only update if the PDF shows changes
- Directory 1-4 are for Lyss, directory 0 is for Busswil
- The seed script clears old data before inserting new dates
