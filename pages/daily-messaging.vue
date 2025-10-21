<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
          Управление ежедневной отправкой сообщений
        </h1>

        <!-- Статус планировщика -->
        <div class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Статус планировщика</h2>
              <div class="mt-2 flex items-center space-x-4">
                <div :class="[
                  'flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
                  status.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    status.enabled ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <span>{{ status.enabled ? 'Активен' : 'Остановлен' }}</span>
                </div>
                <span v-if="status.nextRun" class="text-sm text-gray-600">
                  Следующий запуск: {{ formatDate(status.nextRun) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Конфигурация -->
        <div class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Конфигурация отправки</h2>
          </div>
          <div class="px-6 py-6">
            <form @submit.prevent="updateConfiguration" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="configForm.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="text-sm font-medium text-gray-700">Включить автоматическую отправку</span>
                  </label>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Время отправки (HH:MM)</label>
                  <input
                    v-model="configForm.time"
                    type="text"
                    placeholder="09:00"
                    pattern="[0-2][0-9]:[0-5][0-9]"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Часовой пояс</label>
                  <input
                    v-model="configForm.timezone"
                    type="text"
                    placeholder="Europe/Moscow"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Макс. параллельных отправок (1-20)</label>
                  <input
                    v-model.number="configForm.maxConcurrency"
                    type="number"
                    min="1"
                    max="20"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Задержка между сообщениями (мс, 0-10000)</label>
                  <input
                    v-model.number="configForm.perMessageDelayMs"
                    type="number"
                    min="0"
                    max="10000"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">AI-настройки</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Модель</label>
                    <input
                      v-model="configForm.model"
                      type="text"
                      placeholder="openai/gpt-4o-mini"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Температура (0-2)</label>
                    <input
                      v-model.number="configForm.temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Формат отправки</label>
                    <select
                      v-model="configForm.sendFormat"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Markdown">Markdown</option>
                      <option value="HTML">HTML</option>
                    </select>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">System prompt</label>
                    <textarea
                      v-model="configForm.promptSystem"
                      rows="6"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Текст system-промта"
                    ></textarea>
                  </div>
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-medium text-gray-700">User prompt-шаблон</label>
                      <div class="text-xs text-gray-500" v-pre>Доступные плейсхолдеры: {{birthday}}, {{today}}, {{arcan0}}, {{arcan1}}, {{arcan2}}, {{arcan3}}, {{arcan4}}</div>
                    </div>
                    <textarea
                      v-model="configForm.promptUserTemplate"
                      rows="6"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Шаблон пользовательского промта"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  {{ loading ? 'Сохранение...' : 'Сохранить конфигурацию' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Быстрые действия</h2>
          </div>
          <div class="px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                @click="sendNow"
                :disabled="loading"
                class="px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-left"
              >
                <div class="flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <div>
                    <div class="font-bold">Отправить сейчас</div>
                    <div class="text-sm opacity-90">Отправить ежедневные сообщения прямо сейчас</div>
                  </div>
                </div>
              </button>

              <button
                @click="showTestUserModal = true"
                class="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-left"
              >
                <div class="flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <div class="font-bold">Тестовая отправка</div>
                    <div class="text-sm opacity-90">Отправить сообщение одному пользователю</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Статистика -->
        <div class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Статистика</h2>
          </div>
          <div class="px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="text-sm text-blue-600 font-medium">Пользователей в системе</div>
                <div class="text-3xl font-bold text-blue-900 mt-2">{{ stats.usersForDailyMessaging || 0 }}</div>
              </div>
              <div class="bg-green-50 p-4 rounded-lg" v-if="lastSendResult">
                <div class="text-sm text-green-600 font-medium">Успешно отправлено</div>
                <div class="text-3xl font-bold text-green-900 mt-2">{{ lastSendResult.success || 0 }}</div>
              </div>
              <div class="bg-red-50 p-4 rounded-lg" v-if="lastSendResult">
                <div class="text-sm text-red-600 font-medium">Ошибки отправки</div>
                <div class="text-3xl font-bold text-red-900 mt-2">{{ lastSendResult.failed || 0 }}</div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" v-if="aggregate7d">
              <div class="bg-indigo-50 p-4 rounded-lg">
                <div class="text-sm text-indigo-600 font-medium">7 дней: Всего получателей</div>
                <div class="text-3xl font-bold text-indigo-900 mt-2">{{ aggregate7d.total }}</div>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="text-sm text-green-600 font-medium">7 дней: Успешно</div>
                <div class="text-3xl font-bold text-green-900 mt-2">{{ aggregate7d.success }}</div>
              </div>
              <div class="bg-red-50 p-4 rounded-lg">
                <div class="text-sm text-red-600 font-medium">7 дней: Ошибок</div>
                <div class="text-3xl font-bold text-red-900 mt-2">{{ aggregate7d.failed }}</div>
              </div>
            </div>
            <div class="mt-6" v-if="recentRuns && recentRuns.length">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Последние прогоны</h3>
              <div class="max-h-64 overflow-y-auto divide-y divide-gray-200 bg-gray-50 rounded">
                <div v-for="(run, idx) in recentRuns" :key="idx" class="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ formatDate(run.startedAt) }} <span class="text-gray-500">→</span> {{ formatDate(run.finishedAt) }}</div>
                    <div class="text-xs text-gray-600">Триггер: {{ run.trigger }}</div>
                  </div>
                  <div class="text-sm text-gray-800">
                    {{ run.success }}/{{ run.total }} <span class="text-gray-500">успехов</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Список пользователей для отправки -->
        <div class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">
              Пользователи для ежедневной отправки ({{ users.length }})
            </h2>
            <button
              @click="fetchUsers"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Обновить список
            </button>
          </div>
          <div v-if="loadingUsers" class="px-6 py-8 text-center text-gray-500">
            Загрузка пользователей...
          </div>
          <div v-else-if="users.length === 0" class="px-6 py-8 text-center text-gray-500">
            Нет пользователей для ежедневной отправки
          </div>
          <div v-else class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-gray-200">
              <div
                v-for="user in users"
                :key="`${user.customerId}-${user.chatId}`"
                class="px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ user.customerName || 'Без имени' }}</p>
                  <p class="text-xs text-gray-500">Customer ID: {{ user.customerId }}</p>
                  <p class="text-xs text-gray-500">Chat ID: {{ user.chatId }}</p>
                </div>
                <button
                  @click="testUser(user)"
                  class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Тестировать
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Результат последней отправки -->
        <div v-if="lastSendResult && lastSendResult.results" class="mb-8 bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">Результаты последней отправки</h2>
            <p class="text-sm text-gray-600 mt-1">
              Всего: {{ lastSendResult.total }}, Успешно: {{ lastSendResult.success }}, Ошибок: {{ lastSendResult.failed }}
              ({{ lastSendResult.successRate }})
            </p>
          </div>
          <div class="max-h-96 overflow-y-auto">
            <div class="divide-y divide-gray-200">
              <div
                v-for="(result, index) in lastSendResult.results"
                :key="index"
                :class="[
                  'px-6 py-3 flex justify-between items-center',
                  result.success ? 'bg-green-50' : 'bg-red-50'
                ]"
              >
                <div>
                  <p class="text-sm font-medium" :class="result.success ? 'text-green-900' : 'text-red-900'">
                    {{ result.customerName || 'Пользователь' }}
                  </p>
                  <p class="text-xs" :class="result.success ? 'text-green-700' : 'text-red-700'">
                    Chat ID: {{ result.chatId }}
                  </p>
                  <p v-if="result.error" class="text-xs text-red-600 mt-1">{{ result.error }}</p>
                </div>
                <div :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ result.success ? '✓ Отправлено' : '✗ Ошибка' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Уведомления -->
        <div
          v-if="notification"
          :class="[
            'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300',
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500',
            'text-white max-w-md'
          ]"
        >
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">{{ notification.message }}</p>
            <button @click="notification = null" class="ml-4 text-white hover:text-gray-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Модальное окно для тестирования пользователя -->
        <div
          v-if="showTestUserModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="showTestUserModal = false"
        >
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Тестовая отправка пользователю</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Customer ID</label>
                <input
                  v-model="testUserForm.customerId"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Введите Customer ID"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Chat ID</label>
                <input
                  v-model="testUserForm.chatId"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Введите Chat ID"
                />
              </div>
              <div class="flex space-x-2">
                <button
                  @click="testUserFromModal"
                  :disabled="!testUserForm.customerId || !testUserForm.chatId || loading"
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  Отправить
                </button>
                <button
                  @click="showTestUserModal = false"
                  class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                >
                  Отмена
                </button>
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

const token = useCookie('bearer-token')
const router = useRouter()
const config = useRuntimeConfig()

// Состояния
const loading = ref(false)
const loadingUsers = ref(false)
const notification = ref(null)
const showTestUserModal = ref(false)

// Данные
const status = ref({
  enabled: false,
  nextRun: null
})

const configForm = ref({
  enabled: false,
  time: '09:00',
  timezone: 'Europe/Moscow',
  maxConcurrency: 5,
  perMessageDelayMs: 1000,
  model: 'openai/gpt-4o-mini',
  temperature: 0.7,
  sendFormat: 'Markdown',
  promptSystem: '',
  promptUserTemplate: ''
})

const stats = ref({
  usersForDailyMessaging: 0
})

const users = ref([])
const lastSendResult = ref(null)
const aggregate7d = ref(null)
const recentRuns = ref([])

const testUserForm = ref({
  customerId: '',
  chatId: ''
})

// Методы
async function fetchData() {
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/config`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Не удалось загрузить конфигурацию')
    }

    const data = await response.json()
    
    console.log(data)
    if (data.config) {
      configForm.value = { ...data.config }
    }
    
    if (data.status) {
      status.value = data.status
    }

    await fetchStats()
  } catch (error) {
    showNotification(error.message, 'error')
  }
}

async function fetchStats() {
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/stats`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) throw new Error('Не удалось загрузить статистику')

    const data = await response.json()
    
    if (data.userStats) {
      stats.value = data.userStats
    }
    if (data.aggregate7d) {
      aggregate7d.value = data.aggregate7d
    }
    if (data.recentRuns) {
      recentRuns.value = data.recentRuns
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

async function fetchUsers() {
  loadingUsers.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/users/birthday-today`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Не удалось загрузить пользователей')
    }

    const data = await response.json()
    users.value = data.users || []
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    loadingUsers.value = false
  }
}

async function updateConfiguration() {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/config`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configForm.value)
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      throw new Error(data.message || 'Не удалось обновить конфигурацию')
    }

    const data = await response.json()
    
    if (data.config) {
      configForm.value = { ...data.config }
    }
    
    if (data.status) {
      status.value = data.status
    }

    showNotification('Конфигурация успешно обновлена', 'success')
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function sendNow() {
  if (!confirm('Вы уверены, что хотите отправить сообщения сейчас всем пользователям?')) {
    return
  }

  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/send-now`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Не удалось отправить сообщения')
    }

    const data = await response.json()
    
    if (data.statistics) {
      lastSendResult.value = {
        total: data.statistics.total,
        success: data.statistics.success,
        failed: data.statistics.failed,
        successRate: data.statistics.successRate,
        results: data.results
      }
    }

    showNotification(`Сообщения отправлены: ${data.statistics.success} успешно, ${data.statistics.failed} ошибок`, 'success')
    await fetchStats()
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function testUser(user) {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/test-single-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: user.customerId,
        chatId: user.chatId
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      throw new Error(data.message || 'Не удалось отправить тестовое сообщение')
    }

    showNotification(`Тестовое сообщение успешно отправлено пользователю ${user.customerName}`, 'success')
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    loading.value = false
  }
}

async function testUserFromModal() {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/daily-messaging/test-single-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: testUserForm.value.customerId,
        chatId: testUserForm.value.chatId
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      throw new Error(data.message || 'Не удалось отправить тестовое сообщение')
    }

    showNotification('Тестовое сообщение успешно отправлено', 'success')
    showTestUserModal.value = false
    testUserForm.value = { customerId: '', chatId: '' }
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Не установлено'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function showNotification(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 5000)
}

// Загрузка данных при монтировании
onMounted(() => {
  fetchData()
  fetchUsers()
})
</script>

