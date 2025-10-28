<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <div class="flex items-center justify-center space-x-3 mb-2">
              <svg class="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h1 class="text-4xl font-bold text-gray-900">Мессенджер</h1>
            </div>
            <p class="text-center text-gray-600">Все ваши чаты в одном месте</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p class="text-gray-600 font-medium">Загрузка чатов...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-600 font-medium">{{ error }}</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!chats || chats.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-gray-500 text-lg font-medium">Чаты не найдены</p>
            <p class="text-gray-400 mt-2">Начните новый диалог</p>
          </div>

          <!-- Chats List -->
          <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <ul class="divide-y divide-gray-100">
              <li 
                v-for="chat in chats" 
                :key="chat._id" 
                class="p-5 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
                @click="$router.push(`/chat/${chat.chatId}`)"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                      <span class="text-white font-bold text-lg">{{ chat.chatId.toString().slice(-2) }}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-base font-semibold text-gray-900 truncate">
                        <span v-if="chat.meta && (chat.meta.firstName || chat.meta.lastName)">
                          {{ chat.meta.firstName }} {{ chat.meta.lastName }}
                        </span>
                        <span v-else class="text-indigo-600">Чат #{{ chat.chatId }}</span>
                      </p>
                      <span class="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {{ formatDateTime(chat.meta?.lastMessageAt || chat.updatedAt) }}
                      </span>
                    </div>
                    <p v-if="chat.meta && chat.meta.username" class="text-sm text-gray-500 mt-1 truncate">
                      @{{ chat.meta.username }}
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Пагинация -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center space-x-4">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-6 py-2.5 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border border-gray-200 hover:border-indigo-400"
            >
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Назад</span>
              </div>
            </button>
            <span class="text-gray-700 font-medium px-4 py-2 bg-indigo-50 rounded-lg text-indigo-900">
              Страница {{ currentPage }} из {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-6 py-2.5 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border border-gray-200 hover:border-indigo-400"
            >
              <div class="flex items-center space-x-1">
                <span>Вперед</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "customer",
});

const { tariff } = useAuth();

const chats = ref([]);
const loading = ref(false);
const error = ref('');
const config = useRuntimeConfig();
const token = useCookie('bearer-token');
const currentPage = ref(1);
const totalPages = ref(1);

const formatDateTime = (date) => {
  if (!date) return 'Нет данных';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

async function fetchChats(page = 1) {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`${config.public.apiBase}/api/chats?page=${page}&limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    chats.value = Array.isArray(data.chats) ? data.chats : [];
    currentPage.value = data.currentPage;
    totalPages.value = data.totalPages;

  } catch (err) {
    error.value = err.message || 'Не удалось загрузить чаты';
    console.error('Ошибка загрузки чатов:', err);
  } finally {
    loading.value = false;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    fetchChats(currentPage.value + 1);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    fetchChats(currentPage.value - 1);
  }
}

onMounted(() => {
  fetchChats(currentPage.value);
});
</script>
