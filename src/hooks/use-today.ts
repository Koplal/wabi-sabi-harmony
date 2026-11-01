import { useEffect, useState } from "react";

/** A day on the local calendar, so the same text means the same day in any time zone. */
const dayOf = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

/** The day this code loaded. In the build, prerender.ts stamps it on every page as data-built-on. */
export const builtOn = dayOf(new Date());

const dayInHtml = () => (typeof document === "undefined" ? undefined : document.getElementById("root")?.dataset.builtOn) ?? builtOn;

/**
 * Today, for anything that shows on a built page. HTML built one year is still served the next, and
 * the first render has to match it, so that render uses the day in the HTML. The real day follows
 * straight after.
 */
export function useToday(): Date {
  const [day, setDay] = useState(dayInHtml);

  useEffect(() => {
    setDay(dayOf(new Date()));
  }, []);

  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
}
