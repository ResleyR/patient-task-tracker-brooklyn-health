import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  prioritySeverity,
  statusSeverity,
  formatShortDate,
  formatLongDate,
  formatTimestamp,
  isOverdue,
} from "~/utils/taskFormatters";

describe("taskFormatters", () => {
  describe("prioritySeverity", () => {
    it("returns 'danger' for High", () => {
      expect(prioritySeverity("High")).toBe("danger");
    });

    it("returns 'warn' for Medium", () => {
      expect(prioritySeverity("Medium")).toBe("warn");
    });

    it("returns 'success' for Low", () => {
      expect(prioritySeverity("Low")).toBe("success");
    });

    it("falls back to 'success' for unknown values", () => {
      expect(prioritySeverity("Unknown")).toBe("success");
      expect(prioritySeverity("")).toBe("success");
    });
  });

  describe("statusSeverity", () => {
    it("returns 'info' for In Progress", () => {
      expect(statusSeverity("In Progress")).toBe("info");
    });

    it("returns 'success' for Completed", () => {
      expect(statusSeverity("Completed")).toBe("success");
    });

    it("returns 'secondary' for Pending", () => {
      expect(statusSeverity("Pending")).toBe("secondary");
    });

    it("returns 'secondary' for unknown values", () => {
      expect(statusSeverity("Unknown")).toBe("secondary");
      expect(statusSeverity("")).toBe("secondary");
    });
  });

  describe("formatShortDate", () => {
    it("formats a date string", () => {
      const result = formatShortDate("2026-02-22");
      expect(result).toBeTruthy();
      // Locale-dependent, so just check it contains the year
      expect(result).toContain("2026");
    });

    it("handles different date formats", () => {
      const result = formatShortDate("2026-12-25");
      expect(result).toContain("2026");
    });
  });

  describe("formatLongDate", () => {
    it("formats a date string with weekday", () => {
      const result = formatLongDate("2026-02-22");
      expect(result).toBeTruthy();
      expect(result).toContain("2026");
      // Should include a weekday name (locale-dependent)
      expect(result.length).toBeGreaterThan(
        formatShortDate("2026-02-22").length,
      );
    });
  });

  describe("formatTimestamp", () => {
    it("formats a timestamp with date and time", () => {
      const result = formatTimestamp("2026-02-22T09:30:00Z");
      expect(result).toBeTruthy();
      expect(result).toContain("2026");
    });

    it("handles ISO timestamps", () => {
      const result = formatTimestamp("2026-01-15T14:45:00.000Z");
      expect(result).toContain("2026");
    });
  });

  describe("isOverdue", () => {
    beforeEach(() => {
      // Fix "today" to 2026-02-22
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-02-22T12:00:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns true for past dates", () => {
      expect(isOverdue("2026-02-21")).toBe(true);
      expect(isOverdue("2026-01-01")).toBe(true);
      expect(isOverdue("2025-12-31")).toBe(true);
    });

    it("returns false for today", () => {
      expect(isOverdue("2026-02-22")).toBe(false);
    });

    it("returns false for future dates", () => {
      expect(isOverdue("2026-02-23")).toBe(false);
      expect(isOverdue("2026-12-31")).toBe(false);
    });
  });
});
