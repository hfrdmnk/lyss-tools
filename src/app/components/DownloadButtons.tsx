"use client";

import { Download } from "lucide-react";

interface DownloadButtonsProps {
  street: string;
  houseNumber?: string;
  papierDates: string[];
  kartonDates: string[];
}

export function DownloadButtons({
  street,
  houseNumber,
  papierDates,
  kartonDates,
}: DownloadButtonsProps) {
  const baseUrl = `/api/ics?street=${encodeURIComponent(street)}${
    houseNumber ? `&houseNumber=${encodeURIComponent(houseNumber)}` : ""
  }`;

  const today = new Date().toISOString().split("T")[0];
  const hasFuturePapier = papierDates.some((d) => d >= today);
  const hasFutureKarton = kartonDates.some((d) => d >= today);
  const hasFutureDates = hasFuturePapier || hasFutureKarton;

  return (
    <div className="pt-6 border-t border-[#E8E6E1]">
      <div className="text-[10px] font-medium tracking-widest text-[#6B6B6B] uppercase mb-4">
        Zum Kalender hinzufügen
      </div>
      <div className="flex flex-wrap gap-3">
        {hasFutureDates ? (
          <a
            href={baseUrl}
            download="abfallkalender.ics"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors"
          >
            <Download className="h-4 w-4" />
            Alle Termine
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E8E6E1] text-[#9B9B9B] text-sm font-medium rounded-sm cursor-not-allowed">
            <Download className="h-4 w-4" />
            Alle Termine
          </span>
        )}
        {hasFuturePapier ? (
          <a
            href={`${baseUrl}&type=papier`}
            download="papier.ics"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D4D2CD] text-[#1A1A1A] text-sm font-medium rounded-sm hover:bg-[#F5F4F0] transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
            Nur Papier
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5F4F0] border border-[#E8E6E1] text-[#9B9B9B] text-sm font-medium rounded-sm cursor-not-allowed">
            <div className="w-2 h-2 rounded-full bg-[#D4D2CD]" />
            Nur Papier
          </span>
        )}
        {hasFutureKarton ? (
          <a
            href={`${baseUrl}&type=karton`}
            download="karton.ics"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D4D2CD] text-[#1A1A1A] text-sm font-medium rounded-sm hover:bg-[#F5F4F0] transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#B45309]" />
            Nur Karton
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5F4F0] border border-[#E8E6E1] text-[#9B9B9B] text-sm font-medium rounded-sm cursor-not-allowed">
            <div className="w-2 h-2 rounded-full bg-[#D4D2CD]" />
            Nur Karton
          </span>
        )}
      </div>
    </div>
  );
}
