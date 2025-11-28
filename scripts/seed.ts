import { execFileSync } from "child_process";
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Street {
  name: string;
  directory: number;
  houseNumbers?: string;
}

interface YearData {
  year: number;
  lyss: {
    streets: Street[];
    schedules: {
      papier: Record<string, string[]>;
      karton: Record<string, string[]>;
    };
  };
  busswil: {
    streets: Street[];
    schedules: {
      papier: Record<string, string[]>;
      karton: Record<string, string[]>;
    };
  };
}

function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}

function runSQLFile(filePath: string, remote: boolean = false): void {
  const args = ["wrangler", "d1", "execute", "lyss-abfallkalender"];
  args.push(remote ? "--remote" : "--local");
  args.push("--file", filePath);

  execFileSync("npx", args, { stdio: "inherit" });
}

function seed(remote: boolean = false) {
  const dataDir = join(__dirname, "../data");
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  console.log(`Seeding ${remote ? "remote" : "local"} database...`);

  for (const file of files) {
    const data: YearData = JSON.parse(readFileSync(join(dataDir, file), "utf-8"));
    const year = data.year;

    console.log(`Processing year ${year}...`);

    const sqlStatements: string[] = [];

    // Clear existing data for this year
    sqlStatements.push(`DELETE FROM collection_dates WHERE schedule_id IN (SELECT id FROM schedules WHERE year = ${year});`);
    sqlStatements.push(`DELETE FROM schedules WHERE year = ${year};`);
    sqlStatements.push(`DELETE FROM streets;`);

    // Insert Lyss streets
    for (const street of data.lyss.streets) {
      const houseNumbers = street.houseNumbers ? `'${escapeSQL(street.houseNumbers)}'` : "NULL";
      sqlStatements.push(
        `INSERT INTO streets (name, house_numbers, directory, locality) VALUES ('${escapeSQL(street.name)}', ${houseNumbers}, ${street.directory}, 'lyss');`
      );
    }

    // Insert Busswil streets
    for (const street of data.busswil.streets) {
      const houseNumbers = street.houseNumbers ? `'${escapeSQL(street.houseNumbers)}'` : "NULL";
      sqlStatements.push(
        `INSERT INTO streets (name, house_numbers, directory, locality) VALUES ('${escapeSQL(street.name)}', ${houseNumbers}, ${street.directory}, 'busswil');`
      );
    }

    // Track schedule IDs manually since we can't get them from INSERT in D1
    let scheduleId = 1;
    const scheduleMap: Record<string, number> = {};

    // Insert Lyss schedules
    for (const directory of Object.keys(data.lyss.schedules.papier)) {
      sqlStatements.push(
        `INSERT INTO schedules (year, directory, collection_type) VALUES (${year}, ${directory}, 'papier');`
      );
      scheduleMap[`lyss-papier-${directory}`] = scheduleId++;
    }

    for (const directory of Object.keys(data.lyss.schedules.karton)) {
      sqlStatements.push(
        `INSERT INTO schedules (year, directory, collection_type) VALUES (${year}, ${directory}, 'karton');`
      );
      scheduleMap[`lyss-karton-${directory}`] = scheduleId++;
    }

    // Insert Busswil schedules
    for (const directory of Object.keys(data.busswil.schedules.papier)) {
      sqlStatements.push(
        `INSERT INTO schedules (year, directory, collection_type) VALUES (${year}, ${directory}, 'papier');`
      );
      scheduleMap[`busswil-papier-${directory}`] = scheduleId++;
    }

    for (const directory of Object.keys(data.busswil.schedules.karton)) {
      sqlStatements.push(
        `INSERT INTO schedules (year, directory, collection_type) VALUES (${year}, ${directory}, 'karton');`
      );
      scheduleMap[`busswil-karton-${directory}`] = scheduleId++;
    }

    // Insert collection dates for Lyss
    for (const [directory, dates] of Object.entries(data.lyss.schedules.papier)) {
      const sid = scheduleMap[`lyss-papier-${directory}`];
      for (const date of dates) {
        sqlStatements.push(`INSERT INTO collection_dates (schedule_id, date) VALUES (${sid}, '${date}');`);
      }
    }

    for (const [directory, dates] of Object.entries(data.lyss.schedules.karton)) {
      const sid = scheduleMap[`lyss-karton-${directory}`];
      for (const date of dates) {
        sqlStatements.push(`INSERT INTO collection_dates (schedule_id, date) VALUES (${sid}, '${date}');`);
      }
    }

    // Insert collection dates for Busswil
    for (const [directory, dates] of Object.entries(data.busswil.schedules.papier)) {
      const sid = scheduleMap[`busswil-papier-${directory}`];
      for (const date of dates) {
        sqlStatements.push(`INSERT INTO collection_dates (schedule_id, date) VALUES (${sid}, '${date}');`);
      }
    }

    for (const [directory, dates] of Object.entries(data.busswil.schedules.karton)) {
      const sid = scheduleMap[`busswil-karton-${directory}`];
      for (const date of dates) {
        sqlStatements.push(`INSERT INTO collection_dates (schedule_id, date) VALUES (${sid}, '${date}');`);
      }
    }

    // Write SQL to temporary file
    const tempFile = join(__dirname, `seed-${year}.sql`);
    writeFileSync(tempFile, sqlStatements.join("\n"));

    // Execute the SQL file
    runSQLFile(tempFile, remote);

    // Clean up temp file
    unlinkSync(tempFile);

    console.log(`Year ${year} seeded successfully!`);
  }

  console.log("Seeding complete!");
}

// Run with --remote flag to seed remote database
const isRemote = process.argv.includes("--remote");
seed(isRemote);
