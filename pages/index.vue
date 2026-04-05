<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gradient-to-b from-white via-purple-50/40 to-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <section class="relative overflow-hidden rounded-[2rem] border border-purple-200/50 bg-gray-950 px-8 py-10 text-white shadow-2xl md:px-12 md:py-14">
          <div class="absolute inset-0">
            <div class="absolute -left-16 top-0 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
            <div class="absolute right-0 top-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>
            <div class="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"></div>
          </div>

          <div class="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div class="max-w-3xl">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                Платформа для работы с аудиторией, продуктами, оплатами и контентом
              </div>

              <h1 class="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
                Платформа, которая помогает не просто вести базу, а превращать интерес в оплату и повторные продажи
              </h1>
              <p class="mt-5 max-w-2xl text-lg leading-8 text-white/75">
                Здесь пользователь получает единый кабинет для базы клиентов, рассылок, встроенных продуктов, видеобиблиотеки, управления ботами, оплат и выдачи доступа. Всё собрано в одном месте без лишней ручной рутины.
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink
                  to="/register"
                  class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] hover:from-purple-400 hover:to-pink-400"
                >
                  Начать работу
                </NuxtLink>
                <NuxtLink
                  to="/login"
                  class="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  Войти в кабинет
                </NuxtLink>
              </div>

              <div class="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div class="text-2xl font-bold">База</div>
                  <p class="mt-1 text-sm text-white/65">Клиенты, статистика, сегменты и история взаимодействия под рукой</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div class="text-2xl font-bold">Продажи</div>
                  <p class="mt-1 text-sm text-white/65">Продукты, платежи, повторные сделки и сопровождение после оплаты</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div class="text-2xl font-bold">Контент</div>
                  <p class="mt-1 text-sm text-white/65">Школа, видео, встроенные расчеты и боты в одном потоке работы</p>
                </div>
              </div>

              <p class="mt-5 text-xs text-white/50">
                Вход и регистрация доступны по телефону или email. Email также можно использовать для уведомлений и рассылок.
              </p>
            </div>

            <div class="relative">
              <div class="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-white/60">Что дает платформа</p>
                    <h2 class="mt-1 text-2xl font-semibold">Не набор разрозненных инструментов, а единая система работы с клиентом</h2>
                  </div>
                  <div class="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Онлайн
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <div class="rounded-2xl bg-white p-4 text-gray-900">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Клиенты и аналитика</p>
                        <p class="mt-1 text-lg font-semibold">Видно, кто пришел, кто активен и где лежит ваша точка роста</p>
                      </div>
                      <div class="rounded-xl bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700">База</div>
                    </div>
                  </div>

                  <div class="grid gap-4 sm:grid-cols-2">
                    <div class="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                      <p class="text-sm text-white/60">Продукты и школа</p>
                      <p class="mt-1 font-semibold">Курсы, видео и встроенные продукты можно выдавать из одного кабинета</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-gray-900/70 p-4">
                      <p class="text-sm text-white/60">Коммуникации и боты</p>
                      <p class="mt-1 font-semibold">Личные сообщения, массовые рассылки и настройка своих ботов</p>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 p-4">
                    <p class="text-sm text-white/60">Результат</p>
                    <p class="mt-1 text-lg font-semibold">Пользователь получает не просто сервис, а связанный путь: привлечение, продажа, выдача ценности и возврат клиента</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm shadow-purple-100/40">
            <div class="inline-flex rounded-2xl bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700">01</div>
            <h2 class="mt-4 text-xl font-semibold text-gray-900">Собирайте и удерживайте аудиторию</h2>
            <p class="mt-2 text-sm leading-6 text-gray-600">
              Платформа помогает накапливать базу, видеть статистику по пользователям, возвращаться к сегментам и не терять людей после первого касания.
            </p>
          </div>

          <div class="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm shadow-pink-100/40">
            <div class="inline-flex rounded-2xl bg-pink-100 px-3 py-2 text-sm font-semibold text-pink-700">02</div>
            <h2 class="mt-4 text-xl font-semibold text-gray-900">Продавайте через понятную систему</h2>
            <p class="mt-2 text-sm leading-6 text-gray-600">
              Здесь удобно вести продукты, принимать и отслеживать оплаты, выдавать доступы, собирать повторные сделки и выстраивать путь клиента после покупки.
            </p>
          </div>

          <div class="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm shadow-cyan-100/40">
            <div class="inline-flex rounded-2xl bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-700">03</div>
            <h2 class="mt-4 text-xl font-semibold text-gray-900">Усиливайте ценность после оплаты</h2>
            <p class="mt-2 text-sm leading-6 text-gray-600">
              Рассылки, сообщения, видеобиблиотека, обучающие материалы, встроенные расчеты и боты помогают удерживать внимание и повышать доверие к вашему продукту.
            </p>
          </div>
        </section>

        <section class="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div class="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Что получает пользователь</p>
            <h2 class="mt-3 text-3xl font-bold text-gray-900">Платформа закрывает путь от первого контакта до сопровождения клиента</h2>
            <p class="mt-4 text-gray-600 leading-7">
              Вместо набора отдельных решений пользователь получает связанное пространство, где можно вести базу, работать с продуктами, публиковать контент, запускать коммуникации и контролировать платежи.
            </p>
            <div class="mt-6 space-y-3 text-sm text-gray-700">
              <div class="flex gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <span class="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500"></span>
                <span>База клиентов, статистика и активность пользователей собираются в одном кабинете.</span>
              </div>
              <div class="flex gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <span class="mt-1 h-2.5 w-2.5 rounded-full bg-pink-500"></span>
                <span>Сообщения, массовые рассылки и broadcast помогают быстро доходить до своей аудитории.</span>
              </div>
              <div class="flex gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <span class="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                <span>Школа, видео, встроенные продукты, боты и оплаты усиливают ценность и монетизацию продукта.</span>
              </div>
            </div>
          </div>

          <div class="rounded-[2rem] border border-gray-200 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-700 p-8 text-white shadow-xl">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Зачем заходить в платформу</p>
            <h2 class="mt-3 text-3xl font-bold">Чтобы управлять не только трафиком, но и всем, что происходит после него</h2>
            <p class="mt-4 max-w-xl text-white/80 leading-7">
              Платформа помогает довести пользователя от первого контакта до оплаты, затем выдать контент, продолжить коммуникацию и вернуть человека на повторные предложения.
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <NuxtLink
                to="/register"
                class="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-white/90"
              >
                Перейти к регистрации
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                У меня уже есть аккаунт
              </NuxtLink>
            </div>
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