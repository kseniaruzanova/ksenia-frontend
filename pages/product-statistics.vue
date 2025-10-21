<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">📊 Статистика продуктов</h1>
          <p class="mt-4 text-lg text-gray-600">
            Аналитика использования продуктов
          </p>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600">{{ error }}</p>
          <button 
            @click="fetchStatistics" 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Попробовать снова
          </button>
        </div>

        <!-- Статистика -->
        <div v-else>
          <!-- Общая статистика -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Общая статистика</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div class="text-3xl font-bold">{{ totalRequests }}</div>
                <div class="text-purple-100 mt-2">Всего запросов</div>
              </div>
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div class="text-3xl font-bold">{{ totalPdfRequests }}</div>
                <div class="text-blue-100 mt-2">PDF-запросов</div>
              </div>
              <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div class="text-3xl font-bold">{{ totalJsonRequests }}</div>
                <div class="text-green-100 mt-2">JSON-запросов</div>
              </div>
            </div>
          </div>

          <!-- Статистика по продуктам -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Статистика по продуктам</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Продукт
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Всего
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDF
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JSON
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Последний запрос
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="stat in statistics" :key="stat.productType" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-2xl mr-3">{{ getProductIcon(stat.productType) }}</span>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ getProductName(stat.productType) }}
                          </div>
                          <div class="text-xs text-gray-500">{{ stat.productType }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-lg font-semibold text-gray-900">{{ stat.totalRequests }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {{ stat.pdfRequests }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {{ stat.jsonRequests }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(stat.lastRequest) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- График популярности (опционально) -->
          <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Популярность продуктов</h2>
            <div class="space-y-4">
              <div v-for="stat in sortedStatistics" :key="stat.productType">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">
                    {{ getProductName(stat.productType) }}
                  </span>
                  <span class="text-sm text-gray-500">{{ stat.totalRequests }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    :style="{ width: getPercentage(stat.totalRequests) + '%' }"
                  ></div>
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
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  middleware: "admin",
});

const statistics = ref([]);
const loading = ref(true);
const error = ref(null);

const productNames = {
  forecast: 'Тароскоп на любые месяцы',
  financialCast: 'Расчет 4 кода денег',
  mistakesIncarnation: 'Ошибки прошлого воплощения',
  arcanumRealization: 'Аркан самореализации',
  awakeningCodes: 'Три кода пробуждения',
  matrixLife: 'Матрица Жизни и коды жизни',
  karmicTail: 'Кармический хвост, предназначение и карма денег'
};

const productIcons = {
  forecast: '🔮',
  financialCast: '💰',
  mistakesIncarnation: '🕰️',
  arcanumRealization: '✨',
  awakeningCodes: '✨',
  matrixLife: '🧮',
  karmicTail: '🔗'
};

const totalRequests = computed(() => {
  return statistics.value.reduce((sum, stat) => sum + stat.totalRequests, 0);
});

const totalPdfRequests = computed(() => {
  return statistics.value.reduce((sum, stat) => sum + stat.pdfRequests, 0);
});

const totalJsonRequests = computed(() => {
  return statistics.value.reduce((sum, stat) => sum + stat.jsonRequests, 0);
});

const sortedStatistics = computed(() => {
  return [...statistics.value].sort((a, b) => b.totalRequests - a.totalRequests);
});

const maxRequests = computed(() => {
  return Math.max(...statistics.value.map(stat => stat.totalRequests), 1);
});

function getProductName(productType) {
  return productNames[productType] || productType;
}

function getProductIcon(productType) {
  return productIcons[productType] || '📦';
}

function getPercentage(requests) {
  return (requests / maxRequests.value) * 100;
}

function formatDate(dateString) {
  if (!dateString) return 'Нет данных';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

async function fetchStatistics() {
  loading.value = true;
  error.value = null;

  try {
    const config = useRuntimeConfig();
    const token = useCookie('bearer-token');

    const response = await $fetch(`${config.public.apiBase}/api/product-statistics`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    });

    if (response.status === 'success') {
      statistics.value = response.data;
    } else {
      throw new Error('Неверный формат ответа от сервера');
    }
  } catch (err) {
    console.error('Error fetching product statistics:', err);
    error.value = err.message || 'Не удалось загрузить статистику';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStatistics();
});
</script>

