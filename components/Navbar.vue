<template>
  <nav class="bg-gray-800">
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
          class="text-white hover:text-gray-300 text-sm"
        >
          Выйти
        </button>
      </div>

      <!-- Выпадающее меню для мобильных -->
      <div
        v-if="isMobileMenuOpen"
        class="px-4 pb-4 bg-gray-800"
      >
        <div class="space-y-2">
          <NuxtLink 
            to="/" 
            class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
            @click="closeMenu"
          >
            Главная
          </NuxtLink>

          <NuxtLink 
            to="/tarot" 
            class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
            @click="closeMenu"
          >
            Таро
          </NuxtLink>

          <NuxtLink 
            to="/natal" 
            class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
            @click="closeMenu"
          >
            Карта
          </NuxtLink>

          <NuxtLink 
            to="/library" 
            class="block text-white hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
            @click="closeMenu"
          >
            Школа
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
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/" 
              class="text-white hover:text-gray-300"
            >
              Главная
            </NuxtLink>

            <NuxtLink 
              to="/tarot" 
              class="text-white hover:text-gray-300"
            >
              Таро
            </NuxtLink>

            <NuxtLink 
              to="/natal" 
              class="text-white hover:text-gray-300"
            >
              Карта
            </NuxtLink>

            <NuxtLink 
              to="/library" 
              class="text-white hover:text-gray-300"
            >
              Школа
            </NuxtLink>

            <!-- Ссылки для Админа -->
            <template v-if="isAdmin">
              <NuxtLink 
                to="/constructor" 
                class="text-white hover:text-gray-300"
              >
                Конструктор продуктов
              </NuxtLink>
              <NuxtLink 
                to="/users" 
                class="text-white hover:text-gray-300"
              >
                Пользователи
              </NuxtLink>
              <NuxtLink 
                to="/customers" 
                class="text-white hover:text-gray-300"
              >
                Кастомеры
              </NuxtLink>
              <NuxtLink 
                to="/payments" 
                class="text-white hover:text-gray-300"
              >
                Оплаты
              </NuxtLink>
              <NuxtLink 
                to="/daily-messaging" 
                class="text-white hover:text-gray-300"
              >
                Ежедневные сообщения
              </NuxtLink>
              <NuxtLink 
                to="/ai-settings" 
                class="text-white hover:text-gray-300"
              >
                Настройки AI
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
          </div>
          <button
            @click="handleLogout"
            class="text-white hover:text-gray-300"
          >
            Выйти
          </button>
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