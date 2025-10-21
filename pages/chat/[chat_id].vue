<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="flex flex-1 overflow-hidden bg-gray-100">
      <div class="flex flex-col flex-1 w-full">
        <!-- Шапка чата -->
        <div class="bg-white p-4 border-b border-gray-200 flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-600 font-medium">{{ chatId.toString().slice(-2) }}</span>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Чат #{{ chatId }}</h2>
              <p v-if="userInfo.state" class="text-sm text-gray-500">{{ userInfo.state }}</p>
            </div>
          </div>
          <button 
            @click="refreshMessages"
            class="p-2 rounded-full hover:bg-gray-100"
            :disabled="loadingMessages"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              :class="{ 'animate-spin': loadingMessages }"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <!-- Окно сообщений -->
        <div 
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          @scroll="handleScroll"
        >
          <div v-if="loadingOlderMessages" class="text-center py-2">
            <p>Загрузка предыдущих сообщений...</p>
          </div>
          <div v-else-if="hasMoreMessages" class="text-center py-2">
            <button 
              @click="loadMoreMessages"
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Загрузить предыдущие сообщения
            </button>
          </div>

          <div v-if="loadingMessages" class="text-center py-4">
            <p>Загрузка сообщений...</p>
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
              class="flex"
              :class="{ 'justify-end': message.direction === 'out', 'justify-start': message.direction === 'in' }"
            >
              <div 
                class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2"
                :class="{
                  'bg-indigo-100': message.direction === 'out',
                  'bg-white border border-gray-200': message.direction === 'in'
                }"
              >
                <div v-if="message.type === 'text'">
                  <p class="text-gray-800">{{ message.content.text }}</p>
                </div>
                <div v-else-if="message.type === 'photo'">
                  <img 
                    :src="getFileUrl(message.content.fileId)" 
                    class="rounded max-w-full h-auto"
                    alt="Фото"
                  >
                  <p v-if="message.content.caption" class="mt-1 text-gray-800">{{ message.content.caption }}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1 text-right">
                  {{ formatTime(message.timestamp) }}
                </p>
              </div>
            </div>
          </template>
        </div>

        <!-- Панель ввода сообщения -->
        <template v-if="tariff=='pro'">
          <div class="bg-white border-t border-gray-200 p-3 h-20">
            <div class="flex items-center space-x-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Введите сообщение..."
                class="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                @keyup.enter="sendMessage"
              />
              <button
                @click="sendMessage"
                class="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!newMessage || sendingMessage"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// Загрузка данных чата
onMounted(async () => {
  await fetchMessages();
});

// Обновление при изменении chat_id
watch(chatId, async (newId) => {
  if (newId) {
    messages.value = [];
    hasMoreMessages.value = true;
    await fetchMessages();
  }
});

async function fetchMessages(before = null, loadMore = false) {
  if (loadMore) {
    loadingOlderMessages.value = true;
  } else {
    loadingMessages.value = true;
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
    
    if (loadMore) {
      // Сохраняем позицию прокрутки перед добавлением новых сообщений
      const container = messagesContainer.value;
      const oldScrollHeight = container.scrollHeight;
      const oldScrollTop = container.scrollTop;
      
      // Добавляем старые сообщения в начало списка
      messages.value = [...data.messages, ...messages.value];
      
      // Восстанавливаем позицию прокрутки после обновления DOM
      nextTick(() => {
        container.scrollTop = container.scrollHeight - oldScrollHeight + oldScrollTop;
      });
    } else {
      messages.value = Array.isArray(data.messages) ? data.messages : [];
      nextTick(() => {
        scrollToBottom();
      });
    }
    
    if (data.userInfo) {
      userInfo.value = data.userInfo;
    }
    
    hasMoreMessages.value = data.hasMore !== false;
    
  } catch (err) {
    messagesError.value = err.message || 'Не удалось загрузить сообщения';
    console.error('Ошибка при загрузке сообщений:', err);
  } finally {
    if (loadMore) {
      loadingOlderMessages.value = false;
    } else {
      loadingMessages.value = false;
    }
  }
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
    setTimeout(fetchMessages, 2000);
  } catch (err) {
    console.error('Ошибка отправки сообщения:', err);
  } finally {
    sendingMessage.value = false;
  }
}

function refreshMessages() {
  fetchMessages();
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
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

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #c7d2fe;
  border-radius: 4px;
}
</style>