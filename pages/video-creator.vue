<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Создание Видео
          </h1>
          <p class="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
            Создавайте уникальные рилсы с помощью ИИ
          </p>
        </div>

        <!-- Основной контент -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Левая панель - Список созданных рилсов -->
          <div class="lg:col-span-1 order-2 lg:order-1">
            <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
                  <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  Мои рилсы
                </h2>
                <span class="bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                  {{ reels.length }}
                </span>
              </div>

              <!-- Список рилсов -->
              <div v-if="loading" class="text-center py-8">
                <div class="w-8 h-8 border-t-2 border-purple-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p class="text-gray-500 mt-2 text-sm">Загрузка...</p>
              </div>

              <div v-else-if="reels.length === 0" class="text-center py-8 px-4">
                <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <p class="text-gray-500 text-sm">Пока нет созданных рилсов</p>
                <p class="text-gray-400 text-xs mt-1">Создайте свой первый рилс</p>
              </div>

              <div v-else class="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                <div 
                  v-for="reel in reels" 
                  :key="reel.id"
                  @click="selectReel(reel)"
                  :class="[
                    'group cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                    selectedReel?.id === reel.id 
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : 'border-gray-200 hover:border-purple-300 bg-gray-50'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-sm sm:text-base text-gray-800 truncate mb-1">
                        {{ reel.title }}
                      </h3>
                      <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                        {{ reel.prompt }}
                      </p>
                      <div class="flex items-center gap-2">
                        <span :class="getStatusClass(reel.status)" class="text-xs px-2 py-0.5 rounded-full font-medium">
                          {{ getStatusText(reel.status) }}
                        </span>
                        <span class="text-xs text-gray-400">
                          {{ formatDate(reel.createdAt) }}
                        </span>
                      </div>
                    </div>
                    <button 
                      @click.stop="deleteReel(reel.id)"
                      class="ml-2 text-gray-400 hover:text-red-500 transition touch-manipulation"
                      title="Удалить"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Правая панель - Ввод и действия -->
          <div class="lg:col-span-2 order-1 lg:order-2">
            <!-- Блок анимации генерации блоков -->
            <div v-if="generatingBlocks" class="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <div class="text-center">
                <div class="mb-8">
                  <div class="relative inline-block">
                    <div class="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  🎬 ИИ создает блоки для видео...
                </h2>
                
                <p class="text-base sm:text-lg text-gray-600 mb-6">
                  Генерирую 5 блоков по 10 секунд для вашего видео
                </p>
                
                <div class="max-w-md mx-auto space-y-3">
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <p class="ml-3 text-sm text-gray-700">Анализ вашего промпта</p>
                  </div>
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <p class="ml-3 text-sm text-gray-700">Создание текстов для озвучки</p>
                  </div>
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <p class="ml-3 text-sm text-gray-700">Подготовка структуры видео</p>
                  </div>
                </div>
                
                <p class="text-sm text-gray-500 mt-8">
                  Это займет 15-30 секунд...
                </p>
              </div>
            </div>

            <!-- Редактор блоков видео -->
            <VideoBlockEditor
              v-else-if="showBlockEditor && editingReel"
              :initialBlocks="editingReel.blocks || []"
              :initialAudioSettings="editingReel.audioSettings"
              :initialBackgroundMusic="editingReel.backgroundMusic"
              @back="exitBlockEditor"
              @save="saveVideoBlocks"
              @generate-video="generateFinalVideo"
            />

            <!-- Блок анимации генерации сценария -->
            <div v-else-if="generatingScenario" class="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <div class="text-center">
                <div class="mb-8">
                  <div class="relative inline-block">
                    <div class="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                      <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                  🎬 ИИ создает сценарий...
                </h2>
                
                <p class="text-base sm:text-lg text-gray-600 mb-6">
                  Анализирую ваш промпт и создаю детальный профессиональный сценарий
                </p>
                
                <div class="max-w-md mx-auto space-y-3">
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <p class="ml-3 text-sm text-gray-700">Разработка концепции видео</p>
                  </div>
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <p class="ml-3 text-sm text-gray-700">Создание визуального ряда по кадрам</p>
                  </div>
                  <div class="flex items-center text-left p-3 bg-purple-50 rounded-lg">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <p class="ml-3 text-sm text-gray-700">Подбор музыки и эффектов</p>
                  </div>
                </div>
                
                <p class="text-sm text-gray-500 mt-8">
                  Это может занять 10-30 секунд...
                </p>
              </div>
            </div>

            <!-- Блок просмотра выбранного рилса -->
            <div v-else-if="selectedReel" class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div class="mb-6">
                <button 
                  @click="backToCreationForm"
                  class="flex items-center text-purple-600 hover:text-purple-700 transition mb-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Вернуться к созданию
                </button>
                
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {{ selectedReel.title }}
                    </h2>
                    <div class="flex items-center gap-3">
                      <span :class="getStatusClass(selectedReel.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                        {{ getStatusText(selectedReel.status) }}
                      </span>
                      <span class="text-sm text-gray-500">
                        {{ formatDate(selectedReel.createdAt) }}
                      </span>
                    </div>
                  </div>
                  <button 
                    @click.stop="deleteReel(selectedReel.id)"
                    class="ml-4 text-gray-400 hover:text-red-500 transition p-2"
                    title="Удалить"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-6">
                <div class="p-4 bg-gray-50 rounded-xl">
                  <p class="text-sm font-medium text-gray-500 mb-2">📝 Промпт:</p>
                  <p class="text-base text-gray-800">{{ selectedReel.prompt }}</p>
                </div>

                <div v-if="selectedReel.scenario" class="border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3">
                    <p class="text-white font-semibold flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Сценарий
                    </p>
                  </div>
                  <div class="p-6 bg-white max-h-[600px] overflow-y-auto custom-scrollbar">
                    <div v-html="renderMarkdown(selectedReel.scenario)" class="prose prose-sm sm:prose max-w-none"></div>
                  </div>
                  <div class="bg-blue-50 px-6 py-3 border-t border-blue-200">
                    <p class="text-xs text-blue-700 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      Сгенерировано с помощью ИИ
                    </p>
                  </div>
                </div>

                <div v-if="selectedReel.videoUrl" class="border-2 border-green-200 rounded-xl overflow-hidden">
                  <div class="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3">
                    <p class="text-white font-semibold flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Готовое видео
                    </p>
                  </div>
                  <div class="p-6 bg-white">
                    <video 
                      v-if="selectedReel.videoUrl.endsWith('.mp4')"
                      :src="selectedReel.videoUrl" 
                      controls 
                      class="w-full rounded-lg shadow-lg mb-4"
                      style="max-height: 600px;"
                    >
                      Ваш браузер не поддерживает видео.
                    </video>
                    <div class="flex gap-3">
                      <a 
                        :href="selectedReel.videoUrl" 
                        download
                        class="flex-1 text-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
                      >
                        📥 Скачать видео
                      </a>
                      <a 
                        :href="selectedReel.videoUrl" 
                        target="_blank"
                        class="flex-1 text-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                      >
                        🔗 Открыть в новой вкладке
                      </a>
                    </div>
                  </div>
                  <div class="bg-green-50 px-6 py-3 border-t border-green-200">
                    <p class="text-xs text-green-700 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Видео готово к использованию
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Форма создания -->
            <div v-else-if="showCreationForm" class="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
              <!-- Форма ввода -->
              <div class="mb-6 sm:mb-8">
                <label class="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                  Тема или промпт для видео
                </label>
                <div class="relative">
                  <textarea 
                    v-model="prompt"
                    rows="6"
                    :disabled="processing"
                    class="w-full px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Например: Создай короткое видео про утреннюю йогу для начинающих с успокаивающей музыкой и природными звуками..."
                  ></textarea>
                  <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                    {{ prompt.length }} / 1000
                  </div>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 mt-2">
                  Опишите, какое видео вы хотите создать. Будьте максимально детальными.
                </p>
              </div>

              <!-- Поле для названия -->
              <div class="mb-6 sm:mb-8">
                <label class="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                  Название рилса
                </label>
                <input 
                  v-model="title"
                  type="text"
                  :disabled="processing"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Введите название для рилса"
                >
              </div>

              <!-- Кнопки действий -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <!-- Кнопка генерации сценария -->
                <button 
                  @click="generateScenario"
                  :disabled="!canSubmit || processing"
                  class="group relative overflow-hidden px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div class="relative flex items-center justify-center">
                    <svg v-if="!processing" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div v-else class="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    {{ processing ? 'ИИ создает сценарий...' : 'Сгенерировать сценарий' }}
                  </div>
                </button>

                <!-- Кнопка создания видео -->
                <button 
                  @click="createVideo"
                  :disabled="!canSubmit || processing"
                  class="group relative overflow-hidden px-6 py-4 sm:py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div class="relative flex items-center justify-center">
                    <svg v-if="!processing" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div v-else class="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    {{ processing ? 'Создание...' : 'Создать видео' }}
                  </div>
                </button>
              </div>

              <!-- Подсказки -->
              <div class="mt-6 sm:mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="text-xs sm:text-sm text-gray-700">
                    <p class="font-semibold mb-1">Советы для лучшего результата:</p>
                    <ul class="list-disc list-inside space-y-1 text-gray-600">
                      <li>Опишите желаемую тему, стиль и настроение видео</li>
                      <li>Укажите целевую аудиторию и длительность</li>
                      <li>Добавьте пожелания по музыке и визуальным эффектам</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <!-- Иконка в зависимости от типа -->
            <div class="flex items-center justify-center mb-4">
              <!-- Success -->
              <div v-if="modal.type === 'success'" class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <!-- Error -->
              <div v-else-if="modal.type === 'error'" class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              
              <!-- Warning -->
              <div v-else-if="modal.type === 'warning'" class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <!-- Confirm -->
              <div v-else-if="modal.type === 'confirm'" class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Заголовок -->
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
              {{ modal.title }}
            </h3>

            <!-- Сообщение -->
            <p class="text-gray-600 text-center mb-6 whitespace-pre-line">
              {{ modal.message }}
            </p>

            <!-- Кнопки -->
            <div v-if="modal.type === 'confirm'" class="flex gap-3">
              <button 
                @click="closeModal"
                class="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition"
              >
                Отмена
              </button>
              <button 
                @click="confirmModal"
                class="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition"
              >
                Удалить
              </button>
            </div>
            <div v-else>
              <button 
                @click="closeModal"
                :class="[
                  'w-full px-4 py-3 rounded-xl font-semibold transition',
                  modal.type === 'success' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  modal.type === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' :
                  modal.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                  'bg-blue-500 hover:bg-blue-600 text-white'
                ]"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface VideoBlock {
  id: string
  text: string
  displayText: string
  duration: number
  images: string[]
  audioUrl?: string
  order: number
}

interface AudioSettings {
  voiceVolume: number
  musicVolume: number
  voiceSpeed: number
}

interface Reel {
  id: number | string
  userId: number
  title: string
  prompt: string
  scenario?: string
  blocks?: VideoBlock[]
  backgroundMusic?: string
  audioSettings?: AudioSettings
  videoUrl?: string
  status: 'draft' | 'scenario_generated' | 'blocks_created' | 'video_generating' | 'video_created'
  createdAt?: string
  updatedAt?: string
}

const config = useRuntimeConfig()
const token = useCookie('bearer-token')

// Состояния
const prompt = ref('')
const title = ref('')
const reels = ref<Reel[]>([])
const selectedReel = ref<Reel | null>(null)
const loading = ref(true)
const processing = ref(false)
const showCreationForm = ref(true)
const generatingScenario = ref(false)
const showBlockEditor = ref(false)
const generatingBlocks = ref(false)
const editingReel = ref<Reel | null>(null)

// Модальное окно
interface ModalData {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'confirm'
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
}

const modal = ref<ModalData>({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

// Функции для модального окна
function showModal(type: 'success' | 'error' | 'warning' | 'confirm', title: string, message: string, onConfirm?: () => void) {
  modal.value = {
    show: true,
    type,
    title,
    message,
    onConfirm,
    onCancel: () => {
      modal.value.show = false
    }
  }
}

function closeModal() {
  modal.value.show = false
}

function confirmModal() {
  if (modal.value.onConfirm) {
    modal.value.onConfirm()
  }
  closeModal()
}

// Вычисляемые свойства
const canSubmit = computed(() => {
  return prompt.value.trim().length > 0 && 
         title.value.trim().length > 0 && 
         prompt.value.length <= 1000
})

// Загрузка рилсов
async function loadReels() {
  try {
    loading.value = true
    const response = await fetch(`${config.public.apiBase}/api/reels`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // Маппим _id из MongoDB в id для фронтенда
      reels.value = data.map((reel: any) => ({
        id: reel._id,
        userId: reel.userId,
        title: reel.title,
        prompt: reel.prompt,
        scenario: reel.scenario,
        blocks: reel.blocks || [],
        backgroundMusic: reel.backgroundMusic,
        audioSettings: reel.audioSettings || { voiceVolume: 80, musicVolume: 30, voiceSpeed: 1.0 },
        videoUrl: reel.videoUrl,
        status: reel.status,
        createdAt: reel.createdAt,
        updatedAt: reel.updatedAt
      }))
    } else {
      console.error('Ошибка загрузки рилсов')
    }
  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    loading.value = false
  }
}

// Генерация сценария
async function generateScenario() {
  if (!canSubmit.value) return
  
  try {
    processing.value = true
    generatingScenario.value = true
    showCreationForm.value = false
    
    // Создаем новый рилс
    const createResponse = await fetch(`${config.public.apiBase}/api/reels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        prompt: prompt.value
      })
    })
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}))
      showModal('error', 'Ошибка создания', errorData.error || 'Не удалось создать рилс. Попробуйте позже.')
      generatingScenario.value = false
      showCreationForm.value = true
      return
    }
    
    const newReel = await createResponse.json()
    
    // Генерируем сценарий с помощью ИИ
    const scenarioResponse = await fetch(`${config.public.apiBase}/api/reels/${newReel._id}/generate-scenario`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (scenarioResponse.ok) {
      const updatedReel = await scenarioResponse.json()
      
      // Очищаем форму
      prompt.value = ''
      title.value = ''
      
      // Обновляем список
      await loadReels()
      
      // Автоматически выбираем созданный рилс для просмотра
      selectedReel.value = {
        id: updatedReel._id,
        userId: updatedReel.userId,
        title: updatedReel.title,
        prompt: updatedReel.prompt,
        scenario: updatedReel.scenario,
        videoUrl: updatedReel.videoUrl,
        status: updatedReel.status,
        createdAt: updatedReel.createdAt,
        updatedAt: updatedReel.updatedAt
      }
      
      generatingScenario.value = false
    } else {
      const errorData = await scenarioResponse.json().catch(() => ({}))
      const errorMessage = errorData.details || errorData.error || 'Неизвестная ошибка'
      showModal('warning', 'Частичный успех', `Рилс создан, но не удалось сгенерировать сценарий.\n\nОшибка: ${errorMessage}\n\nПопробуйте позже или обратитесь к администратору.`)
      await loadReels()
      generatingScenario.value = false
      showCreationForm.value = true
    }
  } catch (error) {
    console.error('Ошибка:', error)
    showModal('error', 'Ошибка', 'Произошла ошибка при создании рилса. Попробуйте позже.')
    generatingScenario.value = false
    showCreationForm.value = true
  } finally {
    processing.value = false
  }
}

// Создание видео (генерация блоков)
async function createVideo() {
  if (!canSubmit.value) return
  
  try {
    processing.value = true
    generatingBlocks.value = true
    showCreationForm.value = false
    
    // Создаем новый рилс
    const createResponse = await fetch(`${config.public.apiBase}/api/reels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title.value,
        prompt: prompt.value
      })
    })
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}))
      showModal('error', 'Ошибка создания', errorData.error || 'Не удалось создать рилс')
      generatingBlocks.value = false
      showCreationForm.value = true
      return
    }
    
    const newReel = await createResponse.json()
    
    // Генерируем блоки для видео
    const blocksResponse = await fetch(`${config.public.apiBase}/api/reels/${newReel._id}/generate-video-blocks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (blocksResponse.ok) {
      const updatedReel = await blocksResponse.json()
      
      // Очищаем форму
      prompt.value = ''
      title.value = ''
      
      // Обновляем список
      await loadReels()
      
      // Открываем редактор блоков
      editingReel.value = {
        id: updatedReel._id,
        userId: updatedReel.userId,
        title: updatedReel.title,
        prompt: updatedReel.prompt,
        scenario: updatedReel.scenario,
        blocks: updatedReel.blocks || [],
        backgroundMusic: updatedReel.backgroundMusic,
        audioSettings: updatedReel.audioSettings || { voiceVolume: 80, musicVolume: 30, voiceSpeed: 1.0 },
        videoUrl: updatedReel.videoUrl,
        status: updatedReel.status,
        createdAt: updatedReel.createdAt,
        updatedAt: updatedReel.updatedAt
      }
      
      generatingBlocks.value = false
      showBlockEditor.value = true
    } else {
      const errorData = await blocksResponse.json().catch(() => ({}))
      const errorMessage = errorData.details || errorData.error || 'Неизвестная ошибка'
      showModal('warning', 'Частичный успех', `Рилс создан, но не удалось сгенерировать блоки.\n\nОшибка: ${errorMessage}`)
      await loadReels()
      generatingBlocks.value = false
      showCreationForm.value = true
    }
  } catch (error) {
    console.error('Ошибка:', error)
    showModal('error', 'Ошибка', 'Произошла ошибка при создании видео')
    generatingBlocks.value = false
    showCreationForm.value = true
  } finally {
    processing.value = false
  }
}

// Обновление статуса рилса
async function updateReelStatus(id: number, status: string, scenario?: string, videoUrl?: string) {
  try {
    const body: any = { status }
    if (scenario) body.scenario = scenario
    if (videoUrl) body.videoUrl = videoUrl
    
    await fetch(`${config.public.apiBase}/api/reels/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    console.error('Ошибка обновления статуса:', error)
  }
}

// Удаление рилса
async function deleteReel(id: number | string) {
  showModal('confirm', 'Подтверждение удаления', 'Вы уверены, что хотите удалить этот рилс? Это действие нельзя отменить.', async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/reels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      
      if (response.ok) {
        if (selectedReel.value?.id === id) {
          selectedReel.value = null
          showCreationForm.value = true
        }
        await loadReels()
        showModal('success', 'Удалено', 'Рилс успешно удален')
      } else {
        showModal('error', 'Ошибка', 'Не удалось удалить рилс')
      }
    } catch (error) {
      console.error('Ошибка:', error)
      showModal('error', 'Ошибка', 'Произошла ошибка при удалении рилса')
    }
  })
}

// Выбор рилса для просмотра
function selectReel(reel: Reel) {
  selectedReel.value = reel
  showCreationForm.value = false
}

// Возврат к форме создания
function backToCreationForm() {
  selectedReel.value = null
  showCreationForm.value = true
}

// Выход из редактора блоков
function exitBlockEditor() {
  showBlockEditor.value = false
  editingReel.value = null
  showCreationForm.value = true
}

// Сохранить изменения блоков
async function saveVideoBlocks(data: { blocks: VideoBlock[], audioSettings: AudioSettings, backgroundMusic: string }) {
  if (!editingReel.value) return
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/reels/${editingReel.value.id}/video-blocks`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (response.ok) {
      const updatedReel = await response.json()
      editingReel.value = {
        ...editingReel.value,
        blocks: updatedReel.blocks,
        audioSettings: updatedReel.audioSettings,
        backgroundMusic: updatedReel.backgroundMusic
      }
      await loadReels()
      showModal('success', 'Сохранено', 'Изменения успешно сохранены')
    } else {
      showModal('error', 'Ошибка', 'Не удалось сохранить изменения')
    }
  } catch (error) {
    console.error('Ошибка:', error)
    showModal('error', 'Ошибка', 'Произошла ошибка при сохранении')
  }
}

// Сгенерировать финальное видео
async function generateFinalVideo(data: { blocks: VideoBlock[], audioSettings: AudioSettings, backgroundMusic: string }) {
  if (!editingReel.value) return
  
  try {
    processing.value = true
    
    // Сначала сохраняем изменения
    await saveVideoBlocks(data)
    
    // Затем запускаем генерацию видео
    const response = await fetch(`${config.public.apiBase}/api/reels/${editingReel.value.id}/generate-final-video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      showModal('success', 'Генерация началась', 'Видео генерируется. Это может занять несколько минут. Вы получите уведомление когда видео будет готово.')
      
      // Закрываем редактор и возвращаемся к списку
      showBlockEditor.value = false
      editingReel.value = null
      showCreationForm.value = true
      await loadReels()
    } else {
      const errorData = await response.json().catch(() => ({}))
      showModal('error', 'Ошибка генерации', errorData.error || 'Не удалось запустить генерацию видео')
    }
  } catch (error) {
    console.error('Ошибка:', error)
    showModal('error', 'Ошибка', 'Произошла ошибка при генерации видео')
  } finally {
    processing.value = false
  }
}

// Получение класса для статуса
function getStatusClass(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-700'
    case 'scenario_generated':
      return 'bg-blue-100 text-blue-700'
    case 'blocks_created':
      return 'bg-indigo-100 text-indigo-700'
    case 'video_generating':
      return 'bg-yellow-100 text-yellow-700'
    case 'video_created':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Получение текста для статуса
function getStatusText(status: string): string {
  switch (status) {
    case 'draft':
      return 'Черновик'
    case 'scenario_generated':
      return 'Сценарий готов'
    case 'blocks_created':
      return 'Блоки готовы'
    case 'video_generating':
      return 'Генерация видео...'
    case 'video_created':
      return 'Видео создано'
    default:
      return status
  }
}

// Форматирование даты
function formatDate(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Простой рендеринг Markdown в HTML
function renderMarkdown(text: string): string {
  if (!text) return ''
  
  let html = text
  
  // Заголовки
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h1>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-2 text-gray-800">$1</h2>')
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-700">$1</h3>')
  
  // Жирный текст
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
  
  // Курсив
  html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
  
  // Горизонтальная линия
  html = html.replace(/^---$/gim, '<hr class="my-6 border-t-2 border-gray-200" />')
  
  // Списки
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
  html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside my-3 space-y-1">$1</ul>')
  
  // Параграфы
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.startsWith('<')) {
      return `<p class="mb-3 text-gray-700 leading-relaxed">${para}</p>`
    }
    return para
  }).join('\n')
  
  return html
}

// Загружаем рилсы при монтировании
onMounted(() => {
  loadReels()
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Анимации для загрузки */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Стили для Markdown контента */
.prose {
  color: #374151;
  max-width: none;
}

.prose :deep(h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}

.prose :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.prose :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.prose :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.75;
}

.prose :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.prose :deep(li) {
  margin-bottom: 0.25rem;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #111827;
}

.prose :deep(em) {
  font-style: italic;
}

.prose :deep(hr) {
  margin: 1.5rem 0;
  border-top: 2px solid #e5e7eb;
}

/* Анимации модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-enter-to .relative,
.modal-leave-from .relative {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>

