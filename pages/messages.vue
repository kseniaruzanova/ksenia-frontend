<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="mb-10">
            <div class="flex items-center space-x-3 mb-2">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h1 class="text-4xl font-bold text-gray-900">Управление сообщениями</h1>
            </div>
            <p class="text-gray-600 text-lg">Отправляйте сообщения пользователям индивидуально, массово или всем сразу</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Отправка одиночного сообщения -->
            <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 class="text-xl font-bold text-white">Одно сообщение</h2>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Chat ID</label>
                    <input
                      v-model="singleMessage.chat_id"
                      type="text"
                      class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Введите chat_id получателя"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Сообщение</label>
                    <textarea
                      v-model="singleMessage.message"
                      rows="3"
                      class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Введите текст сообщения"
                    ></textarea>
                  </div>
                  <button
                    @click="sendSingleMessage"
                    class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    :disabled="sending"
                  >
                    {{ sending ? 'Отправка...' : 'Отправить сообщение' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Массовая отправка сообщений -->
            <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 class="text-xl font-bold text-white">Массовая отправка</h2>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Chat IDs (через запятую)</label>
                    <input
                      v-model="massMessage.chatIdsInput"
                      type="text"
                      class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="123456789, 987654321"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Сообщение</label>
                    <textarea
                      v-model="massMessage.message"
                      rows="3"
                      class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      placeholder="Введите текст сообщения"
                    ></textarea>
                  </div>
                  <button
                    @click="sendMassMessage"
                    class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    :disabled="sending"
                  >
                    {{ sending ? 'Отправка...' : 'Отправить группе' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Broadcast отправка -->
            <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200 overflow-hidden">
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1客人-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h2 class="text-xl font-bold text-white">Broadcast</h2>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Сообщение для всех</label>
                    <textarea
                      v-model="broadcastMessage"
                      rows="3"
                      class="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Введите текст сообщения, которое получат ВСЕ пользователи"
                    ></textarea>
                  </div>
                  <button
                    @click="sendBroadcastMessage"
                    class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                    :disabled="sending"
                  >
                    {{ sending ? 'Отправка...' : 'Отправить ВСЕМ' }}
                  </button>
                  <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p class="text-sm text-purple-700 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                      Сообщение будет отправлено ВСЕМ пользователям
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Уведомления -->
          <transition name="fade">
            <div v-if="notification" :class="[
              'mt-6 p-4 rounded-xl shadow-lg flex items-center space-x-3',
              notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            ]">
              <svg v-if="notification.type === 'success'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-semibold">{{ notification.message }}</span>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const token = useCookie('bearer-token')
const sending = ref(false)
const notification = ref(null)
const broadcastMessage = ref('')
const { tariff } = useAuth()
const config = useRuntimeConfig()

const singleMessage = ref({
  chat_id: '',
  message: ''
})

const massMessage = ref({
  chatIdsInput: '',
  message: ''
})

// Отправка одиночного сообщения
async function sendSingleMessage() {
  if (!singleMessage.value.chat_id || !singleMessage.value.message) {
    showNotification('Заполните все поля', 'error')
    return
  }

  sending.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(singleMessage.value)
    })

    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.')
      }
      throw new Error('Ошибка при отправке сообщения')
    }

    showNotification('Сообщение успешно отправлено', 'success')
    singleMessage.value.message = ''
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    sending.value = false
  }
}

// Отправка массового сообщения
async function sendMassMessage() {
  if (!massMessage.value.chatIdsInput || !massMessage.value.message) {
    showNotification('Заполните все поля', 'error')
    return
  }

  const chat_ids = massMessage.value.chatIdsInput
    .split(',')
    .map(id => id.trim())
    .filter(id => id)

  if (chat_ids.length === 0) {
    showNotification('Введите хотя бы один chat_id', 'error')
    return
  }

  sending.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/messages/mass`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_ids,
        message: massMessage.value.message
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.')
      }
      throw new Error('Ошибка при отправке сообщений')
    }

    showNotification('Сообщения успешно отправлены', 'success')
    massMessage.value.message = ''
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    sending.value = false
  }
}

// Отправка broadcast сообщения
async function sendBroadcastMessage() {
  if (!broadcastMessage.value) {
    showNotification('Введите текст сообщения', 'error')
    return
  }

  sending.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/messages/broadcast`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: broadcastMessage.value
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
        throw new Error('Сесси通讯员истекла. Пожалуйста, войдите снова.')
      }
      throw new Error('Ошибка при отправке broadcast сообщения')
    }

    showNotification('Broadcast сообщение успешно отправлено всем пользователям', 'success')
    broadcastMessage.value = ''
  } catch (error) {
    showNotification(error.message, 'error')
  } finally {
    sending.value = false
  }
}

// Показ уведомления
function showNotification(message, type = 'success') {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}
</script>
