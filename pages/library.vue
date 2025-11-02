<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-4 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Заголовок -->
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ isAdmin ? 'Управление видеоконтентом' : 'Видеобиблиотека' }}
          </h1>
          <p class="mt-2 sm:mt-4 text-base sm:text-lg text-gray-500">
            {{ isAdmin ? 'Добавляйте и управляйте видео материалами и курсами' : 'Просматривайте обучающие материалы' }}
          </p>
        </div>

        <!-- Кнопки управления для администратора -->
        <div v-if="isAdmin" class="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button 
            @click="showPlaylistModal = true"
            class="px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 active:bg-green-800 flex items-center justify-center text-sm sm:text-base touch-manipulation"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
            Управление курсами
          </button>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center text-sm sm:text-base touch-manipulation"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Добавить видео
          </button>
        </div>

        <!-- Кнопка фильтра для мобильных устройств -->
        <div class="lg:hidden mb-4">
          <button 
            @click="showMobilePlaylistMenu = !showMobilePlaylistMenu"
            class="w-full px-4 py-3 bg-white rounded-lg shadow flex items-center justify-between text-left touch-manipulation"
          >
            <span class="font-medium text-gray-900">
              {{ getMobilePlaylistLabel() }}
            </span>
            <svg 
              class="w-5 h-5 text-gray-500 transition-transform" 
              :class="{ 'rotate-180': showMobilePlaylistMenu }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- Выпадающее меню курсов на мобильных -->
          <div 
            v-show="showMobilePlaylistMenu"
            class="mt-2 bg-white rounded-lg shadow-lg p-2 space-y-1 max-h-96 overflow-y-auto"
          >
            <button
              @click="selectPlaylist(null); showMobilePlaylistMenu = false"
              :class="[
                'w-full text-left px-3 py-2.5 rounded-md transition touch-manipulation',
                selectedPlaylist === null 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 active:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-between">
                <span>Все видео</span>
                <span class="text-sm text-gray-500">{{ allVideosCount }}</span>
              </div>
            </button>
            
            <button
              @click="selectPlaylist('none'); showMobilePlaylistMenu = false"
              :class="[
                'w-full text-left px-3 py-2.5 rounded-md transition touch-manipulation',
                selectedPlaylist === 'none' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 active:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-between">
                <span>Без курса</span>
                <span class="text-sm text-gray-500">{{ noPlaylistVideosCount }}</span>
              </div>
            </button>

            <hr class="my-2">
            
            <button
              v-for="playlist in playlists"
              :key="playlist._id"
              @click="playlist._id && selectPlaylist(playlist._id); showMobilePlaylistMenu = false"
              :class="[
                'w-full text-left px-3 py-2.5 rounded-md transition touch-manipulation',
                selectedPlaylist === playlist._id 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'hover:bg-gray-100 active:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="truncate">{{ playlist.name }}</span>
                <span class="text-sm text-gray-500">{{ playlist._id ? getPlaylistVideoCount(playlist._id) : 0 }}</span>
              </div>
            </button>
            
            <p v-if="playlists.length === 0" class="text-sm text-gray-500 px-3 py-2">
              Нет курсов
            </p>
          </div>
        </div>

        <!-- Плейлисты и контент -->
        <div class="flex gap-6">
          <!-- Боковая панель с курсами (только для десктопа) -->
          <div class="hidden lg:block w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow p-4 sticky top-4">
              <h3 class="font-semibold text-lg mb-4">Курсы</h3>
              
              <div class="space-y-2">
                <!-- Все видео -->
                <button
                  @click="selectPlaylist(null)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md transition',
                    selectedPlaylist === null 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>Все видео</span>
                    <span class="text-sm text-gray-500">{{ allVideosCount }}</span>
                  </div>
                </button>
                
                <!-- Без курса -->
                <button
                  @click="selectPlaylist('none')"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md transition',
                    selectedPlaylist === 'none' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span>Без курса</span>
                    <span class="text-sm text-gray-500">{{ noPlaylistVideosCount }}</span>
                  </div>
                </button>

                <hr class="my-2">
                
                <!-- Список курсов -->
                <button
                  v-for="playlist in playlists"
                  :key="playlist._id"
                  @click="playlist._id && selectPlaylist(playlist._id)"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-md transition',
                    selectedPlaylist === playlist._id 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <span class="truncate">{{ playlist.name }}</span>
                    <span class="text-sm text-gray-500">{{ playlist._id ? getPlaylistVideoCount(playlist._id) : 0 }}</span>
                  </div>
                </button>
                
                <p v-if="playlists.length === 0" class="text-sm text-gray-500 px-3 py-2">
                  Нет курсов
                </p>
              </div>
            </div>
          </div>

          <!-- Основной контент -->
          <div class="flex-1 min-w-0">
            <!-- Список видео -->
            <div v-if="loading" class="text-center py-12">
              <p class="text-gray-500">Загрузка видео...</p>
            </div>
            
            <div v-else-if="filteredVideos.length === 0" class="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
              <p class="text-gray-500 px-4">
                {{ selectedPlaylist ? 'В этом курсе пока нет видео' : 'Видео пока нет' }}
              </p>
              <button 
                v-if="isAdmin" 
                @click="showAddModal = true"
                class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 touch-manipulation"
              >
                Добавить первое видео
              </button>
            </div>
            
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <div 
                v-for="video in filteredVideos" 
                :key="video._id" 
                class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <!-- Обложка видео -->
                <div class="relative">
                  <img 
                    :src="getThumbnailUrl(video)" 
                    :alt="video.title" 
                    class="w-full h-44 sm:h-48 object-cover"
                    @error="handleImageError"
                  >
                  <div class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {{ video.type === 'file' ? 'Файл' : 'Ссылка' }}
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <button 
                      @click="playVideo(video)"
                      class="bg-black bg-opacity-50 rounded-full p-4 sm:p-3 hover:bg-opacity-70 active:bg-opacity-80 transition touch-manipulation"
                    >
                      <svg class="w-10 h-10 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Информация о видео -->
                <div class="p-3 sm:p-4">
                  <h3 class="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2">{{ video.title }}</h3>
                  <p class="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">{{ video.description }}</p>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">
                      {{ formatDate(video.createdAt) }}
                    </span>
                    
                    <!-- Кнопки управления для администратора -->
                    <div v-if="isAdmin" class="flex space-x-1 sm:space-x-2">
                      <button 
                        @click="editVideo(video)"
                        class="text-blue-600 hover:text-blue-800 active:text-blue-900 p-2 sm:p-1 touch-manipulation"
                        title="Редактировать"
                      >
                        <svg class="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="deleteVideo(video._id)"
                        class="text-red-600 hover:text-red-800 active:text-red-900 p-2 sm:p-1 touch-manipulation"
                        title="Удалить"
                      >
                        <svg class="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Модальное окно добавления/редактирования видео -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div class="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg sm:text-xl font-semibold">
                  {{ editingVideo ? 'Редактирование видео' : 'Добавление нового видео' }}
                </h2>
                <button 
                  @click="closeModal" 
                  class="sm:hidden text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form @submit.prevent="saveVideo">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Название видео</label>
                  <input 
                    v-model="currentVideo.title" 
                    type="text" 
                    class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base" 
                    required
                    placeholder="Введите название видео"
                  >
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Описание</label>
                  <textarea 
                    v-model="currentVideo.description" 
                    rows="3" 
                    class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base" 
                    placeholder="Добавьте описание видео"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Курс</label>
                  <select 
                    v-model="currentVideo.playlistId" 
                    class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base"
                  >
                    <option :value="null">Без курса</option>
                    <option 
                      v-for="playlist in playlists" 
                      :key="playlist._id" 
                      :value="playlist._id"
                    >
                      {{ playlist.name }}
                    </option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Тип видео</label>
                  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="currentVideo.type" 
                        value="file" 
                        class="mr-2 w-4 h-4"
                        @change="clearSource"
                      >
                      <span class="text-sm sm:text-base">Загрузить файл</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="currentVideo.type" 
                        value="link" 
                        class="mr-2 w-4 h-4"
                        @change="clearSource"
                      >
                      <span class="text-sm sm:text-base">Вставить ссылку</span>
                    </label>
                  </div>
                </div>
                
                <div class="mb-4" v-if="currentVideo.type === 'link'">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Ссылка на видео</label>
                  <input 
                    v-model="currentVideo.source" 
                    type="url" 
                    class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base" 
                    placeholder="https://example.com/video.mp4"
                    required
                  >
                </div>
                
                <div class="mb-4" v-if="currentVideo.type === 'file'">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Видео файл</label>
                  <input 
                    type="file" 
                    ref="videoFile"
                    accept="video/*" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base" 
                    @change="handleFileUpload"
                    :required="!editingVideo || !currentVideo.source"
                  >
                  <p class="text-xs sm:text-sm text-gray-500 mt-1" v-if="currentVideo.source && currentVideo.type === 'file'">
                    Текущий файл: {{ currentVideo.source.split('/').pop() }}
                  </p>
                </div>
                
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm sm:text-base mb-2">Обложка видео</label>
                  <input 
                    type="file" 
                    ref="thumbnailFile"
                    accept="image/*" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base" 
                    @change="handleThumbnailUpload"
                  >
                  <p class="text-xs sm:text-sm text-gray-500 mt-1" v-if="currentVideo.thumbnail">
                    Текущая обложка: {{ currentVideo.thumbnail.split('/').pop() }}
                  </p>
                  <div v-if="thumbnailPreview" class="mt-2">
                    <img :src="thumbnailPreview" class="h-32 object-cover rounded-md">
                  </div>
                  <div v-else-if="currentVideo.thumbnail && editingVideo" class="mt-2">
                    <img :src="resolveThumbnail(currentVideo.thumbnail)" class="h-32 object-cover rounded-md">
                  </div>
                </div>
                
                <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-4 border-t sm:border-t-0 sticky sm:static bottom-0 bg-white sm:bg-transparent -mx-4 sm:mx-0 px-4 sm:px-0 pb-4 sm:pb-0">
                  <button 
                    type="button" 
                    @click="closeModal"
                    class="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit" 
                    class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="saving"
                  >
                    {{ saving ? 'Сохранение...' : (editingVideo ? 'Обновить' : 'Сохранить') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Модальное окно управления курсами -->
        <div v-if="showPlaylistModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div class="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[80vh] overflow-y-auto">
            <div class="p-4 sm:p-6">
              <div class="flex justify-between items-center mb-4 sm:mb-4">
                <h2 class="text-lg sm:text-xl font-semibold">Управление курсами</h2>
                <button 
                  @click="closePlaylistModal"
                  class="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Форма создания нового курса -->
              <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 class="font-medium text-sm sm:text-base mb-3">
                  {{ editingPlaylist ? 'Редактировать курс' : 'Создать новый курс' }}
                </h3>
                <form @submit.prevent="savePlaylist">
                  <div class="mb-3">
                    <input 
                      v-model="currentPlaylist.name" 
                      type="text" 
                      class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base" 
                      placeholder="Название курса"
                      required
                    >
                  </div>
                  <div class="mb-3">
                    <textarea 
                      v-model="currentPlaylist.description" 
                      rows="2" 
                      class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-base" 
                      placeholder="Описание (необязательно)"
                    ></textarea>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <button 
                      type="submit" 
                      class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 touch-manipulation disabled:opacity-50"
                      :disabled="savingPlaylist"
                    >
                      {{ savingPlaylist ? 'Сохранение...' : (editingPlaylist ? 'Обновить' : 'Создать') }}
                    </button>
                    <button 
                      v-if="editingPlaylist"
                      type="button" 
                      @click="cancelEditPlaylist"
                      class="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>

              <!-- Список курсов -->
              <div class="space-y-2">
                <h3 class="font-medium text-sm sm:text-base mb-3">Существующие курсы</h3>
                <div 
                  v-for="playlist in playlists" 
                  :key="playlist._id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
                >
                  <div class="flex-1 min-w-0 pr-2">
                    <h4 class="font-medium text-sm sm:text-base truncate">{{ playlist.name }}</h4>
                    <p class="text-xs sm:text-sm text-gray-600 line-clamp-1" v-if="playlist.description">{{ playlist.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">Видео: {{ playlist._id ? getPlaylistVideoCount(playlist._id) : 0 }}</p>
                  </div>
                  <div class="flex gap-1 sm:gap-2">
                    <button 
                      @click="editPlaylist(playlist)"
                      class="p-2 text-blue-600 hover:text-blue-800 active:text-blue-900 touch-manipulation"
                      title="Редактировать"
                    >
                      <svg class="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      @click="deletePlaylist(playlist._id)"
                      class="p-2 text-red-600 hover:text-red-800 active:text-red-900 touch-manipulation"
                      title="Удалить"
                    >
                      <svg class="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p v-if="playlists.length === 0" class="text-center py-4 text-sm sm:text-base text-gray-500">
                  Нет курсов. Создайте первый курс выше.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Модальное окно просмотра видео -->
        <Transition name="video-modal">
          <div v-if="showVideoModal" class="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50" @click.self="closeVideoModal">
            <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-5xl relative flex flex-col shadow-2xl overflow-hidden video-modal-content">
              <!-- Заголовок с улучшенным дизайном -->
              <div class="p-4 sm:p-6 flex justify-between items-start bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-gray-700/50">
                <div class="flex-1 min-w-0 pr-3">
                  <h3 class="text-white text-lg sm:text-2xl font-bold pr-2 mb-1 line-clamp-2">{{ currentVideo.title }}</h3>
                  <div v-if="currentVideo.playlistId" class="flex items-center mt-2">
                    <svg class="w-4 h-4 text-blue-400 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                    </svg>
                    <span class="text-xs sm:text-sm text-blue-400 font-medium truncate">
                      {{ playlists.find(p => p._id === currentVideo.playlistId)?.name || 'Курс' }}
                    </span>
                  </div>
                </div>
                <button 
                  @click="closeVideoModal"
                  class="text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20 p-2.5 rounded-full transition-all duration-200 touch-manipulation flex-shrink-0 group"
                  title="Закрыть"
                >
                  <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Область видео -->
              <div class="relative flex-1 flex items-center bg-black/50 min-h-0">
                <!-- Состояние загрузки с улучшенным дизайном -->
                <Transition name="fade">
                  <div v-if="videoLoading" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/90 to-gray-900/90 z-20 backdrop-blur-sm">
                    <div class="text-white text-center px-6 py-8">
                      <div class="relative w-20 h-20 mx-auto mb-6">
                        <div class="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                        <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        <div class="absolute inset-2 border-4 border-blue-400/20 rounded-full"></div>
                        <div class="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 0.8s;"></div>
                      </div>
                      <p class="text-base sm:text-lg font-medium mb-2">Загрузка видео...</p>
                      <p class="text-xs sm:text-sm text-gray-400">Пожалуйста, подождите</p>
                      <div v-if="videoProgress > 0" class="mt-4 w-64 mx-auto bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-blue-500 h-full transition-all duration-300 rounded-full" :style="{ width: videoProgress + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </Transition>
                
                <!-- Состояние ошибки с улучшенным дизайном -->
                <Transition name="fade">
                  <div v-if="videoError" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/20 to-black/90 z-20 backdrop-blur-sm">
                    <div class="text-white text-center p-6 sm:p-8 max-w-md">
                      <div class="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h4 class="text-xl sm:text-2xl font-bold mb-3">Ошибка загрузки</h4>
                      <p class="text-sm sm:text-base text-gray-300 mb-6">Видео не загрузилось в течение отведенного времени. Проверьте подключение к интернету и попробуйте снова.</p>
                      <button 
                        @click="retryVideoLoad"
                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 touch-manipulation font-medium shadow-lg hover:shadow-blue-500/50"
                      >
                        Попробовать снова
                      </button>
                    </div>
                  </div>
                </Transition>
                
                <!-- Видео контент -->
                <div class="w-full relative">
                  <div v-if="currentVideo.type === 'file'" class="w-full bg-black">
                    <video 
                      ref="videoPlayer"
                      :src="videoSource" 
                      controls 
                      class="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain"
                      preload="auto"
                      playsinline
                      @loadstart="handleVideoLoadStart"
                      @progress="handleVideoProgress"
                      @canplay="handleVideoCanPlay"
                      @error="handleVideoError"
                      @stalled="handleVideoStalled"
                    ></video>
                  </div>
                  
                  <div v-else-if="currentVideo.type === 'link'" class="w-full bg-black">
                    <div class="relative w-full" style="padding-bottom: 56.25%;">
                      <iframe 
                        :src="getEmbedUrl(currentVideo.source)" 
                        class="absolute top-0 left-0 w-full h-full"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        @load="handleIframeLoad"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Описание с улучшенным дизайном -->
              <div v-if="currentVideo.description" class="p-4 sm:p-6 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm border-t border-gray-700/50">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs sm:text-sm text-gray-400 mb-2 font-medium uppercase tracking-wider">Описание</p>
                    <p class="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap">{{ currentVideo.description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Информация о видео -->
              <div class="px-4 sm:px-6 py-3 bg-black/50 border-t border-gray-800/50 flex items-center justify-between text-xs sm:text-sm text-gray-400">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {{ formatDate(currentVideo.createdAt) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    {{ currentVideo.type === 'file' ? 'Видео файл' : 'Внешнее видео' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
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
  playlistId?: string | null
  order?: number
  createdAt?: string
}

interface Playlist {
  _id?: string
  name: string
  description?: string
  order?: number
  createdAt?: string
}

const { isAdmin } = useAuth()
const config = useRuntimeConfig()
const token = useCookie('bearer-token')

// Состояния компонента
const showAddModal = ref(false)
const showVideoModal = ref(false)
const showPlaylistModal = ref(false)
const showMobilePlaylistMenu = ref(false)
const loading = ref(true)
const saving = ref(false)
const savingPlaylist = ref(false)
const videos: Ref<Video[]> = ref([])
const playlists: Ref<Playlist[]> = ref([])
const editingVideo: Ref<Video | null> = ref(null)
const editingPlaylist: Ref<Playlist | null> = ref(null)
const selectedPlaylist: Ref<string | null | 'none'> = ref(null)
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
  thumbnail: '',
  playlistId: null,
  order: 0
})

// Текущий редактируемый плейлист
const currentPlaylist: Ref<Playlist> = ref({
  name: '',
  description: '',
  order: 0
})

// Вычисляемые свойства для подсчета видео
const allVideosCount = computed(() => videos.value.length)
const noPlaylistVideosCount = computed(() => videos.value.filter(v => !v.playlistId).length)

const filteredVideos = computed(() => {
  let result: Video[] = []
  
  if (selectedPlaylist.value === null) {
    result = videos.value
  } else if (selectedPlaylist.value === 'none') {
    result = videos.value.filter(v => !v.playlistId)
  } else {
    result = videos.value.filter(v => {
      return v.playlistId === selectedPlaylist.value
    })
  }
  
  // Сортируем по дате создания (старые сверху)
  return result.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateA - dateB // Прямой порядок (возрастание - старые сверху)
  })
})

function getPlaylistVideoCount(playlistId: string) {
  return videos.value.filter(v => v.playlistId === playlistId).length
}

function selectPlaylist(playlistId: string | null | 'none') {
  selectedPlaylist.value = playlistId
}

// Получение URL обложки (локальный файл или внешний URL)
function getThumbnailUrl(video: Video): string {
  if (video.thumbnail) {
    if (/^https?:\/\//i.test(video.thumbnail)) return video.thumbnail
    return `${config.public.apiBase}/api/videos/thumbnail/${video.thumbnail}`
  }
  return '/placeholder-thumbnail.jpg'
}

function resolveThumbnail(thumbnail?: string): string {
  if (!thumbnail) return '/placeholder-thumbnail.jpg'
  if (/^https?:\/\//i.test(thumbnail)) return thumbnail
  return `${config.public.apiBase}/api/videos/thumbnail/${thumbnail}`
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

// Загрузка плейлистов из API
async function loadPlaylists() {
  try {
    const response = await fetch(`${config.public.apiBase}/api/playlists`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      playlists.value = await response.json()
    } else {
      console.error('Ошибка загрузки курсов')
    }
  } catch (error) {
    console.error('Ошибка:', error)
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
    
    // Добавляем playlistId
    if (currentVideo.value.playlistId) {
      formData.append('playlistId', currentVideo.value.playlistId)
    }
    
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
    thumbnail: '',
    playlistId: null,
    order: 0
  }
  thumbnailPreview.value = ''
  if (videoFile.value) videoFile.value.value = ''
  if (thumbnailFile.value) thumbnailFile.value.value = ''
}

// === Функции для работы с плейлистами ===

// Сохранение плейлиста
async function savePlaylist() {
  try {
    savingPlaylist.value = true
    
    const url = editingPlaylist.value 
      ? `${config.public.apiBase}/api/playlists/${editingPlaylist.value._id}`
      : `${config.public.apiBase}/api/playlists`
    
    const method = editingPlaylist.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentPlaylist.value)
    })
    
    if (response.ok) {
      await loadPlaylists()
      cancelEditPlaylist()
    } else {
      const errorData = await response.json().catch(() => ({}))
      alert(`Ошибка при сохранении плейлиста: ${errorData.message || 'Неизвестная ошибка'}`)
    }
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Произошла ошибка при сохранении плейлиста')
  } finally {
    savingPlaylist.value = false
  }
}

// Удаление плейлиста
async function deletePlaylist(id?: string) {
  if (!id || !confirm('Вы уверены, что хотите удалить этот плейлист?')) return
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/playlists/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (response.ok) {
      await loadPlaylists()
      await loadVideos()
      if (selectedPlaylist.value === id) {
        selectedPlaylist.value = null
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      alert(`Ошибка при удалении плейлиста: ${errorData.message || 'Неизвестная ошибка'}`)
    }
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Произошла ошибка при удалении плейлиста')
  }
}

// Редактирование плейлиста
function editPlaylist(playlist: Playlist) {
  editingPlaylist.value = playlist
  currentPlaylist.value = { ...playlist }
}

// Отмена редактирования плейлиста
function cancelEditPlaylist() {
  editingPlaylist.value = null
  currentPlaylist.value = {
    name: '',
    description: '',
    order: 0
  }
}

// Закрытие модального окна плейлистов
function closePlaylistModal() {
  showPlaylistModal.value = false
  cancelEditPlaylist()
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

// Получить название текущего фильтра для мобильного меню
function getMobilePlaylistLabel(): string {
  if (selectedPlaylist.value === null) {
    return 'Все видео'
  } else if (selectedPlaylist.value === 'none') {
    return 'Без курса'
  } else {
    const playlist = playlists.value.find(p => p._id === selectedPlaylist.value)
    return playlist ? playlist.name : 'Выберите курс'
  }
}

// Загружаем видео и плейлисты при монтировании компонента
onMounted(async () => {
  await Promise.all([loadVideos(), loadPlaylists()])
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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

/* Улучшенное сенсорное управление */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Плавная анимация для поворота стрелки */
.rotate-180 {
  transform: rotate(180deg);
}

/* Анимации для модального окна просмотра видео */
.video-modal-enter-active,
.video-modal-leave-active {
  transition: opacity 0.3s ease;
}

.video-modal-enter-active .video-modal-content,
.video-modal-leave-active .video-modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.video-modal-enter-from,
.video-modal-leave-to {
  opacity: 0;
}

.video-modal-enter-from .video-modal-content,
.video-modal-leave-to .video-modal-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.video-modal-enter-to .video-modal-content,
.video-modal-leave-from .video-modal-content {
  transform: scale(1) translateY(0);
  opacity: 1;
}

/* Анимация fade для состояний загрузки и ошибки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Кастомный скроллбар для описания */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>