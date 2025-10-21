<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ isAdmin ? 'Управление видеоконтентом' : 'Видеобиблиотека' }}
          </h1>
          <p class="mt-4 text-lg text-gray-500">
            {{ isAdmin ? 'Добавляйте и управляйте видео материалами' : 'Просматривайте обучающие материалы' }}
          </p>
        </div>

        <!-- Кнопка добавления видео для администратора -->
        <div v-if="isAdmin" class="mb-6 flex justify-end">
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Добавить видео
          </button>
        </div>

        <!-- Модальное окно добавления/редактирования видео -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-4">
                {{ editingVideo ? 'Редактирование видео' : 'Добавление нового видео' }}
              </h2>
              
              <form @submit.prevent="saveVideo">
                <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Название видео</label>
                  <input 
                    v-model="currentVideo.title" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    required
                    placeholder="Введите название видео"
                  >
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Описание</label>
                  <textarea 
                    v-model="currentVideo.description" 
                    rows="3" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    placeholder="Добавьте описание видео"
                  ></textarea>
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Тип видео</label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="currentVideo.type" 
                        value="file" 
                        class="mr-2"
                        @change="clearSource"
                      >
                      Загрузить файл
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="currentVideo.type" 
                        value="link" 
                        class="mr-2"
                        @change="clearSource"
                      >
                      Вставить ссылку
                    </label>
                  </div>
                </div>
                
                <div class="mb-4" v-if="currentVideo.type === 'link'">
                  <label class="block text-gray-700 mb-2">Ссылка на видео</label>
                  <input 
                    v-model="currentVideo.source" 
                    type="url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    placeholder="https://example.com/video.mp4"
                    required
                  >
                </div>
                
                <div class="mb-4" v-if="currentVideo.type === 'file'">
                  <label class="block text-gray-700 mb-2">Видео файл</label>
                  <input 
                    type="file" 
                    ref="videoFile"
                    accept="video/*" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    @change="handleFileUpload"
                    :required="!editingVideo || !currentVideo.source"
                  >
                  <p class="text-sm text-gray-500 mt-1" v-if="currentVideo.source && currentVideo.type === 'file'">
                    Текущий файл: {{ currentVideo.source.split('/').pop() }}
                  </p>
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Обложка видео</label>
                  <input 
                    type="file" 
                    ref="thumbnailFile"
                    accept="image/*" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    @change="handleThumbnailUpload"
                  >
                  <p class="text-sm text-gray-500 mt-1" v-if="currentVideo.thumbnail">
                    Текущая обложка: {{ currentVideo.thumbnail.split('/').pop() }}
                  </p>
                  <div v-if="thumbnailPreview" class="mt-2">
                    <img :src="thumbnailPreview" class="h-32 object-cover rounded-md">
                  </div>
                  <div v-else-if="currentVideo.thumbnail && editingVideo" class="mt-2">
                    <img :src="`${config.public.apiBase}/api/videos/thumbnail/${currentVideo.thumbnail}`" class="h-32 object-cover rounded-md">
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    type="button" 
                    @click="closeModal"
                    class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    :disabled="saving"
                  >
                    {{ saving ? 'Сохранение...' : (editingVideo ? 'Обновить' : 'Сохранить') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Список видео -->
        <div v-if="loading" class="text-center py-12">
          <p class="text-gray-500">Загрузка видео...</p>
        </div>
        
        <div v-else-if="videos.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <p class="text-gray-500">Видео пока нет</p>
          <button 
            v-if="isAdmin" 
            @click="showAddModal = true"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Добавить первое видео
          </button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="video in videos" 
            :key="video._id" 
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Обложка видео -->
            <div class="relative">
              <img 
                :src="getThumbnailUrl(video)" 
                :alt="video.title" 
                class="w-full h-48 object-cover"
                @error="handleImageError"
              >
              <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {{ video.type === 'file' ? 'Файл' : 'Ссылка' }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <button 
                  @click="playVideo(video)"
                  class="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                >
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Информация о видео -->
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">{{ video.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ video.description }}</p>
              
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">
                  {{ formatDate(video.createdAt) }}
                </span>
                
                <!-- Кнопки управления для администратора -->
                <div v-if="isAdmin" class="flex space-x-2">
                  <button 
                    @click="editVideo(video)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Редактировать"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="deleteVideo(video._id)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Удалить"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Модальное окно просмотра видео -->
        <div v-if="showVideoModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div class="bg-black rounded-lg w-full max-w-4xl relative">
            <div class="p-4 flex justify-between items-center border-b border-gray-800">
              <h3 class="text-white text-lg font-semibold">{{ currentVideo.title }}</h3>
              <button 
                @click="closeVideoModal"
                class="text-white hover:text-gray-300"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="relative">
              <div v-if="videoLoading" class="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div class="text-white text-center">
                  <div class="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Загрузка видео...</p>
                  <p class="text-sm text-gray-400 mt-2">Если видео не загружается, попробуйте позже</p>
                </div>
              </div>
              
              <div v-if="videoError" class="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div class="text-white text-center p-4">
                  <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 class="text-xl font-bold mb-2">Ошибка загрузки видео</h4>
                  <p class="mb-4">Видео не загрузилось в течение отведенного времени.</p>
                  <button 
                    @click="retryVideoLoad"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
              
              <div v-if="currentVideo.type === 'file'" class="aspect-w-16 aspect-h-9">
                <video 
                  ref="videoPlayer"
                  :src="videoSource" 
                  controls 
                  class="w-full h-auto"
                  preload="auto"
                  @loadstart="handleVideoLoadStart"
                  @progress="handleVideoProgress"
                  @canplay="handleVideoCanPlay"
                  @error="handleVideoError"
                  @stalled="handleVideoStalled"
                ></video>
              </div>
              
              <div v-else-if="currentVideo.type === 'link'" class="aspect-w-16 aspect-h-9">
                <iframe 
                  :src="getEmbedUrl(currentVideo.source)" 
                  class="w-full h-96"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  @load="handleIframeLoad"
                ></iframe>
              </div>
            </div>
            
            <div class="p-4 text-white bg-gray-900">
              <p class="text-gray-400 mb-2">Описание:</p>
              <p>{{ currentVideo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Video {
  _id?: string
  title: string
  description: string
  type: 'file' | 'link'
  source: string
  thumbnail?: string
  createdAt?: string
}

const { isAdmin } = useAuth()
const config = useRuntimeConfig()
const token = useCookie('bearer-token')

// Состояния компонента
const showAddModal = ref(false)
const showVideoModal = ref(false)
const loading = ref(true)
const saving = ref(false)
const videos: Ref<Video[]> = ref([])
const editingVideo: Ref<Video | null> = ref(null)
const thumbnailPreview = ref('')
const videoFile = ref<HTMLInputElement | null>(null)
const thumbnailFile = ref<HTMLInputElement | null>(null)
const videoLoading = ref(false)
const videoError = ref(false)
const videoProgress = ref(0)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const videoSource = ref('')
const loadTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const iframeTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Таймаут загрузки видео (в миллисекундах)
const VIDEO_LOAD_TIMEOUT = 15000

// Текущее редактируемое видео
const currentVideo: Ref<Video> = ref({
  title: '',
  description: '',
  type: 'file',
  source: '',
  thumbnail: ''
})

// Получение URL обложки
function getThumbnailUrl(video: Video): string {
  if (video.thumbnail) {
    return `${config.public.apiBase}/api/videos/thumbnail/${video.thumbnail}`
  }
  return '/placeholder-thumbnail.jpg'
}

// Обработка ошибки загрузки изображения
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-thumbnail.jpg'
}

// Загрузка видео из API
async function loadVideos() {
  try {
    loading.value = true
    const response = await fetch(`${config.public.apiBase}/api/videos`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      videos.value = await response.json()
    } else {
      console.error('Ошибка загрузки видео')
    }
  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    loading.value = false
  }
}

// Сохранение видео
async function saveVideo() {
  try {
    saving.value = true
    
    const formData = new FormData()
    formData.append('title', currentVideo.value.title)
    formData.append('description', currentVideo.value.description)
    formData.append('type', currentVideo.value.type)
    
    // Если это ссылка, добавляем её
    if (currentVideo.value.type === 'link') {
      formData.append('source', currentVideo.value.source)
    }
    
    // Добавляем файл видео, если он выбран
    if (videoFile.value && videoFile.value.files && videoFile.value.files[0]) {
      formData.append('video', videoFile.value.files[0])
    } else if (editingVideo.value && currentVideo.value.type === 'file') {
      // При редактировании, если файл не выбран, но видео уже есть
      formData.append('source', currentVideo.value.source)
    }
    
    // Добавляем файл обложки, если он выбран
    if (thumbnailFile.value && thumbnailFile.value.files && thumbnailFile.value.files[0]) {
      formData.append('thumbnail', thumbnailFile.value.files[0])
    } else if (editingVideo.value && currentVideo.value.thumbnail) {
      // При редактировании, если файл не выбран, но обложка уже есть
      formData.append('thumbnailPath', currentVideo.value.thumbnail)
    }
    
    const url = editingVideo.value 
      ? `${config.public.apiBase}/api/videos/${editingVideo.value._id}`
      : `${config.public.apiBase}/api/videos`
    
    const method = editingVideo.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: formData
    })
    
    if (response.ok) {
      closeModal()
      await loadVideos() // Перезагружаем список видео
    } else {
      console.error('Ошибка сохранения видео')
      const errorData = await response.json().catch(() => ({}))
      alert(`Ошибка при сохранении видео: ${errorData.message || 'Неизвестная ошибка'}`)
    }
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Произошла ошибка при сохранении видео')
  } finally {
    saving.value = false
  }
}

// Удаление видео
async function deleteVideo(id?: string) {
  if (!id || !confirm('Вы уверены, что хотите удалить это видео?')) return
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      await loadVideos() // Перезагружаем список видео
    } else {
      console.error('Ошибка удаления видео')
      alert('Ошибка при удалении видео')
    }
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Произошла ошибка при удалении видео')
  }
}

// Редактирование видео
function editVideo(video: Video) {
  editingVideo.value = video
  currentVideo.value = { ...video }
  thumbnailPreview.value = ''
  showAddModal.value = true
}

// Воспроизведение видео
function playVideo(video: Video) {
  currentVideo.value = video
  videoLoading.value = true
  videoError.value = false
  videoProgress.value = 0
  showVideoModal.value = true
  
  // Устанавливаем таймаут для загрузки видео
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
  }
  
  loadTimeout.value = setTimeout(() => {
    if (videoLoading.value) {
      videoError.value = true
      videoLoading.value = false
      console.error('Таймаут загрузки видео')
    }
  }, VIDEO_LOAD_TIMEOUT)
  
  // Для видеофайлов устанавливаем источник
  if (video.type === 'file') {
    videoSource.value = `${config.public.apiBase}/api/videos/file/${video.source}`
    
    // Даем время на отрисовку модального окна перед загрузкой видео
    nextTick(() => {
      if (videoPlayer.value) {
        videoPlayer.value.load()
      }
    })
  } else if (video.type === 'link') {
    // Для iframe также устанавливаем таймаут
    if (iframeTimeout.value) {
      clearTimeout(iframeTimeout.value)
    }
    
    iframeTimeout.value = setTimeout(() => {
      if (videoLoading.value) {
        videoError.value = true
        videoLoading.value = false
        console.error('Таймаут загрузки iframe')
      }
    }, VIDEO_LOAD_TIMEOUT)
  }
}

// Повторная попытка загрузки видео
function retryVideoLoad() {
  videoError.value = false
  videoLoading.value = true
  
  // Устанавливаем таймаут снова
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
  }
  
  loadTimeout.value = setTimeout(() => {
    if (videoLoading.value) {
      videoError.value = true
      videoLoading.value = false
    }
  }, VIDEO_LOAD_TIMEOUT)
  
  // Перезагружаем видео
  if (currentVideo.value.type === 'file' && videoPlayer.value) {
    videoPlayer.value.load()
  } else if (currentVideo.value.type === 'link') {
    // Для iframe перезагрузка происходит через обновление src
    // Это обрабатывается в шаблоне через :src
  }
}

// Обработка загрузки файла видео
function handleFileUpload() {
  // Файл будет обработан при сохранении
}

// Обработка загрузки обложки
function handleThumbnailUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      thumbnailPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Получение embed URL для внешних видео
function getEmbedUrl(url: string): string {
  // Для YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    
    // Разные форматы YouTube URL
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]
      const ampersandPosition = videoId.indexOf('&')
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition)
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]
      const questionMarkPosition = videoId.indexOf('?')
      if (questionMarkPosition !== -1) {
        videoId = videoId.substring(0, questionMarkPosition)
      }
    }
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }
  
  // Для Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`
  }
  
  // Для прямых видеофайлов (не должно использоваться здесь)
  return url
}

// Обработчики прогресса загрузки видео
function handleVideoLoadStart() {
  videoLoading.value = true
  videoProgress.value = 0
}

function handleVideoProgress(event: Event) {
  const video = event.target as HTMLVideoElement
  if (video.buffered.length > 0 && video.duration > 0) {
    const bufferedEnd = video.buffered.end(video.buffered.length - 1)
    videoProgress.value = (bufferedEnd / video.duration) * 100
  }
}

function handleVideoCanPlay() {
  // Очищаем таймаут при успешной загрузке
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
  
  videoLoading.value = false
  if (videoPlayer.value) {
    videoPlayer.value.play().catch(error => {
      console.error('Ошибка автовоспроизведения:', error)
    })
  }
}

function handleVideoError() {
  // Очищаем таймаут при ошибке
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
  
  videoLoading.value = false
  videoError.value = true
  console.error('Ошибка загрузки видео')
}

function handleVideoStalled() {
  console.warn('Видео остановило загрузку')
  // Можно добавить дополнительную логику для обработки остановки загрузки
}

function handleIframeLoad() {
  // Очищаем таймаут при успешной загрузке iframe
  if (iframeTimeout.value) {
    clearTimeout(iframeTimeout.value)
    iframeTimeout.value = null
  }
  
  videoLoading.value = false
}

// Форматирование даты
function formatDate(dateString?: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Закрытие модального окна и сброс данных
function closeModal() {
  showAddModal.value = false
  editingVideo.value = null
  currentVideo.value = {
    title: '',
    description: '',
    type: 'file',
    source: '',
    thumbnail: ''
  }
  thumbnailPreview.value = ''
  if (videoFile.value) videoFile.value.value = ''
  if (thumbnailFile.value) thumbnailFile.value.value = ''
}

function closeVideoModal() {
  showVideoModal.value = false
  videoLoading.value = false
  videoError.value = false
  videoProgress.value = 0
  
  // Очищаем таймауты
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
  
  if (iframeTimeout.value) {
    clearTimeout(iframeTimeout.value)
    iframeTimeout.value = null
  }
  
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.currentTime = 0
  }
}

function clearSource() {
  currentVideo.value.source = ''
}

// Загружаем видео при монтировании компонента
onMounted(() => {
  loadVideos()
})

// Очищаем таймауты при размонтировании компонента
onUnmounted(() => {
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
  }
  
  if (iframeTimeout.value) {
    clearTimeout(iframeTimeout.value)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>