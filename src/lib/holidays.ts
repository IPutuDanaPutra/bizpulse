import type { HolidayEntry } from "./types";

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
}

function daysBetween(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / ms);
}

// Long weekend = the holiday sits adjacent (directly or via a single bridge day) to a weekend.
function longWeekendInfo(date: Date): { isLongWeekend: boolean; totalDays?: number } {
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  if (day === 1) return { isLongWeekend: true, totalDays: 3 }; // Mon holiday -> Sat-Sun-Mon
  if (day === 5) return { isLongWeekend: true, totalDays: 3 }; // Fri holiday -> Fri-Sat-Sun
  if (day === 2) return { isLongWeekend: true, totalDays: 4 }; // Tue holiday -> bridge Mon + weekend
  if (day === 4) return { isLongWeekend: true, totalDays: 4 }; // Thu holiday -> bridge Fri + weekend
  if (day === 0 || day === 6) return { isLongWeekend: false }; // falls on the weekend itself
  return { isLongWeekend: false };
}

export async function fetchNextHolidays(countryCode = "ID"): Promise<HolidayEntry[]> {
  const res = await fetch(`https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`);
  if (!res.ok) throw new Error(`Nager.Date error: ${res.status}`);
  const data: NagerHoliday[] = await res.json();

  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }));

  return data.map((h) => {
    const date = new Date(h.date);
    const lw = longWeekendInfo(date);
    return {
      date: h.date,
      localName: h.localName,
      name: h.name,
      isLongWeekend: lw.isLongWeekend,
      longWeekendDays: lw.totalDays,
      daysUntil: daysBetween(today, date),
    };
  });
}
