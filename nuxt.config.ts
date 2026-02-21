// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

const BrooklynHealth = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{green.50}",
      100: "{green.100}",
      200: "{green.200}",
      300: "{green.300}",
      400: "{green.400}",
      500: "{green.500}",
      600: "{green.600}",
      700: "{green.700}",
      800: "{green.800}",
      900: "{green.900}",
      950: "{green.950}",
    },
  },
  primitive: {
    green: {
      50: "#F4F5F3",
      100: "#E6E9E4",
      200: "#CBD1C7",
      300: "#A3AD9D",
      400: "#7B8A73",
      500: "#5E6B58",
      600: "#4A5445",
      700: "#3B4337",
      800: "#2D332A",
      900: "#1F231D",
      950: "#14170F",
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2026-02-21",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
  ],
  primevue: {
    autoImport: true,
    components: {
      prefix: "Prime",
    },
    options: {
      theme: {
        preset: BrooklynHealth,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, tailwind-utilities",
          },
        },
      },
    },
    usePrimeVue: true,
  },
  css: ["primeicons/primeicons.css"],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
  },
  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "hi", name: "हिन्दी", file: "hi.json" },
    ],
    defaultLocale: "en",
    lazy: false,
    langDir: "locales/",
    restructureDir: false,
    strategy: "no_prefix",
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  app: {
    head: {
      title: "Patient Task Tracker",
      meta: [
        {
          name: "description",
          content:
            "Healthcare portal task management system for nurses and admins as a technical assessment for Brooklyn Health",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
    },
  },
});
