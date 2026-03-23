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
                'bg-gradient-to-r from-green-500 to-green-600': tariff === 'pro',
                'bg-gradient-to-r from-amber-500 to-amber-600': tariff === 'tg_max'
              }"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                :class="{
                  'bg-gray-300': tariff === 'none',
                  'bg-blue-400': tariff === 'basic',
                  'bg-green-400': tariff === 'pro',
                  'bg-amber-400': tariff === 'tg_max'
                }"
              >
                <span class="text-xl">
                  <span v-if="tariff === 'none'">🚫</span>
                  <span v-else-if="tariff === 'basic'">⭐</span>
                  <span v-else-if="tariff === 'pro'">🌱</span>
                  <span v-else-if="tariff === 'tg_max'">📢</span>
                </span>
              </div>

              <p class="text-sm opacity-80" v-if="tariff !== 'none'">Текущий тариф</p>
              <p class="text-2xl font-bold leading-snug mb-2" v-if="tariff !== 'none'">{{ tariffText }}</p>

              <!-- Кнопка «Перейти» только для tg_max -->
              <div v-if="tariff === 'tg_max'" class="mt-4">
                <div v-if="tgInviteLinkLoading" class="text-amber-100 text-sm">Загрузка...</div>
                <div v-else-if="tgInviteLinkError" class="text-amber-100 text-sm">{{ tgInviteLinkError }}</div>
                <a
                  v-else-if="tgInviteLink"
                  :href="tgInviteLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/30"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Перейти в канал
                </a>
              </div>

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

        <!-- Статистика пользователей (не показывать для tg_max) -->
        <template v-if="tariff !== 'none' && tariff !== 'tg_max'">
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

        <!-- Активные функции тарифа (не для tg_max) -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8" v-if="tariff !== 'none' && tariff !== 'tg_max'">
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

        <!-- Встроенные продукты (не для tg_max) -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8" v-if="tariff !== 'none' && tariff !== 'tg_max'">
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
      </div>
    </div>
  </div>
</template>

<script setup>
const { tariff, isCustomer } = useAuth()
const config = useRuntimeConfig()
const token = useCookie('bearer-token')
const loading = ref(true)
const stats = ref(null)

const tgInviteLink = ref('')
const tgInviteLinkLoading = ref(false)
const tgInviteLinkError = ref('')

const tariffText = computed(() => {
  switch (tariff.value) {
    case 'none':
      return 'Нет подписки'
    case 'basic':
      return 'БАЗОВЫЙ ДОСТУП'
    case 'pro':
      return 'РОСТ'
    case 'tg_max':
      return 'Доступ к ТГ и макс каналу'
    default:
      return 'Не указан'
  }
})

async function fetchTgInviteLink() {
  if (tariff.value !== 'tg_max' || !token.value) return
  tgInviteLinkLoading.value = true
  tgInviteLinkError.value = ''
  tgInviteLink.value = ''
  try {
    const res = await fetch(`${config.public.apiBase}/api/customers/tg-channel-invite-link`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' }
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      tgInviteLinkError.value = data.message || 'Не удалось получить ссылку'
      return
    }
    tgInviteLink.value = data.link || ''
  } catch (e) {
    tgInviteLinkError.value = 'Ошибка сети'
  } finally {
    tgInviteLinkLoading.value = false
  }
}

function formatMoney(amount) {
  if (!amount) return '0'
  return new Intl.NumberFormat('ru-RU').format(amount)
}

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
    totalBroadcasts: 0,
    totalEarnings: 0
  }
}

async function fetchUserStats() {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/api/statistics/general`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (!response.ok) {
      throw new Error('Не удалось загрузить статистику')
    }

    const data = await response.json()
    const users = data.users || data || []

    stats.value = {
      ...calculateStats(users),
      totalEarnings: data.paymentsSum
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

onMounted(() => {
  if (!token.value) return
  fetchUserStats()
  if (tariff.value === 'tg_max') fetchTgInviteLink()
})
</script>

