<template>
  <div class="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Navbar />
    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 w-full">
        <!-- Шапка чата -->
        <div class="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <span class="text-white font-bold text-lg">{{ chatId.toString().slice(-2) }}</span>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Чат #{{ chatId }}</h2>
              <p v-if="userInfo.state" class="text-sm text-gray-500">{{ userInfo.state }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Чекбокс режима админа -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="adminChatMode"
                @change="toggleAdminMode"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm font-medium text-gray-700">Режим общения с пользователем</span>
            </label>
            <button 
              @click="refreshMessages"
              class="relative p-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              :disabled="loadingMessages"
              title="Обновить сообщения"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                stroke-width="2"
                :class="{ 'animate-spin': loadingMessages }"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Окно сообщений -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          @scroll="handleScroll"
        >
          <div v-if="loadingOlderMessages" class="text-center py-2">
            <p class="text-gray-500">Загрузка предыдущих сообщений...</p>
          </div>
          <div v-else-if="hasMoreMessages" class="text-center py-2">
            <button 
              @click="loadMoreMessages"
              class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Загрузить предыдущие сообщения
            </button>
          </div>

          <div v-if="loadingMessages" class="text-center py-4">
            <p class="text-gray-500">Загрузка сообщений...</p>
          </div>
          <div v-else-if="messagesError" class="text-center text-red-500 py-4">
            <p>{{ messagesError }}</p>
          </div>
          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-4">
            <p>Нет сообщений в этом чате</p>
          </div>
          <template v-else>
            <div 
              v-for="message in messages" 
              :key="message._id"
              class="flex message-container"
              :class="{ 'justify-end': message.direction === 'out', 'justify-start': message.direction === 'in' }"
            >
              <!-- Сообщение -->
              <div 
                class="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-sm transition-all duration-200"
                :class="message.direction === 'out' 
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'"
              >
                <div v-if="message.type === 'text'">
                  <p :class="message.direction === 'out' ? 'text-white' : 'text-gray-800'">{{ message.content.text }}</p>
                </div>
                <div v-else-if="message.type === 'photo'">
                  <img 
                    :src="getFileUrl(message.content.fileId)" 
                    class="rounded-lg max-w-full h-auto shadow-sm"
                    alt="Фото"
                  >
                  <p v-if="message.content.caption" class="mt-2" :class="message.direction === 'out' ? 'text-white' : 'text-gray-800'">
                    {{ message.content.caption }}
                  </p>
                </div>
                <p 
                  class="text-xs mt-2"
                  :class="message.direction === 'out' 
                    ? 'text-indigo-100 text-left' 
                    : 'text-gray-500 text-right'"
                >
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <!-- Панель ввода сообщения -->
        <template v-if="tariff=='pro'">
          <div class="bg-white border-t border-gray-200 p-4 shadow-lg">
            <div class="flex items-center space-x-3">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Введите сообщение..."
                class="flex-1 border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                @keyup.enter="sendMessage"
              />
              <button
                @click="sendMessage"
                class="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                :disabled="!newMessage || sendingMessage"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "customer",
});

const { tariff } = useAuth();
const route = useRoute();
const config = useRuntimeConfig();
const token = useCookie('bearer-token');

const chatId = computed(() => route.params.chat_id);
const userInfo = ref({});
const messages = ref([]);
const newMessage = ref('');
const sendingMessage = ref(false);
const loadingMessages = ref(false);
const loadingOlderMessages = ref(false);
const messagesError = ref('');
const messagesContainer = ref(null);
const hasMoreMessages = ref(true);
const pollingInterval = ref(null);
const lastMessageCount = ref(0);
const adminChatMode = ref(false);

// Загрузка данных чата
onMounted(async () => {
  await fetchMessages();
  startPolling();
});

// Остановка polling при размонтировании
onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }
});

// Обновление при изменении chat_id
watch(chatId, async (newId) => {
  if (newId) {
    messages.value = [];
    hasMoreMessages.value = true;
    lastMessageCount.value = 0;
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
    }
    await fetchMessages();
    startPolling();
  }
});

// Polling для автоматического обновления сообщений
function startPolling() {
  pollingInterval.value = setInterval(async () => {
    await fetchMessages(null, false, true); // Silent fetch
  }, 3000); // Обновление каждые 3 секунды
}

async function fetchMessages(before = null, loadMore = false, silent = false) {
  if (!silent) {
    if (loadMore) {
      loadingOlderMessages.value = true;
    } else {
      loadingMessages.value = true;
    }
  }
  
  messagesError.value = '';
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/chats/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId.value,
        before: before,
        limit: 30
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка загрузки сообщений');
    }

    const data = await response.json();
    const newMessages = Array.isArray(data.messages) ? data.messages : [];
    const wasAtBottom = isAtBottom();
    
    if (loadMore) {
      // Сохраняем позицию прокрутки перед добавлением новых сообщений
      const container = messagesContainer.value;
      const oldScrollHeight = container.scrollHeight;
      const oldScrollTop = container.scrollTop;
      
      // Добавляем старые сообщения в начало списка
      messages.value = [...newMessages, ...messages.value];
      
      // Восстанавливаем позицию прокрутки после обновления DOM
      nextTick(() => {
        container.scrollTop = container.scrollHeight - oldScrollHeight + oldScrollTop;
      });
    } else {
      const previousCount = messages.value.length;
      messages.value = newMessages;
      
      // Если это polling и количество сообщений изменилось, скроллим вниз
      if (silent && newMessages.length > previousCount && wasAtBottom) {
        nextTick(() => {
          scrollToBottom();
        });
      } else if (!silent) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    }
    
    if (data.userInfo) {
      userInfo.value = data.userInfo;
      // Устанавливаем режим админа из данных пользователя
      if (data.userInfo.adminChatMode !== undefined) {
        adminChatMode.value = data.userInfo.adminChatMode;
      }
    }
    
    hasMoreMessages.value = data.hasMore !== false;
    
  } catch (err) {
    if (!silent) {
      messagesError.value = err.message || 'Не удалось загрузить сообщения';
    }
    console.error('Ошибка при загрузке сообщений:', err);
  } finally {
    if (!silent) {
      if (loadMore) {
        loadingOlderMessages.value = false;
      } else {
        loadingMessages.value = false;
      }
    }
  }
}

// Проверка, находится ли пользователь внизу чата
function isAtBottom() {
  if (!messagesContainer.value) return true;
  const container = messagesContainer.value;
  const threshold = 100; // Пикселей от низа
  return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
}

async function loadMoreMessages() {
  if (messages.value.length === 0 || loadingOlderMessages.value) return;
  
  const oldestMessage = messages.value[0];
  await fetchMessages(oldestMessage.timestamp, true);
}

function handleScroll(e) {
  const container = e.target;
  const scrollTop = container.scrollTop;
  
  // Автоматическая подгрузка при достижении верха
  if (scrollTop < 100 && hasMoreMessages.value && !loadingOlderMessages.value) {
    loadMoreMessages();
  }
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;

  sendingMessage.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/api/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId.value,
        message: newMessage.value
      })
    });

    if (!response.ok) throw new Error('Ошибка отправки сообщения');
    
    messages.value.push({
      _id: Date.now().toString(),
      chatId: chatId.value,
      type: 'text',
      direction: 'out',
      content: { text: newMessage.value },
      status: 'sent',
      timestamp: new Date()
    });
    
    newMessage.value = '';
    
    nextTick(() => {
      scrollToBottom();
    });
    
    // Обновляем список сообщений через 2 секунды, чтобы получить актуальный статус
    setTimeout(() => {
      fetchMessages(null, false, false);
    }, 2000);
  } catch (err) {
    console.error('Ошибка отправки сообщения:', err);
  } finally {
    sendingMessage.value = false;
  }
}

function refreshMessages() {
  fetchMessages(null, false, false);
}

function scrollToBottom() {
  if (messagesContainer.value) {
    // Используем requestAnimationFrame для плавной прокрутки
    requestAnimationFrame(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });
  }
}

async function toggleAdminMode() {
  try {
    const response = await fetch(`${config.public.apiBase}/api/messages/admin-chat-mode`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: chatId.value,
        enabled: adminChatMode.value
      })
    });

    if (!response.ok) {
      throw new Error('Ошибка при изменении режима админа');
    }

    const data = await response.json();
    console.log('Admin mode toggled:', data);
  } catch (err) {
    console.error('Ошибка при изменении режима админа:', err);
    // Возвращаем чекбокс в исходное состояние при ошибке
    adminChatMode.value = !adminChatMode.value;
  }
}

function formatTime(date) {
  const d = new Date(date);
  
  // Форматируем дату: ДД.ММ.ГГГГ
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Исправлено: getMonth() возвращает 0-11
  const year = d.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  
  // Форматируем время: ЧЧ:ММ
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  
  return `${formattedDate} ${formattedTime}`;
}

function getFileUrl(fileId) {
  return `${config.public.apiBase}/api/files/${fileId}`;
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.message-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #818cf8 #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 10px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 5px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #818cf8;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #6366f1;
}
</style>
