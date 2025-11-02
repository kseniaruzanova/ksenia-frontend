<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Управление пользователями</h1>
            <p class="text-gray-500 mt-2">Просмотр и управление пользователями системы</p>
          </div>
            
          <!-- Поиск пользователя -->
          <div class="bg-white rounded-lg shadow-lg mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Поиск пользователя</h2>
            </div>
            <div class="p-6">
              <div class="flex space-x-3">
                <input
                  v-model="searchChatId"
                  type="text"
                  placeholder="Введите chat_id пользователя"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  @click="searchUser"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                >
                  Найти
                </button>
              </div>
            </div>
          </div>

          <!-- Результат поиска -->
          <div v-if="searchedUser" class="bg-white rounded-lg shadow-lg mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Информация о пользователе</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Chat ID</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.chat_id }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Customer ID</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.customerId || 'Не указан' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Состояние</p>
                  <span :class="getStateBadgeClass(searchedUser.state)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ searchedUser.state }}
                  </span>
                </div>
                <div v-if="searchedUser.birthday">
                  <p class="text-sm text-gray-500 mb-1">День рождения</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.birthday }}</p>
                </div>
                <div v-if="searchedUser.birthTime">
                  <p class="text-sm text-gray-500 mb-1">Время рождения</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.birthTime }}</p>
                </div>
                <div v-if="searchedUser.city_name">
                  <p class="text-sm text-gray-500 mb-1">Место рождения</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.city_name }}</p>
                </div>
                <div v-if="searchedUser.latitude && searchedUser.longitude">
                  <p class="text-sm text-gray-500 mb-1">Координаты</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.latitude }}, {{ searchedUser.longitude }}</p>
                </div>
                <div v-if="searchedUser.timezone !== undefined">
                  <p class="text-sm text-gray-500 mb-1">Часовой пояс</p>
                  <p class="text-sm font-medium text-gray-900">UTC{{ searchedUser.timezone >= 0 ? '+' : '' }}{{ searchedUser.timezone }}</p>
                </div>
                <div v-if="searchedUser.question" class="md:col-span-2">
                  <p class="text-sm text-gray-500 mb-1">Вопрос</p>
                  <p class="text-sm font-medium text-gray-900">{{ searchedUser.question }}</p>
                </div>
                <div v-if="searchedUser.createdAt">
                  <p class="text-sm text-gray-500 mb-1">Дата создания</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(searchedUser.createdAt) }}</p>
                </div>
                <div v-if="searchedUser.updatedAt">
                  <p class="text-sm text-gray-500 mb-1">Последнее обновление</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(searchedUser.updatedAt) }}</p>
                </div>
              </div>
            </div>
          </div>

            <!-- Список всех пользователей -->
            <div class="bg-white rounded-lg shadow-lg">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Все пользователи</h2>
                  <p class="text-sm text-gray-500 mt-1">{{ filteredUsers.length }} записей</p>
                </div>
                
                <!-- Настройки отображения -->
                <div class="flex items-center space-x-2">
                  <select 
                    v-model="pageSize" 
                    @change="changePageSize"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="10">10 на странице</option>
                    <option value="25">25 на странице</option>
                    <option value="50">50 на странице</option>
                    <option value="100">100 на странице</option>
                  </select>
                </div>
              </div>

              <!-- Статистика для админов -->
              <div v-if="adminStats" class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div class="flex items-center">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-blue-900">Всего пользователей</p>
                        <p class="text-2xl font-bold text-blue-700">{{ adminStats.totalUsers }}</p>
                      </div>
                      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs">👥</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div class="flex items-center">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-green-900">Всего кастомеров</p>
                        <p class="text-2xl font-bold text-green-700">{{ adminStats.totalCustomers }}</p>
                      </div>
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs">🏢</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div class="flex items-center">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-yellow-900">Без кастомера</p>
                        <p class="text-2xl font-bold text-yellow-700">{{ adminStats.usersWithoutCustomer?.length || 0 }}</p>
                      </div>
                      <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs">⚠️</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredUsers.length === 0" class="p-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Нет пользователей</h3>
                <p class="mt-1 text-sm text-gray-500">Данные будут отображаться после появления пользователей</p>
              </div>

              <div v-else class="overflow-hidden">
                <!-- Мобильная версия (карточки) -->
                <div class="lg:hidden divide-y divide-gray-200">
                <div
                  v-for="user in sortedUsers"
                  :key="user._id"
                  class="p-4 hover:bg-gray-50 transition cursor-pointer"
                  @click="toggleUser(user._id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span class="text-indigo-600 text-xs font-semibold">👤</span>
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-semibold text-gray-900">Chat ID: {{ user.chat_id }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ formatDate(user.createdAt) }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="ml-4 flex items-center space-x-2">
                      <span :class="getStateBadgeClass(user.state)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ user.state }}
                      </span>
                      <svg 
                        class="h-5 w-5 text-gray-400 transition transform"
                        :class="{ 'rotate-180': expandedUsers[user._id] }"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Раскрывающаяся информация -->
                  <div v-if="expandedUsers[user._id]" class="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-gray-500">ID:</p>
                        <p class="text-gray-900 font-mono text-xs break-all">{{ user._id }}</p>
                      </div>
                      <div>
                        <p class="text-gray-500">Состояние:</p>
                        <span :class="getStateBadgeClass(user.state)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ user.state }}
                        </span>
                      </div>
                      <div class="col-span-2">
                        <p class="text-gray-500">Customer ID:</p>
                        <p class="text-gray-900 font-mono text-xs break-all">{{ user.customerId || 'Не указан' }}</p>
                      </div>
                      <div v-if="user.birthday" class="col-span-2">
                        <p class="text-gray-500">День рождения:</p>
                        <p class="text-gray-900 text-sm">{{ user.birthday }}</p>
                      </div>
                      <div v-if="user.city_name" class="col-span-2">
                        <p class="text-gray-500">Место рождения:</p>
                        <p class="text-gray-900 text-sm">{{ user.city_name }}</p>
                      </div>
                    </div>
                    <div class="flex space-x-2 pt-2">
                      <button
                        @click.stop="viewUserDetails(user.chat_id)"
                        class="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
                </div>

                <!-- Десктопная версия (таблица) -->
                <div class="hidden lg:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th 
                        @click="setSortField('chat_id')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>Chat ID</span>
                          <span v-if="sortField === 'chat_id'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th 
                        @click="setSortField('customerId')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>Customer ID</span>
                          <span v-if="sortField === 'customerId'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th 
                        @click="setSortField('state')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>Состояние</span>
                          <span v-if="sortField === 'state'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th 
                        @click="setSortField('birthday')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>День рождения</span>
                          <span v-if="sortField === 'birthday'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th 
                        @click="setSortField('city_name')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>Место рождения</span>
                          <span v-if="sortField === 'city_name'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th 
                        @click="setSortField('createdAt')"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div class="flex items-center space-x-1">
                          <span>Дата создания</span>
                          <span v-if="sortField === 'createdAt'" class="text-indigo-600">
                            {{ sortDirection === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="user in sortedUsers" :key="user._id" class="hover:bg-gray-50 transition">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span class="text-indigo-600 text-xs font-semibold">👤</span>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900">{{ user.chat_id }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-xs font-mono text-gray-500">{{ user.customerId || 'Не указан' }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getStateBadgeClass(user.state)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {{ user.state }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.birthday || '—' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ user.city_name || '—' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ user.createdAt ? formatDate(user.createdAt) : 'Не указано' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <button
                          @click="viewUserDetails(user.chat_id)"
                          class="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        >
                          Подробнее
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
                
                <!-- Информация о пагинации -->
                <div class="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200">
                  <div class="flex-1 flex justify-between items-center">
                    <div class="text-sm text-gray-700">
                      Страница {{ currentPage }} из {{ totalDisplayPages }}
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                      >
                        Назад
                      </button>
                      <button
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalDisplayPages"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="currentPage === totalDisplayPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                      >
                        Вперед
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <!-- Ошибка -->
          <div v-if="error" class="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const { tariff } = useAuth();

const searchChatId = ref('')
const searchedUser = ref(null)
const users = ref([])
const currentPage = ref(1)
const error = ref('')
const pageSize = ref(50)
const sortField = ref('')
const sortDirection = ref('asc')
const adminStats = ref(null)
const expandedUsers = ref({})
const config = useRuntimeConfig()

// Получение токена из куки
const token = useCookie('bearer-token')

// Отфильтрованные пользователи (пока без фильтров, просто копия)
const filteredUsers = computed(() => {
  return users.value
})

// Отсортированные пользователи
const sortedAndFilteredUsers = computed(() => {
  if (!sortField.value) return filteredUsers.value
  
  return [...filteredUsers.value].sort((a, b) => {
    const aValue = a[sortField.value] || ''
    const bValue = b[sortField.value] || ''
    
    let comparison = 0
    
    // Специальная обработка для дат
    if (sortField.value === 'createdAt' || sortField.value === 'updatedAt') {
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      comparison = aDate.getTime() - bDate.getTime()
    } else {
      // Обычная строковая сортировка
      comparison = String(aValue).localeCompare(String(bValue))
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

// Общее количество страниц для отображения
const totalDisplayPages = computed(() => {
  return Math.ceil(sortedAndFilteredUsers.value.length / pageSize.value)
})

// Индексы для текущей страницы
const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + pageSize.value, sortedAndFilteredUsers.value.length)
})

// Пользователи для текущей страницы
const sortedUsers = computed(() => {
  return sortedAndFilteredUsers.value.slice(startIndex.value, endIndex.value)
})

// Поиск пользователя по chat_id
async function searchUser() {
  if (!searchChatId.value) return
  error.value = ''
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/users/by-chat-id/${searchChatId.value}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.')
      }
      throw new Error('Пользователь не найден')
    }
    
    searchedUser.value = await response.json()
  } catch (err) {
    console.error('Ошибка при поиске пользователя:', err)
    error.value = err.message
    searchedUser.value = null
  }
}

// Получение всех пользователей
async function fetchUsers() {
  error.value = ''
  try {
    const response = await fetch(`${config.public.apiBase}/api/users/all`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        token.value = null
        navigateTo('/login')
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.')
      }
      throw new Error('Ошибка при получении списка пользователей')
    }
    
    const data = await response.json()
    
    // Проверяем, какой тип ответа получили
    if (data.isAdmin) {
      // Ответ для админа - берем пользователей из allUsers
      users.value = data.allUsers || []
      console.log('Загружены пользователи для админа:', users.value.length)
      
      // Сохраняем статистику админа
      adminStats.value = {
        totalUsers: data.totalUsers,
        totalCustomers: data.totalCustomers,
        usersWithoutCustomer: data.usersWithoutCustomer,
        usersByCustomer: data.usersByCustomer
      }
    } else {
      // Ответ для кастомера - берем пользователей напрямую
      users.value = data.users || data || []
      console.log('Загружены пользователи для кастомера:', users.value.length)
      
      // Очищаем статистику админа для кастомеров
      adminStats.value = null
    }
    
    // Сбрасываем на первую страницу при загрузке новых данных
    currentPage.value = 1
  } catch (err) {
    console.error('Ошибка при получении пользователей:', err)
    error.value = err.message
    users.value = []
  }
}

// Изменение страницы
function changePage(page) {
  if (page < 1 || page > totalDisplayPages.value) return
  currentPage.value = page
}

// Просмотр деталей пользователя
function viewUserDetails(chatId) {
  searchChatId.value = chatId
  searchUser()
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return 'Не указано'
  
  try {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Функция для стилизации badge состояния
function getStateBadgeClass(state) {
  const classes = {
    'completed': 'bg-green-100 text-green-800',
    'waiting': 'bg-blue-100 text-blue-800',
    'new_chat': 'bg-gray-100 text-gray-800'
  }
  return classes[state] || 'bg-gray-100 text-gray-800'
}

// Функция для переключения раскрытия пользователя
function toggleUser(userId) {
  expandedUsers.value[userId] = !expandedUsers.value[userId]
}

// Сортировка пользователей
function setSortField(field) {
  if (field === sortField.value) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  // Сбрасываем на первую страницу при изменении сортировки
  currentPage.value = 1
}

// Изменение размера страницы
function changePageSize() {
  // Сбрасываем на первую страницу при изменении размера
  currentPage.value = 1
}

// Загрузка пользователей при монтировании компонента
onMounted(() => {
  fetchUsers()
})
</script> 
