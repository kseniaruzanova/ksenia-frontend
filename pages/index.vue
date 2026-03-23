<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 p-8 md:p-12 text-white shadow-xl border border-purple-500/20">
          <div class="max-w-2xl">
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
              Система для управления продуктами, клиентами и рассылками
            </h1>
            <p class="mt-4 text-white/80 text-lg">
              Вход и регистрация доступны по телефону или email. Email также используется для рассылки и уведомлений.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-3">
              <NuxtLink
                to="/login"
                class="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-white/90 transition shadow-lg"
              >
                Войти
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="inline-flex justify-center items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition shadow-lg"
              >
                Регистрация (телефон / email)
              </NuxtLink>
            </div>
            <p class="mt-3 text-xs text-white/60">
              Регистрируясь, вы соглашаетесь получать сервисные уведомления и рассылки (можно отписаться).
            </p>
          </div>
        </section>

        <section class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div class="text-2xl mb-3">👥</div>
            <h2 class="text-lg font-semibold text-gray-900">База клиентов</h2>
            <p class="mt-2 text-gray-600 text-sm">Сбор контактов и сегментация под разные продукты.</p>
          </div>
          <div class="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div class="text-2xl mb-3">📨</div>
            <h2 class="text-lg font-semibold text-gray-900">Рассылки</h2>
            <p class="mt-2 text-gray-600 text-sm">Email/сообщения, статистика и повторные касания.</p>
          </div>
          <div class="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div class="text-2xl mb-3">🧩</div>
            <h2 class="text-lg font-semibold text-gray-900">Продукты и доступы</h2>
            <p class="mt-2 text-gray-600 text-sm">Тарифы, контент, выдача доступов и управление.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const router = useRouter()

onMounted(() => {
  if (user.value) router.replace('/cabinet')
})
</script> 