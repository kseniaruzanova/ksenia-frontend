<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Заголовок -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Настройки AI</h1>
          <p class="mt-2 text-sm text-gray-600">Управление глобальными настройками AI провайдеров</p>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p class="mt-2 text-gray-600">Загрузка настроек...</p>
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Ошибка загрузки</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
              <div class="mt-4">
                <button
                  @click="fetchSettings"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Попробовать снова
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Форма настроек -->
        <form v-else @submit.prevent="saveSettings" class="space-y-6">
          <!-- VseGPT настройки -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">VseGPT</h2>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input 
                  v-model="settings.vsegptApiKey" 
                  type="password"
                  placeholder="Введите API ключ VseGPT"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p class="mt-1 text-xs text-gray-500">
                  API ключ для работы с VseGPT. Модель задается программно в коде.
                </p>
              </div>
            </div>
          </div>

          <!-- OpenAI настройки -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">OpenAI</h2>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input 
                  v-model="settings.openaiApiKey" 
                  type="password"
                  placeholder="sk-..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p class="mt-1 text-xs text-gray-500">
                  API ключ OpenAI (опционально, если используется OpenAI). Модель задается программно в коде.
                </p>
              </div>
            </div>
          </div>

          <!-- Прокси настройки -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Прокси (опционально)</h2>
            </div>
            <div class="px-6 py-4 space-y-4">
              <!-- Включить прокси -->
              <div class="flex items-center">
                <input 
                  v-model="settings.proxyEnabled" 
                  type="checkbox"
                  id="proxyEnabled"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label for="proxyEnabled" class="ml-2 text-sm font-medium text-gray-700">
                  Использовать прокси
                </label>
              </div>

              <!-- Поля прокси (показываются только если включено) -->
              <template v-if="settings.proxyEnabled">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Тип прокси</label>
                  <select 
                    v-model="settings.proxyType" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SOCKS5">SOCKS5</option>
                    <option value="HTTP">HTTP</option>
                    <option value="HTTPS">HTTPS</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">IP адрес</label>
                    <input 
                      v-model="settings.proxyIp" 
                      type="text"
                      placeholder="192.168.1.1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      :required="settings.proxyEnabled"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Порт</label>
                    <input 
                      v-model.number="settings.proxyPort" 
                      type="number"
                      placeholder="4145"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      :required="settings.proxyEnabled"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Логин (опционально)</label>
                    <input 
                      v-model="settings.proxyUsername" 
                      type="text"
                      placeholder="username"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Пароль (опционально)</label>
                    <input 
                      v-model="settings.proxyPassword" 
                      type="password"
                      placeholder="password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded p-3">
                  <p class="text-xs text-blue-800">
                    <strong>Пример:</strong> IP: 192.252.214.17, Порт: 4145, Тип: SOCKS5
                  </p>
                </div>
              </template>
            </div>
          </div>

          <!-- Кнопки -->
          <div class="flex flex-wrap gap-3">
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Сохранение...' : 'Сохранить настройки' }}
            </button>
            <button
              type="button"
              @click="fetchSettings"
              :disabled="saving"
              class="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Обновить
            </button>
            <button
              type="button"
              @click="testProxyConnection"
              :disabled="testing || !settings.openaiApiKey"
              class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ testing ? 'Тестирование...' : '🧪 Тест OpenAI' }}
            </button>
          </div>

          <!-- Сообщение об успехе -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded p-4">
            <p class="text-sm text-green-800">✓ Настройки успешно сохранены</p>
          </div>

          <!-- Результат теста -->
          <div v-if="testResult" class="rounded p-4" :class="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
            <p class="text-sm font-semibold" :class="testResult.success ? 'text-green-800' : 'text-red-800'">
              {{ testResult.success ? '✓' : '✗' }} {{ testResult.message }}
            </p>
            <p v-if="testResult.success" class="text-xs text-green-700 mt-1">
              Прокси: {{ testResult.proxyUsed ? 'Используется' : 'Не используется' }}
              <span v-if="testResult.modelsCount"> | Моделей: {{ testResult.modelsCount }}</span>
            </p>
            <p v-if="!testResult.success && testResult.error" class="text-xs text-red-700 mt-1">
              {{ testResult.error }}
            </p>
          </div>
        </form>

        <!-- Информация -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">ℹ️ Важная информация</h3>
          <ul class="text-sm text-blue-800 space-y-2">
            <li><strong>VseGPT</strong> — по умолчанию используется для всех AI запросов в системе</li>
            <li><strong>OpenAI</strong> — альтернативный провайдер, выбирается программно в коде</li>
            <li>Выбор провайдера (VseGPT/OpenAI) и модели происходит в коде при вызове функций AI</li>
            <li>Здесь настраиваются только API ключи и прокси</li>
            <li><strong>Прокси</strong> — поддерживается SOCKS5, HTTP и HTTPS. Применяется глобально для всех запросов к AI</li>
            <li>Настройки применяются глобально для всех customers</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "admin",
});

const config = useRuntimeConfig()
const token = useCookie('bearer-token', {
  maxAge: 60 * 60 * 16,
  path: '/',
  sameSite: 'lax'
})

const settings = ref({
  vsegptApiKey: '',
  openaiApiKey: '',
  proxyEnabled: false,
  proxyType: 'SOCKS5',
  proxyIp: '',
  proxyPort: 4145,
  proxyUsername: '',
  proxyPassword: ''
})

const loading = ref(false)
const error = ref('')
const saving = ref(false)
const success = ref(false)
const testing = ref(false)
const testResult = ref(null)

// Получение настроек
async function fetchSettings() {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    const response = await fetch(`${config.public.apiBase}/api/ai-settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    settings.value = {
      vsegptApiKey: data.vsegptApiKey || '',
      openaiApiKey: data.openaiApiKey || '',
      proxyEnabled: data.proxyEnabled || false,
      proxyType: data.proxyType || 'SOCKS5',
      proxyIp: data.proxyIp || '',
      proxyPort: data.proxyPort || 4145,
      proxyUsername: data.proxyUsername || '',
      proxyPassword: data.proxyPassword || ''
    }
  } catch (err) {
    error.value = err.message || 'Не удалось загрузить настройки'
    console.error('Ошибка загрузки настроек:', err)
  } finally {
    loading.value = false
  }
}

// Сохранение настроек
async function saveSettings() {
  saving.value = true
  error.value = ''
  success.value = false

  try {
    const response = await fetch(`${config.public.apiBase}/api/ai-settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings.value)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка ${response.status}: ${errorText}`)
    }

    await response.json()
    success.value = true
    
    // Скрыть сообщение об успехе через 3 секунды
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Не удалось сохранить настройки'
    console.error('Ошибка сохранения настроек:', err)
  } finally {
    saving.value = false
  }
}

// Тест подключения через прокси
async function testProxyConnection() {
  testing.value = true
  testResult.value = null

  try {
    const response = await fetch(`${config.public.apiBase}/api/ai-settings/test-proxy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    testResult.value = data

    // Скрыть результат через 10 секунд
    setTimeout(() => {
      testResult.value = null
    }, 10000)
  } catch (err) {
    testResult.value = {
      success: false,
      message: 'Ошибка при тестировании',
      error: err.message
    }
  } finally {
    testing.value = false
  }
}

// Загрузка данных при монтировании
onMounted(() => {
  fetchSettings()
})
</script>

