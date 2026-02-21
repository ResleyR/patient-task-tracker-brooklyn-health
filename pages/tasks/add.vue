<script setup lang="ts">
const router = useRouter();

const showDrawer = ref(true);

function onSaved() {
  router.push("/tasks");
}

function onClose(val: boolean) {
  if (!val) {
    router.push("/tasks");
  }
}
</script>

<template>
  <TaskFormDrawer
    :visible="showDrawer"
    @update:visible="onClose"
    @saved="onSaved"
  />
</template>
