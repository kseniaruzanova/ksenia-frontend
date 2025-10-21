<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Добро пожаловать в систему
          </h1>
          <p class="mt-4 text-lg text-gray-500">
            Вы успешно авторизованы
          </p>
        </div>

        <template v-if="isCustomer">
          <!-- Информация о текущей подписке -->
          <div class="mb-6"> 
            <div
              class="w-full rounded-xl shadow-md p-5 text-white flex flex-col items-center justify-center text-center"
              :class="{
                'bg-gradient-to-r from-gray-400 to-gray-500': tariff === 'none',
                'bg-gradient-to-r from-blue-500 to-blue-600': tariff === 'basic',
                'bg-gradient-to-r from-green-500 to-green-600': tariff === 'pro'
              }"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                :class="{
                  'bg-gray-300': tariff === 'none',
                  'bg-blue-400': tariff === 'basic',
                  'bg-green-400': tariff === 'pro'
                }"
              >
                <span class="text-xl">
                  <span v-if="tariff === 'none'">🚫</span>
                  <span v-else-if="tariff === 'basic'">⭐</span>
                  <span v-else-if="tariff === 'pro'">🌱</span>
                </span>
              </div>

              <p class="text-sm opacity-80" v-if="tariff !== 'none'">Текущий тариф</p>
              <p class="text-2xl font-bold leading-snug mb-2" v-if="tariff !== 'none'">{{ tariffText }}</p>
              
              <div v-if="tariff === 'none'" class="mt-2">
                <p class="text-xl font-bold mb-2">Ваш кабинет заблокирован</p>
                <p class="text-sm mb-3">Все функции и база подписчиков подлежат автоудалению через 10 дней</p>
                <a 
                  href="/subscription" 
                  class="inline-block bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Оплатить подписку
                </a>
              </div>
            </div>
          </div>
        </template>

        <!-- Статистика пользователей -->
        <template v-if="tariff!='none'">
          <div v-if="loading" class="text-center">
            <p class="text-gray-500">Загрузка статистики...</p>
          </div>
          
          <div v-else-if="stats" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">📊 Статистика ваших пользователей</h2>
            
            <!-- Основные метрики -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-blue-100 text-sm font-medium">ваша БАЗА пользователей</p>
                    <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <span class="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              
              <!-- <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-green-100 text-sm font-medium">Активных сегодня</p>
                    <p class="text-3xl font-bold">{{ stats.todayActive }}</p>
                  </div>
                  <div class="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span class="text-2xl">⚡</span>
                  </div>
                </div>
              </div>
              -->
              <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-purple-100 text-sm font-medium">Новых за неделю</p>
                    <p class="text-3xl font-bold">{{ stats.weeklyNew }}</p>
                  </div>
                  <div class="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                    <span class="text-2xl">🆕</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Дополнительные метрики -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-yellow-100 text-sm font-medium">Вы отправили рассылок</p>
                    <p class="text-3xl font-bold">{{ stats.totalBroadcasts }}</p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span class="text-2xl">📧</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="text-emerald-100 text-sm font-medium">Вы заработали</p>
                    <p class="text-3xl font-bold">{{ formatMoney(stats.totalEarnings) }} ₽</p>
                  </div>
                  <div class="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center">
                    <span class="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Активные функции тарифа -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8" v-if="tariff !== 'none'">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ваши активные функции тарифа:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">База клиентов</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Личный кабинет управления</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Мессенджер и рассылки</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Дополнительные проводники и ассистенты</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Конструктор продуктов</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Новые апгрейды</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Профиль на платформе</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Сообщество избранных</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Трафик под ключ</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Персональный ИИ-бот</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Ассистент-консультант (от вашего лица)</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Сценарии продающих диалогов</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Встроенные продукты и апсейлы</span>
              </div>
              <div class="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span class="text-green-600 mr-3">🔻</span>
                <span class="text-gray-800">Автооплаты и повторные сделки</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Встроенные продукты -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8" v-if="tariff !== 'none'">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Вы используете встроенные продукты:</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Матрица жизни и коды жизни (калькулятор + трактовки)</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Проводник Воли</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Проводник Будущего</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Проводник Таро Оракул</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Расчет 4 кода денег</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Расчет 3 кода пробуждения</span>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Расчет «Застой, удар, цикл, выход из кризиса»</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Расчет «Мужская ось и деньги + ошибка прошлой жизни»</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Тароскоп на любые месяцы</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Архетип на месяц</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Ошибка прошлого воплощения и задача на жизнь</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Денежный блок и сверх-возможности</span>
              </div>
              <div class="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span class="text-blue-600 mr-3">🔻</span>
                <span class="text-gray-800">Архетип и тень</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            @click="handleLogout"
            class="mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const { tariff, isCustomer } = useAuth();
const tariffText = computed(() => {
  switch (tariff) {
    case 'none':
      return 'Нет подписки'
    case 'basic':
      return 'БАЗОВЫЙ ДОСТУП'
    case 'pro':
      return 'РОСТ'
    default:
      return 'Не указан'
  }
})
const router = useRouter()
const config = useRuntimeConfig()
const token = useCookie('bearer-token')
const loading = ref(true)
const stats = ref(null)

refreshToken()

// Форматирование денежных сумм
function formatMoney(amount) {
  if (!amount) return '0'
  return new Intl.NumberFormat('ru-RU').format(amount)
}

// Вычисление статистики из данных пользователей
function calculateStats(users) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const todayActive = users.filter(user => {
    if (!user.updatedAt) return false
    const userDate = new Date(user.updatedAt)
    return userDate >= today
  }).length

  const weeklyNew = users.filter(user => {
    if (!user.createdAt) return false
    const userDate = new Date(user.createdAt)
    return userDate >= weekAgo
  }).length

  return {
    totalUsers: users.length,
    todayActive,
    weeklyNew,
    totalBroadcasts: 0, // Пока статичное значение
    totalEarnings: 0 // Пока статичное значение
  }
}

// Загрузка статистики пользователей
async function fetchUserStats() {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/statistics/general`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      throw new Error('Не удалось загрузить статистику')
    }

    const data = await response.json()
    const users = data.users || data || []

    stats.value = {
      ...calculateStats(users),
      totalEarnings: data.paymentsSum,
    }
  } catch (err) {
    console.error('Ошибка загрузки статистики:', err)
    stats.value = {
      totalUsers: 0,
      todayActive: 0,
      weeklyNew: 0,
      totalBroadcasts: 0,
      totalEarnings: 0
    }
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  const cookie = useCookie('bearer-token')
  cookie.value = null
  router.push('/login')
}

async function refreshToken() {
  try {
    // Берем текущий токен из куки
    const cookie = useCookie('bearer-token')
    const oldToken = cookie.value

    if (!oldToken) {
      throw new Error('Нет сохранённого токена')
    }

    const response = await fetch(`${config.public.apiBase}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oldToken}`
      }
      // body не нужен, бэк работает только с заголовком
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при обновлении токена')
    }

    // Сохраняем новый токен в куки
    cookie.value = data.token

    console.log('✅ Token refreshed', data)

    // Можно обновить user state или просто редиректнуть
    router.push('/')
  } catch (e) {
    
  }
}


// Загружаем статистику при монтировании компонента
onMounted(() => {
  fetchUserStats()
})
</script> 