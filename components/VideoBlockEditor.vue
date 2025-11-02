<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
    <div class="mb-6">
      <button 
        @click="$emit('back')"
        class="flex items-center text-purple-600 hover:text-purple-700 transition mb-4"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Назад
      </button>
      
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Редактор видео-блоков
      </h2>
      <p class="text-gray-600">
        Отредактируйте каждый блок: измените текст, добавьте изображения и настройте параметры
      </p>
    </div>

    <!-- Блоки -->
    <div class="space-y-6 mb-8">
      <div 
        v-for="(block, index) in blocks" 
        :key="block.id"
        class="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {{ index + 1 }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              Блок {{ index + 1 }}
            </h3>
            <span class="text-sm text-gray-500">
              ({{ block.duration }}с)
            </span>
            <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ID: {{ block.id || 'no-id' }} | Index: {{ index }}
            </div>
          </div>
        </div>

        <!-- Текст для озвучки -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎙️ Текст для озвучки
          </label>
          <textarea
            :value="block.text"
            @input="handleBlockChange(index, 'text', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
            placeholder="Текст, который будет озвучен..."
          ></textarea>
        </div>

        <!-- Текст для отображения -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            📝 Текст на экране
          </label>
          <input
            :value="block.displayText"
            @input="handleBlockChange(index, 'displayText', ($event.target as HTMLInputElement).value)"
            type="text"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
            placeholder="Короткий текст для отображения..."
          />
        </div>

        <!-- Продолжительность -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            ⏱️ Продолжительность (секунды)
          </label>
          <input
            :value="block.duration"
            @input="handleBlockChange(index, 'duration', Number(($event.target as HTMLInputElement).value))"
            type="number"
            min="5"
            max="30"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
          />
        </div>

        <!-- Анимация изображений -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            ✨ Анимация изображений
          </label>
          <select
            :value="block.imageAnimation"
            @change="handleBlockChange(index, 'imageAnimation', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
          >
            <option value="zoom-in">🔍 Приближение (Zoom In)</option>
            <option value="swipe">↔️ Свайп (Swipe)</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Для нечетных блоков (1,3,5...) - оригинальный эффект, для четных (0,2,4...) - обратный эффект
          </p>
        </div>

        <!-- Последовательное появление слов -->
        <div class="mb-4">
          <label class="flex items-center cursor-pointer">
            <input
              :checked="block.scrollingText"
              @change="handleBlockChange(index, 'scrollingText', ($event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-4 focus:ring-purple-100 transition"
            />
            <span class="ml-3 text-sm font-semibold text-gray-700">
              📜 Последовательное появление слов (слово за словом)
            </span>
          </label>
        </div>

        <!-- Настройки текста -->
        <div class="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">⚙️ Настройки текста на экране</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Размер шрифта -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">
                📏 Размер шрифта
              </label>
              <input
                :value="block.textFontSize ?? 50"
                @input="handleBlockChange(index, 'textFontSize', Number(($event.target as HTMLInputElement).value))"
                type="number"
                min="20"
                max="100"
                step="5"
                class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <span class="text-xs text-gray-500 mt-1 block">{{ block.textFontSize ?? 50 }}px</span>
            </div>

            <!-- Расположение текста -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">
                📍 Расположение
              </label>
              <select
                :value="block.textPosition ?? 'bottom'"
                @change="handleBlockChange(index, 'textPosition', ($event.target as HTMLSelectElement).value)"
                class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
              >
                <option value="top">⬆️ Сверху</option>
                <option value="center">➡️ По центру</option>
                <option value="bottom">⬇️ Снизу</option>
              </select>
            </div>

            <!-- Шрифт -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-2">
                🔤 Шрифт
              </label>
              <select
                :value="block.textFont ?? 'Arial'"
                @change="handleBlockChange(index, 'textFont', ($event.target as HTMLSelectElement).value)"
                class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
              >
                <option value="Arial">Arial</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Impact">Impact</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Промпты для изображений -->
        <div v-if="block.imagePrompts && block.imagePrompts.length > 0" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎨 Промпты для генерации изображений
          </label>
          <div class="space-y-2">
            <div 
              v-for="(prompt, promptIndex) in block.imagePrompts" 
              :key="promptIndex"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <textarea
                :value="block.imagePrompts[promptIndex]"
                @input="handlePromptChange(index, promptIndex, ($event.target as HTMLTextAreaElement).value)"
                rows="2"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition resize-none"
                placeholder="Введите промпт для генерации изображения..."
              ></textarea>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Отредактируйте промпты для лучшего результата генерации изображений
          </p>
          <!-- Управление генерацией изображений для блока -->
          <div class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-gray-700">Сгенерировать изображения</div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">по умолчанию 5 шт.</span>
                <button
                  @click="generateBlockImages(index)"
                  :disabled="isBlockGenerating[index]"
                  :class="[
                    'px-3 py-1 text-xs rounded font-medium transition',
                    isBlockGenerating[index]
                      ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  ]"
                >
                  <span v-if="isBlockGenerating[index]">
                    <div class="inline-block w-3 h-3 border border-yellow-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                    {{ blockProgress[index] ?? 0 }}%
                  </span>
                  <span v-else>
                    🎨 Сгенерировать 5
                  </span>
                </button>
              </div>
            </div>
            <div v-if="blockErrors[index]" class="text-xs text-red-600 mt-2">{{ blockErrors[index] }}</div>
          </div>
        </div>

        <!-- Сгенерированные изображения -->
        <div v-if="block.images && block.images.length > 0" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🖼️ Сгенерированные изображения
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div 
              v-for="(image, imgIndex) in block.images" 
              :key="imgIndex"
              class="relative aspect-[9/16] rounded-lg overflow-hidden border-2 border-gray-200 group"
            >
              <img 
                :src="getImageUrl(image)" 
                alt="Generated image" 
                class="w-full h-full object-cover" 
                @error="onImgError($event)"
                @load="onImgLoad($event)"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <button
                  @click="removeImage(index, imgIndex)"
                  class="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
              <div class="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                {{ getImageDuration(block) }}с
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Каждое изображение показывается {{ getImageDuration(block) }}с в видео
          </p>
        </div>

        <!-- Настройки аудио для блока -->
        <div class="mb-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
          <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            🎤 Тип аудио для блока
          </h4>
          
          <!-- Выбор типа аудио -->
          <div class="mb-4">
            <select
              :value="block.audioType ?? 'ai'"
              @change="handleBlockChange(index, 'audioType', ($event.target as HTMLSelectElement).value)"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white font-medium"
            >
              <option value="ai">🤖 Озвучка с помощью ИИ</option>
              <option value="user">🎙️ Моя запись</option>
            </select>
          </div>

          <!-- Интерфейс для ИИ озвучки -->
          <div v-if="(block.audioType ?? 'ai') === 'ai'" class="space-y-3">
            <div class="text-sm text-gray-600 bg-white p-3 rounded-lg border border-purple-200">
              <p class="font-medium mb-1">💡 Озвучка с помощью ИИ</p>
              <p class="text-xs text-gray-500">
                Текст в поле "Текст для озвучки" будет автоматически озвучен выбранным голосом ИИ при генерации видео.
              </p>
            </div>
            <div v-if="block.audioUrl" class="flex items-center gap-2 p-2 bg-white rounded-lg">
              <audio :src="getAudioUrl(block.audioUrl)" controls class="flex-1 h-8"></audio>
            </div>
          </div>

          <!-- Интерфейс для пользовательской записи -->
          <div v-else class="space-y-3">
            <div class="text-sm text-gray-600 bg-white p-3 rounded-lg border border-purple-200">
              <p class="font-medium mb-1">🎙️ Запись или загрузка аудио</p>
              <p class="text-xs text-gray-500">
                Вы можете записать свой голос или загрузить аудио файл (MP3, WAV, M4A, OGG, WEBM).
              </p>
            </div>

            <!-- Запись аудио -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <!-- Предупреждение о недоступности записи -->
              <div v-if="!recordingAvailable" class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800 font-medium flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ recordingAvailabilityError }}
                </p>
              </div>
              
              <div class="flex items-center gap-3 mb-3">
                <button
                  @click="toggleRecording(index)"
                  :disabled="recordingState[index] === 'recording' || !recordingAvailable"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition',
                    !recordingAvailable
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : recordingState[index] === 'recording'
                      ? 'bg-red-500 text-white cursor-not-allowed'
                      : recordingState[index] === 'paused'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  ]"
                >
                  <svg v-if="recordingState[index] === 'recording'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 9a1 1 0 10-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ getRecordingButtonText(index) }}</span>
                </button>
                
                <button
                  v-if="recordingState[index] === 'recording'"
                  @click="stopRecording(index)"
                  class="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 9a1 1 0 10-2 0v2a1 1 0 102 0V9z" clip-rule="evenodd" />
                  </svg>
                  Остановить
                </button>
              </div>

              <div v-if="recordingState[index] === 'recording'" class="text-sm text-gray-600 flex items-center gap-2">
                <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Запись: {{ formatTime(recordingTime[index] || 0) }}</span>
              </div>

              <div v-if="recordedAudio[index]" class="mt-3">
                <p class="text-xs text-gray-600 mb-2">Предпросмотр записи:</p>
                <audio 
                  :src="recordedAudio[index]" 
                  controls 
                  class="w-full h-8"
                  @error="(e) => handleAudioPreviewError(e, index)"
                  @loadedmetadata="() => console.log('✅ Audio metadata loaded for block', index)"
                  @canplay="() => console.log('✅ Audio can play for block', index)"
                  preload="metadata"
                ></audio>
                <button
                  @click="saveRecording(index)"
                  class="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
                >
                  ✅ Сохранить запись
                </button>
                <button
                  @click="discardRecording(index)"
                  class="mt-2 ml-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                >
                  ❌ Отменить
                </button>
              </div>
            </div>

            <!-- Загрузка аудио файла -->
            <div class="bg-white p-4 rounded-lg border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📁 Загрузить аудио файл
              </label>
              <label class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition bg-gray-50">
                <input
                  type="file"
                  accept="audio/*"
                  class="hidden"
                  @change="(e) => handleAudioUpload(e, index)"
                />
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span class="text-sm text-gray-700 font-medium">Выбрать файл</span>
              </label>
              <p class="text-xs text-gray-500 mt-2">
                Поддерживаемые форматы: MP3, WAV, M4A, OGG, WEBM
              </p>
            </div>

            <!-- Загруженное аудио -->
            <div v-if="block.uploadedAudioUrl" class="bg-white p-3 rounded-lg border border-green-200">
              <p class="text-xs text-gray-600 mb-2 font-medium">✅ Загруженное аудио:</p>
              <audio :src="getAudioUrl(block.uploadedAudioUrl)" controls class="w-full h-8"></audio>
              <button
                @click="removeUploadedAudio(index)"
                class="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>

        <!-- Загрузка собственных изображений -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            📁 Добавить свои изображения
          </label>
          <div class="flex flex-wrap gap-3">
            <label class="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="(e) => handleImageUpload(e, index)"
              />
              <svg class="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span class="text-xs text-gray-500">Добавить</span>
            </label>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Загрузите свои изображения для замены сгенерированных
          </p>
        </div>
      </div>
    </div>

    <!-- Настройки аудио -->
    <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
        </svg>
        Настройки аудио
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Выбор голоса -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎙️ Голос для озвучки
          </label>
          <select
            :value="audioSettings.voice"
            @change="handleAudioChange('voice', ($event.target as HTMLSelectElement).value)"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
          >
            <option value="alloy">Alloy (нейтральный)</option>
            <option value="echo">Echo (мужской)</option>
            <option value="fable">Fable (женский)</option>
            <option value="onyx">Onyx (глубокий мужской)</option>
            <option value="nova">Nova (женский, по умолчанию)</option>
            <option value="shimmer">Shimmer (мягкий женский)</option>
          </select>
        </div>

        <!-- Громкость голоса -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎤 Громкость голоса: {{ audioSettings.voiceVolume }}%
          </label>
          <input
            :value="audioSettings.voiceVolume"
            @input="handleAudioChange('voiceVolume', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="0"
            max="100"
            class="w-full"
          />
        </div>

        <!-- Громкость музыки -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎵 Громкость музыки: {{ audioSettings.musicVolume }}%
          </label>
          <input
            :value="audioSettings.musicVolume"
            @input="handleAudioChange('musicVolume', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="0"
            max="100"
            class="w-full"
          />
        </div>

        <!-- Скорость речи -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            ⚡ Скорость речи: {{ audioSettings.voiceSpeed }}x
          </label>
          <input
            :value="audioSettings.voiceSpeed"
            @input="handleAudioChange('voiceSpeed', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Фоновая музыка -->
    <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
        </svg>
        Фоновая музыка (опционально)
      </h3>

      <div v-if="backgroundMusic" class="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-blue-200 mb-3">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
          </svg>
          <span class="text-sm text-gray-700">Музыка загружена</span>
        </div>
        <button
          @click="backgroundMusic = ''"
          class="text-red-500 hover:text-red-600 transition"
        >
          Удалить
        </button>
      </div>

      <label class="block w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition">
        <input
          type="file"
          accept="audio/*"
          class="hidden"
          @change="handleMusicUpload"
        />
        <svg class="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <p class="text-sm text-gray-600">Загрузить музыку (MP3, WAV)</p>
      </label>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="uploading" class="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm text-blue-700 font-medium">Загрузка файлов...</p>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex gap-4">
      <button
        @click="$emit('save', { blocks, audioSettings, backgroundMusic })"
        :disabled="uploading"
        class="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        💾 Сохранить изменения
      </button>
      <button
        @click="$emit('generate-video', { blocks, audioSettings, backgroundMusic })"
        :disabled="!canGenerateVideo || uploading"
        class="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🎬 Сгенерировать видео
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface VideoBlock {
  id: string
  text: string
  displayText: string
  duration: number
  images: string[]
  imagePrompts?: string[]
  imageAnimation?: string
  transition?: string
  scrollingText?: boolean
  audioUrl?: string
  audioType?: 'ai' | 'user'
  uploadedAudioUrl?: string
  order: number
  imageGenerationStatus?: 'pending' | 'generating' | 'completed' | 'failed'
  imageGenerationProgress?: number
  imageGenerationError?: string
  textFontSize?: number
  textPosition?: string
  textFont?: string
}

interface AudioSettings {
  voiceVolume: number
  musicVolume: number
  voiceSpeed: number
  voice?: string
}

interface Props {
  initialBlocks?: VideoBlock[]
  initialAudioSettings?: AudioSettings
  initialBackgroundMusic?: string
  reelId?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  initialBlocks: () => [],
  initialAudioSettings: () => ({
    voiceVolume: 80,
    musicVolume: 30,
    voiceSpeed: 1.0,
    voice: 'nova'
  }),
  initialBackgroundMusic: ''
})

const emit = defineEmits(['back', 'save', 'generate-video'])

const config = useRuntimeConfig()
const token = useCookie('bearer-token')

// Инициализируем блоки с дефолтными значениями для новых полей
const blocks = ref<VideoBlock[]>(
  JSON.parse(JSON.stringify(props.initialBlocks)).map((block: VideoBlock, index: number) => {
    console.log(`🔍 Initializing block ${index}:`, block);
    return {
      ...block,
      imageAnimation: block.imageAnimation || 'zoom-in',
      transition: block.transition || 'fade',
      scrollingText: block.scrollingText ?? false,
      textFontSize: block.textFontSize ?? 50,
      textPosition: block.textPosition || 'bottom',
      textFont: block.textFont || 'Arial',
      audioType: block.audioType || 'ai'
    };
  })
)

console.log(`🔍 Total blocks initialized: ${blocks.value.length}`);
blocks.value.forEach((block, index) => {
  console.log(`🔍 Block ${index}:`, { id: block.id, text: block.text?.substring(0, 50) });
});

const audioSettings = ref<AudioSettings>(JSON.parse(JSON.stringify(props.initialAudioSettings)))
const backgroundMusic = ref(props.initialBackgroundMusic)
const uploading = ref(false)
const isBlockGenerating = ref<Record<number, boolean>>({})
const blockProgress = ref<Record<number, number>>({})
const blockErrors = ref<Record<number, string | null>>({})
const promptSaveTimeout = ref<NodeJS.Timeout | null>(null)
const blockSaveTimeout = ref<NodeJS.Timeout | null>(null)
const audioSaveTimeout = ref<NodeJS.Timeout | null>(null)

// Состояние записи аудио для каждого блока
const recordingState = ref<Record<number, 'idle' | 'recording' | 'paused'>>({})
const recordedAudio = ref<Record<number, string>>({})
const recordedAudioBlob = ref<Record<number, Blob | null>>({}) // Сохраняем blob для отправки на сервер
const recordingTime = ref<Record<number, number>>({})
const mediaRecorders = ref<Record<number, MediaRecorder | null>>({})
const recordingIntervals = ref<Record<number, NodeJS.Timeout | null>>({})
const recordingChunks = ref<Record<number, Blob[]>>({}) // Сохраняем chunks для каждого блока

const canGenerateVideo = computed(() => {
  return blocks.value.every(block => 
    block.text.trim().length > 0 && 
    block.displayText.trim().length > 0
  )
})

// Функция для проверки доступности записи
function checkRecordingAvailability(): { available: boolean; error?: string } {
  // Проверяем доступность API
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      available: false,
      error: 'Ваш браузер не поддерживает запись аудио. Пожалуйста, обновите браузер.'
    }
  }

  // Проверяем протокол (HTTPS обязателен, кроме localhost)
  const isSecureContext = window.isSecureContext || 
    location.protocol === 'https:' || 
    location.hostname === 'localhost' || 
    location.hostname === '127.0.0.1'

  if (!isSecureContext) {
    return {
      available: false,
      error: 'Для записи аудио требуется HTTPS подключение. Пожалуйста, используйте HTTPS для доступа к сайту.'
    }
  }

  return { available: true }
}

// Функция для определения поддерживаемого MIME типа
function getSupportedMimeType(): string | null {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav'
  ]

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      console.log(`✅ Supported MIME type: ${type}`)
      return type
    }
  }

  console.warn('⚠️ No supported MIME type found, using default')
  return null // Браузер выберет подходящий тип
}

// Проверяем доступность записи при загрузке компонента
const recordingAvailable = computed(() => {
  return checkRecordingAvailability().available
})

const recordingAvailabilityError = computed(() => {
  return checkRecordingAvailability().error
})

// Вычисляемое свойство для расчета продолжительности каждой фотографии
const getImageDuration = (block: VideoBlock) => {
  if (!block.images || block.images.length === 0) return 0
  return Math.round((block.duration / block.images.length) * 10) / 10 // Округляем до 1 знака после запятой
}

// Функция для получения полного URL изображения
function getImageUrl(imagePath: string): string {
  // Если путь уже начинается с http/https, возвращаем как есть (blob URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath
  }
  // Иначе добавляем базовый URL
  return `${config.public.apiBase}${imagePath}`
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iMTEyIiB2aWV3Qm94PSIwIDAgNjQgMTEyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSIzMiIgeT0iNTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OiDwvdGV4dD48L3N2Zz4='
}

function onImgLoad(e: Event) {
  const el = e.target as HTMLImageElement
  console.log('✅ Image loaded successfully:', el.src)
}

// Функция для получения полного URL музыки
function getMusicUrl(musicPath: string): string {
  if (musicPath.startsWith('http://') || musicPath.startsWith('https://') || musicPath.startsWith('blob:')) {
    return musicPath
  }
  return `${config.public.apiBase}${musicPath}`
}

async function handleImageUpload(event: Event, blockIndex: number) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  uploading.value = true

  try {
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('images', file)
    })

    const response = await fetch(`${config.public.apiBase}/api/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      // Сохраняем только относительные пути, без домена
      blocks.value[blockIndex].images.push(...data.imageUrls)
    } else {
      console.error('Failed to upload images')
      alert('Не удалось загрузить изображения')
    }
  } catch (error) {
    console.error('Error uploading images:', error)
    alert('Ошибка при загрузке изображений')
  } finally {
    uploading.value = false
  }
}

function removeImage(blockIndex: number, imageIndex: number) {
  blocks.value[blockIndex].images.splice(imageIndex, 1)
}


// Генерация 5 изображений для блока с прямым вызовом backend
async function generateBlockImages(blockIndex: number) {
  if (!props.reelId && !(blocks.value as any)._id) {
    alert('Не удалось определить идентификатор рилса')
    return
  }
  if (isBlockGenerating.value[blockIndex]) return // защита от повторного запуска
  isBlockGenerating.value[blockIndex] = true
  blockErrors.value[blockIndex] = null
  blockProgress.value[blockIndex] = 0

  try {
    const reelId = String(props.reelId || (blocks.value as any)._id)
    const res = await fetch(`${config.public.apiBase}/api/reels/${reelId}/blocks/${blockIndex}/generate-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageCount: 5 })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Не удалось запустить генерацию изображений')
    }
    // Пулинг прогресса
    await pollBlockProgress(reelId, blockIndex)
  } catch (e: any) {
    blockErrors.value[blockIndex] = e?.message || 'Ошибка генерации'
  } finally {
    isBlockGenerating.value[blockIndex] = false
  }
}

async function pollBlockProgress(reelId: string, blockIndex: number) {
  const pollOnce = async () => {
    const res = await fetch(`${config.public.apiBase}/api/reels/${reelId}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    if (!res.ok) return
    const reel = await res.json()
    const block = reel.blocks?.[blockIndex]
    if (!block) return
    blockProgress.value[blockIndex] = block.imageGenerationProgress || 0
    blocks.value[blockIndex].images = block.images || []
    if (block.imageGenerationStatus === 'completed' || block.imageGenerationStatus === 'failed') {
      if (block.imageGenerationStatus === 'failed') {
        blockErrors.value[blockIndex] = block.imageGenerationError || 'Ошибка генерации'
      }
      return true
    }
    return false
  }

  // первый опрос сразу
  let done = await pollOnce()
  if (done) return
  // далее каждые 2 секунды до завершения
  await new Promise<void>((resolve) => {
    const iv = setInterval(async () => {
      const finished = await pollOnce()
      if (finished) {
        clearInterval(iv)
        resolve()
      }
    }, 2000)
  })
}

async function handleMusicUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('audio', file)

    const response = await fetch(`${config.public.apiBase}/api/upload/audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      // Сохраняем только относительный путь, без домена
      backgroundMusic.value = data.audioUrl
    } else {
      console.error('Failed to upload audio')
      alert('Не удалось загрузить аудио')
    }
  } catch (error) {
    console.error('Error uploading audio:', error)
    alert('Ошибка при загрузке аудио')
  } finally {
    uploading.value = false
  }
}

// Функция для получения полного URL аудио
function getAudioUrl(audioPath: string): string {
  if (audioPath.startsWith('http://') || audioPath.startsWith('https://') || audioPath.startsWith('blob:')) {
    return audioPath
  }
  return `${config.public.apiBase}${audioPath}`
}

// Функции для записи аудио
async function toggleRecording(blockIndex: number) {
  if (recordingState.value[blockIndex] === 'recording') {
    return // Уже записывается
  }

  // Проверяем доступность записи
  const availability = checkRecordingAvailability()
  if (!availability.available) {
    alert(availability.error || 'Запись недоступна')
    return
  }

  try {
    console.log('🎤 Requesting microphone access...')
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    })
    console.log('✅ Microphone access granted')

    const mimeType = getSupportedMimeType()
    const options = mimeType ? { mimeType } : undefined
    
    console.log(`🎙️ Creating MediaRecorder with options:`, options)
    
    // Инициализируем chunks для этого блока
    recordingChunks.value[blockIndex] = []
    
    const mediaRecorder = new MediaRecorder(stream, options)

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        console.log(`📦 Audio chunk received: ${e.data.size} bytes, type: ${e.data.type}`)
        // Убеждаемся, что массив chunks существует
        if (!recordingChunks.value[blockIndex]) {
          recordingChunks.value[blockIndex] = []
        }
        recordingChunks.value[blockIndex].push(e.data)
      } else {
        console.warn('⚠️ Empty or invalid chunk received')
      }
    }

    mediaRecorder.onstop = () => {
      console.log(`🛑 Recording stopped. Total chunks: ${recordingChunks.value[blockIndex].length}`)
      
      // Небольшая задержка, чтобы убедиться, что все данные записаны
      setTimeout(() => {
        if (recordingChunks.value[blockIndex].length === 0) {
          console.error('❌ No audio chunks recorded!')
          alert('Ошибка: не удалось записать аудио. Попробуйте еще раз.')
          recordingState.value[blockIndex] = 'idle'
          stream.getTracks().forEach(track => track.stop())
          return
        }
        
        // Определяем MIME тип из первого chunk или используем дефолтный
        let detectedMimeType = recordingChunks.value[blockIndex][0]?.type || mimeType || 'audio/webm'
        
        // Убеждаемся, что MIME тип валидный
        if (!detectedMimeType || detectedMimeType === '') {
          detectedMimeType = 'audio/webm;codecs=opus'
        }
        
        // Если тип содержит только 'webm' без codecs, добавляем codecs
        if (detectedMimeType === 'audio/webm') {
          detectedMimeType = 'audio/webm;codecs=opus'
        }
        
        console.log(`📦 Using MIME type: ${detectedMimeType}`)
        
        // Создаем blob из всех chunks
        const blob = new Blob(recordingChunks.value[blockIndex], { type: detectedMimeType })
        console.log(`📦 Created blob: ${blob.size} bytes, type: ${blob.type}`)
        
        if (blob.size === 0) {
          console.error('❌ Created blob is empty!')
          alert('Ошибка: записанный файл пуст. Попробуйте еще раз.')
          recordingState.value[blockIndex] = 'idle'
          stream.getTracks().forEach(track => track.stop())
          return
        }
        
        // Сохраняем blob для последующей отправки
        recordedAudioBlob.value[blockIndex] = blob
        
        // Освобождаем старый URL, если есть
        if (recordedAudio.value[blockIndex]) {
          URL.revokeObjectURL(recordedAudio.value[blockIndex])
        }
        
        // Создаем новый URL для предпросмотра
        const url = URL.createObjectURL(blob)
        recordedAudio.value[blockIndex] = url
        console.log('✅ Created blob URL for preview:', url)
        
        // Проверяем, что audio может быть воспроизведен
        const testAudio = new Audio(url)
        testAudio.oncanplay = () => {
          console.log('✅ Audio can be played, duration:', testAudio.duration)
        }
        testAudio.onerror = (e) => {
          console.error('❌ Audio preview error:', e)
        }
        
        recordingState.value[blockIndex] = 'idle'
        
        stream.getTracks().forEach(track => {
          track.stop()
          console.log('🔇 Media track stopped')
        })
        
        console.log('✅ Recording completed successfully')
      }, 100) // Небольшая задержка для завершения записи
    }

    mediaRecorder.onerror = (event: any) => {
      console.error('❌ MediaRecorder error:', event.error)
      const errorMsg = event.error?.message || 'Неизвестная ошибка'
      alert(`Ошибка записи: ${errorMsg}`)
      recordingState.value[blockIndex] = 'idle'
      stream.getTracks().forEach(track => track.stop())
      
      // Очищаем интервал, если он был запущен
      if (recordingIntervals.value[blockIndex]) {
        clearInterval(recordingIntervals.value[blockIndex]!)
        recordingIntervals.value[blockIndex] = null
      }
    }

    mediaRecorder.onstart = () => {
      console.log('✅ MediaRecorder started successfully')
    }

    console.log('▶️ Starting MediaRecorder...')
    
    // Проверяем состояние MediaRecorder перед стартом
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start(1000) // Собираем данные каждую секунду
      mediaRecorders.value[blockIndex] = mediaRecorder
      recordingState.value[blockIndex] = 'recording'
      recordingTime.value[blockIndex] = 0

      // Запускаем таймер
      recordingIntervals.value[blockIndex] = setInterval(() => {
        if (recordingState.value[blockIndex] === 'recording') {
          recordingTime.value[blockIndex] = (recordingTime.value[blockIndex] || 0) + 1
        }
      }, 1000)

      console.log('✅ Recording started successfully, state:', mediaRecorder.state)
    } else {
      console.warn('⚠️ MediaRecorder is not in inactive state:', mediaRecorder.state)
    }
  } catch (error: any) {
    console.error('❌ Error starting recording:', error)
    
    let errorMessage = 'Не удалось начать запись. '
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      errorMessage += 'Разрешение на доступ к микрофону было отклонено. Пожалуйста, разрешите доступ к микрофону в настройках браузера.'
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      errorMessage += 'Микрофон не найден. Убедитесь, что микрофон подключен.'
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      errorMessage += 'Микрофон уже используется другим приложением.'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage += 'Микрофон не поддерживает требуемые параметры.'
    } else if (error.name === 'SecurityError') {
      errorMessage += 'Для записи аудио требуется HTTPS подключение. Пожалуйста, используйте HTTPS для доступа к сайту.'
    } else {
      errorMessage += `Ошибка: ${error.message || 'Неизвестная ошибка'}`
    }
    
    alert(errorMessage)
    recordingState.value[blockIndex] = 'idle'
  }
}

function stopRecording(blockIndex: number) {
  const recorder = mediaRecorders.value[blockIndex]
  if (recorder && recordingState.value[blockIndex] === 'recording') {
    console.log('🛑 Stopping recording...', 'State:', recorder.state)
    
    // Останавливаем таймер
    if (recordingIntervals.value[blockIndex]) {
      clearInterval(recordingIntervals.value[blockIndex]!)
      recordingIntervals.value[blockIndex] = null
    }
    
    // Останавливаем запись
    if (recorder.state === 'recording' || recorder.state === 'paused') {
      recorder.stop()
      console.log('✅ Recorder stop() called, final state:', recorder.state)
    } else {
      console.warn('⚠️ Recorder is not in recording/paused state:', recorder.state)
    }
  }
}

function getRecordingButtonText(blockIndex: number): string {
  const state = recordingState.value[blockIndex] || 'idle'
  switch (state) {
    case 'recording':
      return 'Запись...'
    case 'paused':
      return 'Продолжить'
    default:
      return 'Начать запись'
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Обработка ошибок предпросмотра аудио
function handleAudioPreviewError(event: Event, blockIndex: number) {
  const audioElement = event.target as HTMLAudioElement
  console.error('❌ Audio preview error for block', blockIndex, ':', {
    error: audioElement.error,
    code: audioElement.error?.code,
    message: audioElement.error?.message,
    src: audioElement.src
  })
  
  // Пытаемся использовать blob напрямую, если URL не работает
  if (recordedAudioBlob.value[blockIndex]) {
    console.log('🔄 Trying to recreate blob URL...')
    if (recordedAudio.value[blockIndex]) {
      URL.revokeObjectURL(recordedAudio.value[blockIndex])
    }
    const newUrl = URL.createObjectURL(recordedAudioBlob.value[blockIndex]!)
    recordedAudio.value[blockIndex] = newUrl
    console.log('✅ Recreated blob URL:', newUrl)
  } else {
  }
}

async function saveRecording(blockIndex: number) {
  console.log('💾 Starting save recording for block', blockIndex)
  
  // Проверяем наличие blob
  if (!recordedAudioBlob.value[blockIndex] && !recordedAudio.value[blockIndex]) {
    alert('Нет записи для сохранения')
    return
  }

  try {
    let audioBlob: Blob
    
    // Используем сохраненный blob, если есть, иначе получаем из URL
    if (recordedAudioBlob.value[blockIndex]) {
      audioBlob = recordedAudioBlob.value[blockIndex]!
      console.log('✅ Using saved blob:', audioBlob.size, 'bytes, type:', audioBlob.type)
    } else {
      console.log('⚠️ Blob not found, fetching from URL...')
      const response = await fetch(recordedAudio.value[blockIndex])
      if (!response.ok) {
        throw new Error(`Failed to fetch audio blob: ${response.status} ${response.statusText}`)
      }
      audioBlob = await response.blob()
      console.log('✅ Fetched blob:', audioBlob.size, 'bytes, type:', audioBlob.type)
    }
    
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Записанный файл пуст')
    }

    // Определяем расширение файла из MIME типа
    let fileExtension = 'webm'
    if (audioBlob.type.includes('ogg')) {
      fileExtension = 'ogg'
    } else if (audioBlob.type.includes('mp4')) {
      fileExtension = 'm4a'
    } else if (audioBlob.type.includes('wav')) {
      fileExtension = 'wav'
    }
    
    const fileName = `recording.${fileExtension}`
    console.log('📤 Uploading file:', fileName, 'Size:', audioBlob.size, 'Type:', audioBlob.type)
    
    const formData = new FormData()
    formData.append('audio', audioBlob, fileName)

    if (!props.reelId) {
      alert('Не удалось определить идентификатор рилса')
      return
    }

    uploading.value = true
    
    const uploadUrl = `${config.public.apiBase}/api/reels/${props.reelId}/blocks/${blockIndex}/upload-audio`
    console.log('📡 Uploading to:', uploadUrl)
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
        // НЕ добавляем Content-Type - браузер установит его автоматически с boundary для FormData
      },
      body: formData
    })

    console.log('📡 Response status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Upload successful:', data)
      
      blocks.value[blockIndex].uploadedAudioUrl = data.audioUrl
      blocks.value[blockIndex].audioType = 'user'
      
      // Очищаем временные данные
      if (recordedAudio.value[blockIndex]) {
        URL.revokeObjectURL(recordedAudio.value[blockIndex])
      }
      recordedAudio.value[blockIndex] = ''
      recordedAudioBlob.value[blockIndex] = null
      recordingChunks.value[blockIndex] = []
      recordingState.value[blockIndex] = 'idle'
      
      // Сохраняем изменения блока
      await handleBlockChange(blockIndex, 'uploadedAudioUrl', data.audioUrl)
      await handleBlockChange(blockIndex, 'audioType', 'user')
      
      alert('Запись успешно сохранена!')
    } else {
      const errorText = await response.text()
      console.error('❌ Upload failed:', response.status, errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || 'Неизвестная ошибка сервера' }
      }
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('❌ Error saving recording:', error)
    let errorMessage = 'Ошибка при сохранении записи: '
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage += 'Не удалось подключиться к серверу. Проверьте интернет-соединение.'
    } else if (error.message) {
      errorMessage += error.message
    } else {
      errorMessage += 'Неизвестная ошибка'
    }
    
    alert(errorMessage)
  } finally {
    uploading.value = false
  }
}

function discardRecording(blockIndex: number) {
  // Останавливаем запись, если она идет
  if (recordingState.value[blockIndex] === 'recording') {
    stopRecording(blockIndex)
  }
  
  // Освобождаем ресурсы
  if (recordedAudio.value[blockIndex]) {
    URL.revokeObjectURL(recordedAudio.value[blockIndex])
    recordedAudio.value[blockIndex] = ''
  }
  
  // Очищаем данные
  recordedAudioBlob.value[blockIndex] = null
  recordingChunks.value[blockIndex] = []
  recordingState.value[blockIndex] = 'idle'
  recordingTime.value[blockIndex] = 0
  
  // Очищаем интервал
  if (recordingIntervals.value[blockIndex]) {
    clearInterval(recordingIntervals.value[blockIndex]!)
    recordingIntervals.value[blockIndex] = null
  }
  
  // Останавливаем медиа-рекордер
  if (mediaRecorders.value[blockIndex]) {
    const recorder = mediaRecorders.value[blockIndex]
    if (recorder.state === 'recording' || recorder.state === 'paused') {
      recorder.stop()
    }
    mediaRecorders.value[blockIndex] = null
  }
}

// Загрузка аудио файла для блока
async function handleAudioUpload(event: Event, blockIndex: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (!props.reelId) {
    alert('Не удалось определить идентификатор рилса')
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('audio', file)

    const response = await fetch(`${config.public.apiBase}/api/reels/${props.reelId}/blocks/${blockIndex}/upload-audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: formData
    })

    if (response.ok) {
      const data = await response.json()
      blocks.value[blockIndex].uploadedAudioUrl = data.audioUrl
      blocks.value[blockIndex].audioType = 'user'
      
      // Сохраняем изменения блока
      await handleBlockChange(blockIndex, 'uploadedAudioUrl', data.audioUrl)
      await handleBlockChange(blockIndex, 'audioType', 'user')
      
      alert('Аудио файл успешно загружен!')
    } else {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || 'Не удалось загрузить аудио')
    }
  } catch (error: any) {
    console.error('Error uploading audio:', error)
    alert(`Ошибка при загрузке аудио: ${error.message}`)
  } finally {
    uploading.value = false
    // Очищаем input
    ;(event.target as HTMLInputElement).value = ''
  }
}

function removeUploadedAudio(blockIndex: number) {
  blocks.value[blockIndex].uploadedAudioUrl = undefined
  blocks.value[blockIndex].audioType = 'ai'
  handleBlockChange(blockIndex, 'uploadedAudioUrl', undefined)
  handleBlockChange(blockIndex, 'audioType', 'ai')
}

// Сохранение промптов блока
async function saveBlockPrompts(reelId: string, blockIndex: number, imagePrompts: string[]) {
  try {
    const response = await fetch(`${config.public.apiBase}/api/reels/${reelId}/blocks/${blockIndex}/prompts`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imagePrompts })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Prompts saved for block ${blockIndex}:`, result)
      return true
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('Failed to save prompts:', errorData.error)
      return false
    }
  } catch (error) {
    console.error('Error saving prompts:', error)
    return false
  }
}

// Обработчик изменения промптов с автосохранением
async function handlePromptChange(blockIndex: number, promptIndex: number, newValue: string) {
  // Обновляем локальное состояние
  blocks.value[blockIndex].imagePrompts![promptIndex] = newValue
  
  // Сохраняем в БД с задержкой (debounce)
  if (promptSaveTimeout.value) {
    clearTimeout(promptSaveTimeout.value)
  }
  
  promptSaveTimeout.value = setTimeout(async () => {
    if (props.reelId) {
      const success = await saveBlockPrompts(String(props.reelId), blockIndex, blocks.value[blockIndex].imagePrompts!)
      if (!success) {
        console.warn('Failed to save prompts, will retry on next change')
      }
    }
  }, 1000) // Сохраняем через 1 секунду после последнего изменения
}

// Универсальная функция сохранения блока
async function saveBlock(reelId: string, blockIndex: number, blockData: any) {
  try {
    console.log(`🔍 saveBlock called with reelId: ${reelId}, blockIndex: ${blockIndex}, blockData:`, blockData);
    
    if (!reelId || reelId === 'undefined') {
      console.error('❌ Invalid reelId:', reelId);
      return false;
    }
    
    console.log(`📡 Sending request to: ${config.public.apiBase}/api/reels/${reelId}/blocks/${blockIndex}`);
    
    const response = await fetch(`${config.public.apiBase}/api/reels/${reelId}/blocks/${blockIndex}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ blockData })
    })
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ Block ${blockIndex} saved:`, result.updatedFields)
      return true
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('Failed to save block:', errorData.error)
      return false
    }
  } catch (error) {
    console.error('Error saving block:', error)
    return false
  }
}

// Обработчик изменения блока с автосохранением
async function handleBlockChange(blockIndex: number, field: string, value: any) {
  console.log(`🔍 handleBlockChange called with blockIndex: ${blockIndex}, field: ${field}, value:`, value);
  console.log(`🔍 props.reelId: ${props.reelId}`);
  console.log(`🔍 Total blocks: ${blocks.value.length}`);
  console.log(`🔍 Block at index ${blockIndex}:`, blocks.value[blockIndex]);
  
  // Обновляем локальное состояние
  ;(blocks.value[blockIndex] as any)[field] = value
  
  // Сохраняем в БД с задержкой (debounce)
  if (blockSaveTimeout.value) {
    clearTimeout(blockSaveTimeout.value)
  }
  
  blockSaveTimeout.value = setTimeout(async () => {
    if (props.reelId && props.reelId !== 'undefined') {
      const blockData = { [field]: value }
      console.log(`🔄 Saving block ${blockIndex} with data:`, blockData);
      const success = await saveBlock(String(props.reelId), blockIndex, blockData)
      if (!success) {
        console.warn('Failed to save block change, will retry on next change')
      }
    } else {
      console.warn('❌ Cannot save block change: reelId is invalid:', props.reelId)
    }
  }, 1000) // Сохраняем через 1 секунду после последнего изменения
}

// Обработчик изменения настроек аудио с автосохранением
async function handleAudioChange(field: string, value: any) {
  // Обновляем локальное состояние
  ;(audioSettings.value as any)[field] = value
  
  // Сохраняем в БД с задержкой (debounce)
  if (audioSaveTimeout.value) {
    clearTimeout(audioSaveTimeout.value)
  }
  
  audioSaveTimeout.value = setTimeout(async () => {
    // Эмитим событие для родительского компонента
    emit('save', { 
      blocks: blocks.value, 
      audioSettings: audioSettings.value, 
      backgroundMusic: backgroundMusic.value 
    })
  }, 1000) // Сохраняем через 1 секунду после последнего изменения
}
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #8b5cf6 0%, #8b5cf6 var(--value), #e5e7eb var(--value), #e5e7eb 100%);
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}
</style>

