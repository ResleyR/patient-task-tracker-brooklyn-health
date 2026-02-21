export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export interface Task {
  id: string;
  title: string;
  patient: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  assignee: string;
  activityLog: ActivityLogEntry[];
  order: number;
}

export type UserRole = "admin" | "nurse";
