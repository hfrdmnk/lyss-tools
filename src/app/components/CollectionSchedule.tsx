"use client";

interface ScheduleData {
  street: string;
  houseNumbers: string | null;
  locality: string;
  directory: number;
  papier: string[];
  karton: string[];
}

interface CollectionScheduleProps {
  schedule: ScheduleData | null;
  loading?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-CH", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

function getNextCollection(dates: string[]): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    if (date >= today) {
      return dateStr;
    }
  }
  return null;
}

function CollectionCard({
  title,
  dates,
  type,
}: {
  title: string;
  dates: string[];
  type: "papier" | "karton";
}) {
  const nextDate = getNextCollection(dates);
  const upcomingDates = dates.filter((d) => new Date(d) >= new Date());

  const indicatorColor = type === "papier" ? "bg-[#2563EB]" : "bg-[#B45309]";

  return (
    <div className="bg-white border border-[#D4D2CD] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8E6E1]">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
          <h3 className="text-sm font-semibold tracking-wide text-[#1A1A1A] uppercase">
            {title}
          </h3>
        </div>
      </div>

      {/* Next collection highlight */}
      {nextDate && (
        <div className="px-5 py-4 bg-[#F5F4F0] border-b border-[#E8E6E1]">
          <div className="text-[10px] font-medium tracking-widest text-[#6B6B6B] uppercase mb-1">
            Nächste Abholung
          </div>
          <div className="text-lg font-semibold text-[#1A1A1A]">
            {formatDate(nextDate)}
          </div>
        </div>
      )}

      {/* All dates list */}
      <div className="px-5 py-4">
        <div className="text-[10px] font-medium tracking-widest text-[#6B6B6B] uppercase mb-3">
          Alle Termine 2025
        </div>
        <div className="space-y-2">
          {upcomingDates.length > 0 ? (
            upcomingDates.map((date) => (
              <div
                key={date}
                className={`text-sm py-1 ${
                  date === nextDate
                    ? "font-medium text-[#1A1A1A]"
                    : "text-[#6B6B6B]"
                }`}
              >
                {formatDate(date)}
              </div>
            ))
          ) : (
            <div className="text-sm text-[#6B6B6B]">
              Keine weiteren Termine
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CollectionSchedule({
  schedule,
  loading,
}: CollectionScheduleProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#D4D2CD] rounded-sm overflow-hidden animate-pulse"
          >
            <div className="px-5 py-4 border-b border-[#E8E6E1]">
              <div className="h-4 bg-[#E8E6E1] rounded w-20" />
            </div>
            <div className="px-5 py-4 bg-[#F5F4F0] border-b border-[#E8E6E1]">
              <div className="h-3 bg-[#E8E6E1] rounded w-24 mb-2" />
              <div className="h-5 bg-[#E8E6E1] rounded w-40" />
            </div>
            <div className="px-5 py-4 space-y-2">
              <div className="h-3 bg-[#E8E6E1] rounded w-20" />
              <div className="h-4 bg-[#E8E6E1] rounded w-32" />
              <div className="h-4 bg-[#E8E6E1] rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!schedule) {
    return null;
  }

  return (
    <div className="space-y-5">
      {/* Location info */}
      <div className="flex items-center gap-2 text-xs text-[#6B6B6B] tracking-wide">
        <span className="font-medium text-[#1A1A1A]">{schedule.street}</span>
        {schedule.houseNumbers && (
          <span className="text-[#9B9B9B]">({schedule.houseNumbers})</span>
        )}
        <span className="text-[#D4D2CD]">·</span>
        <span>{schedule.locality === "lyss" ? "Lyss" : "Busswil"}</span>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <CollectionCard title="Papier" dates={schedule.papier} type="papier" />
        <CollectionCard title="Karton" dates={schedule.karton} type="karton" />
      </div>
    </div>
  );
}
