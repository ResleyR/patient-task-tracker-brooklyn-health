<script setup lang="ts">
const { t, locale, setLocale } = useI18n();
const authStore = useAuthStore();

function toggleLocale() {
  setLocale(locale.value === "en" ? "hi" : "en");
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 shadow-lg shadow-primary-600/20"
          >
            <div v-if="false">
              <!-- https://www.svgrepo.com/svg/522795/clipboard-check-->
            </div>
            <svg
              class="h-5 w-5 text-white"
              width="800"
              height="800"
              viewBox="-2.4 -2.4 28.8 28.8"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                fill-rule="evenodd"
                d="M7.263 3.259A2.25 2.25 0 0 1 9.5 1.25h5a2.25 2.25 0 0 1 2.237 2.009c.763.016 1.423.055 1.986.158.758.139 1.403.404 1.928.929.602.602.861 1.36.982 2.26.116.867.116 1.969.116 3.337v6.11l-.116 3.337c-.121.9-.38 1.658-.982 2.26s-1.36.861-2.26.982c-.867.117-1.969.117-3.337.117h-6.11c-1.368 0-2.47 0-3.337-.117-.9-.121-1.658-.38-2.26-.982s-.861-1.36-.982-2.26c-.117-.867-.117-1.969-.117-3.337v-6.11l.117-3.337c.121-.9.38-1.658.982-2.26.525-.525 1.17-.79 1.928-.929.563-.103 1.223-.143 1.986-.158zm.002 1.5c-.718.015-1.271.051-1.717.133-.567.104-.895.271-1.138.515-.277.277-.457.665-.556 1.399-.102.755-.103 1.756-.103 3.192v6l.103 3.192c.099.734.279 1.122.556 1.399s.665.457 1.399.556c.755.102 1.756.103 3.192.103h6l3.192-.103c.734-.099 1.122-.279 1.399-.556s.457-.665.556-1.399c.102-.755.103-1.756.103-3.192v-6l-.103-3.192c-.099-.734-.279-1.122-.556-1.399-.244-.243-.572-.411-1.138-.515-.446-.082-.999-.118-1.718-.133A2.25 2.25 0 0 1 14.5 6.75h-5a2.25 2.25 0 0 1-2.235-1.991zM9.5 2.75a.75.75 0 0 0-.75.75v1a.75.75 0 0 0 .75.75h5a.75.75 0 0 0 .75-.75v-1a.75.75 0 0 0-.75-.75h-5zm6.048 7.738a.75.75 0 0 1-.037 1.06l-4.286 4a.75.75 0 0 1-1.024 0l-1.714-1.6a.75.75 0 1 1 1.023-1.097l1.203 1.122 3.774-3.522a.75.75 0 0 1 1.06.037z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-lg font-bold leading-tight text-slate-900">
              {{ t("app.title") }}
            </h1>
            <p class="-mt-0.5 text-xs text-slate-500">
              {{ t("app.subtitle") }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <PrimeButton
            @click="toggleLocale"
            :label="locale === 'en' ? 'हिन्दी' : 'EN'"
            icon="pi pi-language"
            severity="secondary"
            text
            size="small"
            :title="locale === 'en' ? 'Switch to Hindi' : 'Switch to English'"
          />

          <PrimeButton
            @click="authStore.toggleRole()"
            :label="authStore.isAdmin ? t('roles.admin') : t('roles.nurse')"
            :icon="authStore.isAdmin ? 'pi pi-shield' : 'pi pi-user'"
            :severity="authStore.isAdmin ? 'help' : 'info'"
            outlined
            size="small"
          />
        </div>
      </div>
    </div>
  </header>
</template>
