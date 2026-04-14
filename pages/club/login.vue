<template>
  <ClubPageShell>
    <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/90">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      Закрытый клуб
    </div>

    <h1 class="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
      Вход в
      <span class="bg-gradient-to-r from-amber-200 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
        клуб
      </span>
    </h1>
    <p class="mt-3 text-[15px] leading-relaxed text-white/65">
      Логин и пароль, которые вы указали при регистрации.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-white/80" for="club-login">Логин</label>
        <input
          id="club-login"
          v-model="formData.login"
          name="login"
          type="text"
          required
          autocomplete="username"
          placeholder="Введите логин"
          class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-white/80" for="club-password">Пароль</label>
        <input
          id="club-password"
          v-model="formData.password"
          name="password"
          type="password"
          required
          autocomplete="current-password"
          placeholder="Введите пароль"
          class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
      </div>

      <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
        <button
          type="submit"
          class="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-600 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-950/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
        <NuxtLink
          to="/club/register"
          class="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-[15px] font-semibold text-white/95 transition hover:border-white/30 hover:bg-white/10"
        >
          Регистрация
        </NuxtLink>
      </div>

      <p
        v-if="error"
        class="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
      >
        {{ error }}
      </p>
    </form>

    <template #footer>
      После входа при необходимости откроется оплата доступа к клубу.
    </template>
  </ClubPageShell>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

const clubIntentCookie = useCookie('ksenia-club-intent', {
  maxAge: 60 * 60 * 24 * 90,
  path: '/',
  sameSite: 'lax'
})

onMounted(() => {
  clubIntentCookie.value = '1'
})

const formData = ref({
  login: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const router = useRouter()
const config = useRuntimeConfig()

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''

    const response = await fetch(`${config.public.apiBase}/api/auth/club/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.value)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при входе')
    }

    const cookie = useCookie('bearer-token', {
      maxAge: 60 * 60 * 16,
      path: '/',
      sameSite: 'lax'
    })
    cookie.value = data.token

    let decodedTariff = 'none'
    try {
      const dec = jwtDecode<{ tariff?: string }>(data.token)
      decodedTariff = dec?.tariff ?? 'none'
    } catch {
      decodedTariff = 'none'
    }

    if (decodedTariff !== 'tg_max') {
      await router.push('/club/pay')
    } else {
      await router.push('/cabinet')
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Произошла ошибка при входе'
  } finally {
    loading.value = false
  }
}
</script>
