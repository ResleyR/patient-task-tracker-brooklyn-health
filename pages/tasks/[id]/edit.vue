<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const taskId = route.params.id as string;
const showDrawer = ref(true);

function onSaved() {
  router.push(`/tasks/${taskId}`);
}

function onClose(val: boolean) {
  if (!val) {
    router.push(`/tasks/${taskId}`);
  }
}
</script>

<template>
  <TaskFormDrawer
    :visible="showDrawer"
    :task-id="taskId"
    @update:visible="onClose"
    @saved="onSaved"
  />
</template>
