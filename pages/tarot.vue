<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gradient-to-b from-purple-800 to-indigo-900 flex flex-col items-center justify-center p-6">
      
      <h1 class="text-white text-2xl sm:text-3xl font-semibold text-center mb-6 drop-shadow-lg">
        ✨ Подумайте о волнующем вопросе и нажмите <span class="text-yellow-300">"Получить расклад"</span>
      </h1>
      
      <!-- Пока тасуется -->
      <div v-if="selectedCards.length === 0" class="text-white text-xl animate-pulse">
        🔮 Тасуем колоду...
      </div>

      <!-- Анимация выпадения карт -->
      <div v-if="selectedCards.length > 0" class="flex flex-wrap justify-center gap-4 mt-10 relative">
        <div
          v-for="(card, index) in selectedCards"
          :key="index"
          class="w-28 h-40 sm:w-32 sm:h-48 perspective"
          :style="{ 
            transform: `translateY(${positions[index]}px) scale(${scales[index]})`,
            opacity: opacities[index],
            transition: 'all 0.8s ease',
            transitionDelay: `${index * 0.6}s`
          }"
        >
          <div
            class="relative w-full h-full duration-700 transform-style-preserve-3d"
            :class="{ 'rotate-y-180': flipped }"
          >
            <!-- Рубашка -->
            <img
              src="/cards/back.jpg"
              class="absolute w-full h-full rounded-xl shadow-lg backface-hidden"
            />
            <!-- Лицевая сторона -->
            <img
              :src="`/cards/${card}.jpg`"
              class="absolute w-full h-full rounded-xl shadow-lg backface-hidden rotate-y-180"
            />
          </div>
        </div>
      </div>

      <!-- Кнопка для раскрытия -->
      <div v-if="selectedCards.length > 0 && !flipped" class="mt-8">
        <button
          @click="revealCards"
          class="px-6 py-3 bg-yellow-400 text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-yellow-500 transition"
        >
          Получить расклад
        </button>
      </div>

      <!-- Текст -->
      <div v-if="Object.keys(results).length > 0" class="w-full max-w-3xl mt-10 grid md:grid-cols-3 gap-6">
        <div v-for="(text, key) in results" :key="key" class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-lg font-bold text-indigo-600 mb-2 capitalize">
            {{ titles[key] || key }}
          </h2>
          <p class="text-gray-700 text-sm leading-relaxed">{{ text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const selectedCards = ref([])
const results = ref({})
const flipped = ref(false)
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
const opacities = ref([0, 0, 0])      

onMounted(() => {
  const all = Array.from({ length: 78 }, (_, i) => i + 1)
  selectedCards.value = all.sort(() => Math.random() - 0.5).slice(0, 3)

  setTimeout(() => {
    positions.value[0] = 0
    scales.value[0] = 1
    opacities.value[0] = 1
  }, 500)

  setTimeout(() => {
    positions.value[1] = 0
    scales.value[1] = 1
    opacities.value[1] = 1
  }, 1100)

  setTimeout(() => {
    positions.value[2] = 0
    scales.value[2] = 1
    opacities.value[2] = 1
  }, 1700)
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
.perspective {
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

/* адаптивность */
@media (max-width: 640px) {
  .w-28 {
    width: 5.5rem;
  }
  .h-40 {
    height: 8rem;
  }
}
</style>
