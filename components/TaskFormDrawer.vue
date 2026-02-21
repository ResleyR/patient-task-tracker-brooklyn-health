<script setup lang="ts">
import type { Task } from "~/types";

const { t } = useI18n();
const taskStore = useTaskStore();

const props = defineProps<{
  visible: boolean;
  taskId?: string | null;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  saved: [];
}>();

const isEditMode = computed(() => !!props.taskId);

const form = reactive({
  title: "",
  patient: "",
  description: "",
  priority: "Medium" as Task["priority"],
  status: "Pending" as Task["status"],
  dueDate: "",
  assignee: "",
});

const errors = reactive({
  title: "",
  patient: "",
  dueDate: "",
  priority: "",
});

const priorityOptions = [
  { label: t("tasks.priority.High"), value: "High" },
  { label: t("tasks.priority.Medium"), value: "Medium" },
  { label: t("tasks.priority.Low"), value: "Low" },
];

const statusOptions = [
  { label: t("tasks.status.Pending"), value: "Pending" },
  { label: t("tasks.status.In Progress"), value: "In Progress" },
  { label: t("tasks.status.Completed"), value: "Completed" },
];

watch(
  () => props.visible,
  (visible) => {
    if (visible && props.taskId) {
      loadTask();
    } else if (visible) {
      resetForm();
    }
  },
);

function loadTask() {
  const task = taskStore.getTaskById(props.taskId!);
  if (task) {
    form.title = task.title;
    form.patient = task.patient;
    form.description = task.description;
    form.priority = task.priority;
    form.status = task.status;
    form.dueDate = task.dueDate;
    form.assignee = task.assignee;
  }
}

function resetForm() {
  form.title = "";
  form.patient = "";
  form.description = "";
  form.priority = "Medium";
  form.status = "Pending";
  form.dueDate = "";
  form.assignee = "";
  clearErrors();
}

function clearErrors() {
  errors.title = "";
  errors.patient = "";
  errors.dueDate = "";
  errors.priority = "";
}

function validate(): boolean {
  clearErrors();
  let valid = true;

  if (!form.title) {
    errors.title = t("tasks.validation.titleRequired");
    valid = false;
  } else if (form.title.length < 3) {
    errors.title = t("tasks.validation.titleMinLength");
    valid = false;
  }

  if (!form.patient) {
    errors.patient = t("tasks.validation.patientRequired");
    valid = false;
  } else if (form.patient.length < 3) {
    errors.patient = t("tasks.validation.patientMinLength");
    valid = false;
  }

  if (!form.dueDate) {
    errors.dueDate = t("tasks.validation.dueDateRequired");
    valid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(form.dueDate);
    if (!isEditMode.value && due < today) {
      errors.dueDate = t("tasks.validation.dueDatePast");
      valid = false;
    }
  }

  if (!form.priority) {
    errors.priority = t("tasks.validation.priorityRequired");
    valid = false;
  }

  return valid;
}

function handleSave() {
  if (!validate()) return;

  if (isEditMode.value && props.taskId) {
    taskStore.updateTask(props.taskId, { ...form });
  } else {
    taskStore.addTask({ ...form });
  }

  emit("update:visible", false);
  emit("saved");
  resetForm();
}

function handleClose() {
  emit("update:visible", false);
  resetForm();
}

if (props.visible && props.taskId) {
  loadTask();
}
</script>

<template>
  <PrimeDrawer
    :visible="visible"
    @update:visible="handleClose"
    :header="isEditMode ? t('tasks.editTask') : t('tasks.addTask')"
    position="right"
    class="w-full sm:w-[480px]"
  >
    <div class="flex flex-col gap-5 p-6">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700">
          {{ t("tasks.form.title") }} <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.title"
          :placeholder="t('tasks.form.titlePlaceholder')"
          :class="{ '!border-red-500': errors.title, 'w-full': true }"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-red-500">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700">
          {{ t("tasks.form.patient") }} <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.patient"
          :placeholder="t('tasks.form.patientPlaceholder')"
          :class="{ '!border-red-500': errors.patient, 'w-full': true }"
        />
        <p v-if="errors.patient" class="mt-1 text-xs text-red-500">
          {{ errors.patient }}
        </p>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700">
          {{ t("tasks.form.description") }}
        </label>
        <PrimeTextarea
          v-model="form.description"
          :placeholder="t('tasks.form.descriptionPlaceholder')"
          class="w-full"
          rows="3"
          autoResize
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">
            {{ t("tasks.form.priority") }} <span class="text-red-500">*</span>
          </label>
          <PrimeSelect
            v-model="form.priority"
            :options="priorityOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            :class="{ '!border-red-500': errors.priority }"
          />
          <p v-if="errors.priority" class="mt-1 text-xs text-red-500">
            {{ errors.priority }}
          </p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">
            {{ t("tasks.form.status") }}
          </label>
          <PrimeSelect
            v-model="form.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700">
          {{ t("tasks.form.dueDate") }} <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.dueDate"
          type="date"
          :class="{ '!border-red-500': errors.dueDate, 'w-full': true }"
        />
        <p v-if="errors.dueDate" class="mt-1 text-xs text-red-500">
          {{ errors.dueDate }}
        </p>
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-slate-700">
          {{ t("tasks.form.assignee") }}
        </label>
        <PrimeInputText
          v-model="form.assignee"
          :placeholder="t('tasks.form.assigneePlaceholder')"
          class="w-full"
        />
      </div>

      <div class="flex items-center gap-3 border-t border-slate-200 pt-4">
        <PrimeButton
          @click="handleSave"
          :label="isEditMode ? t('tasks.form.update') : t('tasks.form.create')"
          class="flex-1"
        />
        <PrimeButton
          @click="handleClose"
          :label="t('tasks.form.cancel')"
          severity="secondary"
          outlined
        />
      </div>
    </div>
  </PrimeDrawer>
</template>
