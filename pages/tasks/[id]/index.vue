<script setup lang="ts">
import {
  prioritySeverity,
  formatLongDate as formatDate,
  formatTimestamp,
  isOverdue,
} from "~/utils/taskFormatters";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const authStore = useAuthStore();

const taskId = route.params.id as string;
const task = computed(() => taskStore.getTaskById(taskId));

const statusOptions = ["Pending", "In Progress", "Completed"];

function updateStatus(newStatus: string) {
  taskStore.updateStatus(taskId, newStatus as any);
}

function goBack() {
  router.push("/tasks");
}

function goEdit() {
  router.push(`/tasks/${taskId}/edit`);
}
</script>

<template>
  <div v-if="task">
    <div class="mb-6 flex items-center justify-between">
      <PrimeButton
        @click="goBack"
        :label="t('tasks.backToList')"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
      />

      <PrimeButton
        v-if="authStore.isAdmin"
        @click="goEdit"
        :label="t('common.edit')"
        icon="pi pi-pencil"
      />
    </div>

    <div
      class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="border-b border-slate-200 px-6 py-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900">{{ task.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">
              {{ t("tasks.columns.patient") }}:
              <span class="font-medium text-slate-700">{{ task.patient }}</span>
            </p>
          </div>
          <PrimeTag
            :value="t(`tasks.priority.${task.priority}`)"
            :severity="prioritySeverity(task.priority)"
          />
        </div>
      </div>

      <div class="space-y-6 px-6 py-5">
        <div v-if="task.description">
          <h3
            class="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500"
          >
            {{ t("tasks.detail.description") }}
          </h3>
          <p class="leading-relaxed text-slate-700">{{ task.description }}</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg bg-slate-50 p-4">
            <h4
              class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              {{ t("tasks.columns.status") }}
            </h4>
            <PrimeSelect
              :modelValue="task.status"
              @update:modelValue="updateStatus"
              :options="statusOptions"
              class="w-full"
            />
          </div>

          <div class="rounded-lg bg-slate-50 p-4">
            <h4
              class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              {{ t("tasks.columns.dueDate") }}
            </h4>
            <p
              :class="[
                'font-medium',
                isOverdue(task.dueDate) && task.status !== 'Completed'
                  ? 'text-red-600'
                  : 'text-slate-900',
              ]"
            >
              {{ formatDate(task.dueDate) }}
              <span
                v-if="isOverdue(task.dueDate) && task.status !== 'Completed'"
                class="mt-0.5 block text-xs text-red-500"
                >({{ t("tasks.overdue") }})</span
              >
            </p>
          </div>

          <div class="rounded-lg bg-slate-50 p-4">
            <h4
              class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              {{ t("tasks.columns.assignee") }}
            </h4>
            <p class="font-medium text-slate-900">{{ task.assignee || "—" }}</p>
          </div>

          <div class="rounded-lg bg-slate-50 p-4">
            <h4
              class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              {{ t("tasks.columns.priority") }}
            </h4>
            <PrimeTag
              :value="t(`tasks.priority.${task.priority}`)"
              :severity="prioritySeverity(task?.priority)"
            />
          </div>
        </div>

        <div>
          <h3
            class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500"
          >
            {{ t("tasks.detail.activityLog") }}
          </h3>
          <div
            v-if="task.activityLog.length === 0"
            class="py-4 text-sm text-slate-400"
          >
            {{ t("tasks.detail.noActivity") }}
          </div>
          <div v-else class="space-y-0">
            <div
              v-for="(log, index) in [...task.activityLog].reverse()"
              :key="log.id"
              class="flex items-start gap-3 py-3"
              :class="{ 'border-t border-slate-100': index > 0 }"
            >
              <div
                class="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-500"
              ></div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-700">
                  {{ log.action }}
                </p>
                <p v-if="log.details" class="mt-0.5 text-xs text-slate-500">
                  {{ log.details }}
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  {{ formatTimestamp(log.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="py-16 text-center">
    <p class="text-lg text-slate-400">Task not found</p>
    <PrimeButton
      @click="goBack"
      :label="t('tasks.backToList')"
      severity="secondary"
      text
      class="mt-4"
    />
  </div>
</template>
