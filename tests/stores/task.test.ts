import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTaskStore } from "~/stores/task";
import type { Task } from "~/types";

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

function createTaskData(
  overrides: Partial<Omit<Task, "id" | "activityLog" | "order">> = {},
) {
  return {
    title: "Test Task",
    patient: "John Doe",
    description: "Test description",
    priority: "Medium" as const,
    status: "Pending" as const,
    dueDate: "2026-02-25",
    assignee: "Nurse Alice",
    ...overrides,
  };
}

describe("Task Store", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with empty tasks before loading", () => {
      const store = useTaskStore();
      expect(store.tasks).toEqual([]);
    });

    it("has default filter/sort values", () => {
      const store = useTaskStore();
      expect(store.searchQuery).toBe("");
      expect(store.statusFilter).toBeNull();
      expect(store.sortField).toBe("dueDate");
      expect(store.sortOrder).toBe("asc");
      expect(store.dateRangeStart).toBeNull();
      expect(store.dateRangeEnd).toBeNull();
    });
  });

  describe("addTask", () => {
    it("adds a task with auto-generated id and order", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());

      expect(store.tasks).toHaveLength(1);
      expect(task.id).toMatch(/^task-/);
      expect(task.order).toBe(0);
      expect(task.title).toBe("Test Task");
      expect(task.patient).toBe("John Doe");
    });

    it("creates an initial activity log entry", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());

      expect(task.activityLog).toHaveLength(1);
      expect(task.activityLog[0].action).toBe("Task created");
      expect(task.activityLog[0].id).toMatch(/^log-/);
      expect(task.activityLog[0].timestamp).toBeTruthy();
    });

    it("increments order for subsequent tasks", () => {
      const store = useTaskStore();
      const task1 = store.addTask(createTaskData({ title: "First" }));
      const task2 = store.addTask(createTaskData({ title: "Second" }));

      expect(task1.order).toBe(0);
      expect(task2.order).toBe(1);
    });

    it("persists to localStorage", () => {
      const store = useTaskStore();
      store.addTask(createTaskData());

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "patient-task-tracker:tasks",
        expect.any(String),
      );
    });
  });

  describe("getTaskById", () => {
    it("returns the correct task", () => {
      const store = useTaskStore();
      const added = store.addTask(createTaskData({ title: "Find Me" }));

      const found = store.getTaskById(added.id);
      expect(found).toBeDefined();
      expect(found!.title).toBe("Find Me");
    });

    it("returns undefined for nonexistent id", () => {
      const store = useTaskStore();
      expect(store.getTaskById("nonexistent")).toBeUndefined();
    });
  });

  describe("updateTask", () => {
    it("updates task fields", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());

      store.updateTask(task.id, { title: "Updated Title" });

      const updated = store.getTaskById(task.id);
      expect(updated!.title).toBe("Updated Title");
    });

    it("logs status changes in activity log", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData({ status: "Pending" }));

      store.updateTask(task.id, { status: "In Progress" });

      const updated = store.getTaskById(task.id)!;
      const statusLog = updated.activityLog.find(
        (l) => l.action === "Status updated",
      );
      expect(statusLog).toBeDefined();
      expect(statusLog!.details).toContain("Pending");
      expect(statusLog!.details).toContain("In Progress");
    });

    it("logs general edits", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());

      store.updateTask(task.id, { title: "New Title" });

      const updated = store.getTaskById(task.id)!;
      const editLog = updated.activityLog.find(
        (l) => l.action === "Task edited",
      );
      expect(editLog).toBeDefined();
    });

    it("does nothing for nonexistent task", () => {
      const store = useTaskStore();
      store.addTask(createTaskData());

      store.updateTask("nonexistent", { title: "Nope" });
      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("Test Task");
    });

    it("persists updates to localStorage", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());
      vi.clearAllMocks();

      store.updateTask(task.id, { title: "Updated" });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe("updateStatus", () => {
    it("updates status via convenience method", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData({ status: "Pending" }));

      store.updateStatus(task.id, "Completed");

      expect(store.getTaskById(task.id)!.status).toBe("Completed");
    });
  });

  describe("deleteTask", () => {
    it("removes the task", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());

      store.deleteTask(task.id);
      expect(store.tasks).toHaveLength(0);
    });

    it("only removes the targeted task", () => {
      const store = useTaskStore();
      const task1 = store.addTask(createTaskData({ title: "Keep" }));
      const task2 = store.addTask(createTaskData({ title: "Delete" }));

      store.deleteTask(task2.id);

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("Keep");
    });

    it("persists deletion to localStorage", () => {
      const store = useTaskStore();
      const task = store.addTask(createTaskData());
      vi.clearAllMocks();

      store.deleteTask(task.id);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe("reorderTasks", () => {
    it("updates order indices", () => {
      const store = useTaskStore();
      const t1 = store.addTask(createTaskData({ title: "A" }));
      const t2 = store.addTask(createTaskData({ title: "B" }));
      const t3 = store.addTask(createTaskData({ title: "C" }));

      // Reverse the order
      store.reorderTasks([
        store.getTaskById(t3.id)!,
        store.getTaskById(t2.id)!,
        store.getTaskById(t1.id)!,
      ]);

      expect(store.tasks[0].title).toBe("C");
      expect(store.tasks[0].order).toBe(0);
      expect(store.tasks[1].title).toBe("B");
      expect(store.tasks[1].order).toBe(1);
      expect(store.tasks[2].title).toBe("A");
      expect(store.tasks[2].order).toBe(2);
    });
  });

  describe("filteredTasks", () => {
    function seedStore() {
      const store = useTaskStore();
      store.addTask(
        createTaskData({
          title: "Blood test",
          patient: "Alice",
          status: "Pending",
          priority: "High",
          dueDate: "2026-02-20",
        }),
      );
      store.addTask(
        createTaskData({
          title: "X-ray review",
          patient: "Bob",
          status: "In Progress",
          priority: "Medium",
          dueDate: "2026-02-25",
        }),
      );
      store.addTask(
        createTaskData({
          title: "Discharge",
          patient: "Charlie",
          status: "Completed",
          priority: "Low",
          dueDate: "2026-03-01",
        }),
      );
      return store;
    }

    describe("search", () => {
      it("filters by title", () => {
        const store = seedStore();
        store.searchQuery = "blood";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].title).toBe("Blood test");
      });

      it("filters by patient name", () => {
        const store = seedStore();
        store.searchQuery = "bob";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].patient).toBe("Bob");
      });

      it("is case insensitive", () => {
        const store = seedStore();
        store.searchQuery = "DISCHARGE";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].title).toBe("Discharge");
      });

      it("returns all tasks when query is empty", () => {
        const store = seedStore();
        store.searchQuery = "";

        expect(store.filteredTasks).toHaveLength(3);
      });
    });

    describe("status filter", () => {
      it("filters by Pending", () => {
        const store = seedStore();
        store.statusFilter = "Pending";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].status).toBe("Pending");
      });

      it("filters by In Progress", () => {
        const store = seedStore();
        store.statusFilter = "In Progress";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].status).toBe("In Progress");
      });

      it("returns all when filter is null", () => {
        const store = seedStore();
        store.statusFilter = null;

        expect(store.filteredTasks).toHaveLength(3);
      });
    });

    describe("date range filter", () => {
      it("filters by start date", () => {
        const store = seedStore();
        store.dateRangeStart = "2026-02-24";

        expect(
          store.filteredTasks.every((t) => t.dueDate >= "2026-02-24"),
        ).toBe(true);
        expect(store.filteredTasks).toHaveLength(2);
      });

      it("filters by end date", () => {
        const store = seedStore();
        store.dateRangeEnd = "2026-02-25";

        expect(
          store.filteredTasks.every((t) => t.dueDate <= "2026-02-25"),
        ).toBe(true);
        expect(store.filteredTasks).toHaveLength(2);
      });

      it("filters by both start and end", () => {
        const store = seedStore();
        store.dateRangeStart = "2026-02-24";
        store.dateRangeEnd = "2026-02-26";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].title).toBe("X-ray review");
      });
    });

    describe("sorting", () => {
      it("sorts by due date ascending (default)", () => {
        const store = seedStore();
        store.sortField = "dueDate";
        store.sortOrder = "asc";

        const dates = store.filteredTasks.map((t) => t.dueDate);
        expect(dates).toEqual([...dates].sort());
      });

      it("sorts by due date descending", () => {
        const store = seedStore();
        store.sortField = "dueDate";
        store.sortOrder = "desc";

        const dates = store.filteredTasks.map((t) => t.dueDate);
        expect(dates).toEqual([...dates].sort().reverse());
      });

      it("sorts by priority ascending (High first)", () => {
        const store = seedStore();
        store.sortField = "priority";
        store.sortOrder = "asc";

        const priorities = store.filteredTasks.map((t) => t.priority);
        expect(priorities).toEqual(["High", "Medium", "Low"]);
      });

      it("sorts by priority descending (Low first)", () => {
        const store = seedStore();
        store.sortField = "priority";
        store.sortOrder = "desc";

        const priorities = store.filteredTasks.map((t) => t.priority);
        expect(priorities).toEqual(["Low", "Medium", "High"]);
      });
    });

    describe("combined filters", () => {
      it("applies search + status filter together", () => {
        const store = seedStore();
        store.searchQuery = "blood";
        store.statusFilter = "Completed";

        expect(store.filteredTasks).toHaveLength(0);
      });

      it("applies search + date range together", () => {
        const store = seedStore();
        store.searchQuery = "x-ray";
        store.dateRangeStart = "2026-02-20";
        store.dateRangeEnd = "2026-02-28";

        expect(store.filteredTasks).toHaveLength(1);
        expect(store.filteredTasks[0].title).toBe("X-ray review");
      });
    });
  });

  describe("loadFromStorage", () => {
    it("loads tasks from localStorage", () => {
      const tasks = [createTaskData({ title: "Saved Task" })];
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(tasks));

      const store = useTaskStore();
      store.loadFromStorage();

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe("Saved Task");
    });

    it("seeds mock data when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const store = useTaskStore();
      store.loadFromStorage();

      expect(store.tasks.length).toBeGreaterThan(0);
    });

    it("seeds mock data on invalid JSON", () => {
      localStorageMock.getItem.mockReturnValueOnce("invalid json{{{");

      const store = useTaskStore();
      store.loadFromStorage();

      expect(store.tasks.length).toBeGreaterThan(0);
    });
  });

  describe("resetData", () => {
    it("restores mock data", () => {
      const store = useTaskStore();
      store.addTask(createTaskData({ title: "Custom" }));
      store.addTask(createTaskData({ title: "Another" }));

      store.resetData();

      // Should have mock data, not our custom tasks
      expect(store.tasks.find((t) => t.title === "Custom")).toBeUndefined();
      expect(store.tasks.length).toBeGreaterThan(0);
    });
  });
});
