<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <div class="max-w-3xl mx-auto px-4 py-10">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 md:p-8 border-b border-gray-100">
          <h1 class="text-3xl font-bold text-gray-900">Вход в систему</h1>
          <p class="mt-2 text-gray-600">
            Введите логин и пароль для доступа к личному кабинету.
          </p>
        </div>

        <div class="p-6 md:p-8">
          <form class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="login">Логин</label>
              <input
                id="login"
                v-model="formData.login"
                name="login"
                type="text"
                required
                placeholder="Введите логин"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Пароль</label>
              <input
                id="password"
                v-model="formData.password"
                name="password"
                type="password"
                required
                placeholder="Введите пароль"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                {{ loading ? 'Вход...' : 'Войти' }}
              </button>
              <NuxtLink
                to="/register"
                class="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
              >
                Нет аккаунта — Регистрация
              </NuxtLink>
            </div>

            <p v-if="error" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
              {{ error }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
    
    const response = await fetch(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при входе')
    }

    // Сохраняем токен в куки с правильными параметрами
    const cookie = useCookie('bearer-token', {
      maxAge: 60 * 60 * 16, // 8 часов
      path: '/',
      sameSite: 'lax'
    })
    cookie.value = data.token

    console.log('Токен сохранен:', data.token ? 'да' : 'нет')
    console.log('Роль пользователя:', data.role)

    // Перенаправляем в кабинет
    await router.push('/cabinet')
  } catch (e) {
    error.value = e.message || 'Произошла ошибка при входе'
  } finally {
    loading.value = false
  }
}
</script>
