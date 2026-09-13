export function uptimeParts(launchedAt: string, now: number) {
  const seconds = Math.max(
    0,
    Math.floor((now - Date.parse(launchedAt)) / 1000),
  );
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
  };
}
