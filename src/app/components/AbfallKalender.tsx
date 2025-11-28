"use client";

import { useState, useEffect } from "react";
import { StreetSelector } from "./StreetSelector";
import { CollectionSchedule } from "./CollectionSchedule";
import { DownloadButtons } from "./DownloadButtons";
import { LocalityTabs, type Locality } from "./LocalityTabs";

interface ScheduleData {
  street: string;
  houseNumbers: string | null;
  locality: string;
  directory: number;
  papier: string[];
  karton: string[];
}

export function AbfallKalender() {
  const [locality, setLocality] = useState<Locality>("lyss");
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPastDates, setShowPastDates] = useState(false);

  // Fetch Busswil schedule when locality changes to busswil
  useEffect(() => {
    if (locality === "busswil") {
      fetchBusswilSchedule();
    } else {
      // Reset when switching back to Lyss
      setSchedule(null);
      setSelectedStreet(null);
    }
  }, [locality]);

  const fetchBusswilSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule?locality=busswil");
      const data = (await res.json()) as ScheduleData;
      setSchedule(data);
      setSelectedStreet("Busswil");
    } catch {
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  };

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

  const handleLocalityChange = (newLocality: Locality) => {
    setLocality(newLocality);
  };

  return (
    <div className="space-y-6">
      <LocalityTabs value={locality} onChange={handleLocalityChange} />

      {locality === "lyss" && (
        <StreetSelector onSelect={handleStreetSelect} />
      )}

      <CollectionSchedule
        schedule={schedule}
        loading={loading}
        showPastDates={showPastDates}
        onTogglePastDates={() => setShowPastDates(!showPastDates)}
      />

      {schedule && (
        <DownloadButtons
          street={selectedStreet!}
          houseNumber={schedule.houseNumbers ?? undefined}
          papierDates={schedule.papier}
          kartonDates={schedule.karton}
        />
      )}
    </div>
  );
}
