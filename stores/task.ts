import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task } from "~/types";
import { mockTasks } from "~/data/mockTasks";

const STORAGE_KEY = "patient-task-tracker:tasks";
const PRIORITY_WEIGHT: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

function getRandomId() {
  return Math.random().toString(36).substring(2, 9);
}

function generateTaskId(): string {
  return `task-${Date.now()}-${getRandomId()}`;
}

function generateLogId(): string {
  return `log-${Date.now()}-${getRandomId()}`;
}

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const searchQuery = ref("");
  const statusFilter = ref<string | null>(null);
  const sortField = ref<"dueDate" | "priority">("dueDate");
  const sortOrder = ref<"asc" | "desc">("asc");
  const dateRangeStart = ref<string | null>(null);
  const dateRangeEnd = ref<string | null>(null);

  const filteredTasks = computed(() => {
    let result = [...tasks.value];

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.patient.toLowerCase().includes(q),
      );
    }
    if (statusFilter.value) {
      result = result.filter((t) => t.status === statusFilter.value);
    }
    if (dateRangeStart.value) {
      result = result.filter((t) => t.dueDate >= dateRangeStart.value!);
    }
    if (dateRangeEnd.value) {
      result = result.filter((t) => t.dueDate <= dateRangeEnd.value!);
    }

    const sortByFunc =
      sortField.value === "priority" ? sortByPriority : sortByDueDate;
    result.sort(sortByFunc);

    return result;
  });

  function sortByDueDate(a: Task, b: Task) {
    const diff = a.dueDate.localeCompare(b.dueDate);
    return sortOrder.value === "asc" ? diff : -diff;
  }

  function sortByPriority(b: Task, a: Task) {
    const diff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    return sortOrder.value === "asc" ? -diff : diff;
  }

  function loadFromStorage() {
    if (import.meta.server) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        tasks.value = JSON.parse(raw);
      } catch {
        seedMockData();
      }
    } else {
      seedMockData();
    }
  }

  function saveToStorage() {
    if (import.meta.server) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
  }

  function seedMockData() {
    tasks.value = JSON.parse(JSON.stringify(mockTasks));
    saveToStorage();
  }

  function getTaskById(id: string): Task | undefined {
    return tasks.value.find((t) => t.id === id);
  }

  function addTask(data: Omit<Task, "id" | "activityLog" | "order">) {
    const task: Task = {
      ...data,
      id: generateTaskId(),
      activityLog: [
        {
          id: generateLogId(),
          timestamp: new Date().toISOString(),
          action: "Task created",
          details: "Created by Admin",
        },
      ],
      order: tasks.value.length,
    };
    tasks.value.push(task);
    saveToStorage();
    return task;
  }

  function updateTask(
    id: string,
    data: Partial<Omit<Task, "id" | "activityLog">>,
  ) {
    const task = getTaskById(id);
    if (!task) return;

    if (data.status && data.status !== task.status) {
      task.activityLog.push({
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        action: "Status updated",
        details: `Status changed from "${task.status}" to "${data.status}"`,
      });
    }

    if (
      data.title ||
      data.patient ||
      data.priority ||
      data.dueDate ||
      data.description ||
      data.assignee
    ) {
      task.activityLog.push({
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        action: "Task edited",
        // todo: would be good to add a diff of what's changed
      });
    }

    Object.assign(task, data);
    saveToStorage();
  }

  function deleteTask(id: string) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
    saveToStorage();
  }

  function reorderTasks(newOrder: Task[]) {
    tasks.value = newOrder.map((t, i) => ({ ...t, order: i }));
    saveToStorage();
  }

  function updateStatus(id: string, newStatus: Task["status"]) {
    updateTask(id, { status: newStatus });
  }

  function resetData() {
    seedMockData();
  }

  return {
    tasks,
    searchQuery,
    statusFilter,
    sortField,
    sortOrder,
    dateRangeStart,
    dateRangeEnd,
    filteredTasks,
    loadFromStorage,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    updateStatus,
    resetData,
  };
});
