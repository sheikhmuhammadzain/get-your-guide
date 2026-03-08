const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

const MONTH_SHORT_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const MONTH_LONG_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
});

export function formatUtcDateTime(value: Date | string) {
  return DATE_TIME_FORMATTER.format(new Date(value));
}

export function formatMonthShort(month: number) {
  return MONTH_SHORT_FORMATTER.format(new Date(Date.UTC(2024, month - 1, 1)));
}

export function formatMonthLong(month: number) {
  return MONTH_LONG_FORMATTER.format(new Date(Date.UTC(2024, month - 1, 1)));
}
