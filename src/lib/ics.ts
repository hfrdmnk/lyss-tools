interface IcsEvent {
  summary: string;
  date: string; // YYYY-MM-DD
  uid: string;
  description?: string;
}

function formatDate(date: string): string {
  return date.replace(/-/g, "");
}

function getCurrentTimestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function generateVEvent(event: IcsEvent): string {
  const dateFormatted = formatDate(event.date);
  const lines = [
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${dateFormatted}`,
    `DTSTAMP:${getCurrentTimestamp()}`,
    `UID:${event.uid}`,
    `SUMMARY:${event.summary}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${event.description}`);
  }

  lines.push("END:VEVENT");
  return lines.join("\r\n");
}

export function generateIcs(events: IcsEvent[], calendarName: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Abfallkalender Lyss//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${calendarName}`,
    ...events.map((event) => generateVEvent(event)),
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function createCollectionEvents(
  dates: string[],
  type: "papier" | "karton",
  street: string,
  year: number
): IcsEvent[] {
  const typeLabel = type === "papier" ? "Papiersammlung" : "Kartonsammlung";

  return dates.map((date) => ({
    summary: typeLabel,
    date,
    uid: `${date}-${type}-${street.replace(/\s+/g, "-").toLowerCase()}@abfallkalender-lyss.ch`,
    description: `${typeLabel} für ${street}`,
  }));
}
