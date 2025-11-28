"use client";

import { useState } from "react";
import { StreetSelector } from "./StreetSelector";
import { CollectionSchedule } from "./CollectionSchedule";
import { DownloadButtons } from "./DownloadButtons";

interface ScheduleData {
  street: string;
  houseNumbers: string | null;
  locality: string;
  directory: number;
  papier: string[];
  karton: string[];
}

export function AbfallKalender() {
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStreetSelect = async (street: string, houseNumber?: string) => {
    setSelectedStreet(street);
    setLoading(true);

    try {
      const params = new URLSearchParams({ street });
      if (houseNumber) params.set("houseNumber", houseNumber);

      const res = await fetch(`/api/schedule?${params}`);
      const data = (await res.json()) as ScheduleData;
      setSchedule(data);
    } catch {
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <StreetSelector onSelect={handleStreetSelect} />

      <CollectionSchedule schedule={schedule} loading={loading} />

      {schedule && <DownloadButtons street={selectedStreet!} />}
    </div>
  );
}
