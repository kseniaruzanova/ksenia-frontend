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
            <h1 class="text-3xl font-bold text-gray-900">🔮 Архетип и тень</h1>
            <p class="mt-4 text-lg text-gray-600">
              Получите персональный расчет архетипа и тени на основе вашей даты рождения
            </p>
          </div>

          <!-- Форма расчета -->
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
                  <span v-else>🔮 Сгенерировать расчет</span>
                </button>
              </div>
            </form>

            <!-- Ошибка -->
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

            <!-- Успех -->
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
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Архетип и тень вашей даты рождения</h2>
            
            <div class="prose max-w-none space-y-8">
              <!-- Первый блок -->
              <div class="border-l-4 border-blue-600 pl-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">1️⃣ Базовый Архетип – «Твой бессознательный сценарий»</h3>
                <div class="bg-blue-50 p-4 rounded-lg mb-3">
                  <p class="text-sm font-semibold text-blue-900 mb-2">📌 Что это даёт?</p>
                  <ul class="list-none space-y-1 text-gray-700 text-sm">
                    <li>🔹 Показывает твой основной жизненный путь, с которым ты пришёл(-а) в этот мир.</li>
                    <li>🔹 Определяет главную силу и главный вызов, который будет сопровождать тебя всю жизнь.</li>
                  </ul>
                </div>
              </div>

              <!-- Разделитель -->
              <div class="flex justify-center items-center my-4">
                <span class="text-xl">🌀</span>
                <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
                <span class="text-xl">🌀</span>
              </div>

              <!-- Второй блок -->
              <div class="border-l-4 border-red-600 pl-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">2️⃣ Теневой Архетип – «Где ты застрял(-а)»</h3>
                <div class="bg-red-50 p-4 rounded-lg mb-3">
                  <p class="text-sm font-semibold text-red-900 mb-2">📌 Что это даёт?</p>
                  <ul class="list-none space-y-1 text-gray-700 text-sm">
                    <li>🔹 Показывает ловушку, в которой ты находишься прямо сейчас.</li>
                    <li>🔹 Это бессознательный паттерн, который мешает тебе двигаться вперёд.</li>
                    <li>🔹 Это то, что ты считаешь своей слабостью, но на самом деле это скрытая сила, которую ты пока не используешь правильно.</li>
                  </ul>
                </div>
              </div>

              <!-- Разделитель -->
              <div class="flex justify-center items-center my-4">
                <span class="text-xl">🌀</span>
                <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
                <span class="text-xl">🌀</span>
              </div>

              <!-- Третий блок -->
              <div class="border-l-4 border-amber-600 pl-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">3️⃣ Ограничивающий Архетип – «Почему ты не двигаешься дальше»</h3>
                <div class="bg-amber-50 p-4 rounded-lg mb-3">
                  <p class="text-sm font-semibold text-amber-900 mb-2">📌 Что это даёт?</p>
                  <ul class="list-none space-y-1 text-gray-700 text-sm">
                    <li>🔹 Показывает основной внутренний блок, который мешает переходу на следующий уровень.</li>
                    <li>🔹 Это убеждение или привычка, которая создаёт торможение.</li>
                    <li>🔹 Это точка, в которой ты сам(-а) себе создаёшь ограничения.</li>
                  </ul>
                </div>
              </div>

              <!-- Разделитель -->
              <div class="flex justify-center items-center my-4">
                <span class="text-xl">🌀</span>
                <div class="w-16 h-0.5 bg-gray-300 mx-2"></div>
                <span class="text-xl">🌀</span>
              </div>

              <!-- Четвертый блок -->
              <div class="border-l-4 border-purple-600 pl-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">4️⃣ Архетип Трансформации – «Какой новый сценарий тебя освободит»</h3>
                <div class="bg-purple-50 p-4 rounded-lg mb-3">
                  <p class="text-sm font-semibold text-purple-900 mb-2">📌 Что это даёт?</p>
                  <ul class="list-none space-y-1 text-gray-700 text-sm">
                    <li>🔹 Показывает ключевой путь перехода в новый сценарий жизни.</li>
                    <li>🔹 Даёт понимание, какие качества тебе нужно развить, чтобы выйти на следующий уровень.</li>
                    <li>🔹 Это архетип, который показывает, куда идти, чтобы больше не застревать в старых циклах.</li>
                  </ul>
                </div>
              </div>

              <!-- Заключительный блок -->
              <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p class="text-gray-800 italic mb-2 font-medium">"Архетип показывает путь, тень - учит мудрости."</p>
                <p class="text-gray-800 italic font-medium">"Осознав обе стороны, вы обретаете целостность."</p>
              </div>
            </div>
          </div>

          <!-- Контент продукта -->
          <ProductContentBlock 
            product-type="archetypeShadow" 
            product-id="taroscope-archetypeShadow" 
            product-display-name="Архетип и тень" 
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

    // Проверка формата даты
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(formData.value.birthDate)) {
      error.value = 'Неверный формат даты. Используйте формат ДД.ММ.ГГГГ';
      return;
    }

    loading.value = true;
    error.value = '';
    success.value = '';

    try {
      const response = await fetch(`${config.public.apiBase}/api/archetypeShadow/pdf`, {
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

      // Получаем blob с PDF
      const blob = await response.blob();
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Получаем имя файла из заголовка или создаем по умолчанию
      const contentDisposition = response.headers.get('Content-disposition');
      let filename = 'archetypeShadow.pdf';
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
      
      // Очищаем форму
      formData.value.birthDate = '';

    } catch (err) {
      console.error('Ошибка генерации расчета:', err);
      error.value = err.message || 'Произошла ошибка при генерации расчета';
    } finally {
      loading.value = false;
    }
  }
</script>
