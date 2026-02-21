# Patient Task Tracker – Frontend

A **Nuxt 3** healthcare portal for managing patient tasks, built with **Vue 3 Composition API**, **Tailwind CSS**, **PrimeVue** (Aura preset), and **Pinia**.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000/tasks
```

## Scripts

| Command              | Description             |
| -------------------- | ----------------------- |
| `npm run dev`        | Start Nuxt dev server   |
| `npm run build`      | Production build        |
| `npm test`           | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Tech Stack

| Technology            | Usage                                                        |
| --------------------- | ------------------------------------------------------------ |
| Nuxt 3                | App framework, file-based routing, auto-imports              |
| Vue 3 Composition API | Component logic (`<script setup>`)                           |
| Tailwind CSS          | Utility-first styling & responsive design                    |
| PrimeVue 4 (Aura)     | UI components (DataTable, Button, Select, Tag, Drawer, etc.) |
| PrimeIcons            | Icon library for PrimeVue components                         |
| Pinia                 | State management (task store, auth store)                    |
| @nuxtjs/i18n          | Localization (English + Hindi)                               |
| Vitest + happy-dom    | Unit testing                                                 |

## Features

- **Task list** (`/tasks`) – PrimeVue DataTable with column sorting, search, status filter, date-range filter, priority/status tags with severity colors, overdue highlighting, pagination, and row reordering
- **Task detail** (`/tasks/[id]`) – Full task view with inline status editing, priority badge, and activity log timeline
- **Create/Edit** (`/tasks/add`, `/tasks/[id]/edit`) – PrimeVue Drawer form with reactive validation (InputText, Select, Textarea, DatePicker)
- **i18n** – English and Hindi language toggle in the header
- **Role-based UI** – Admin (full CRUD) vs Nurse (view + status update only), toggleable in the header
- **Theming** – Custom Brooklyn Health brand palette (`#4A5445` sage green) applied via PrimeVue's `definePreset` on the Aura theme
- **Responsive** – Adaptive layouts for desktop and mobile
- **Persistence** – Task data and user role stored in localStorage; auto-seeds mock data on first visit

## Testing

```bash
npm test
```
