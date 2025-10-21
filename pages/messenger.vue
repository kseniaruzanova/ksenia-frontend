<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">Мессенджер</h1>

          <div v-if="loading" class="text-center">
            <p>Загрузка чатов...</p>
          </div>
          <div v-else-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
          </div>
          <div v-else-if="!chats || chats.length === 0" class="text-center text-gray-500">
            <p>Чаты не найдены.</p>
          </div>
          <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <ul class="divide-y divide-gray-200">
              <li 
                v-for="chat in chats" 
                :key="chat._id" 
                class="p-4 hover:bg-gray-50 cursor-pointer"
                @click="$router.push(`/chat/${chat.chatId}`)"
              >
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-medium">{{ chat.chatId.toString().slice(-2) }}</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      <span v-if="chat.meta && (chat.meta.firstName || chat.meta.lastName)">
                        {{ chat.meta.firstName }} {{ chat.meta.lastName }}
                      </span>
                      <span v-else>Чат #{{ chat.chatId }}</span>
                    </p>
                    <p v-if="chat.meta && chat.meta.username" class="text-xs text-gray-500">@{{ chat.meta.username }}</p>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDateTime(chat.meta?.lastMessageAt || chat.updatedAt) }}
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
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <span class="text-gray-700">Страница {{ currentPage }} из {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
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