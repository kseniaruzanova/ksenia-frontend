<template>
  <ClubPageShell>
    <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/90">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      Закрытый клуб
    </div>

    <h1 class="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
      Клуб
      <span class="bg-gradient-to-r from-amber-200 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
        магии
      </span>
    </h1>

    <p class="mt-5 text-[15px] leading-relaxed text-white/70 sm:text-base">
      Лента материалов в духе Telegram: посты с текстом, фото, видео и файлами. После регистрации и оплаты открывается доступ к закрытому каналу в Telegram; вход в Макс появится чуть позже.
    </p>

    <ul class="mt-8 space-y-3 text-sm text-white/60">
      <li class="flex gap-3">
        <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-amber-300/90">✦</span>
        <span>Единая лента в личном кабинете после оплаты</span>
      </li>
      <li class="flex gap-3">
        <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-amber-300/90">✦</span>
        <span>Приглашение в закрытый Telegram-канал</span>
      </li>
    </ul>

    <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
      <NuxtLink
        to="/club/register"
        class="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-600 px-6 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-950/50 transition hover:brightness-110 active:scale-[0.98]"
      >
        Зарегистрироваться
      </NuxtLink>
      <NuxtLink
        to="/club/login"
        class="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 text-[15px] font-semibold text-white/95 transition hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
      >
        Войти
      </NuxtLink>
    </div>

    <template #footer>
      Продолжая, вы соглашаетесь с правилами клуба и обработкой данных при регистрации.
    </template>
  </ClubPageShell>
</template>

<script setup lang="ts">
const clubIntent = useCookie('ksenia-club-intent', {
  maxAge: 60 * 60 * 24 * 90,
  path: '/',
  sameSite: 'lax'
})

onMounted(() => {
  clubIntent.value = '1'
})
</script>
