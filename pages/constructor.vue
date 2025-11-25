<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8">
            <div class="flex items-center justify-center gap-4 mb-4">
              <h1 class="text-3xl font-bold text-gray-900">🛠️ Конструктор продуктов</h1>
              <NuxtLink 
                v-if="isAdmin"
                to="/product-statistics" 
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                📊 Статистика
              </NuxtLink>
            </div>
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
                <template v-if="isProductAvailable('forecast')">
                  <NuxtLink 
                    to="/magic/forecast" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 极有可能 00-8 0v极有可能h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Матрица Жизни и коды жизни -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🧮</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Матрица Жизни и коды жизни</h3>
                    <p class="text-sm text-gray-500">Калькулятор + трактовки</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Рассчитайте свою таро матрицу и получите подробную трактовку жизненных кодов.
                </p>
                <template v-if="isProductAvailable('matrixLife')">
                  <NuxtLink 
                    to="/magic/matrixLife" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Матрица жизни -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🔮</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Матрица жизни</h3>
                    <p class="text-sm text-gray-500">Полный расчет с периодами</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Получите полный расчет матрицы жизни с арканами, периодами жизни и кармическими уроками.
                </p>
                <template v-if="isProductAvailable('lifeMatrix')">
                  <NuxtLink 
                    to="/magic/lifeMatrix" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
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
                <template v-if="isProductAvailable('financialCast')">
                  <NuxtLink 
                    to="/magic/financialCast" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Архетип и тень -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🌟</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Архетип и тень</h3>
                    <p class="text-sm text-gray-500">Психологический анализ</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Исследуйте свои архетипы и тени для глубокого понимания личности и потенциала.
                </p>
                <template v-if="isProductAvailable('archetypeShadow')">
                  <NuxtLink 
                    to="/magic/archetypeShadow" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Ошибки прошлого воплощения -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🕰️</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Ошибки прошлого воплощения</h3>
                    <p class="text-sm text-gray-500">Анализ прошлого</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Что ваша душа не успела завершить в прошлых воплощениях? Время исправить.
                </p>
                <template v-if="isProductAvailable('mistakesIncarnation')">
                  <NuxtLink 
                    to="/magic/mistakesIncarnation" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Аркан самореализации -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Аркан самореализации</h3>
                    <p class="text-sm text-gray-500">Узнай свой аркан самореализации</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Узнайте свой кармический аркан самореализации по дате рождения и получите ключи к раскрытию вашего истинного предназначения и талантов.
                </p>
                <template v-if="isProductAvailable('arcanumRealization')">
                  <NuxtLink 
                    to="/magic/arcanumRealization" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Три кода пробуждения -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Три кода пробуждения</h3>
                    <p class="text-sm text-gray-500">Узнай свои коды пробуждения</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Раскрой три сакральных кода своей души: кто ты на самом деле, что тебя сдерживает и как реализовать свой высший потенциал.
                </p>
                <template v-if="isProductAvailable('awakeningCodes')">
                  <NuxtLink 
                    to="/magic/awakeningCodes" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Кармический хвост, предназначение и карма денег -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Кармический хвост</h3>
                    <p class="text-sm text-gray-500">Предназначение и карма денег</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Узнайте свой кармический хвост, истинное предназначение и денежную карму по дате рождения.
                </p>
                <template v-if="isProductAvailable('karmicTail')">
                  <NuxtLink 
                    to="/magic/karmicTail" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Архетип месяца -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">🌙</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Архетип месяца</h3>
                    <p class="text-sm text-gray-500">Узнай свои коды архетип месяца</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Исследуйте свой архетип месяца для глубокого понимания личности и потенциала.
                </p>
                <template v-if="isProductAvailable('archetypeMonth')">
                  <NuxtLink 
                    to="/magic/archetypeMonth" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Удар, цикл, застой, выход -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Удар, цикл, застой, выход</h3>
                    <p class="text-sm text-gray-500">Жизненный цикл и пути выхода</p>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mb-4">
                  Узнайте свой цикл жизни: застой, удар и три пути выхода по дате рождения.
                </p>
                <template v-if="isProductAvailable('stagnationCycle')">
                  <NuxtLink 
                    to="/magic/stagnationCycle" 
                    class="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Рассчитать
                    <svg class="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </template>
                <template v-else>
                  <div class="flex items-center text-gray-500 cursor-not-allowed">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Недоступно</span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Контент продукта -->
          <ProductContentBlock 
            product-type="constructor" 
            product-id="main" 
            product-display-name="Конструктор продуктов" 
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

const { tariff, isAdmin } = useAuth();

// Конфигурация доступности продуктов по тарифам
const productAvailability = {
  // Продукты доступные для всех тарифов
  forecast: ['basic', 'pro'],
  matrixLife: ['basic', 'pro'],
  will: ['basic', 'pro'],
  
  // Продукты только для про
  financialCast: ['pro'],
  mistakesIncarnation: ['pro'],
  future: ['pro'],
  archetype: ['pro'],
  archetypeShadow: ['pro'],
  archetypeMonth: ['pro'],
  arcanumRealization: ['pro'],
  awakeningCodes: ['pro'],
  karmicTail: ['pro'],
  lifeMatrix: ['pro'],
  stagnationCycle: ['pro'],
};

// Функция проверки доступности продукта
function isProductAvailable(productKey) {
  // Админам всегда доступны все продукты
  const { isAdmin } = useAuth();
  if (isAdmin.value) return true;
  
  // Проверяем доступность для текущего тарифа
  const availableForTariffs = productAvailability[productKey];
  return availableForTariffs && availableForTariffs.includes(tariff);
}
</script>