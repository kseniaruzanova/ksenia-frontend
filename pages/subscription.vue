<template>
  <div>
    <Navbar />
    
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div class="max-w-6xl mx-auto px-4 space-y-8">
        <!-- Current plan banner -->
        <section
          class="w-full rounded-2xl shadow-lg p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          :class="{
            'bg-gradient-to-r from-gray-400 to-gray-500': tariff === 'none',
            'bg-gradient-to-r from-blue-500 to-blue-600': tariff === 'basic',
            'bg-gradient-to-r from-green-500 to-green-600': tariff === 'pro'
          }"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
              :class="{
                'bg-gray-300': tariff === 'none',
                'bg-blue-400': tariff === 'basic',
                'bg-green-400': tariff === 'pro'
              }"
            >
              <span class="text-2xl">
                <span v-if="tariff === 'none'">🚫</span>
                <span v-else-if="tariff === 'basic'">⭐</span>
                <span v-else-if="tariff === 'pro'">🌱</span>
              </span>
            </div>
            <div>
              <p class="text-sm opacity-80">Текущий тариф</p>
              <p class="text-2xl font-bold">{{ tariffText }}</p>
            </div>
          </div>
        </section>

        <!-- Plan cards -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- BASIC -->
          <article
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                ⭐ БАЗОВЫЙ
              </h2>
              <p class="text-lg font-medium text-gray-600 mt-1">4 900₽ / мес</p>
            </div>

            <ul class="text-gray-700 space-y-3 flex-1 mb-6">
              <li class="flex gap-2"><span>✅</span>Конструктор продуктов (до 3)</li>
              <li class="flex gap-2"><span>✅</span>Мессенджер, база клиентов, статистика</li>
              <li class="flex gap-2"><span>✅</span>ИИ-пророк и Проводник Воли</li>
              <li class="flex gap-2"><span>⚠️</span>Трафик заморожен — нужен «РОСТ»</li>
              <li class="flex gap-2"><span>🚫</span>Нет обновлений и новых шаблонов</li>
            </ul>

            <button
              @click="startPayment('basic')"
              class="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition shadow"
              :disabled="loading || tariff === 'pro'"
            >
              {{ tariff === 'basic' ? 'Продлить' : 'Купить' }} «БАЗОВЫЙ»
            </button>
          </article>

          <!-- PRO -->
          <article
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-8 flex flex-col border-2 border-green-400"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                🌱 РОСТ
              </h2>
              <p class="text-lg font-medium text-gray-600 mt-1">9 900₽ / мес</p>
            </div>

            <ul class="text-gray-700 space-y-3 flex-1 mb-6">
              <li class="flex gap-2"><span>✅</span>Полный доступ и обновления</li>
              <li class="flex gap-2"><span>✅</span>Рабочий трафик</li>
              <li class="flex gap-2"><span>✅</span>Новые авто-продукты и шаблоны</li>
              <li class="flex gap-2"><span>✅</span>Витрина экспертов, мультизапуски</li>
              <li class="flex gap-2"><span>✅</span>Поддержка, база знаний, клуб</li>
            </ul>

            <button
              @click="startPayment('pro')"
              class="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition shadow"
              :disabled="loading"
            >
              {{ ctaProLabel }}
            </button>
          </article>
        </section>

        <!-- Info for NONE -->
        <section v-if="tariff === 'none'" class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700 shadow-sm text-center">
          <p class="mb-2 font-medium">📌 Ты пока без тарифа</p>
          <p>Выбери «РОСТ», чтобы активировать трафик и новые возможности.</p>
        </section>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

// Предполагается, что у тебя есть useAuth() с текущим тарифом
const { tariff } = useAuth()
const loading = ref(false)
const token = useCookie('bearer-token')

const tariffText = computed(() => {
  switch (tariff) {
    case 'none': return 'Нет подписки'
    case 'basic': return 'БАЗОВЫЙ ДОСТУП'
    case 'pro': return 'РОСТ'
  }
})

const ctaProLabel = computed(() => {
  if (tariff === 'pro') return 'Продлить «РОСТ»'
  if (tariff === 'basic') return 'Улучшить до «РОСТ»'
  return 'Купить «РОСТ»'
})

const config = useRuntimeConfig()

async function startPayment(plan: 'basic'|'pro') {
  try {
    loading.value = true
    const response = await fetch(`${config.public.apiBase}/api/prodamus/create/link/${plan}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    const data = await response.json()
    
    if (data?.link) {
      window.location.href = data.link
    } else {
      throw new Error('Не удалось получить ссылку на оплату')
    }
  } catch (e) {
    console.error(e)
    // Можно заменить на собственный toast
    alert('Ошибка создания платежа. Попробуйте снова.')
  } finally {
    loading.value = false
  }
}
</script>
