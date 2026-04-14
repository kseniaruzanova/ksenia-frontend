<template>
  <ClubPageShell>
    <div class="text-center">
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl"
        aria-hidden="true"
      >
        ✓
      </div>
      <h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Оплата прошла успешно
      </h1>
      <p class="mt-4 text-[15px] leading-relaxed text-white/70">
        Подписка клуба активируется автоматически в течение минуты. Если доступ не появился — обновите страницу кабинета.
      </p>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <NuxtLink
          to="/cabinet"
          class="inline-flex justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-950/50 transition hover:brightness-110"
        >
          В кабинет
        </NuxtLink>
        <NuxtLink
          to="/club/pay"
          class="inline-flex justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-white/90 transition hover:border-white/30 hover:bg-white/10"
        >
          К оплате
        </NuxtLink>
      </div>
    </div>
    <template #footer>
      Закрытый клуб · спасибо за поддержку
    </template>
  </ClubPageShell>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'customer',
})
</script>
