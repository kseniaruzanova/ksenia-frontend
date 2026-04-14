<template>
  <ClubPageShell>
    <div class="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200/90">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
      Закрытый клуб
    </div>

    <h1 class="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
      Регистрация в
      <span class="bg-gradient-to-r from-amber-200 via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
        клубе
      </span>
    </h1>
    <p class="mt-3 text-[15px] leading-relaxed text-white/65">
      Укажите email — придёт код подтверждения. Пароль нужен для входа в кабинет.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
      <template v-if="step === 'details'">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-white/80" for="club-email">Email</label>
          <input
            id="club-email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            placeholder="name@email.com"
            required
            class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
          <p class="mt-2 text-xs text-white/45">На email придёт 6-значный код.</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-white/80" for="club-reg-password">Пароль</label>
          <input
            id="club-reg-password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            minlength="6"
            placeholder="Минимум 6 символов"
            required
            class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
        </div>

        <label class="flex items-start gap-3 text-sm text-white/75">
          <input v-model="consent" type="checkbox" class="mt-1 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-500/40" required>
          <span>Согласен(на) на обработку данных и сообщения (рассылку).</span>
        </label>
      </template>

      <template v-else>
        <div class="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4">
          <h2 class="text-lg font-semibold text-white">Подтвердите email</h2>
          <p class="mt-2 text-sm text-white/70">
            Код отправлен на
            <span class="font-semibold text-white">{{ maskedTarget }}</span>.
          </p>
          <p class="mt-1 text-xs text-white/45">Введите 6 цифр.</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-white/80" for="club-code">Код</label>
          <input
            id="club-code"
            v-model.trim="verificationCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="••••••"
            required
            class="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-center text-lg tracking-[0.35em] text-white placeholder:text-white/25 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
        </div>
      </template>

      <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          class="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-fuchsia-600 to-violet-600 px-5 text-[15px] font-semibold text-white shadow-lg shadow-fuchsia-950/50 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{
            loading
              ? (step === 'details' ? 'Отправляем код...' : 'Подтверждаем...')
              : (step === 'details' ? 'Получить код' : 'Подтвердить')
          }}
        </button>

        <button
          v-if="step === 'code'"
          type="button"
          class="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 text-[15px] font-semibold text-white/90 transition hover:bg-white/10 disabled:opacity-60"
          :disabled="loading"
          @click="submitRegistrationCode()"
        >
          Код ещё раз
        </button>

        <button
          v-if="step === 'code'"
          type="button"
          class="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-transparent px-5 text-[15px] font-semibold text-white/70 transition hover:text-white disabled:opacity-60"
          :disabled="loading"
          @click="goBackToDetails"
        >
          Изменить данные
        </button>

        <NuxtLink
          v-if="step === 'details'"
          to="/club/login"
          class="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 text-[15px] font-semibold text-white/95 transition hover:border-white/30 hover:bg-white/10"
        >
          Уже есть аккаунт
        </NuxtLink>
      </div>

      <p v-if="success" class="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        {{ success }}
      </p>
      <p v-if="createdLogin" class="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">
        Логин для входа: <span class="font-semibold text-white">{{ createdLogin }}</span>
      </p>
      <p v-if="error" class="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
        {{ error }}
      </p>
    </form>

    <template #footer>
      После подтверждения откроется страница оплаты доступа.
    </template>
  </ClubPageShell>
</template>

<script setup lang="ts">
const step = ref<'details' | 'code'>('details')
const email = ref('')
const password = ref('')
const verificationCode = ref('')
const maskedTarget = ref('')
const consent = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const createdLogin = ref('')

const config = useRuntimeConfig()
const router = useRouter()

const clubIntentCookie = useCookie('ksenia-club-intent', {
  maxAge: 60 * 60 * 24 * 90,
  path: '/',
  sameSite: 'lax'
})

onMounted(() => {
  clubIntentCookie.value = '1'
})

function getRegistrationPayload() {
  return {
    email: email.value.toLowerCase(),
    channel: 'email',
    password: password.value
  }
}

function goBackToDetails() {
  step.value = 'details'
  verificationCode.value = ''
  success.value = ''
  error.value = ''
}

async function submitRegistrationCode() {
  error.value = ''
  success.value = ''
  createdLogin.value = ''

  loading.value = true
  try {
    const payload = getRegistrationPayload()

    const res = await fetch(`${config.public.apiBase}/api/auth/club/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Не удалось отправить код подтверждения')
    }

    const loginValue: string = data.login || email.value.toLowerCase()
    createdLogin.value = loginValue
    maskedTarget.value = data.target || loginValue
    step.value = 'code'
    success.value = data.message || 'Код подтверждения отправлен'
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Ошибка отправки кода'
  } finally {
    loading.value = false
  }
}

async function verifyRegistration() {
  error.value = ''
  success.value = ''
  createdLogin.value = ''

  if (!verificationCode.value || verificationCode.value.trim().length !== 6) {
    error.value = 'Введите 6-значный код'
    return
  }

  loading.value = true
  try {
    const payload = { email: email.value.toLowerCase(), channel: 'email', code: verificationCode.value.trim() }

    const res = await fetch(`${config.public.apiBase}/api/auth/club/register/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Не удалось подтвердить код')
    }

    const loginValue: string = data.login || email.value.toLowerCase()
    createdLogin.value = loginValue

    const loginRes = await fetch(`${config.public.apiBase}/api/auth/club/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: loginValue,
        password: password.value
      })
    })

    const loginData = await loginRes.json().catch(() => ({}))
    if (!loginRes.ok || !loginData?.token) {
      throw new Error(loginData.message || 'Регистрация прошла, но вход не удался')
    }

    const cookie = useCookie('bearer-token', {
      maxAge: 60 * 60 * 16,
      path: '/',
      sameSite: 'lax'
    })
    cookie.value = loginData.token

    success.value = 'Готово. Переходим к оплате...'
    password.value = ''
    verificationCode.value = ''

    await router.push('/club/pay')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  if (step.value === 'details') {
    await submitRegistrationCode()
    return
  }
  await verifyRegistration()
}
</script>
