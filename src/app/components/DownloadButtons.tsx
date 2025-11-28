"use client";

import { Download } from "lucide-react";

interface DownloadButtonsProps {
  street: string;
  houseNumber?: string;
}

export function DownloadButtons({ street, houseNumber }: DownloadButtonsProps) {
  const baseUrl = `/api/ics?street=${encodeURIComponent(street)}${
    houseNumber ? `&houseNumber=${encodeURIComponent(houseNumber)}` : ""
  }`;

  return (
    <div className="pt-6 border-t border-[#E8E6E1]">
      <div className="text-[10px] font-medium tracking-widest text-[#6B6B6B] uppercase mb-4">
        Zum Kalender hinzufügen
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={baseUrl}
          download="abfallkalender.ics"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-sm hover:bg-[#333] transition-colors"
        >
          <Download className="h-4 w-4" />
          Alle Termine
        </a>
        <a
          href={`${baseUrl}&type=papier`}
          download="papier.ics"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D4D2CD] text-[#1A1A1A] text-sm font-medium rounded-sm hover:bg-[#F5F4F0] transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
          Nur Papier
        </a>
        <a
          href={`${baseUrl}&type=karton`}
          download="karton.ics"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D4D2CD] text-[#1A1A1A] text-sm font-medium rounded-sm hover:bg-[#F5F4F0] transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-[#B45309]" />
          Nur Karton
        </a>
      </div>
    </div>
  );
}
