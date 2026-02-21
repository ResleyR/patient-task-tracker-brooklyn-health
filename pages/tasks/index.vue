<script setup lang="ts">
import {
  prioritySeverity,
  statusSeverity,
  formatShortDate as formatDate,
  isOverdue,
} from "~/utils/taskFormatters";
import type { Task } from "~/types";

const { t } = useI18n();
const taskStore = useTaskStore();
const authStore = useAuthStore();
const router = useRouter();

// Drawer state
const showDrawer = ref(false);
const editingTaskId = ref<string | null>(null);

// Status filter options
const statusOptions = computed(() => [
  { label: t("tasks.allStatuses"), value: null },
  { label: t("tasks.status.Pending"), value: "Pending" },
  { label: t("tasks.status.In Progress"), value: "In Progress" },
  { label: t("tasks.status.Completed"), value: "Completed" },
]);

// Date range as Date objects for PrimeDatePicker
const dateRangeStart = computed({
  get: () =>
    taskStore.dateRangeStart ? new Date(taskStore.dateRangeStart) : null,
  set: (val: Date | null) => {
    taskStore.dateRangeStart = val ? val.toISOString().slice(0, 10) : "";
  },
});
const dateRangeEnd = computed({
  get: () => (taskStore.dateRangeEnd ? new Date(taskStore.dateRangeEnd) : null),
  set: (val: Date | null) => {
    taskStore.dateRangeEnd = val ? val.toISOString().slice(0, 10) : "";
  },
});

const totalRecords = computed(() => taskStore.filteredTasks.length);

function openCreateDrawer() {
  editingTaskId.value = null;
  showDrawer.value = true;
}

function openEditDrawer(taskId: string) {
  editingTaskId.value = taskId;
  showDrawer.value = true;
}

function viewTask(taskId: string) {
  router.push(`/tasks/${taskId}`);
}

function deleteTask(taskId: string) {
  if (confirm(t("tasks.confirm.deleteMessage"))) {
    taskStore.deleteTask(taskId);
  }
}

function onRowReorder(event: {
  dragIndex: number;
  dropIndex: number;
  value: Task[];
}) {
  // event.value is only the filtered subset, so we can't replace the full array
  // with it. Instead, use dragIndex/dropIndex to find the tasks in the full
  // array and move accordingly.

  // Since event.value is the filtered but reordered subset, we swap the indices
  // as that would match the before state.
  const dragTask = event.value[event.dropIndex];

  const fullTasks = [...taskStore.tasks];
  const fromIndex = fullTasks.findIndex((t) => t.id === dragTask.id);
  let toIndex: number;
  if (event.dropIndex > 0) {
    // we want to insert it just after the item it is now before in the filtered tasks
    const dropTask = event.value[event.dropIndex - 1];
    toIndex = fullTasks.findIndex((t) => t.id === dropTask.id) + 1;
  } else {
    toIndex = 0;
  }

  const [moved] = fullTasks.splice(fromIndex, 1);
  fullTasks.splice(toIndex, 0, moved);
  taskStore.reorderTasks(fullTasks);
}
</script>

<template>
  <div>
    <div
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold text-slate-900">
          {{ t("tasks.title") }}
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ totalRecords }}
          {{ totalRecords === 1 ? t("tasks.task") : t("tasks.tasks") }}
        </p>
      </div>
      <PrimeButton
        v-if="authStore.isAdmin"
        @click="openCreateDrawer"
        :label="t('tasks.addTask')"
        icon="pi pi-plus"
      />
    </div>

    <div class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-3 lg:flex-row">
        <div class="flex-1">
          <PrimeIconField>
            <PrimeInputIcon class="pi pi-search" />
            <PrimeInputText
              v-model="taskStore.searchQuery"
              :placeholder="t('tasks.search')"
              class="w-full"
            />
          </PrimeIconField>
        </div>

        <div class="w-full lg:w-48">
          <PrimeSelect
            v-model="taskStore.statusFilter"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('tasks.filterByStatus')"
            class="w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <PrimeDatePicker
            v-model="dateRangeStart"
            :placeholder="t('tasks.columns.dueDate')"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-36"
          />
          <span class="text-slate-400">–</span>
          <PrimeDatePicker
            v-model="dateRangeEnd"
            :placeholder="t('tasks.columns.dueDate')"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-36"
          />
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <PrimeDataTable
        :value="taskStore.filteredTasks"
        :rows="10"
        :paginator="totalRecords > 10"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        :reorderableRows="true"
        @row-reorder="onRowReorder"
        @row-click="viewTask($event.data.id)"
        sortField="dueDate"
        :sortOrder="1"
        removableSort
        stripedRows
        :rowHover="true"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :currentPageReportTemplate="`{first}–{last} of {totalRecords}`"
        class="cursor-pointer"
        dataKey="id"
      >
        <PrimeColumn
          rowReorder
          headerStyle="width: 3rem"
          :reorderableColumn="false"
        />

        <PrimeColumn field="title" :header="t('tasks.columns.title')" sortable>
          <template #body="{ data }">
            <span class="font-medium text-slate-900">{{ data.title }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="patient"
          :header="t('tasks.columns.patient')"
          sortable
          class="hidden md:table-cell"
        />

        <PrimeColumn
          field="priority"
          :header="t('tasks.columns.priority')"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="t(`tasks.priority.${data.priority}`)"
              :severity="prioritySeverity(data.priority)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="dueDate"
          :header="t('tasks.columns.dueDate')"
          sortable
        >
          <template #body="{ data }">
            <span
              :class="[
                'text-sm',
                isOverdue(data.dueDate) && data.status !== 'Completed'
                  ? 'font-semibold text-red-600'
                  : 'text-slate-600',
              ]"
            >
              {{ formatDate(data.dueDate) }}
              <span
                v-if="isOverdue(data.dueDate) && data.status !== 'Completed'"
                class="ml-1 text-xs font-normal text-red-500"
              >
                ({{ t("tasks.overdue") }})
              </span>
            </span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="status"
          :header="t('tasks.columns.status')"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="t(`tasks.status.${data.status}`)"
              :severity="statusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn :header="t('tasks.columns.actions')" :exportable="false">
          <template #body="{ data }">
            <div class="flex items-center gap-1" @click.stop>
              <PrimeButton
                @click="viewTask(data.id)"
                icon="pi pi-eye"
                severity="secondary"
                text
                rounded
                size="small"
                :title="t('common.view')"
              />
              <PrimeButton
                v-if="authStore.isAdmin"
                @click="openEditDrawer(data.id)"
                icon="pi pi-pencil"
                severity="warn"
                text
                rounded
                size="small"
                :title="t('common.edit')"
              />
              <PrimeButton
                v-if="authStore.isAdmin"
                @click="deleteTask(data.id)"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
                :title="t('common.delete')"
              />
            </div>
          </template>
        </PrimeColumn>

        <template #empty>
          <div class="py-16 text-center text-slate-400">
            <i class="pi pi-clipboard mb-4 block text-5xl opacity-30"></i>
            <p class="text-lg">{{ t("tasks.noTasks") }}</p>
          </div>
        </template>
      </PrimeDataTable>
    </div>

    <TaskFormDrawer
      :visible="showDrawer"
      :task-id="editingTaskId"
      @update:visible="showDrawer = $event"
      @saved="editingTaskId = null"
    />
  </div>
</template>
