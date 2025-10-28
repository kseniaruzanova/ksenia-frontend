<template>
  <div>
    <Navbar />
    <template v-if="tariff=='none'">
      <TariffRestrictionMessage />
    </template>
    <template v-else>
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Заголовок -->
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-3">Настройки</h1>
            <p class="text-lg text-gray-600">Управляйте настройками ваших ботов и сервисов</p>
          </div>

          <!-- Форма с настройками -->
          <form v-if="settings" @submit.prevent="updateSettings">
            <!-- Блок "Бот пророк" -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Бот пророк</h2>
                  <p class="text-sm text-gray-500">Настройки бота для предсказаний и гороскопов</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="currentPrice" class="block text-sm font-semibold text-gray-700 mb-2">
                    Текущая цена
                  </label>
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model.number="settings.currentPrice" 
                      id="currentPrice" 
                      placeholder="Введите текущую цену"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label for="basePrice" class="block text-sm font-semibold text-gray-700 mb-2">
                    Базовая цена
                  </label>
                  <div class="relative">
                    <input 
                      type="number" 
                      v-model.number="settings.basePrice" 
                      id="basePrice" 
                      placeholder="Введите базовую цену"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label for="cardNumber" class="block text-sm font-semibold text-gray-700 mb-2">
                    Номер карты
                  </label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    <input 
                      type="text" 
                      v-model="settings.cardNumber" 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000"
                      class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label for="cardHolderName" class="block text-sm font-semibold text-gray-700 mb-2">
                    Имя держателя карты
                  </label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <input 
                      type="text" 
                      v-model="settings.cardHolderName" 
                      id="cardHolderName" 
                      placeholder="Ivan Petrov"
                      class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 mt-6">
                <div>
                  <label for="otherCountries" class="block text-sm font-semibold text-gray-700 mb-2">
                    Ссылка для других стран
                  </label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <input 
                      type="url" 
                      v-model="settings.otherCountries" 
                      id="otherCountries" 
                      placeholder="https://example.com"
                      class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label for="sendTo" class="block text-sm font-semibold text-gray-700 mb-2">
                    <span class="flex items-center">
                      Отправлять на
                      <span class="ml-2 text-xs text-gray-500">(email/id)</span>
                    </span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <input 
                      type="text" 
                      v-model="settings.sendTo" 
                      id="sendTo" 
                      placeholder="example@email.com или 123456789"
                      class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Блок "Проводник воли" -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Проводник воли</h2>
                  <p class="text-sm text-gray-500">Настройки токена для бота проводника воли</p>
                </div>
              </div>
              
              <div>
                <label for="willGuideToken" class="block text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center">
                    Токен
                    <span class="ml-2 text-xs text-gray-500 font-normal">(секретный ключ для доступа)</span>
                  </span>
                </label>
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                  <input 
                    type="password" 
                    v-model="settings.willGuideToken" 
                    id="willGuideToken" 
                    placeholder="Введите токен"
                    class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white" 
                  />
                  <button 
                    type="button"
                    @click="toggleTokenVisibility"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg v-if="showToken" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Кнопка сохранения -->
            <div class="flex justify-center">
              <button 
                type="submit" 
                :disabled="loading" 
                class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span class="flex items-center">
                  <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
                </span>
              </button>
            </div>

            <!-- Уведомления -->
            <transition name="slide-fade">
              <div v-if="notification.message" :class="['mt-6 p-4 rounded-lg flex items-center', notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200']">
                <svg v-if="notification.type === 'success'" class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ notification.message }}</span>
              </div>
            </transition>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "customer",
});

const { user, tariff } = useAuth();
const config = useRuntimeConfig();

const settings = ref(null);
const loading = ref(false);
const notification = ref({ message: '', type: '' });
const showToken = ref(false);

// Загрузка настроек при монтировании компонента
onMounted(async () => {
  if (!user.value?.id) {
    notification.value = { message: 'Не удалось определить ID пользователя.', type: 'error' };
    return;
  }
  loading.value = true;
  try {
    const response = await fetch(`${config.public.apiBase}/api/customers/${user.value.id}/settings`, {
      headers: { 'Authorization': `Bearer ${useCookie('bearer-token').value}` }
    });
    if (!response.ok) throw new Error('Не удалось загрузить настройки.');
    
    const data = await response.json();
    settings.value = data;
  } catch (err) {
    notification.value = { message: err.message, type: 'error' };
  } finally {
    loading.value = false;
  }
});

// Переключение видимости токена
function toggleTokenVisibility() {
  showToken.value = !showToken.value;
  const input = document.getElementById('willGuideToken');
  if (input) {
    input.type = showToken.value ? 'text' : 'password';
  }
}

// Обновление настроек
async function updateSettings() {
  if (!user.value?.id || !settings.value) return;
  
  loading.value = true;
  notification.value = { message: '', type: '' };
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/customers/${user.value.id}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('bearer-token').value}`
      },
      body: JSON.stringify(settings.value)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при сохранении настроек.');
    }
    
    notification.value = { message: 'Настройки успешно сохранены!', type: 'success' };
    
    // Автоматически скрыть уведомление через 5 секунд
    setTimeout(() => {
      notification.value = { message: '', type: '' };
    }, 5000);
  } catch (err) {
    notification.value = { message: err.message, type: 'error' };
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>