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
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-semibold border transition"
              :class="tab === 'phone' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
              @click="tab = 'phone'"
            >
              По телефону
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm font-semibold border transition"
              :class="tab === 'email' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
              @click="tab = 'email'"
            >
              По email
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div v-if="tab === 'phone'">
              <label class="block text-sm font-medium text-gray-700 mb-1" for="phone">Телефон</label>
              <input
                id="phone"
                v-model.trim="phone"
                type="tel"
                autocomplete="tel"
                placeholder="+7 999 123-45-67"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <p class="mt-2 text-xs text-gray-500">Если на бэке включена SMS/OTP — сюда придёт код подтверждения.</p>
            </div>

            <div v-else>
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
              <p class="mt-2 text-xs text-gray-500">Будем использовать email для уведомлений и рассылки.</p>
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

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                {{ loading ? 'Отправляем...' : 'Зарегистрироваться' }}
              </button>
              <NuxtLink
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
const tab = ref<'phone' | 'email'>('phone')
const phone = ref('')
const email = ref('')
const password = ref('')
const consent = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const createdLogin = ref('')

const config = useRuntimeConfig()
const router = useRouter()

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, '')
}

async function handleSubmit() {
  error.value = ''
  success.value = ''
  createdLogin.value = ''
  loading.value = true
  try {
    const payload =
      tab.value === 'phone'
        ? { phone: normalizePhone(phone.value), channel: 'phone', password: password.value }
        : { email: email.value.toLowerCase(), channel: 'email', password: password.value }

    const res = await fetch(`${config.public.apiBase}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Не удалось зарегистрироваться')
    }

    const loginValue: string = data.login || (tab.value === 'phone' ? normalizePhone(phone.value) : email.value.toLowerCase())
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
    await router.push('/cabinet')
  } catch (e: any) {
    error.value = e?.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>

