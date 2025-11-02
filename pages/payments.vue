<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Список оплат</h1>
            <p class="text-gray-500 mt-2">Управление и отслеживание платежей</p>
          </div>

          <!-- Фильтрация -->
          <div class="bg-white rounded-lg shadow-lg mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Фильтрация</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Username -->
                <div v-if="!isCustomer">
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    id="username"
                    v-model="filters.username"
                    type="text"
                    placeholder="Введите username"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <!-- Дата от -->
                <div>
                  <label for="fromDate" class="block text-sm font-medium text-gray-700 mb-2">Дата от</label>
                  <input
                    id="fromDate"
                    v-model="filters.fromDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <!-- Дата до -->
                <div>
                  <label for="toDate" class="block text-sm font-medium text-gray-700 mb-2">Дата до</label>
                  <input
                    id="toDate"
                    v-model="filters.toDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <!-- Кнопки -->
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  @click="resetFilters"
                  class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition disabled:opacity-50"
                  :disabled="loading"
                >
                  Сбросить
                </button>
                <button
                  @click="applyFilters"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="loading"
                >
                  <span v-if="loading" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {{ loading ? 'Загрузка...' : 'Применить фильтры' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Список оплат -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Оплаты</h2>
                <p class="text-sm text-gray-500 mt-1">{{ total }} всего</p>
              </div>
              <button
                @click="fetchPayments"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Загрузка...' : 'Обновить' }}
              </button>
            </div>

            <div v-if="error" class="p-6 bg-red-50 border-l-4 border-red-400">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>

            <div v-else-if="payments.length === 0 && !loading" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Нет оплат</h3>
              <p class="mt-1 text-sm text-gray-500">Данные будут отображаться после появления платежей</p>
            </div>

            <div v-else class="overflow-hidden">
              <!-- Мобильная версия (карточки) -->
              <div class="lg:hidden divide-y divide-gray-200">
                <div
                  v-for="payment in payments"
                  :key="payment._id"
                  class="p-4 hover:bg-gray-50 transition cursor-pointer"
                  @click="togglePayment(payment._id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span class="text-green-600 text-xl">💰</span>
                        </div>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">{{ payment.username || 'Неизвестно' }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(payment.createdAt) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {{ payment.amount }} ₽
                      </span>
                      <svg 
                        class="h-5 w-5 text-gray-400 transition transform"
                        :class="{ 'rotate-180': expandedPayments[payment._id] }"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Раскрывающаяся информация -->
                  <div v-if="expandedPayments[payment._id]" class="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-gray-500">ID:</p>
                        <p class="text-gray-900 font-mono text-xs break-all">{{ payment._id }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Тип:</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ payment.type }}
                        </span>
                      </div>
                      <div class="col-span-2">
                        <p class="text-gray-500">Бот:</p>
                        <p class="text-gray-900 text-sm">{{ payment.bot_name }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Десктопная версия (таблица) -->
              <div class="hidden lg:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бот</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="payment in payments" :key="payment._id" class="hover:bg-gray-50 transition">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-600 text-xs font-semibold">
                              {{ payment.username ? payment.username.charAt(0).toUpperCase() : '?' }}
                            </span>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ payment.username || 'Неизвестно' }}</div>
                            <div class="text-xs text-gray-500 font-mono">{{ payment._id }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.bot_name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ payment.type }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm font-semibold text-green-600">{{ payment.amount }} ₽</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(payment.createdAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Пагинация -->
              <div class="bg-white px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <div class="flex-1 flex justify-between items-center">
                  <div class="text-sm text-gray-700">
                    Страница {{ currentPage }} из {{ totalDisplayPages }}
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="changePage(currentPage - 1)"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                    >
                      Назад
                    </button>
                    <button
                      @click="changePage(currentPage + 1)"
                      :disabled="currentPage === totalDisplayPages"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="currentPage === totalDisplayPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                    >
                      Вперед
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const payments = ref([])
const loading = ref(false)
const error = ref(null)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(25)
const expandedPayments = ref({})

const config = useRuntimeConfig()
const token = useCookie('bearer-token')

const { isCustomer, tariff } = useAuth();
 
// Фильтры
const filters = ref({
  username: '',
  fromDate: '',
  toDate: ''
})

// Пагинация
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + pageSize.value, total.value)
)
const totalDisplayPages = computed(() =>
  Math.ceil(total.value / pageSize.value)
)

// Загрузка платежей с учетом фильтров
async function fetchPayments() {
  loading.value = true
  error.value = null
  try {
    const url = new URL(`${config.public.apiBase}/api/payments/`)
    url.searchParams.append('page', currentPage.value)
    url.searchParams.append('limit', pageSize.value)

    // Применяем фильтры
    if (filters.value.username) {
      url.searchParams.append('filters[username]', filters.value.username)
    }
    if (filters.value.fromDate) {
      url.searchParams.append('filters[fromDate]', filters.value.fromDate)
    }
    if (filters.value.toDate) {
      url.searchParams.append('filters[toDate]', filters.value.toDate)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных')
    }

    const result = await response.json()
    payments.value = result?.payments || []
    total.value = result?.total || 0 // total — общее количество записей
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Применить фильтры
function applyFilters() {
  currentPage.value = 1
  fetchPayments()
}

// Сбросить фильтры
function resetFilters() {
  filters.value.username = ''
  filters.value.fromDate = ''
  filters.value.toDate = ''
  applyFilters()
}

function changePage(page) {
  if (page >= 1 && page <= totalDisplayPages.value) {
    currentPage.value = page
  }
}

// Функция для переключения раскрытия платежа
function togglePayment(paymentId) {
  expandedPayments.value[paymentId] = !expandedPayments.value[paymentId]
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return 'Не указано'
  
  try {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Автоматическая загрузка при смене страницы
watch(currentPage, () => {
  fetchPayments()
})

// Первая загрузка
fetchPayments()

 
</script>
