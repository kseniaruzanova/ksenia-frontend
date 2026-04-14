<template>
  <ClubPageShell>
    <div class="flex justify-end">
      <button
        type="button"
        class="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
        @click="handleLogout"
      >
        Выйти
      </button>
    </div>

    <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/90">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      Закрытый клуб
    </div>

    <h1 class="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
      Оплатить
      <span class="bg-gradient-to-r from-amber-200 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
        вход
      </span>
    </h1>
    <p class="mt-3 text-[15px] leading-relaxed text-white/65">
      Продукт «Доступ к ТГ и макс каналу» открывает ленту в кабинете и вход в закрытый Telegram. Макс — в разработке.
    </p>

    <div class="mt-8 rounded-2xl border border-amber-400/25 bg-amber-500/[0.08] p-5">
      <h2 class="text-lg font-semibold text-white">📢 Доступ к ТГ и макс каналу</h2>
      <p class="mt-1 text-white/70">990₽ / мес</p>
      <ul class="mt-4 space-y-2.5 text-sm text-white/75">
        <li class="flex gap-2"><span class="text-amber-300/90">✓</span>Доступ в Telegram-канал</li>
        <li class="flex gap-2"><span class="text-amber-300/90">✓</span>Лента постов в личном кабинете</li>
        <li class="flex gap-2"><span class="text-white/45">⋯</span>Макс — скоро</li>
      </ul>
    </div>

    <button
      type="button"
      class="mt-8 w-full rounded-2xl bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-600 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-950/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="loading || tariff === 'tg_max'"
      @click="startPayment"
    >
      {{
        tariff === 'tg_max'
          ? 'Уже оплачено'
          : loading
            ? 'Создаём ссылку...'
            : 'Оплатить вход'
      }}
    </button>

    <p v-if="tariff === 'tg_max'" class="mt-5 text-center text-sm text-emerald-300/90">
      Доступ активен.
      <NuxtLink to="/cabinet" class="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white">
        В кабинет
      </NuxtLink>
    </p>

    <template #footer>
      После успешной оплаты подписка активируется в течение минуты.
    </template>
  </ClubPageShell>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'customer'
})

const { tariff } = useAuth()
const loading = ref(false)
const token = useCookie('bearer-token')
const clubIntentCookie = useCookie('ksenia-club-intent')
const router = useRouter()
const config = useRuntimeConfig()

function handleLogout() {
  token.value = null
  clubIntentCookie.value = null
  router.push('/club')
}

async function startPayment() {
  try {
    loading.value = true
    const response = await fetch(`${config.public.apiBase}/api/prodamus/create/link/tg_max`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const data = await response.json()
    if (data?.link) {
      window.location.href = data.link
    } else {
      throw new Error('Не удалось получить ссылку на оплату')
    }
  } catch (e) {
    console.error(e)
    alert('Ошибка создания платежа. Попробуйте снова.')
  } finally {
    loading.value = false
  }
}
</script>
