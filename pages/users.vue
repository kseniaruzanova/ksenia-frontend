<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Управление пользователями</h1>
            
            <!-- Поиск пользователя -->
            <div class="mt-6">
              <div class="flex space-x-4">
                <input
                  v-model="searchChatId"
                  type="text"
                  placeholder="Введите chat_id пользователя"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                  @click="searchUser"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Найти
                </button>
              </div>
            </div>

            <!-- Результат поиска -->
            <div v-if="searchedUser" class="mt-6 bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">Информация о пользователе</h2>
              <div class="space-y-4">
                <div class="border-b pb-4">
                  <p><span class="font-medium">Chat ID:</span> {{ searchedUser.chat_id }}</p>
                  <p><span class="font-medium">Customer ID:</span> {{ searchedUser.customerId || 'Не указан' }}</p>
                  <p><span class="font-medium">Состояние:</span> {{ searchedUser.state }}</p>
                  <p><span class="font-medium">День рождения:</span> {{ searchedUser.birthday || 'Не указано' }}</p>
                  <p v-if="searchedUser.birthTime"><span class="font-medium">Время рождения:</span> {{ searchedUser.birthTime }}</p>
                  <p v-if="searchedUser.city_name"><span class="font-medium">Место рождения:</span> {{ searchedUser.city_name }}</p>
                  <p v-if="searchedUser.latitude && searchedUser.longitude">
                    <span class="font-medium">Координаты:</span> {{ searchedUser.latitude }}, {{ searchedUser.longitude }}
                  </p>
                  <p v-if="searchedUser.timezone !== undefined"><span class="font-medium">Часовой пояс:</span> UTC{{ searchedUser.timezone >= 0 ? '+' : '' }}{{ searchedUser.timezone }}</p>
                  <p v-if="searchedUser.question"><span class="font-medium">Вопрос:</span> {{ searchedUser.question }}</p>
                  <p v-if="searchedUser.createdAt"><span class="font-medium">Дата создания:</span> {{ formatDate(searchedUser.createdAt) }}</p>
                  <p v-if="searchedUser.updatedAt"><span class="font-medium">Последнее обновление:</span> {{ formatDate(searchedUser.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Список всех пользователей -->
            <div class="mt-8">
              <!-- Статистика для админов -->
              <div v-if="adminStats" class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Все пользователи</h2>
                
                <!-- Настройки отображения -->
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <label class="text-sm text-gray-700">Показать:</label>
                    <select 
                      v-model="pageSize" 
                      @change="changePageSize"
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    <span class="text-sm text-gray-700">на странице</span>
                  </div>
                </div>
              </div>

              <div class="bg-white shadow overflow-hidden rounded-lg">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th 
                          @click="setSortField('chat_id')"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                      <tr v-for="user in sortedUsers" :key="user._id">
                        <td class="px-6 py-4 whitespace-nowrap">{{ user.chat_id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-xs font-mono">{{ user.customerId || 'Не указан' }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="{
                            'px-2 py-1 text-xs rounded-full': true,
                            'bg-green-100 text-green-800': user.state === 'completed',
                            'bg-blue-100 text-blue-800': user.state === 'waiting',
                            'bg-gray-100 text-gray-800': user.state === 'new_chat'
                          }">
                            {{ user.state }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ user.birthday || '—' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span v-if="user.city_name" class="text-sm text-gray-900">{{ user.city_name }}</span>
                          <span v-else class="text-sm text-gray-400">—</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ user.createdAt ? formatDate(user.createdAt) : 'Не указано' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button
                            @click="viewUserDetails(user.chat_id)"
                            class="text-blue-600 hover:text-blue-900"
                          >
                            Подробнее
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Информация о пагинации -->
                <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div class="flex-1 flex justify-between items-center">
                    <div>
                      <p class="text-sm text-gray-700">
                        Показано {{ startIndex + 1 }}-{{ endIndex }} из {{ filteredUsers.length }} пользователей
                        (Страница {{ currentPage }} из {{ totalDisplayPages }})
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        :class="[
                          'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        ]"
                      >
                        Назад
                      </button>
                      <button
                        @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalDisplayPages"
                        :class="[
                          'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                          currentPage === totalDisplayPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        ]"
                      >
                        Вперед
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ошибка -->
            <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {{ error }}
            </div>
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