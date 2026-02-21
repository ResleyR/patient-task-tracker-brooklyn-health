<script setup lang="ts">
const taskStore = useTaskStore();
const authStore = useAuthStore();

onMounted(() => {
  taskStore.loadFromStorage();
  authStore.loadFromStorage();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
