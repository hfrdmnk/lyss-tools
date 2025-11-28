-- Schedules: links year, directory, and collection type
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  directory INTEGER NOT NULL,  -- 1-4 for Lyss, 0 for Busswil
  collection_type TEXT NOT NULL,  -- 'papier' or 'karton'
  UNIQUE(year, directory, collection_type)
);

-- Collection dates linked to schedules
CREATE TABLE IF NOT EXISTS collection_dates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL,
  date TEXT NOT NULL,  -- ISO format: YYYY-MM-DD
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

-- Streets with their directory assignments
CREATE TABLE IF NOT EXISTS streets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  house_numbers TEXT,  -- NULL = all numbers, or specific like "18,20,22,24,26"
  directory INTEGER NOT NULL,
  locality TEXT NOT NULL DEFAULT 'lyss',  -- 'lyss' or 'busswil'
  UNIQUE(name, house_numbers, locality)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_streets_name ON streets(name);
CREATE INDEX IF NOT EXISTS idx_streets_locality ON streets(locality);
CREATE INDEX IF NOT EXISTS idx_collection_dates_schedule ON collection_dates(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedules_year ON schedules(year);
