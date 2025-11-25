<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'||tariff=='basic'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">🌙 Архетип месяца</h1>
            <p class="mt-4 text-lg text-gray-600">
              Быстро получите архетип месяца по вашей дате рождения и одну ключевую трактовку.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Введите данные для расчета</h2>

            <form @submit.prevent="generateForecast" class="space-y-6">
              <div>
                <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Дата рождения
                </label>
                <input
                  id="birthDate"
                  v-model="formData.birthDate"
                  type="text"
                  placeholder="ДД.ММ.ГГГГ (например: 15.07.1990)"
                  required
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  :class="{ 'border-red-500': error }"
                />
                <p class="mt-1 text-sm text-gray-500">
                  Формат: ДД.ММ.ГГГГ
                </p>
              </div>

              <div class="flex items-center justify-center">
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-8 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Генерация PDF...
                  </span>
                  <span v-else>🌙 Сгенерировать расчет</span>
                </button>
              </div>
            </form>

            <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Ошибка</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{{ error }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">Успешно!</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>Расчет сгенерирован и готов к скачиванию.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Архетип месяца</h2>
            
            <div class="flex justify-center items-center mb-6">
              <span class="text-xl">🌙</span>
              <div class="w-16 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 mx-2"></div>
              <span class="text-xl">🔮</span>
              <div class="w-16 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 mx-2"></div>
              <span class="text-xl">🌙</span>
            </div>

            <div class="prose max-w-none space-y-6">
              <div class="text-center mb-8">
                <p class="text-lg text-gray-700 leading-relaxed">
                  Архетип месяца — это быстрый расчет вашего текущего энергетического влияния по дате рождения с одной ключевой трактовкой.
                </p>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <!-- Карта 1 -->
                <div class="border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-2xl">📝</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Строка расчёта</h3>
                  </div>
                  <p class="text-gray-700">
                    В PDF сразу прописывается «Расчет для даты: ДД.ММ.ГГГГ», чтобы клиент видел персонализацию.
                  </p>
                </div>

                <!-- Карта 2 -->
                <div class="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-2xl">🔍</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Одна трактовка</h3>
                  </div>
                  <p class="text-gray-700">
                    Файл содержит одну лаконичную трактовку архетипа месяца. Текст подтягивается из JSON, поэтому вы легко перепишете его под себя.
                  </p>
                </div>

                <!-- Карта 3 -->
                <div class="border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-2xl">🎨</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Свой контент</h3>
                  </div>
                  <p class="text-gray-700">
                    Через блок «Управление контентом» добавьте продающие тексты, инструкции или видео для админов и клиентов.
                  </p>
                </div>

                <!-- Карта 4 -->
                <div class="border-2 border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-2xl">⚡</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Быстрый результат</h3>
                  </div>
                  <p class="text-gray-700">
                    Мгновенное получение ключевого архетипа месяца без сложных расчетов и длительного ожидания.
                  </p>
                </div>
              </div>

              <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mt-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Что включает расчет
                </h3>
                <ul class="space-y-3 text-gray-700">
                  <li class="flex items-start">
                    <svg class="w-6 h-6 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Персонализированный расчет для вашей даты рождения с указанием точной даты</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-6 h-6 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Одна ключевая трактовка архетипа месяца с лаконичным описанием</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-6 h-6 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Возможность легко изменить тексты трактовок через JSON конфигурацию</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-6 h-6 text-purple-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Быстрое получение результата без сложных вычислений</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ProductContentBlock 
            product-type="archetypeMonth" 
            product-id="taroscope-archetypeMonth" 
            product-display-name="Архетип месяца" 
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "customer-or-admin",
});
const { tariff } = useAuth();
const config = useRuntimeConfig();
const token = useCookie('bearer-token');

const formData = ref({
  birthDate: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');

async function generateForecast() {
  if (!formData.value.birthDate) {
    error.value = 'Пожалуйста, введите дату рождения';
    return;
  }

  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(formData.value.birthDate)) {
    error.value = 'Неверный формат даты. Используйте формат ДД.ММ.ГГГГ';
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await fetch(`${config.public.apiBase}/api/archetypeMonth/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify({
        birthDate: formData.value.birthDate
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers.get('Content-disposition');
    let filename = 'archetypeMonth.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    success.value = 'Расчет успешно сгенерирован и скачан!';
    formData.value.birthDate = '';

  } catch (err) {
    console.error('Ошибка генерации расчета:', err);
    error.value = err.message || 'Произошла ошибка при генерации расчета';
  } finally {
    loading.value = false;
  }
}
</script>

