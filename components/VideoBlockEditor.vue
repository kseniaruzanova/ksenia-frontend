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
          </div>
        </div>

        <!-- Текст для озвучки -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎙️ Текст для озвучки
          </label>
          <textarea
            v-model="block.text"
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
            v-model="block.displayText"
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
            v-model.number="block.duration"
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
            v-model="block.imageAnimation"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
          >
            <option value="zoom-in">🔍 Приближение (Zoom In)</option>
            <option value="zoom-out">🔎 Отдаление (Zoom Out)</option>
            <option value="pan-left">← Движение влево</option>
            <option value="pan-right">→ Движение вправо</option>
            <option value="none">⏹️ Без анимации</option>
          </select>
        </div>

        <!-- Переход к следующему блоку -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎞️ Переход к следующему блоку
          </label>
          <select
            v-model="block.transition"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all bg-white"
          >
            <option value="fade">🌅 Плавное затухание (Fade)</option>
            <option value="dissolve">💫 Растворение (Dissolve)</option>
            <option value="wipe">📱 Смахивание (Wipe)</option>
            <option value="none">⏹️ Без перехода</option>
          </select>
        </div>

        <!-- Бегущий текст -->
        <div class="mb-4">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="block.scrollingText"
              type="checkbox"
              class="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-4 focus:ring-purple-100 transition"
            />
            <span class="ml-3 text-sm font-semibold text-gray-700">
              📜 Бегущий текст (анимация текста справа налево)
            </span>
          </label>
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
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">{{ prompt }}</p>
                </div>
                <button
                  @click="regenerateImage(index, promptIndex)"
                  :disabled="regeneratingImages"
                  class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition disabled:opacity-50"
                >
                  {{ regeneratingImages ? '⏳' : '🔄' }}
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            ИИ сгенерировал эти промпты для создания изображений
          </p>
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
              <img :src="getImageUrl(image)" alt="Generated image" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <button
                  @click="removeImage(index, imgIndex)"
                  class="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
              <div class="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                {{ (imgIndex + 1) * 2 }}с
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Каждое изображение показывается 2 секунды в видео
          </p>
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Громкость голоса -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            🎤 Громкость голоса: {{ audioSettings.voiceVolume }}%
          </label>
          <input
            v-model.number="audioSettings.voiceVolume"
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
            v-model.number="audioSettings.musicVolume"
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
            v-model.number="audioSettings.voiceSpeed"
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
  order: number
}

interface AudioSettings {
  voiceVolume: number
  musicVolume: number
  voiceSpeed: number
}

interface Props {
  initialBlocks?: VideoBlock[]
  initialAudioSettings?: AudioSettings
  initialBackgroundMusic?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialBlocks: () => [],
  initialAudioSettings: () => ({
    voiceVolume: 80,
    musicVolume: 30,
    voiceSpeed: 1.0
  }),
  initialBackgroundMusic: ''
})

defineEmits(['back', 'save', 'generate-video'])

const config = useRuntimeConfig()
const token = useCookie('bearer-token')

// Инициализируем блоки с дефолтными значениями для новых полей
const blocks = ref<VideoBlock[]>(
  JSON.parse(JSON.stringify(props.initialBlocks)).map((block: VideoBlock) => ({
    ...block,
    imageAnimation: block.imageAnimation || 'zoom-in',
    transition: block.transition || 'fade',
    scrollingText: block.scrollingText ?? false
  }))
)

const audioSettings = ref<AudioSettings>(JSON.parse(JSON.stringify(props.initialAudioSettings)))
const backgroundMusic = ref(props.initialBackgroundMusic)
const uploading = ref(false)
const regeneratingImages = ref(false)

const canGenerateVideo = computed(() => {
  return blocks.value.every(block => 
    block.text.trim().length > 0 && 
    block.displayText.trim().length > 0
  )
})

// Функция для получения полного URL изображения
function getImageUrl(imagePath: string): string {
  // Если путь уже начинается с http/https, возвращаем как есть (blob URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath
  }
  // Иначе добавляем базовый URL
  return `${config.public.apiBase}${imagePath}`
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

async function regenerateImage(blockIndex: number, promptIndex: number) {
  if (!blocks.value[blockIndex].imagePrompts?.[promptIndex]) return
  
  regeneratingImages.value = true
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/reels/regenerate-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: blocks.value[blockIndex].imagePrompts![promptIndex],
        blockIndex,
        promptIndex
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      // Заменяем изображение по индексу
      if (blocks.value[blockIndex].images[promptIndex]) {
        blocks.value[blockIndex].images[promptIndex] = data.imageUrl
      } else {
        blocks.value[blockIndex].images.push(data.imageUrl)
      }
    } else {
      console.error('Failed to regenerate image')
      alert('Не удалось перегенерировать изображение')
    }
  } catch (error) {
    console.error('Error regenerating image:', error)
    alert('Ошибка при перегенерации изображения')
  } finally {
    regeneratingImages.value = false
  }
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

