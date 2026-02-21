/**
 * Map task priority to PrimeVue Tag severity.
 */
export function prioritySeverity(priority: string): string {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warn";
    default:
      return "success";
  }
}

/**
 * Map task status to PrimeVue Tag severity.
 */
export function statusSeverity(status: string): string {
  switch (status) {
    case "In Progress":
      return "info";
    case "Completed":
      return "success";
    default:
      return "secondary";
  }
}

/**
 * Format a date string as a short date (e.g. "Feb 22, 2026").
 */
export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string as a long date (e.g. "Sunday, February 22, 2026").
 */
export function formatLongDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a timestamp string as a short date + time (e.g. "Feb 22, 2026, 09:30 AM").
 */
export function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check whether a due date is in the past (overdue).
 */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date(new Date().toDateString());
}
