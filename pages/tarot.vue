<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      <!-- Анимированный фон с звездами -->
      <div class="absolute inset-0 stars-container">
        <div v-for="i in belongings" :key="i" class="star" :style="getStarStyle(i)"></div>
      </div>

      <!-- Градиентное свечение -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      
      <div class="relative z-10 max-w-6xl w-full">
        <!-- Заголовок -->
        <div class="text-center mb-8">
          <h1 class="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-2xl">
            <span class="bg-gradient-to-r from-yellow-200 via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient">
              🔮 Расклад Таро
            </span>
          </h1>
          <p class="text-purple-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Сосредоточьтесь на волнующем вопросе и позвольте картам показать путь к ответу
          </p>
        </div>
        
        <!-- Пока тасуется -->
        <div v-if="selectedCards.length === 0" class="text-center">
          <div class="inline-block">
            <div class="flex items-center justify-center space-x-4 mb-4">
              <div class="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
              <div class="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
              <div class="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
            </div>
            <p class="text-white text-xl font-semibold drop-shadow-lg">
              🔮 Тасуем колоду...
            </p>
          </div>
        </div>

        <!-- Анимация выпадения карт -->
        <div v-if="selectedCards.length > 0" class="flex flex-wrap justify-center gap-6 sm:gap-8 mt-12 relative">
          <div
            v-for="(card, index) in selectedCards"
            :key="index"
            class="perspective-card relative"
            :style="{ 
              transform: `translateY(${positions[index]}px) scale(${scales[index]}) rotate(${rotations[index]}deg)`,
              opacity: opacities[index],
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${index * 0.6}s`,
              filter: flipped ? 'drop-shadow(0 25px 50px rgba(255, 215, 0, 0.5))' : 'none'
            }"
          >
            <div
              class="relative w-32 h-44 sm:w-36 sm:h-52 lg:w-40 lg:h-56 duration-700 transform-style-preserve-3d"
              :class="{ 'rotate-y-180': flipped }"
            >
              <!-- Рубашка с градиентом -->
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 shadow-2xl backface-hidden border-2 border-yellow-500/30"></div>
              <div class="absolute inset-2 rounded-xl bg-gradient-to-t from-black/40 to-transparent backface-hidden pointer-events-none"></div>
              
              <!-- Лицевая сторона -->
              <img
                :src="`/cards/${card}.jpg`"
                class="absolute w-full h-full rounded-2xl shadow-2xl backface-hidden rotate-y-180 object-cover border-2 border-white/10"
              />
            </div>
            <!-- Свечение вокруг карты -->
            <div v-if="flipped" class="absolute inset-0 -z-10 bg-yellow-400/30 rounded-2xl blur-xl animate-pulse"></div>
          </div>
        </div>

        <!-- Кнопка для раскрытия -->
        <div v-if="selectedCards.length > 0 && !flipped && cardsShown" class="mt-12 text-center animate-fade-in">
          <button
            @click="revealCards"
            class="group relative px-12 py-5 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 text-purple-950 font-bold text-xl rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] active:scale-95 overflow-hidden"
          >
            <!-- Анимированный фон -->
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-300 to-yellow-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Блики -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <span class="relative z-10 flex items-center space-x-3">
              <span class="text-2xl drop-shadow-lg">🔮</span>
              <span class="drop-shadow-md">Раскрыть карты судьбы</span>
              <span class="text-2xl drop-shadow-lg">✨</span>
            </span>
            
            <!-- Декоративные точки вокруг -->
            <div class="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
            <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-400 rounded-full opacity-60 animate-ping" style="animation-delay: 0.3s;"></div>
          </button>
        </div>

        <!-- Результаты -->
        <div v-if="Object.keys(results).length > 0" class="w-full max-w-5xl mx-auto mt-16">
          <div class="text-center mb-8">
            <h2 class="text-white text-2xl sm:text-3xl font-bold mb-2">
              <span class="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                🌟 Ваш расклад готов
              </span>
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
          </div>
          
          <div class="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div 
              v-for="(text, key) in results" 
              :key="key" 
              class="group relative bg-gradient-to-br from-white/95 to-purple-50/95 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/20"
            >
              <!-- Декоративный уголок -->
              <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
              
              <div class="relative">
                <h2 class="text-2xl font-bold mb-4 capitalize bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {{ titles[key] || key }}
                </h2>
                <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {{ text }}
                </p>
              </div>
              
              <!-- Декоративная иконка -->
              <div class="absolute bottom-4 right-4 text-4xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                {{ getIcon(key) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"

const selectedCards = ref([])
const results = ref({})
const flipped = ref(false)
const cardsShown = ref(false)
const config = useRuntimeConfig()

// Словарь переводов
const titles = {
  love: "❤️ Любовь",
  career: "💼 Карьера",
  finance: "💰 Финансы"
}

// Анимационные параметры
const positions = ref([100, 100, 100]) 
const scales = ref([0.5, 0.5, 0.5])
const rotations = ref([-15, 0, 15])  // Поворот карт для эффекта
const opacities = ref([0, 0, 0])

// Массив индексов для звезд
const belongings = computed(() => Array.from({ length: 50 }, (_, i) => i + 1))

// Функция для генерации стилей звезд
function getStarStyle(index) {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const top = Math.random() * 100
  const delay = Math.random() * 3
  const duration = Math.random() * 2 + 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

// Функция для получения иконки
function getIcon(key) {
  const icons = {
    love: "💕",
    career: "💼",
    finance: "💰"
  }
  return icons[key] || "✨"
}      

onMounted(() => {
  const all = Array.from({ length: 78 }, (_, i) => i + 1)
  selectedCards.value = all.sort(() => Math.random() - 0.5).slice(0, 3)

  setTimeout(() => {
    positions.value[0] = 0
    scales.value[0] = 1
    opacities.value[0] = 1
    rotations.value[0] = -5
  }, 500)

  setTimeout(() => {
    positions.value[1] = 0
    scales.value[1] = 1
    opacities.value[1] = 1
    rotations.value[1] = 0
  }, 1100)

  setTimeout(() => {
    positions.value[2] = 0
    scales.value[2] = 1
    opacities.value[2] = 1
    rotations.value[2] = 5
  }, 1700)

  // Показываем кнопку после завершения всех анимаций (последняя карта появляется в 1700ms + delay 1200ms + transition 800ms)
  setTimeout(() => {
    cardsShown.value = true
  }, 3800)
})

async function revealCards() {
  flipped.value = true

  setTimeout(async () => {
    try {
      const res = await fetch(`${config.public.apiBase}/api/tarot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: selectedCards.value })
      })
      results.value = await res.json()
    } catch (e) {
      console.error("Ошибка:", e)
    }
  }, 1000)
}
</script>

<style scoped>
.perspective-card {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

/* Анимация звезд */
.stars-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Анимация градиента текста */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Анимация появления кнопки */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Мобильная адаптивность */
@media (max-width: 640px) {
  .perspective-card {
    transform: scale(0.85);
  }
}
</style>
