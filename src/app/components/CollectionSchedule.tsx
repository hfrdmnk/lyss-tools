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
  showPastDates?: boolean;
  onTogglePastDates?: () => void;
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function CollectionCard({
  title,
  dates,
  type,
  street,
  showPastDates,
}: {
  title: string;
  dates: string[];
  type: "papier" | "karton";
  street: string;
  showPastDates?: boolean;
}) {
  const nextDate = getNextCollection(dates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const displayDates = showPastDates
    ? dates
    : dates.filter((d) => new Date(d) >= today);

  const indicatorColor = type === "papier" ? "bg-[#2563EB]" : "bg-[#B45309]";

  const isPastDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date < today;
  };

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
        <div className="space-y-1">
          {displayDates.length > 0 ? (
            displayDates.map((date) => {
              const past = isPastDate(date);
              return (
                <div
                  key={date}
                  className="flex items-center justify-between group py-1"
                >
                  <span
                    className={`text-sm ${
                      past
                        ? "text-[#9B9B9B] line-through"
                        : date === nextDate
                          ? "font-medium text-[#1A1A1A]"
                          : "text-[#6B6B6B]"
                    }`}
                  >
                    {formatDate(date)}
                  </span>
                  <a
                    href={`/api/ics?street=${encodeURIComponent(street)}&date=${date}&type=${type}`}
                    className="opacity-0 group-hover:opacity-100 text-[#6B6B6B] hover:text-[#1A1A1A] transition-opacity p-1"
                    title="Zum Kalender hinzufügen"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </a>
                </div>
              );
            })
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
  showPastDates,
  onTogglePastDates,
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
      {/* Location info + toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] tracking-wide">
          <span className="font-medium text-[#1A1A1A]">{schedule.street}</span>
          {schedule.houseNumbers && (
            <span className="text-[#9B9B9B]">({schedule.houseNumbers})</span>
          )}
          <span className="text-[#D4D2CD]">·</span>
          <span>{schedule.locality === "lyss" ? "Lyss" : "Busswil"}</span>
        </div>

        <button
          onClick={onTogglePastDates}
          className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          <span
            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
              showPastDates
                ? "bg-[#1A1A1A] border-[#1A1A1A]"
                : "border-[#D4D2CD]"
            }`}
          >
            {showPastDates && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            )}
          </span>
          <span>Vergangene anzeigen</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <CollectionCard
          title="Papier"
          dates={schedule.papier}
          type="papier"
          street={schedule.street}
          showPastDates={showPastDates}
        />
        <CollectionCard
          title="Karton"
          dates={schedule.karton}
          type="karton"
          street={schedule.street}
          showPastDates={showPastDates}
        />
      </div>
    </div>
  );
}
