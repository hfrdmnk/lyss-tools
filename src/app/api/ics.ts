import type { AppContext } from "@/worker";
import { generateIcs, createCollectionEvents } from "@/lib/ics";

export async function getIcs({ ctx, request }: { ctx: AppContext; request: Request }) {
  const url = new URL(request.url);
  const street = url.searchParams.get("street");
  const houseNumber = url.searchParams.get("houseNumber");
  const yearParam = url.searchParams.get("year");
  const type = url.searchParams.get("type") as "papier" | "karton" | "all" | null;
  const singleDate = url.searchParams.get("date"); // For single event download

  if (!street) {
    return new Response(JSON.stringify({ error: "street parameter required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  const collectionType = type || "all";
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Find the street's directory (reuse logic from schedule.ts)
  const streetResults = await ctx.db
    .prepare(
      `SELECT id, name, house_numbers as houseNumbers, directory, locality
       FROM streets WHERE name = ?`
    )
    .bind(street)
    .all<{
      id: number;
      name: string;
      houseNumbers: string | null;
      directory: number;
      locality: string;
    }>();

  if (!streetResults.results || streetResults.results.length === 0) {
    return new Response(JSON.stringify({ error: "Street not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Find the best match based on house number (synced with schedule.ts)
  let selectedStreet = streetResults.results[0];

  if (houseNumber && streetResults.results.length > 1) {
    const houseNum = parseInt(houseNumber, 10);

    // Look for a specific range that includes this house number
    for (const s of streetResults.results) {
      if (s.houseNumbers) {
        const numbers = s.houseNumbers.split(",").map((n: string) => n.trim());
        // Check if it's a range (e.g., "61-98") or specific numbers
        for (const num of numbers) {
          if (num.includes("-")) {
            const [start, end] = num.split("-").map((n: string) => parseInt(n.trim(), 10));
            if (houseNum >= start && houseNum <= end) {
              selectedStreet = s;
              break;
            }
          } else if (parseInt(num, 10) === houseNum) {
            selectedStreet = s;
            break;
          }
        }
      }
    }

    // If no specific match found, use the entry without house numbers (general)
    if (selectedStreet.houseNumbers && !streetResults.results.find((s) => !s.houseNumbers)) {
      // Keep the first match
    } else {
      const generalEntry = streetResults.results.find((s) => !s.houseNumbers);
      if (generalEntry && selectedStreet.houseNumbers) {
        // Check if the house number matches any specific entry
        let hasSpecificMatch = false;
        for (const s of streetResults.results) {
          if (s.houseNumbers) {
            const numbers = s.houseNumbers.split(",").map((n: string) => n.trim());
            for (const num of numbers) {
              if (num.includes("-")) {
                const [start, end] = num.split("-").map((n: string) => parseInt(n.trim(), 10));
                if (houseNum >= start && houseNum <= end) {
                  hasSpecificMatch = true;
                  selectedStreet = s;
                  break;
                }
              } else if (parseInt(num, 10) === houseNum) {
                hasSpecificMatch = true;
                selectedStreet = s;
                break;
              }
            }
            if (hasSpecificMatch) break;
          }
        }
        if (!hasSpecificMatch) {
          selectedStreet = generalEntry;
        }
      }
    }
  } else if (!houseNumber && streetResults.results.length > 1) {
    // If no house number provided, prefer the general entry (without house numbers)
    const generalEntry = streetResults.results.find((s) => !s.houseNumbers);
    if (generalEntry) {
      selectedStreet = generalEntry;
    }
  }

  // Get dates based on type
  const allEvents: ReturnType<typeof createCollectionEvents> = [];

  if (collectionType === "papier" || collectionType === "all") {
    const papierDates = await ctx.db
      .prepare(
        `SELECT cd.date FROM collection_dates cd
         JOIN schedules s ON cd.schedule_id = s.id
         WHERE s.year = ? AND s.directory = ? AND s.collection_type = 'papier'
         ORDER BY cd.date ASC`
      )
      .bind(year, selectedStreet.directory)
      .all<{ date: string }>();

    let dates = papierDates.results?.map((r) => r.date).filter((d) => d >= today) || [];
    if (singleDate) {
      dates = dates.filter((d) => d === singleDate);
    }
    allEvents.push(...createCollectionEvents(dates, "papier", street, year));
  }

  if (collectionType === "karton" || collectionType === "all") {
    const kartonDates = await ctx.db
      .prepare(
        `SELECT cd.date FROM collection_dates cd
         JOIN schedules s ON cd.schedule_id = s.id
         WHERE s.year = ? AND s.directory = ? AND s.collection_type = 'karton'
         ORDER BY cd.date ASC`
      )
      .bind(year, selectedStreet.directory)
      .all<{ date: string }>();

    let dates = kartonDates.results?.map((r) => r.date).filter((d) => d >= today) || [];
    if (singleDate) {
      dates = dates.filter((d) => d === singleDate);
    }
    allEvents.push(...createCollectionEvents(dates, "karton", street, year));
  }

  // Generate filename
  let filename: string;
  if (singleDate) {
    filename = `abfallkalender-${singleDate}.ics`;
  } else if (collectionType === "all") {
    filename = `abfallkalender-lyss-${year}.ics`;
  } else {
    filename = `${collectionType}-${year}.ics`;
  }

  const calendarName =
    collectionType === "all"
      ? `Abfallkalender ${street} ${year}`
      : `${collectionType === "papier" ? "Papier" : "Karton"} ${street} ${year}`;

  const icsContent = generateIcs(allEvents, calendarName);

  return new Response(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
