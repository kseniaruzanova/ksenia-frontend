<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="max-w-3xl mx-auto px-4 py-10">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 md:p-8 border-b border-gray-100">
          <h1 class="text-3xl font-bold text-gray-900">Регистрация</h1>
          <p class="mt-2 text-gray-600">
            Выберите удобный способ. Email используется также для рассылки (можно отписаться в любой момент).
          </p>
        </div>

        <div class="p-6 md:p-8">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <template v-if="step === 'details'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
                <input
                  id="email"
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  placeholder="name@email.com"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <p class="mt-2 text-xs text-gray-500">На указанный email придет код подтверждения.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Пароль</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  autocomplete="new-password"
                  minlength="6"
                  placeholder="Минимум 6 символов"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <label class="flex items-start gap-3 text-sm text-gray-700">
                <input v-model="consent" type="checkbox" class="mt-1" required />
                <span>
                  Я согласен(на) на обработку данных и получение сообщений (рассылки).
                </span>
              </label>
            </template>

            <template v-else>
              <div class="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <h2 class="text-lg font-semibold text-gray-900">Подтвердите регистрацию</h2>
                <p class="mt-2 text-sm text-gray-600">
                  Мы отправили код подтверждения на
                  <span class="font-semibold text-gray-900">{{ maskedTarget }}</span>.
                </p>
                <p class="mt-1 text-xs text-gray-500">
                  Введите 6-значный код, чтобы завершить регистрацию.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="verificationCode">Код подтверждения</label>
                <input
                  id="verificationCode"
                  v-model.trim="verificationCode"
                  type="text"
                  inputmode="numeric"
                  maxlength="6"
                  placeholder="123456"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 tracking-[0.35em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </template>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                {{
                  loading
                    ? (step === 'details' ? 'Отправляем код...' : 'Подтверждаем...')
                    : (step === 'details' ? 'Получить код' : 'Подтвердить и зарегистрироваться')
                }}
              </button>

              <button
                v-if="step === 'code'"
                type="button"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
                :disabled="loading"
                @click="submitRegistrationCode()"
              >
                Отправить код повторно
              </button>

              <button
                v-if="step === 'code'"
                type="button"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
                :disabled="loading"
                @click="goBackToDetails"
              >
                Изменить данные
              </button>

              <NuxtLink
                v-if="step === 'details'"
                to="/login"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
              >
                Уже есть аккаунт — Войти
              </NuxtLink>
            </div>

            <p v-if="success" class="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3">
              {{ success }}
            </p>
            <p v-if="createdLogin" class="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
              Ваш логин для входа: <span class="font-semibold">{{ createdLogin }}</span>
            </p>
            <p v-if="error" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
              {{ error }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
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

function getRegistrationPayload() {
  return {
    email: email.value.toLowerCase(),
    channel: 'email',
    password: password.value,
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

    const res = await fetch(`${config.public.apiBase}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
  } catch (e: any) {
    error.value = e?.message || 'Ошибка отправки кода'
  } finally {
    loading.value = false
  }
}

async function verifyRegistration() {
  error.value = ''
  success.value = ''
  createdLogin.value = ''

  if (!verificationCode.value || verificationCode.value.trim().length !== 6) {
    error.value = 'Введите 6-значный код подтверждения'
    return
  }

  loading.value = true
  try {
    const payload = { email: email.value.toLowerCase(), channel: 'email', code: verificationCode.value.trim() }

    const res = await fetch(`${config.public.apiBase}/api/auth/register/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Не удалось подтвердить код')
    }

    const loginValue: string = data.login || email.value.toLowerCase()
    createdLogin.value = loginValue

    // После регистрации сразу авторизуем пользователя.
    const loginRes = await fetch(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: loginValue,
        password: password.value,
      }),
    })

    const loginData = await loginRes.json().catch(() => ({}))
    if (!loginRes.ok || !loginData?.token) {
      throw new Error(loginData.message || 'Регистрация прошла, но не удалось выполнить автоматический вход')
    }

    const cookie = useCookie('bearer-token', {
      maxAge: 60 * 60 * 16,
      path: '/',
      sameSite: 'lax'
    })
    cookie.value = loginData.token

    success.value = 'Регистрация успешна. Выполняем вход...'
    password.value = ''
    verificationCode.value = ''

    await router.push('/cabinet')
  } catch (e: any) {
    error.value = e?.message || 'Ошибка регистрации'
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

