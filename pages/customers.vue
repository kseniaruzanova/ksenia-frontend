<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">Управление кастомерами</h1>

        <!-- Два блока: создание слева, список справа -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Левая колонка: Форма создания -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900">Создать кастомера</h2>
              <p class="text-sm text-gray-500 mt-1">Заполните форму для создания нового кастомера</p>
            </div>

            <div class="p-6">
              <form @submit.prevent="createCustomer" class="space-y-5">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                    Имя пользователя
                  </label>
                  <input
                    id="username"
                    v-model="formData.username"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="ivan_ivanov"
                  />
                </div>

                <div>
                  <label for="botToken" class="block text-sm font-medium text-gray-700 mb-1">
                    Токен бота
                  </label>
                  <input
                    id="botToken"
                    v-model="formData.botToken"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="7285194020:AAH..."
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="tariff" class="block text-sm font-medium text-gray-700 mb-1">
                      Вид подписки
                    </label>
                    <select
                      id="tariff"
                      v-model="formData.tariff"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="none">Без подписки</option>
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>

                  <div>
                    <label for="subscriptionStatus" class="block text-sm font-medium text-gray-700 mb-1">
                      Статус подписки
                    </label>
                    <select
                      id="subscriptionStatus"
                      v-model="formData.subscriptionStatus"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="inactive">Неактивна</option>
                      <option value="active">Активна</option>
                      <option value="expired">Истекла</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="loading"
                >
                  <span v-if="loading" class="mr-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ loading ? 'Создание...' : 'Создать кастомера' }}
                </button>
              </form>

              <!-- Результат -->
              <div v-if="result" class="mt-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Успешно!</h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p class="font-semibold mb-2">Данные для входа:</p>
                      <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Username:</strong> {{ result.customer.username }}</li>
                        <li><strong>Password:</strong> <span class="font-mono text-xs bg-white px-2 py-1 rounded">{{ result.customer.password }}</span></li>
                        <li><strong>Подписка:</strong> {{ getTariffName(result.customer.tariff) }}</li>
                        <li><strong>Статус:</strong> {{ getSubscriptionStatusName(result.customer.subscriptionStatus) }}</li>
                      </ul>
                      <p class="mt-3 text-xs font-semibold text-orange-700">⚠️ Пароль больше не будет показан!</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ошибка -->
              <div v-if="error" class="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Правая колонка: Список кастомеров -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Кастомеры</h2>
                <p class="text-sm text-gray-500 mt-1">{{ customers.length }} записей</p>
              </div>
              <button
                @click="fetchCustomers"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loadingCustomers"
              >
                <span v-if="loadingCustomers" class="mr-2 inline-block">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loadingCustomers ? 'Загрузка...' : 'Обновить' }}
              </button>
            </div>
            
            <div v-if="customersError" class="p-4 bg-red-50 border-l-4 border-red-400 m-6 rounded">
              <p class="text-sm text-red-800">{{ customersError }}</p>
            </div>

            <div v-else-if="customers.length === 0 && !loadingCustomers" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Нет кастомеров</h3>
              <p class="mt-1 text-sm text-gray-500">Создайте первого кастомера с помощью формы слева</p>
            </div>

            <div v-else class="max-h-[calc(100vh-300px)] overflow-y-auto">
              <div class="divide-y divide-gray-200">
                <div
                  v-for="customer in customers"
                  :key="customer._id"
                  class="p-4 hover:bg-gray-50 transition cursor-pointer"
                  @click="toggleCustomer(customer._id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                            {{ customer.username ? customer.username.charAt(0).toUpperCase() : '?' }}
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-900 truncate">
                            {{ customer.username || 'Без имени' }}
                          </p>
                          <p v-if="customer.botToken" class="text-xs text-gray-500 font-mono truncate">
                            {{ customer.botToken.substring(0, 30) }}...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex items-center space-x-2">
                      <span 
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getStatusBadgeClass(customer.subscriptionStatus)"
                      >
                        {{ getSubscriptionStatusName(customer.subscriptionStatus) }}
                      </span>
                      <svg 
                        class="h-5 w-5 text-gray-400 transition transform"
                        :class="{ 'rotate-180': expandedCustomers[customer._id] }"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Раскрывающаяся информация -->
                  <div 
                    v-if="expandedCustomers[customer._id]" 
                    class="mt-4 pt-4 border-t border-gray-200 space-y-2"
                  >
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-gray-500">ID:</p>
                        <p class="text-gray-900 font-mono text-xs break-all">{{ customer._id }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Вид подписки:</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getTariffBadgeClass(customer.tariff)"
                        >
                          {{ getTariffName(customer.tariff) }}
                        </span>
                      </div>
                      <div class="col-span-2">
                        <p class="text-gray-500">Токен бота:</p>
                        <p class="text-gray-900 font-mono text-xs break-all">{{ customer.botToken }}</p>
                      </div>
                      <div v-if="customer.subscriptionEndsAt" class="col-span-2">
                        <p class="text-gray-500">Подписка до:</p>
                        <p class="text-gray-900 text-xs">{{ formatDate(customer.subscriptionEndsAt) }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2 pt-2">
                      <button
                        @click.stop="goToCustomer(customer._id)"
                        class="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                      >
                        Перейти
                      </button>
                      <button
                        @click.stop="copyCustomerId(customer._id)"
                        class="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
                      >
                        Копировать ID
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "admin",
});

const token = useCookie('bearer-token', {
  maxAge: 60 * 60 * 16,
  path: '/',
  sameSite: 'lax'
})
const router = useRouter()
const config = useRuntimeConfig()

// Отладка при загрузке страницы
console.log('Страница customers загружена')
console.log('Токен при загрузке:', token.value ? 'присутствует' : 'отсутствует')

const formData = ref({
  username: '',
  botToken: '',
  tariff: 'none',
  subscriptionStatus: 'inactive'
})

const loading = ref(false)
const error = ref('')
const result = ref(null)

// Состояние для списка кастомеров
const customers = ref([])
const loadingCustomers = ref(false)
const customersError = ref('')
const expandedCustomers = ref({})

// Получение списка кастомеров
async function fetchCustomers() {
  loadingCustomers.value = true
  customersError.value = ''

  // Проверяем наличие токена
  if (!token.value) {
    customersError.value = 'Токен авторизации не найден. Пожалуйста, войдите снова.'
    console.error('Токен отсутствует:', token.value)
    router.push('/login')
    loadingCustomers.value = false
    return
  }

  console.log('Токен для запроса:', token.value ? 'присутствует' : 'отсутствует')

  try {
    const response = await fetch(`${config.public.apiBase}/api/customers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        router.push('/login')
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.')
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    customers.value = Array.isArray(data) ? data : data.customers || []
    console.log('Загружено кастомеров:', customers.value.length)
  } catch (err) {
    customersError.value = err.message || 'Не удалось загрузить список кастомеров'
    console.error('Ошибка загрузки кастомеров:', err)
  } finally {
    loadingCustomers.value = false
  }
}

// Переход на страницу кастомера
function goToCustomer(customerId) {
  // Можно настроить маршрут как /customers/[id] или другой
  router.push(`/customer/${customerId}`)
}

// Копирование ID кастомера в буфер обмена
async function copyCustomerId(customerId) {
  try {
    await navigator.clipboard.writeText(customerId.toString())
    // Можно добавить уведомление об успешном копировании
    alert('ID скопирован в буфер обмена!')
  } catch (err) {
    console.error('Не удалось скопировать ID:', err)
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea')
    textArea.value = customerId
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('ID скопирован в буфер обмена!')
  }
}

// Вспомогательные функции для отображения
function getTariffName(tariff) {
  const names = {
    'none': 'Без подписки',
    'basic': 'Basic',
    'pro': 'Pro'
  }
  return names[tariff] || tariff
}

function getSubscriptionStatusName(status) {
  const names = {
    'inactive': 'Неактивна',
    'active': 'Активна',
    'expired': 'Истекла'
  }
  return names[status] || status
}

// Функции для стилизации badge'ей
function getStatusBadgeClass(status) {
  const classes = {
    'inactive': 'bg-gray-100 text-gray-800',
    'active': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getTariffBadgeClass(tariff) {
  const classes = {
    'none': 'bg-gray-100 text-gray-800',
    'basic': 'bg-blue-100 text-blue-800',
    'pro': 'bg-purple-100 text-purple-800'
  }
  return classes[tariff] || 'bg-gray-100 text-gray-800'
}

// Функция для переключения раскрытия кастомера
function toggleCustomer(customerId) {
  expandedCustomers.value[customerId] = !expandedCustomers.value[customerId]
}

// Функция для форматирования даты
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Загрузка кастомеров при монтировании компонента
onMounted(() => {
  fetchCustomers()
})

async function createCustomer() {
  loading.value = true
  error.value = ''
  result.value = null

  // Проверяем наличие токена
  if (!token.value) {
    error.value = 'Токен авторизации не найден. Пожалуйста, войдите снова.'
    console.error('Токен отсутствует при создании кастомера')
    router.push('/login')
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${config.public.apiBase}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(formData.value)
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        router.push('/login')
      }
      throw new Error(data.message || 'Не удалось создать кастомера')
    }

    result.value = data
    formData.value = { username: '', botToken: '', tariff: 'none', subscriptionStatus: 'inactive' } // Сброс формы
    
    // Обновляем список кастомеров после создания
    await fetchCustomers()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script> 