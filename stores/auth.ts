import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserRole } from "../types";

const STORAGE_KEY = "patient-task-tracker:role";

export const useAuthStore = defineStore("auth", () => {
  const role = ref<UserRole>("admin");

  function loadFromStorage() {
    if (import.meta.server) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "admin" || saved === "nurse") {
      role.value = saved;
    }
  }

  function setRole(newRole: UserRole) {
    role.value = newRole;
    if (!import.meta.server) {
      localStorage.setItem(STORAGE_KEY, newRole);
    }
  }

  function toggleRole() {
    setRole(role.value === "admin" ? "nurse" : "admin");
  }

  const isAdmin = computed(() => role.value === "admin");
  const isNurse = computed(() => role.value === "nurse");

  return {
    role,
    isAdmin,
    isNurse,
    loadFromStorage,
    setRole,
    toggleRole,
  };
});
