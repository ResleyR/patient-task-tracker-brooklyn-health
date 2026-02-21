import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "~/stores/auth";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("Auth Store", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("defaults to admin role", () => {
      const store = useAuthStore();
      expect(store.role).toBe("admin");
      expect(store.isAdmin).toBe(true);
      expect(store.isNurse).toBe(false);
    });
  });

  describe("setRole", () => {
    it("sets role to nurse", () => {
      const store = useAuthStore();
      store.setRole("nurse");

      expect(store.role).toBe("nurse");
      expect(store.isAdmin).toBe(false);
      expect(store.isNurse).toBe(true);
    });

    it("persists role to localStorage", () => {
      const store = useAuthStore();
      store.setRole("nurse");

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "patient-task-tracker:role",
        "nurse",
      );
    });

    it("sets role back to admin", () => {
      const store = useAuthStore();
      store.setRole("nurse");
      store.setRole("admin");

      expect(store.role).toBe("admin");
      expect(store.isAdmin).toBe(true);
    });
  });

  describe("toggleRole", () => {
    it("toggles from admin to nurse", () => {
      const store = useAuthStore();
      expect(store.role).toBe("admin");

      store.toggleRole();
      expect(store.role).toBe("nurse");
    });

    it("toggles from nurse to admin", () => {
      const store = useAuthStore();
      store.setRole("nurse");

      store.toggleRole();
      expect(store.role).toBe("admin");
    });

    it("persists toggled role", () => {
      const store = useAuthStore();
      store.toggleRole();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "patient-task-tracker:role",
        "nurse",
      );
    });
  });

  describe("loadFromStorage", () => {
    it("loads admin from localStorage", () => {
      localStorageMock.getItem.mockReturnValueOnce("admin");
      const store = useAuthStore();
      store.loadFromStorage();

      expect(store.role).toBe("admin");
    });

    it("loads nurse from localStorage", () => {
      localStorageMock.getItem.mockReturnValueOnce("nurse");
      const store = useAuthStore();
      store.loadFromStorage();

      expect(store.role).toBe("nurse");
    });

    it("ignores invalid stored values", () => {
      localStorageMock.getItem.mockReturnValueOnce("invalid");
      const store = useAuthStore();
      store.loadFromStorage();

      expect(store.role).toBe("admin"); // keeps default
    });

    it("keeps default when nothing stored", () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const store = useAuthStore();
      store.loadFromStorage();

      expect(store.role).toBe("admin");
    });
  });

  describe("computed properties", () => {
    it("isAdmin is reactive", () => {
      const store = useAuthStore();
      expect(store.isAdmin).toBe(true);
      expect(store.isNurse).toBe(false);

      store.setRole("nurse");
      expect(store.isAdmin).toBe(false);
      expect(store.isNurse).toBe(true);
    });
  });
});
