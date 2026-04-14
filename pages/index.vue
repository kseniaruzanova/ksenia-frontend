<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/90 to-gray-950 text-white">
    <div class="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <p class="text-center text-sm font-medium uppercase tracking-[0.2em] text-purple-300/90">
        Добро пожаловать
      </p>
      <h1 class="mt-4 text-center text-3xl font-bold leading-tight sm:text-4xl">
        Выберите раздел: закрытый клуб с лентой или платформа для экспертов
      </h1>
      <p class="mt-5 text-center text-base leading-relaxed text-white/75">
        Клуб — посты и доступ к каналам после оплаты. Платформа — кабинет, продукты, клиенты и инструменты для работы с аудиторией.
      </p>

      <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <NuxtLink
          to="/club"
          class="inline-flex items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:from-amber-500/30 hover:to-orange-500/30"
        >
          Клуб магии
        </NuxtLink>
        <NuxtLink
          to="/platform"
          class="inline-flex items-center justify-center rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-fuchsia-500"
        >
          Платформа
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
