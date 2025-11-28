"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Locality = "lyss" | "busswil";

interface LocalityTabsProps {
  value: Locality;
  onChange: (locality: Locality) => void;
}

export function LocalityTabs({ value, onChange }: LocalityTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as Locality)}
      className="flex-none"
    >
      <TabsList className="bg-[#E8E6E1] h-auto p-1 rounded-sm w-auto inline-flex">
        <TabsTrigger
          value="lyss"
          className="px-4 py-1.5 text-sm font-medium rounded-sm data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm text-[#6B6B6B] hover:text-[#1A1A1A]"
        >
          Lyss
        </TabsTrigger>
        <TabsTrigger
          value="busswil"
          className="px-4 py-1.5 text-sm font-medium rounded-sm data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm text-[#6B6B6B] hover:text-[#1A1A1A]"
        >
          Busswil
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
