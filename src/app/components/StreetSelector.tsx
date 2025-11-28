"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Street {
  id: number;
  name: string;
  houseNumbers: string | null;
  directory: number;
  locality: string;
}

interface StreetSelectorProps {
  onSelect: (street: string, houseNumber?: string) => void;
}

export function StreetSelector({ onSelect }: StreetSelectorProps) {
  const [streets, setStreets] = useState<Street[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStreets() {
      try {
        const res = await fetch("/api/streets");
        const data = (await res.json()) as Street[];
        setStreets(data);
      } catch {
        // Ignore errors
      } finally {
        setLoading(false);
      }
    }
    loadStreets();
  }, []);

  // Get unique street names
  const uniqueStreetNames = [...new Set(streets.map((s) => s.name))];

  // Filter streets based on input
  const filteredStreets = inputValue
    ? uniqueStreetNames.filter((name) =>
        name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : uniqueStreetNames;

  const handleSelect = (streetName: string) => {
    setInputValue(streetName);
    setIsOpen(false);
    onSelect(streetName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium tracking-wide text-[#6B6B6B] uppercase">
        Strasse auswählen
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#6B6B6B]" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={loading ? "Laden..." : "Strasse eingeben..."}
          className="w-full h-12 pl-11 pr-4 bg-white border border-[#D4D2CD] rounded-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all"
          disabled={loading}
        />

        {/* Dropdown */}
        {isOpen && filteredStreets.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#D4D2CD] rounded-sm shadow-lg max-h-64 overflow-auto">
            {filteredStreets.slice(0, 50).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className="w-full px-4 py-3 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F4F0] transition-colors border-b border-[#E8E6E1] last:border-b-0"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
