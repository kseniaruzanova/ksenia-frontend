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
            
            <!-- Мобильная версия (карточки) -->
            <div class="lg:hidden divide-y divide-gray-200">
              <div
                v-for="stat in statistics"
                :key="stat.productType"
                class="py-4 hover:bg-gray-50 transition cursor-pointer"
                @click="toggleProduct(stat.productType)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span class="text-purple-600 text-xl">{{ getProductIcon(stat.productType) }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900">{{ getProductName(stat.productType) }}</p>
                      <p class="text-xs text-gray-500">{{ stat.productType }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      {{ stat.totalRequests }}
                    </span>
                    <svg 
                      class="h-5 w-5 text-gray-400 transition transform"
                      :class="{ 'rotate-180': expandedProducts[stat.productType] }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                <!-- Раскрывающаяся информация -->
                <div v-if="expandedProducts[stat.productType]" class="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p class="text-gray-500">PDF запросы:</p>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ stat.pdfRequests }}
                      </span>
                    </div>
                    <div>
                      <p class="text-gray-500">JSON запросы:</p>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {{ stat.jsonRequests }}
                      </span>
                    </div>
                    <div class="col-span-2">
                      <p class="text-gray-500">Последний запрос:</p>
                      <p class="text-gray-900 text-sm">{{ formatDate(stat.lastRequest) }}</p>
                    </div>
                  </div>
                  <button 
                    @click.stop="openProductDetails(stat.productType)"
                    class="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium transition-colors duration-200"
                  >
                    Подробная статистика
                  </button>
                </div>
              </div>
            </div>

            <!-- Десктопная версия (таблица) -->
            <div class="hidden lg:block overflow-x-auto">
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
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
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
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="openProductDetails(stat.productType)"
                        class="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        Подробнее
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- График популярности -->
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

    <!-- Модальное окно детальной статистики -->
    <div v-if="showProductDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Заголовок -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center">
            <span class="text-3xl mr-4">{{ getProductIcon(selectedProductType) }}</span>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ getProductName(selectedProductType) }}
              </h3>
              <p class="text-sm text-gray-500">{{ selectedProductType }}</p>
            </div>
          </div>
          <button 
            @click="closeProductDetails"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Контент -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <!-- Загрузка детальной статистики -->
          <div v-if="detailLoading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>

          <!-- Ошибка детальной статистики -->
          <div v-else-if="detailError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p class="text-red-600">{{ detailError }}</p>
            <button 
              @click="fetchProductDetails(selectedProductType)"
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Попробовать снова
            </button>
          </div>

          <!-- Детальная статистика -->
          <div v-else-if="productDetails" class="space-y-6">
            <!-- Общая информация -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-purple-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">{{ productDetails.totalRequests }}</div>
                <div class="text-sm text-purple-800 mt-1">Всего запросов</div>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ productDetails.requestsByCustomer.length }}</div>
                <div class="text-sm text-blue-800 mt-1">Уникальных пользователей</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ productDetails.requestsByDay.length }}</div>
                <div class="text-sm text-green-800 mt-1">Дней активности</div>
              </div>
            </div>

            <!-- Статистика по пользователям -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Запросы по пользователям</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Количество запросов
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Последний запрос
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="customer in productDetails.requestsByCustomer" :key="customer.customerId" class="hover:bg-gray-50">
                      <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ customer.customerUsername || 'Без имени' }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {{ customer.requestCount }}
                        </span>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(customer.lastRequest) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Статистика по дням -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Активность за последние 30 дней</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Количество запросов
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="day in productDetails.requestsByDay" :key="day._id" class="hover:bg-gray-50">
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {{ formatDate(day._id) }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ day.count }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Футер -->
        <div class="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button 
            @click="closeProductDetails"
            class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Закрыть
          </button>
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

// Детальная статистика
const showProductDetails = ref(false);
const selectedProductType = ref('');
const productDetails = ref(null);
const detailLoading = ref(false);
const detailError = ref(null);

// Для мобильной версии - раскрытые продукты
const expandedProducts = ref({});

const productNames = {
  forecast: 'Тароскоп на любые месяцы',
  financialCast: 'Расчет 4 кода денег',
  mistakesIncarnation: 'Ошибки прошлого воплощения',
  arcanumRealization: 'Аркан самореализации',
  awakeningCodes: 'Три кода пробуждения',
  matrixLife: 'Матрица Жизни и коды жизни',
  lifeMatrix: 'Матрица жизни',
  karmicTail: 'Кармический хвост, предназначение и карма денег',
  archetypeShadow: 'Архетип и тень',
  archetypeMonth: 'Архетип месяца',
  stagnationCycle: 'Удар, цикл, застой, выход'
};

const productIcons = {
  forecast: '🔮',
  financialCast: '💰',
  mistakesIncarnation: '🕰️',
  arcanumRealization: '✨',
  awakeningCodes: '✨',
  matrixLife: '🧮',
  lifeMatrix: '🔮',
  karmicTail: '🔗',
  archetypeShadow: '🌟',
  archetypeMonth: '🌙',
  stagnationCycle: '⚡'
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
  
  // Если это строка даты в формате YYYY-MM-DD (из агрегации по дням)
  if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  
  // Для обычных дат
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Функция для переключения раскрытия продукта
function toggleProduct(productType) {
  expandedProducts.value[productType] = !expandedProducts.value[productType];
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

async function fetchProductDetails(productType) {
  detailLoading.value = true;
  detailError.value = null;

  try {
    const config = useRuntimeConfig();
    const token = useCookie('bearer-token');

    const response = await $fetch(`${config.public.apiBase}/api/product-statistics/${productType}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    });

    if (response.status === 'success') {
      productDetails.value = response.data;
    } else {
      throw new Error('Неверный формат ответа от сервера');
    }
  } catch (err) {
    console.error('Error fetching product details:', err);
    detailError.value = err.message || 'Не удалось загрузить детальную статистику';
  } finally {
    detailLoading.value = false;
  }
}

function openProductDetails(productType) {
  selectedProductType.value = productType;
  showProductDetails.value = true;
  productDetails.value = null;
  fetchProductDetails(productType);
}

function closeProductDetails() {
  showProductDetails.value = false;
  selectedProductType.value = '';
  productDetails.value = null;
  detailError.value = null;
}

onMounted(() => {
  fetchStatistics();
});
</script>