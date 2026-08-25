"use client";

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { searchAddress, type GeocodeResult } from "@/lib/geocode";

export function AddressSearch({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (result: GeocodeResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing stale results when the query becomes too short to search
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      searchAddress(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-start font-normal">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{value || "Cari alamat usaha kamu..."}</span>
          </Button>
        }
      />
      <PopoverContent className="w-[--anchor-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Ketik alamat atau nama tempat..." value={query} onValueChange={setQuery} />
          <CommandList>
            {loading && <CommandEmpty>Mencari...</CommandEmpty>}
            {!loading && query.trim().length >= 3 && results.length === 0 && (
              <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            )}
            <CommandGroup>
              {results.map((r) => (
                <CommandItem
                  key={`${r.lat},${r.lon}`}
                  value={r.label}
                  onSelect={() => {
                    onSelect(r);
                    setOpen(false);
                  }}
                >
                  {r.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
