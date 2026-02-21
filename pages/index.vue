<script setup lang="ts">
// This is more of a placeholder page, which can eventually be a login page or
// maybe directly the tasks page. For now, it redirects to the tasks page.
navigateTo("/tasks");
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <div class="text-center">
      <div
        class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"
      ></div>
      <p class="text-slate-500">Redirecting...</p>
    </div>
  </div>
</template>
