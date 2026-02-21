import { createPinia, setActivePinia } from "pinia";
import { ref, computed, watch } from "vue";
import { beforeEach } from "vitest";

// Make Nuxt auto-imports available as globals
Object.assign(globalThis, { ref, computed, watch });

// Create a fresh Pinia instance before each test
beforeEach(() => {
  setActivePinia(createPinia());
});
