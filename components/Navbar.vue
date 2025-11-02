<template>
  <nav class="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-lg border-b border-purple-500/20">
    <!-- Мобильное меню (бургер) -->
    <div class="lg:hidden">
      <div class="flex items-center justify-between p-4">
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="text-white focus:outline-none"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        <button
          @click="handleLogout"
          class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md"
        >
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Выйти
          </span>
        </button>
      </div>

      <!-- Выпадающее меню для мобильных -->
      <div
        v-if="isMobileMenuOpen"
        class="px-4 pb-4 bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm"
      >
        <div class="space-y-2">
          <NuxtLink 
            to="/" 
            class="block text-white hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-all duration-200 hover:translate-x-2 font-medium"
            @click="closeMenu"
          >
            🏠 Главная
          </NuxtLink>

          <NuxtLink 
            to="/tarot" 
            class="block text-white hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-all duration-200 hover:translate-x-2 font-medium"
            @click="closeMenu"
          >
            🔮 Таро
          </NuxtLink>

          <NuxtLink 
            to="/natal" 
            class="block text-white hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-all duration-200 hover:translate-x-2 font-medium"
            @click="closeMenu"
          >
            🌟 Карта
          </NuxtLink>

          <NuxtLink 
            to="/library" 
            class="block text-white hover:bg-purple-900/50 px-4 py-2 rounded-lg transition-all duration-200 hover:translate-x-2 font-medium"
            @click="closeMenu"
          >
            📚 Школа
          </NuxtLink>

          <NuxtLink 
            to="/video-creator" 
            class="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md"
            @click="closeMenu"
          >
            🎬 Создатель видео
          </NuxtLink>

          <!-- Ссылки для Админа -->
          <template v-if="isAdmin">
            <NuxtLink 
              to="/constructor" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Конструктор продуктов
            </NuxtLink>
            <NuxtLink 
              to="/users" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Пользователи
            </NuxtLink>
            <NuxtLink 
              to="/customers" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Кастомеры
            </NuxtLink>
            <NuxtLink 
              to="/payments" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Оплаты
            </NuxtLink>
            <NuxtLink 
              to="/daily-messaging" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Ежедневные сообщения
            </NuxtLink>
            <NuxtLink 
              to="/ai-settings" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Настройки AI
            </NuxtLink>
          </template>

          <!-- Ссылки для Кастомера -->
          <template v-if="isCustomer">
            <!-- Трафик всегда доступен -->
            <NuxtLink 
              to="/subscription" 
              class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              @click="closeMenu"
            >
              Подписка
            </NuxtLink>

            <a
              href="https://taplink.cc/sistema/p/1008398/"
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center"
              @click="closeMenu"
            >
              ТРАФИК
            </a>

            <!-- Остальные ссылки с индивидуальной проверкой доступности -->
            <template v-if="!isMenuItemLocked('messenger')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Мессенджер</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/messenger" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Мессенджер
              </NuxtLink>
            </template>

            <template v-if="!isMenuItemLocked('constructor')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Конструктор продуктов</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/constructor" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Конструктор продуктов
              </NuxtLink>
            </template>

            <template v-if="!isMenuItemLocked('users')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Пользователи</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/users" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Пользователи
              </NuxtLink>
            </template>

            <template v-if="!isMenuItemLocked('messages')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Сообщения</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/messages" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Сообщения
              </NuxtLink>
            </template>

            <template v-if="!isMenuItemLocked('settings')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Мои боты</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/settings" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Мои боты
              </NuxtLink>
            </template>

            <template v-if="!isMenuItemLocked('payments')">
              <div class="flex items-center text-gray-500 px-4 py-2 cursor-not-allowed">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Оплаты</span>
              </div>
            </template>
            <template v-else>
              <NuxtLink 
                to="/payments" 
                class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                @click="closeMenu"
              >
                Оплаты
              </NuxtLink>
            </template>
          </template>
        </div>
      </div>
    </div>

    <!-- Десктопное меню -->
    <div class="hidden lg:block">
      <div class="w-full">
        <div class="flex items-center justify-center px-6 py-3">
          <div class="flex items-center flex-wrap gap-4 justify-center">
            <NuxtLink 
              to="/" 
              class="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group"
            >
              Главная
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
            </NuxtLink>

            <NuxtLink 
              to="/tarot" 
              class="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group"
            >
              Таро
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
            </NuxtLink>

            <NuxtLink 
              to="/natal" 
              class="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group"
            >
              Карта
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
            </NuxtLink>

            <NuxtLink 
              to="/library" 
              class="text-white hover:text-purple-300 transition-colors duration-200 font-medium relative group"
            >
              Школа
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
            </NuxtLink>

            <NuxtLink 
              to="/video-creator" 
              class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              🎬 Создатель видео
            </NuxtLink>

            <!-- Ссылки для Админа -->
            <template v-if="isAdmin">
              <NuxtLink 
                to="/constructor" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Конструктор продуктов
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
              <NuxtLink 
                to="/users" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Пользователи
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
              <NuxtLink 
                to="/customers" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Кастомеры
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
              <NuxtLink 
                to="/payments" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Оплаты
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
              <NuxtLink 
                to="/daily-messaging" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Ежедневные сообщения
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
              <NuxtLink 
                to="/ai-settings" 
                class="text-white hover:text-purple-300 transition-colors duration-200 relative group"
              >
                Настройки AI
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-200"></span>
              </NuxtLink>
            </template>

            <!-- Ссылки для Кастомера -->
            <template v-if="isCustomer">
              <!-- Трафик всегда доступен -->
              <NuxtLink 
                to="/subscription" 
                class="text-white hover:text-gray-300"
              >
                Подписка
              </NuxtLink>

              <a
                href="https://taplink.cc/sistema/p/1008398/"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ТРАФИК
              </a>

              <!-- Остальные ссылки с индивидуальной проверкой доступности -->
              <template v-if="!isMenuItemLocked('messenger')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Мессенджер</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/messenger" 
                  class="text-white hover:text-gray-300"
                >
                  Мессенджер
                </NuxtLink>
              </template>

              <template v-if="!isMenuItemLocked('constructor')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Конструктор</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/constructor" 
                  class="text-white hover:text-gray-300"
                >
                  Конструктор продуктов
                </NuxtLink>
              </template>

              <template v-if="!isMenuItemLocked('users')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Пользователи</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/users" 
                  class="text-white hover:text-gray-300"
                >
                  Пользователи
                </NuxtLink>
              </template>

              <template v-if="!isMenuItemLocked('messages')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Сообщения</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/messages" 
                  class="text-white hover:text-gray-300"
                >
                  Сообщения
                </NuxtLink>
              </template>

              <template v-if="!isMenuItemLocked('settings')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Настройки</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/settings" 
                  class="text-white hover:text-gray-300"
                >
                  Мои боты
                </NuxtLink>
              </template>

              <template v-if="!isMenuItemLocked('payments')">
                <div class="flex items-center text-gray-500 cursor-not-allowed">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Оплаты</span>
                </div>
              </template>
              <template v-else>
                <NuxtLink 
                  to="/payments" 
                  class="text-white hover:text-gray-300"
                >
                  Оплаты
                </NuxtLink>
              </template>
            </template>

            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Выйти
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const router = useRouter()
const { isAdmin, isCustomer, tariff, username } = useAuth()
const isMobileMenuOpen = ref(false)

// Конфигурация доступности пунктов меню
const menuItemsAvailability = {
  subscription: ['none', 'basic', 'pro'],
  messenger: ['basic', 'pro'],
  constructor: ['basic', 'pro'],
  users: ['basic', 'pro'],
  messages: ['pro'],
  settings: ['pro'],
  payments: ['pro']
}

// Функция проверки доступности пункта меню
function isMenuItemLocked(menuItem) {
  // Админам всегда доступны все пункты меню
  if (isAdmin.value) return true
  
  // Проверяем доступность для текущего тарифа
  const availableForTariffs = menuItemsAvailability[menuItem]
  return availableForTariffs && availableForTariffs.includes(tariff)
}

function closeMenu() {
  isMobileMenuOpen.value = false
}

function handleLogout() {
  const cookie = useCookie('bearer-token')
  cookie.value = null
  router.push('/login')
}
</script>

<style scoped>
/* Стили для корректного переноса длинных названий пунктов меню */
nav a {
  white-space: nowrap;
  display: inline-block;
  line-height: 1.5;
}

nav .flex-wrap {
  gap: 0.75rem;
}

/* Улучшение отступов для кнопок */
nav button {
  white-space: nowrap;
}
</style>