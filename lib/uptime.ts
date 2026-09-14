export const PUBLIC_LAUNCH_DATE = "2026-09-13";
const launchTimestamp = Date.parse(`${PUBLIC_LAUNCH_DATE}T00:00:00.000Z`);

export function runningDays(now: number) {
  if (!Number.isFinite(now)) throw new Error("Invalid current time");
  return Math.max(0, Math.floor((now - launchTimestamp) / 86_400_000));
}

export function localizedPublicLaunchDate(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(launchTimestamp));
}
