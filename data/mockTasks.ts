import type { Task } from "../types";

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Schedule follow-up visit",
    patient: "John Doe",
    description:
      "Call patient to schedule a follow-up visit after the recent surgery. Ensure the appointment is within 2 weeks.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-24",
    assignee: "Nurse Alice",
    activityLog: [
      {
        id: "log-1",
        timestamp: "2026-02-18T09:00:00Z",
        action: "Task created",
        details: "Created by Admin",
      },
    ],
    order: 0,
  },
  {
    id: "task-2",
    title: "Update allergy information",
    patient: "Jane Smith",
    description:
      "Verify and update allergy records in the system. Patient reported new allergy to penicillin.",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-02-27",
    assignee: "Nurse Bob",
    activityLog: [
      {
        id: "log-2",
        timestamp: "2026-02-17T10:30:00Z",
        action: "Task created",
        details: "Created by Admin",
      },
      {
        id: "log-3",
        timestamp: "2026-02-20T14:00:00Z",
        action: "Status updated",
        details: 'Status changed from "Pending" to "In Progress"',
      },
    ],
    order: 1,
  },
  {
    id: "task-3",
    title: "Blood pressure monitoring",
    patient: "Robert Johnson",
    description:
      "Monitor and record blood pressure readings twice daily for the next week.",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-02-21",
    assignee: "Nurse Alice",
    activityLog: [
      {
        id: "log-4",
        timestamp: "2026-02-15T08:00:00Z",
        action: "Task created",
      },
    ],
    order: 2,
  },
  {
    id: "task-4",
    title: "Discharge paperwork review",
    patient: "Maria Garcia",
    description:
      "Review and prepare discharge paperwork. Ensure all medications and follow-up instructions are documented.",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-02-19",
    assignee: "Nurse Carol",
    activityLog: [
      {
        id: "log-5",
        timestamp: "2026-02-14T11:00:00Z",
        action: "Task created",
      },
      {
        id: "log-6",
        timestamp: "2026-02-18T16:00:00Z",
        action: "Status updated",
        details: 'Status changed from "Pending" to "Completed"',
      },
    ],
    order: 3,
  },
  {
    id: "task-5",
    title: "Notify caretaker about medication change",
    patient: "William Brown",
    description:
      "Contact the primary caretaker regarding changes in medication dosage. New prescription needs to be picked up.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-20",
    assignee: "Nurse Bob",
    activityLog: [
      {
        id: "log-7",
        timestamp: "2026-02-17T09:30:00Z",
        action: "Task created",
      },
    ],
    order: 4,
  },
  {
    id: "task-6",
    title: "Pre-surgery preparation checklist",
    patient: "Emily Davis",
    description:
      "Complete pre-surgery preparation checklist including fasting instructions and consent forms.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-26",
    assignee: "Nurse Alice",
    activityLog: [
      {
        id: "log-8",
        timestamp: "2026-02-19T10:00:00Z",
        action: "Task created",
      },
    ],
    order: 5,
  },
  {
    id: "task-7",
    title: "Lab results follow-up",
    patient: "Michael Wilson",
    description:
      "Review lab results and update patient records. Discuss results with attending physician if abnormal.",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-02-28",
    assignee: "Nurse Carol",
    activityLog: [
      {
        id: "log-9",
        timestamp: "2026-02-20T08:30:00Z",
        action: "Task created",
      },
    ],
    order: 6,
  },
  {
    id: "task-8",
    title: "Patient education session",
    patient: "Sarah Anderson",
    description:
      "Conduct diabetes management education session with patient and family members.",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-02-25",
    assignee: "Nurse Bob",
    activityLog: [
      {
        id: "log-10",
        timestamp: "2026-02-18T15:00:00Z",
        action: "Task created",
      },
      {
        id: "log-11",
        timestamp: "2026-02-21T09:00:00Z",
        action: "Status updated",
        details: 'Status changed from "Pending" to "In Progress"',
      },
    ],
    order: 7,
  },
  {
    id: "task-9",
    title: "Wound dressing change",
    patient: "David Martinez",
    description:
      "Change wound dressing on left leg. Document wound healing progress with photos.",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-02-21",
    assignee: "Nurse Alice",
    activityLog: [
      {
        id: "log-12",
        timestamp: "2026-02-16T11:00:00Z",
        action: "Task created",
      },
      {
        id: "log-13",
        timestamp: "2026-02-21T10:00:00Z",
        action: "Status updated",
        details: 'Status changed from "In Progress" to "Completed"',
      },
    ],
    order: 8,
  },
  {
    id: "task-10",
    title: "Insurance verification",
    patient: "Lisa Taylor",
    description:
      "Verify insurance coverage for upcoming physical therapy sessions. Contact insurance provider if needed.",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-03-05",
    assignee: "Nurse Carol",
    activityLog: [
      {
        id: "log-14",
        timestamp: "2026-02-20T14:00:00Z",
        action: "Task created",
      },
    ],
    order: 9,
  },
  {
    id: "task-11",
    title: "Medication reconciliation",
    patient: "James White",
    description:
      "Perform medication reconciliation upon admission. Cross-check with pharmacy records.",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-23",
    assignee: "Nurse Bob",
    activityLog: [
      {
        id: "log-15",
        timestamp: "2026-02-21T08:00:00Z",
        action: "Task created",
      },
    ],
    order: 10,
  },
  {
    id: "task-12",
    title: "Physical therapy referral",
    patient: "Jennifer Lee",
    description:
      "Process referral to physical therapy department. Coordinate appointment scheduling.",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-03-02",
    assignee: "Nurse Alice",
    activityLog: [
      {
        id: "log-16",
        timestamp: "2026-02-20T16:00:00Z",
        action: "Task created",
      },
    ],
    order: 11,
  },
];
