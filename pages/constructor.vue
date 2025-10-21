<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">🛠️ Конструктор продуктов1</h1>
          <p class="mt-4 text-lg text-gray-600">
            Выберите нужный расчет для генерации персонального результата
          </p>
        </div>

        <!-- Список расчетов -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Тароскоп на любые месяцы -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">🔮</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Тароскоп на любые месяцы</h3>
                  <p class="text-sm text-gray-500">Персональный прогноз</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Получите детальный тароскоп на основе вашей даты рождения с интерпретацией карт и практическими рекомендациями.
              </p>
              <NuxtLink 
                to="/forecast" 
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Рассчитать
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </NuxtLink>
            </div>
          </div>

          <!-- Матрица жизни и коды жизни -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">🧮</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Матрица жизни и коды жизни</h3>
                  <p class="text-sm text-gray-500">Калькулятор + трактовки</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Рассчитайте свою таро матрицу и получите подробную трактовку жизненных кодов.
              </p>
              <button 
                disabled
                class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                Скоро
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Проводник Воли -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Проводник Воли</h3>
                  <p class="text-sm text-gray-500">Сила намерения</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Раскройте потенциал вашей воли и научитесь направлять энергию на достижение целей.
              </p>
              <button 
                disabled
                class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                Скоро
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Проводник Будущего -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">🔮</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Проводник Будущего</h3>
                  <p class="text-sm text-gray-500">Прогнозы и возможности</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Исследуйте возможные пути развития и получите рекомендации для принятия решений.
              </p>
              <button 
                disabled
                class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                Скоро
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Расчет 4 кода денег -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">💰</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Расчет 4 кода денег</h3>
                  <p class="text-sm text-gray-500">Финансовая таро</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Узнайте свои денежные коды и получите стратегии для привлечения финансового изобилия.
              </p>
              <button 
                disabled
                class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                Скоро
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Архетип и тень -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span class="text-2xl">👤</span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">Архетип и тень</h3>
                  <p class="text-sm text-gray-500">Психологический анализ</p>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                Исследуйте свои архетипы и тени для глубокого понимания личности и потенциала.
              </p>
              <button 
                disabled
                class="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
              >
                Скоро
                <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Информация о конструкторе -->
        <div class="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">📋 О конструкторе продуктов</h2>
          <div class="prose max-w-none">
            <p class="text-gray-700 mb-4">
              <strong>Конструктор продуктов</strong> — это ваш персональный инструмент для создания уникальных расчетов и прогнозов на основе таро, астрологии и психологии.
            </p>
            <p class="text-gray-700 mb-4">
              Каждый расчет учитывает:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Вашу уникальную дату рождения</li>
              <li>Таро коды и матрицы</li>
              <li>Энергетические циклы и периоды</li>
              <li>Персональные рекомендации и стратегии</li>
            </ul>
            <p class="text-gray-700">
              Результаты предоставляются в виде подробных PDF-документов с практическими советами и интерпретациями.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "customer-or-admin",
});
</script> 