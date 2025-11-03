<template>
    <Navbar />
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center p-2 sm:p-4 md:p-6 transition-all duration-500" :class="{'lg:flex-row lg:items-start lg:justify-center lg:gap-6 lg:px-4': chartData}">

        <!-- Левая часть - форма -->
        <div class="w-full max-w-md transition-all duration-500" :class="{'lg:max-w-sm lg:sticky lg:top-6': chartData}">
            <header class="text-center mb-4 sm:mb-6 lg:mb-8">
                <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700 mb-2">Натальная карта</h1>
                <p class="text-gray-600 text-xs sm:text-sm md:text-base">Рассчитайте вашу персональную астрологическую карту</p>
            </header>

            <!-- Форма -->
            <form @submit.prevent="fetchChart" class="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg w-full space-y-3 sm:space-y-4 border border-gray-100 mb-4 sm:mb-6">
                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Дата и время рождения</label>
                    <input v-model="form.date" type="datetime-local" class="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm" required />
                </div>
                
                <!-- Поле выбора города -->
                <div class="relative">
                    <label class="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Место рождения</label>
                    <div class="relative">
                        <input 
                            v-model="citySearchQuery" 
                            @input="searchCities" 
                            @focus="showCitySuggestions = true"
                            @blur="hideCitySuggestions"
                            type="text" 
                            class="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm" 
                            placeholder="Начните вводить название города..."
                            autocomplete="off"
                        />
                        <div v-if="citySearchLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        </div>
                    </div>
                    
                    <!-- Выпадающий список городов -->
                    <div v-if="showCitySuggestions && citySuggestions.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div 
                            v-for="city in citySuggestions" 
                            :key="city.place_id"
                            @click="selectCity(city)"
                            class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <div class="font-medium text-sm">{{ city.display_name }}</div>
                            <div class="text-xs text-gray-500">{{ city.type }}</div>
                        </div>
                    </div>
                    
                    <!-- Выбранный город -->
                    <div v-if="selectedCity" class="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-medium text-indigo-700">{{ selectedCity.display_name }}</div>
                                <div class="text-xs text-indigo-600">
                                    {{ parseFloat(selectedCity.lat).toFixed(4) }}°N, {{ parseFloat(selectedCity.lon).toFixed(4) }}°E
                                </div>
                            </div>
                            <button 
                                @click="clearSelectedCity" 
                                type="button"
                                class="text-indigo-400 hover:text-indigo-600 transition"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Широта места рождения</label>
                    <input v-model.number="form.lat" @input="limitDecimalPlaces($event, 'lat')" type="number" step="0.0001" class="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm" required placeholder="55.7558" />
                    <p class="text-xs text-gray-500 mt-1">Пример: Москва - 55.7558</p>
                </div>
                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Долгота места рождения</label>
                    <input v-model.number="form.lon" @input="limitDecimalPlaces($event, 'lon')" type="number" step="0.0001" class="mt-1 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm" required placeholder="37.6173" />
                    <p class="text-xs text-gray-500 mt-1">Пример: Москва - 37.6173</p>
                </div>
                <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-600 mb-1">Часовой пояс</label>
                    <div class="flex gap-2">
                        <input v-model.number="form.timezone" type="number" step="1" min="-12" max="14" class="mt-1 flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-sm" required placeholder="3" />
                        <button 
                            @click="updateTimezoneFromCoordinates" 
                            type="button"
                            class="mt-1 px-3 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition text-sm font-medium"
                            title="Автоматически определить часовой пояс по координатам"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Москва: +3, Нью-Йорк: -5. Нажмите кнопку для автоматического определения</p>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl shadow hover:bg-indigo-700 transition font-medium flex items-center justify-center text-sm md:text-base" :disabled="loading">
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ loading ? 'Расчет карты...' : 'Рассчитать натальную карту' }}
                </button>
            </form>

            <!-- Ошибка -->
            <div v-if="error" class="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                <div class="flex items-center text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-medium text-xs sm:text-sm">{{ error }}</span>
                </div>
            </div>
        </div>

        <!-- Правая часть - результаты -->
        <transition name="slide-fade">
            <div v-if="chartData" class="w-full max-w-6xl lg:flex-1 transition-all duration-500 px-2 sm:px-0">
                <!-- Информация о карте -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-gray-100">
                    <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 mb-3 sm:mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Ваша натальная карта
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-sm">
                        <div class="bg-indigo-50 p-2.5 sm:p-3 rounded-lg">
                            <div class="text-xs text-indigo-600 font-semibold">ДАТА И ВРЕМЯ</div>
                            <div class="text-xs sm:text-sm">{{ formatDateTime(chartData.date) }}</div>
                        </div>
                        <div class="bg-indigo-50 p-2.5 sm:p-3 rounded-lg">
                            <div class="text-xs text-indigo-600 font-semibold">МЕСТО РОЖДЕНИЯ</div>
                            <div class="text-xs sm:text-sm">
                                {{ selectedCity ? selectedCity.display_name : 'Координаты' }}
                            </div>
                            <div class="text-xs text-gray-500">
                                {{ chartData.location.latitude.toFixed(4) }}°N, {{ chartData.location.longitude.toFixed(4) }}°E
                            </div>
                        </div>
                        <div class="bg-indigo-50 p-2.5 sm:p-3 rounded-lg">
                            <div class="text-xs text-indigo-600 font-semibold">ЧАСОВОЙ ПОЯС</div>
                            <div class="text-xs sm:text-sm">UTC{{ chartData.location.timezone >= 0 ? '+' : '' }}{{ chartData.location.timezone }}</div>
                        </div>
                    </div>
                    <!-- Подпись о системе домов -->
                    <div class="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p class="text-xs text-blue-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Система расчета домов: Равнодомная (Equal Houses)
                        </p>
                    </div>
                </div>

                <!-- Гороскопы по планетам -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-gray-100">
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Персональные гороскопы
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Получите подробный гороскоп по каждой из планет в вашем знаке зодиака</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <button
                            v-for="planet in planetsWithHoroscopes"
                            :key="planet.key"
                            @click="downloadHoroscope(planet.key, planet.planet)"
                            :disabled="loadingHoroscope"
                            class="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                        >
                            <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0" :style="{ backgroundColor: getPlanetColor(planet.planet) + '20', color: getPlanetColor(planet.planet) }">
                                    {{ getPlanetAbbreviation(planet.planet) }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-semibold text-xs sm:text-sm text-gray-800 truncate">{{ planet.name }}</div>
                                    <div class="text-xs text-gray-500 truncate">{{ planet.description }}</div>
                                </div>
                            </div>
                            <svg v-if="!loadingHoroscope" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <div v-else class="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-indigo-600 flex-shrink-0 ml-2"></div>
                        </button>
                    </div>
                </div>

                <!-- Таблица планета-знак-дом -->
                <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-gray-100">
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Планеты в знаках и домах
                    </h3>
                    <div class="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <table class="w-full text-xs sm:text-sm">
                            <thead>
                                <tr class="bg-indigo-50 text-indigo-700">
                                    <th class="p-2 sm:p-3 text-left">Планета</th>
                                    <th class="p-2 sm:p-3 text-left">Знак</th>
                                    <th class="p-2 sm:p-3 text-left">Дом</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="planet in chartData.planets" :key="planet.name" class="border-b hover:bg-gray-50">
                                    <td class="p-2 sm:p-3 font-medium">{{ getRussianPlanetName(planet.name) }}</td>
                                    <td class="p-2 sm:p-3">
                                        <span class="inline-flex items-center">
                                            <span class="mr-1">{{ getRussianSignName(planet.zodiacSign.sign) }}</span>
                                            <span class="text-xs text-gray-500">{{ planet.zodiacSign.emoji }}</span>
                                        </span>
                                    </td>
                                    <td class="p-2 sm:p-3">{{ getHouseForPlanet(planet.name) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex flex-col xl:flex-row gap-4 sm:gap-6">
                    <!-- Круговая диаграмма -->
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 flex-1 border border-gray-100">
                        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Круговая карта
                        </h3>
                        <div class="relative mx-auto w-full max-w-[500px] aspect-square touch-none">
                            <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" class="w-full h-full">
                                <!-- Фоновый круг -->
                                <circle cx="200" cy="200" r="195" fill="none" stroke="#e5e7eb" stroke-width="2" />

                                <!-- Дополнительные круги для глубины -->
                                <circle cx="200" cy="200" r="160" fill="none" stroke="#e5e7eb" stroke-dasharray="4 4" />
                                <circle cx="200" cy="200" r="120" fill="none" stroke="#f3f4f6" />

                                <!-- Знаки зодиака (правильное позиционирование) -->
                                <g v-for="(sign, index) in 12" :key="'sign-' + index">
                                    <!-- Линии знаков -->
                                    <line 
                                        x1="200" 
                                        y1="200" 
                                        :x2="200 + 180 * Math.cos(toRad(index * 30 - 90))" 
                                        :y2="200 + 180 * Math.sin(toRad(index * 30 - 90))" 
                                        stroke="#d1d5db" 
                                        stroke-width="1" 
                                    />
                                    
                                    <!-- Названия знаков -->
                                    <text 
                                        :x="200 + 170 * Math.cos(toRad(index * 30 - 75))" 
                                        :y="200 + 170 * Math.sin(toRad(index * 30 - 75))" 
                                        text-anchor="middle" 
                                        alignment-baseline="middle" 
                                        class="text-xs font-bold" 
                                        :fill="getSignColor(index)"
                                    >
                                        {{ getSignAbbreviation(index) }} {{ getSignSymbol(index) }}
                                    </text>
                                </g>

                                <!-- Дома (правильное позиционирование) -->
                                <g v-for="(house, index) in chartData.houses" :key="'house-' + index">
                                    <line 
                                        x1="200" 
                                        y1="200" 
                                        :x2="200 + 180 * Math.cos(toRad(house.position - 90))" 
                                        :y2="200 + 180 * Math.sin(toRad(house.position - 90))" 
                                        stroke="#6b7280" 
                                        stroke-dasharray="3 2" 
                                        stroke-width="1" 
                                    />
                                    <text 
                                        :x="200 + 190 * Math.cos(toRad(house.position - 90))" 
                                        :y="200 + 190 * Math.sin(toRad(house.position - 90))" 
                                        text-anchor="middle" 
                                        alignment-baseline="middle" 
                                        class="text-[10px] fill-gray-700 font-medium"
                                    >
                                        {{ house.house }}
                                    </text>
                                </g>

                                <!-- Планеты (правильное позиционирование) -->
                                <g v-for="planet in chartData.planets" :key="planet.name">
                                    <circle 
                                        :cx="200 + 140 * Math.cos(toRad(planet.longitude - 90))" 
                                        :cy="200 + 140 * Math.sin(toRad(planet.longitude - 90))" 
                                        r="10" 
                                        class="cursor-pointer transition-transform duration-200" 
                                        :class="hoverPlanet === planet ? 'scale-125' : ''" 
                                        :fill="getPlanetColor(planet.name)" 
                                        stroke="black" 
                                        stroke-width="1.5" 
                                        style="transform-box: fill-box; transform-origin: center;" 
                                        @mouseover="hoverPlanet = planet" 
                                        @mouseleave="hoverPlanet = null" 
                                    />

                                    <text 
                                        :x="200 + 140 * Math.cos(toRad(planet.longitude - 90))" 
                                        :y="200 + 140 * Math.sin(toRad(planet.longitude - 90))" 
                                        text-anchor="middle" 
                                        alignment-baseline="middle" 
                                        class="text-[12px] fill-white font-bold pointer-events-none"
                                    >
                                        {{ getPlanetAbbreviation(planet.name) }}
                                    </text>
                                </g>

                                <!-- Углы карты (ASC и MC) -->
                                <g v-if="chartData.ascendant">
                                    <line 
                                        x1="200" 
                                        y1="200" 
                                        :x2="200 + 180 * Math.cos(toRad(chartData.ascendant.longitude - 90))" 
                                        :y2="200 + 180 * Math.sin(toRad(chartData.ascendant.longitude - 90))" 
                                        stroke="#ef4444" 
                                        stroke-width="2" 
                                    />
                                    <text 
                                        :x="200 + 195 * Math.cos(toRad(chartData.ascendant.longitude - 90))" 
                                        :y="200 + 195 * Math.sin(toRad(chartData.ascendant.longitude - 90))" 
                                        text-anchor="middle" 
                                        alignment-baseline="middle" 
                                        class="text-[10px] fill-red-600 font-bold"
                                    >
                                        ASC
                                    </text>
                                </g>

                                <g v-if="chartData.midheaven">
                                    <line 
                                        x1="200" 
                                        y1="200" 
                                        :x2="200 + 180 * Math.cos(toRad(chartData.midheaven.longitude - 90))" 
                                        :y2="200 + 180 * Math.sin(toRad(chartData.midheaven.longitude - 90))" 
                                        stroke="#8b5cf6" 
                                        stroke-width="2" 
                                    />
                                    <text 
                                        :x="200 + 195 * Math.cos(toRad(chartData.midheaven.longitude - 90))" 
                                        :y="200 + 195 * Math.sin(toRad(chartData.midheaven.longitude - 90))" 
                                        text-anchor="middle" 
                                        alignment-baseline="middle" 
                                        class="text-[10px] fill-purple-600 font-bold"
                                    >
                                        MC
                                    </text>
                                </g>
                            </svg>

                            <!-- Подсказка -->
                            <transition name="fade">
                                <div v-if="hoverPlanet" class="absolute bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl shadow-xl border border-gray-200 z-20 w-[180px] sm:w-[220px] text-xs sm:text-sm animate-fade-in pointer-events-none" :style="{
                                    left: `calc(50% + ${150 * Math.cos(toRad(hoverPlanet.longitude - 90))}px)`,
                                    top: `calc(50% + ${150 * Math.sin(toRad(hoverPlanet.longitude - 90))}px)`,
                                    transform: 'translate(-50%, -110%)'
                                }">
                                    <div class="font-semibold text-indigo-700 truncate">{{ getRussianPlanetName(hoverPlanet.name) }}</div>
                                    <div class="truncate">{{ hoverPlanet.formattedPosition }}</div>
                                    <div class="truncate">В знаке: {{ getRussianSignName(hoverPlanet.zodiacSign.sign) }}</div>
                                    <div class="truncate">В доме: {{ getHouseForPlanet(hoverPlanet.name) }}</div>
                                    <div :class="hoverPlanet.retrograde ? 'text-red-600' : 'text-green-600'">
                                        {{ hoverPlanet.retrograde ? 'Ретроградная' : 'Директная' }}
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>

                    <!-- Информация о планетах и домах -->
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 flex-1 border border-gray-100">
                        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                            </svg>
                            Планеты и дома
                        </h3>

                        <!-- Планеты -->
                        <div class="mb-4 sm:mb-6">
                            <h4 class="font-semibold mb-2 sm:mb-3 text-gray-700 border-b pb-2 text-sm sm:text-base">Планеты</h4>
                            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                <div v-for="planet in chartData.planets" :key="planet.name" class="flex items-center justify-between p-2 sm:p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition">
                                    <div class="flex items-center space-x-2 sm:space-x-3">
                                        <div class="w-4 h-4 rounded-full border-2 border-black flex-shrink-0" :style="{ backgroundColor: getPlanetColor(planet.name) }"></div>
                                        <span class="font-medium text-xs sm:text-sm">{{ getRussianPlanetName(planet.name) }}</span>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs font-semibold">{{ planet.formattedPosition }}</div>
                                        <div class="text-xs text-gray-500" :class="planet.retrograde ? 'text-red-600' : 'text-green-600'">
                                            {{ planet.retrograde ? 'Ретроградная' : 'Директная' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Дома -->
                        <div class="mb-4 sm:mb-6">
                            <h4 class="font-semibold mb-2 sm:mb-3 text-gray-700 border-b pb-2 text-sm sm:text-base">Дома гороскопа</h4>
                            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                <div v-for="house in chartData.houses" :key="house.house" class="flex items-center justify-between p-2 sm:p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg transition">
                                    <div class="flex items-center space-x-2 sm:space-x-3">
                                        <div class="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                                            {{ house.house }}
                                        </div>
                                        <span class="font-medium text-xs sm:text-sm">{{ getRussianHouseName(house.house) }}</span>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs font-semibold">{{ house.formattedPosition }}</div>
                                        <div class="text-xs text-gray-500">
                                            {{ getRussianSignName(house.zodiacSign.sign) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Углы карты -->
                        <div>
                            <h4 class="font-semibold mb-2 sm:mb-3 text-gray-700 border-b pb-2 text-sm sm:text-base">Углы карты</h4>
                            <div class="space-y-2">
                                <div class="flex justify-between p-2 sm:p-3 border-b hover:bg-gray-50 rounded-lg transition">
                                    <span class="font-medium text-red-600 flex items-center text-xs sm:text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                        ASC (Асцендент)
                                    </span>
                                    <span class="text-xs sm:text-sm">{{ chartData.ascendant.formattedPosition }}</span>
                                </div>
                                <div class="flex justify-between p-2 sm:p-3 border-b hover:bg-gray-50 rounded-lg transition">
                                    <span class="font-medium text-purple-600 flex items-center text-xs sm:text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                        MC (Середина неба)
                                    </span>
                                    <span class="text-xs sm:text-sm">{{ chartData.midheaven.formattedPosition }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Аспекты -->
                <div v-if="chartData.aspects.length" class="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-5 md:p-6 mt-4 sm:mt-6 border border-gray-100">
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-indigo-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Аспекты
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div v-for="aspect in chartData.aspects" :key="`${aspect.planet1}-${aspect.planet2}`" class="p-3 sm:p-4 rounded-lg border transition transform hover:scale-[1.02]" :class="getAspectColor(aspect.influence)">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                                <span class="font-semibold text-xs sm:text-sm">{{ getRussianPlanetName(aspect.planet1) }} - {{ getRussianPlanetName(aspect.planet2) }}</span>
                                <span class="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 font-medium self-start sm:self-auto">
                                    {{ getRussianAspectName(aspect.type) }}
                                </span>
                            </div>
                            <div class="text-xs sm:text-sm">
                                {{ aspect.angle.toFixed(1) }}° (орбис: {{ aspect.orb.toFixed(1) }}°)
                            </div>
                            <div class="text-xs text-gray-600 mt-1">
                                {{ getAspectDescription(aspect.type) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Загрузка -->
        <div v-if="loading && !chartData" class="mt-8 p-4 w-full max-w-md">
            <div class="flex flex-col items-center">
                <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
                <p class="mt-4 text-gray-600 text-center text-sm sm:text-base">Рассчитываем вашу натальную карту<br>Это может занять несколько секунд</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {
        ref
    } from "vue";

    const config = useRuntimeConfig();

    const form = ref({
        date: new Date().toISOString().slice(0, 16),
        lat: 55.7558,
        lon: 37.6173,
        timezone: 3
    });

    // Интерфейс для города из Nominatim API
    interface City {
        place_id: number;
        display_name: string;
        lat: string;
        lon: string;
        type: string;
        importance: number;
    }

    // Состояние для поиска городов
    const citySearchQuery = ref('');
    const citySuggestions = ref<City[]>([]);
    const selectedCity = ref<City | null>(null);
    const showCitySuggestions = ref(false);
    const citySearchLoading = ref(false);
    let searchTimeout: NodeJS.Timeout | null = null;

    // Функции для работы с городами через Nominatim API
    async function searchCities() {
        if (citySearchQuery.value.length < 2) {
            citySuggestions.value = [];
            return;
        }

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(async () => {
            try {
                citySearchLoading.value = true;
                
                // Используем наш API для поиска городов (проксирует Nominatim)
                const response = await fetch(
                    `${config.public.apiBase}/api/geocoding/search?q=${encodeURIComponent(citySearchQuery.value)}&limit=10`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    citySuggestions.value = data.cities || [];
                } else {
                    console.error('Error searching cities:', response.statusText);
                    citySuggestions.value = [];
                }
            } catch (error) {
                console.error('Error searching cities:', error);
                citySuggestions.value = [];
            } finally {
                citySearchLoading.value = false;
            }
        }, 500); // Задержка 500мс для избежания слишком частых запросов
    }

    async function selectCity(city: City) {
        selectedCity.value = city;
        citySearchQuery.value = '';
        citySuggestions.value = [];
        showCitySuggestions.value = false;
        
        // Автозаполнение координат с ограничением до 4 знаков после запятой
        form.value.lat = parseFloat(parseFloat(city.lat).toFixed(4));
        form.value.lon = parseFloat(parseFloat(city.lon).toFixed(4));
        
        // Получаем точный часовой пояс по координатам через API
        try {
            const response = await fetch(
                `${config.public.apiBase}/api/geocoding/timezone?lat=${city.lat}&lon=${city.lon}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.timezone) {
                    form.value.timezone = data.timezone.utcOffset;
                    console.log('Timezone detected:', data.timezone);
                } else {
                    // Fallback к простому определению
                    const timezone = getTimezoneFromCoordinates(parseFloat(city.lat), parseFloat(city.lon));
                    form.value.timezone = timezone;
                }
            } else {
                // Fallback к простому определению
                const timezone = getTimezoneFromCoordinates(parseFloat(city.lat), parseFloat(city.lon));
                form.value.timezone = timezone;
            }
        } catch (error) {
            console.error('Error getting timezone:', error);
            // Fallback к простому определению
            const timezone = getTimezoneFromCoordinates(parseFloat(city.lat), parseFloat(city.lon));
            form.value.timezone = timezone;
        }
    }

    function clearSelectedCity() {
        selectedCity.value = null;
        citySearchQuery.value = '';
        citySuggestions.value = [];
        showCitySuggestions.value = false;
    }

    function limitDecimalPlaces(event: Event, field: 'lat' | 'lon') {
        const target = event.target as HTMLInputElement;
        const value = parseFloat(target.value);
        
        if (!isNaN(value)) {
            const limitedValue = parseFloat(value.toFixed(4));
            if (field === 'lat') {
                form.value.lat = limitedValue;
            } else {
                form.value.lon = limitedValue;
            }
            
            // Автоматически определяем часовой пояс при изменении координат
            if (form.value.lat && form.value.lon) {
                updateTimezoneFromCoordinates();
            }
        }
    }

    // Функция для обновления часового пояса по текущим координатам
    async function updateTimezoneFromCoordinates() {
        if (!form.value.lat || !form.value.lon) return;
        
        try {
            const response = await fetch(
                `${config.public.apiBase}/api/geocoding/timezone?lat=${form.value.lat}&lon=${form.value.lon}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.timezone) {
                    form.value.timezone = data.timezone.utcOffset;
                    console.log('Timezone updated:', data.timezone);
                }
            }
        } catch (error) {
            console.error('Error updating timezone:', error);
        }
    }

    function hideCitySuggestions() {
        // Небольшая задержка, чтобы клик по предложению успел сработать
        setTimeout(() => {
            showCitySuggestions.value = false;
        }, 200);
    }

    // Простая функция определения часового пояса по координатам
    function getTimezoneFromCoordinates(lat: number, lon: number): number {
        // Примерная логика определения часового пояса
        if (lon >= -180 && lon < -150) return -12; // Гавайи
        if (lon >= -150 && lon < -120) return -10; // Аляска
        if (lon >= -120 && lon < -60) return -8;   // Тихоокеанское время
        if (lon >= -60 && lon < -30) return -5;    // Восточное время
        if (lon >= -30 && lon < 0) return -3;      // Атлантическое время
        if (lon >= 0 && lon < 30) return 0;        // GMT
        if (lon >= 30 && lon < 60) return 2;       // Восточная Европа
        if (lon >= 60 && lon < 90) return 3;       // Москва
        if (lon >= 90 && lon < 120) return 5;      // Екатеринбург
        if (lon >= 120 && lon < 150) return 7;     // Красноярск
        if (lon >= 150 && lon < 180) return 9;     // Владивосток
        return 0; // По умолчанию GMT
    }

    function formatDateTime(dateString: string): string {
        // Разбиваем строку на дату и время
        const [datePart, timePart] = dateString.split('T');
        if (!datePart || !timePart) return '';

        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);

        // Создаём дату в локальном времени
        const date = new Date(year, month - 1, day, hour, minute);

        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }


    function getSignSymbol(index: number): string {
        const symbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
        return symbols[index];
    }

    interface Planet {
        name: string;
        longitude: number;
        latitude: number;
        distance: number;
        speed: number;
        retrograde: boolean;
        zodiacSign: {
            sign: string;
            degree: number;
            minute: number;
            second: number;
            element: string;
            modality: string;
            ruler: string;
            symbol: string;
            emoji: string;
        };
        formattedPosition: string;
    }

    interface House {
        house: number;
        position: number;
        zodiacSign: {
            sign: string;
            degree: number;
            minute: number;
            second: number;
            element: string;
            modality: string;
            ruler: string;
            symbol: string;
            emoji: string;
        };
        formattedPosition: string;
    }

    interface Aspect {
        planet1: string;
        planet2: string;
        angle: number;
        type: string;
        orb: number;
        exact: boolean;
        influence: string;
    }

    interface ChartData {
        planets: Planet[];
        houses: House[];
        ascendant: {
            longitude: number;
            zodiacSign: any;
            formattedPosition: string;
        };
        midheaven: {
            longitude: number;
            zodiacSign: any;
            formattedPosition: string;
        };
        aspects: Aspect[];
        date: string;
        location: {
            latitude: number;
            longitude: number;
            timezone: number;
        };
    }

    const chartData = ref < ChartData | null > (null);
    const hoverPlanet = ref < Planet | null > (null);
    const error = ref < string | null > (null);
    const loading = ref(false);
    const loadingHoroscope = ref(false);

    // Планеты с доступными гороскопами
    const planetsWithHoroscopes = [
        { key: 'jupiter', planet: 'Jupiter', name: 'Юпитер', description: 'Гороскоп по Юпитеру' },
        { key: 'venus', planet: 'Venus', name: 'Венера', description: 'Гороскоп по Венере' },
        { key: 'mercury', planet: 'Mercury', name: 'Меркурий', description: 'Гороскоп по Меркурию' },
        { key: 'saturn', planet: 'Saturn', name: 'Сатурн', description: 'Гороскоп по Сатурну' }
    ];

    function toRad(deg: number) {
        return (deg * Math.PI) / 180;
    }

    function getSignColor(index: number): string {
        const colors = [
            '#ef4444', '#f97316', '#eab308', '#22c55e',
            '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
            '#f97316', '#eab308', '#22c55e', '#3b82f6'
        ];
        return colors[index];
    }

    function getSignAbbreviation(index: number): string {
        const signs = ['Овен', 'Телец', 'Близн', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорп', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
        return signs[index];
    }

    function getRussianSignName(sign: string): string {
        const signNames: {
            [key: string]: string
        } = {
            'Aries': 'Овен',
            'Taurus': 'Телец',
            'Gemini': 'Близнецы',
            'Cancer': 'Рак',
            'Leo': 'Лев',
            'Virgo': 'Дева',
            'Libra': 'Весы',
            'Scorpio': 'Скорпион',
            'Sagittarius': 'Стрелец',
            'Capricorn': 'Козерог',
            'Aquarius': 'Водолей',
            'Pisces': 'Рыбы'
        };
        return signNames[sign] || sign;
    }

    function getPlanetColor(name: string): string {
        const colors: {
            [key: string]: string
        } = {
            'Sun': '#f59e0b',
            'Moon': '#60a5fa',
            'Mercury': '#9ca3af',
            'Venus': '#f472b6',
            'Mars': '#ef4444',
            'Jupiter': '#f97316',
            'Saturn': '#6b7280',
            'Uranus': '#22d3ee',
            'Neptune': '#3b82f6',
            'Pluto': '#8b5cf6'
        };
        return colors[name] || '#000';
    }

    function getPlanetAbbreviation(name: string): string {
        const abbreviations: {
            [key: string]: string
        } = {
            'Sun': '☉',
            'Moon': '☽',
            'Mercury': '☿',
            'Venus': '♀',
            'Mars': '♂',
            'Jupiter': '♃',
            'Saturn': '♄',
            'Uranus': '♅',
            'Neptune': '♆',
            'Pluto': '♇'
        };
        return abbreviations[name] || name.slice(0, 3);
    }

    function getRussianPlanetName(name: string): string {
        const names: {
            [key: string]: string
        } = {
            'Sun': 'Солнце',
            'Moon': 'Луна',
            'Mercury': 'Меркурий',
            'Venus': 'Венера',
            'Mars': 'Марс',
            'Jupiter': 'Юпитер',
            'Saturn': 'Сатурн',
            'Uranus': 'Уран',
            'Neptune': 'Нептун',
            'Pluto': 'Плутон'
        };
        return names[name] || name;
    }

    function getRussianHouseName(houseNumber: number): string {
        const houseNames: {
            [key: number]: string
        } = {
            1: 'Первый дом (ASC)',
            2: 'Второй дом',
            3: 'Третий дом',
            4: 'Четвертый дом (IC)',
            5: 'Пятый дом',
            6: 'Шестой дом',
            7: 'Седьмой дом (DSC)',
            8: 'Восьмой дом',
            9: 'Девятый дом',
            10: 'Десятый дом (MC)',
            11: 'Одиннадцатый дом',
            12: 'Двенадцатый дом'
        };
        return houseNames[houseNumber] || `Дом ${houseNumber}`;
    }

    function getRussianAspectName(name: string): string {
        const names: {
            [key: string]: string
        } = {
            'conjunction': 'Соединение',
            'sextile': 'Секстиль',
            'square': 'Квадрат',
            'trine': 'Трин',
            'quincunx': 'Квиконс',
            'opposition': 'Оппозиция'
        };
        return names[name] || name;
    }

    function getAspectColor(influence: string): string {
        return influence === 'positive' ?
            'bg-green-100 border-green-300' :
            influence === 'negative' ?
            'bg-red-100 border-red-300' :
            'bg-blue-100 border-blue-300';
    }

    function getAspectDescription(type: string): string {
        const descriptions: {
            [key: string]: string
        } = {
            'conjunction': 'Соединение - объединение энергий планет',
            'sextile': 'Секстиль - гармония и благоприятные возможности',
            'square': 'Квадрат - напряжение и вызовы, требующие преодоления',
            'trine': 'Трин - легкость, поддержка и благоприятные обстоятельства',
            'quincunx': 'Квиконс - необходимость адаптации и корректировки',
            'opposition': 'Оппозиция - полярности, требующие балансирования'
        };
        return descriptions[type] || type;
    }

    // Функция для определения дома планеты
    function getHouseForPlanet(planetName: string): string {
        if (!chartData.value) return "-";

        const planet = chartData.value.planets.find(p => p.name === planetName);
        if (!planet) return "-";

        // Находим дом, в котором находится планета
        for (let i = 0; i < chartData.value.houses.length; i++) {
            const currentHouse = chartData.value.houses[i];
            const nextHouse = chartData.value.houses[(i + 1) % chartData.value.houses.length];

            // Если следующая позиция дома меньше текущей, значит мы пересекли 360°
            let nextPosition = nextHouse.position;
            if (nextPosition < currentHouse.position) {
                nextPosition += 360;
            }

            // Проверяем, находится ли планета между текущим и следующим домом
            let planetLongitude = planet.longitude;
            if (planetLongitude < currentHouse.position) {
                planetLongitude += 360;
            }

            if (planetLongitude >= currentHouse.position && planetLongitude < nextPosition) {
                return `${currentHouse.house} дом`;
            }
        }

        return "-";
    }

    async function fetchChart() {
        try {
            loading.value = true;
            error.value = null;
            chartData.value = null;

            const res = await fetch(`${config.public.apiBase}/api/astro/natal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date: form.value.date,
                    latitude: form.value.lat,
                    longitude: form.value.lon,
                    timezone: form.value.timezone
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            chartData.value = data;
        } catch (e: any) {
            error.value = e.message || "Не удалось рассчитать натальную карту";
            console.error('Error fetching chart:', e);
        } finally {
            loading.value = false;
        }
    }

    // Функция для загрузки гороскопа
    async function downloadHoroscope(planetKey: string, planetName: string) {
        if (!chartData.value) {
            error.value = 'Сначала рассчитайте натальную карту';
            return;
        }

        try {
            loadingHoroscope.value = true;
            
            // Находим планету в данных карты
            const planet = chartData.value.planets.find(p => p.name === planetName);
            if (!planet) {
                error.value = 'Планета не найдена в вашей карте';
                return;
            }

            // Получаем номер знака (1-12)
            const signNumber = planet.zodiacSign.sign === 'Aries' ? 1 :
                            planet.zodiacSign.sign === 'Taurus' ? 2 :
                            planet.zodiacSign.sign === 'Gemini' ? 3 :
                            planet.zodiacSign.sign === 'Cancer' ? 4 :
                            planet.zodiacSign.sign === 'Leo' ? 5 :
                            planet.zodiacSign.sign === 'Virgo' ? 6 :
                            planet.zodiacSign.sign === 'Libra' ? 7 :
                            planet.zodiacSign.sign === 'Scorpio' ? 8 :
                            planet.zodiacSign.sign === 'Sagittarius' ? 9 :
                            planet.zodiacSign.sign === 'Capricorn' ? 10 :
                            planet.zodiacSign.sign === 'Aquarius' ? 11 : 12;

            // Скачиваем гороскоп
            const url = `${config.public.apiBase}/api/astro/horoscope/${planetKey}/${signNumber}`;
            window.open(url, '_blank');
            
        } catch (e: any) {
            error.value = e.message || 'Не удалось загрузить гороскоп';
            console.error('Error downloading horoscope:', e);
        } finally {
            loadingHoroscope.value = false;
        }
    }
</script>
<style scoped>
    .relative {
        position: relative;
    }

    .max-h-60 {
        max-height: 15rem;
    }

    .overflow-y-auto {
        overflow-y: auto;
    }

    /* Стили для скроллбара в списке предложений */
    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #c5c5c5;
        border-radius: 10px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }

    .circle-chart {
        transition: all 0.3s ease;
    }

    .planet-dot {
        transition: transform 0.2s ease;
    }

    .planet-dot:hover {
        transform: scale(1.2);
    }

    /* Анимация появления результатов */
    .slide-fade-enter-active {
        transition: all 0.5s ease-out;
    }

    .slide-fade-enter-from {
        opacity: 0;
        transform: translateX(30px);
    }

    /* Стили для скроллбара */
    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #c5c5c5;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }


    /* Адаптивные стили */
    @media (max-width: 1023px) {
        .lg\:flex-row {
            flex-direction: column;
        }

        .lg\:sticky {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .text-4xl {
            font-size: 2rem;
        }

        .p-6 {
            padding: 1.25rem;
        }
    }

    @media (max-width: 640px) {
        /* Улучшенная адаптация для мобильных устройств */
        .min-h-screen {
            min-height: 100vh;
        }
        
        /* Более компактные отступы для мобильных */
        .space-y-3 > * + * {
            margin-top: 0.75rem;
        }
        
        .space-y-2 > * + * {
            margin-top: 0.5rem;
        }
        
        /* Таблица с горизонтальным скроллом на мобильных */
        .overflow-x-auto {
            -webkit-overflow-scrolling: touch;
        }
        
        /* Круговая диаграмма - более компактная на мобильных */
        .aspect-square {
            min-height: 280px;
        }
    }

    @media (max-width: 480px) {
        .text-3xl {
            font-size: 1.75rem;
        }

        .p-5 {
            padding: 1rem;
        }

        .relative[style*="width: 100%; max-width: 400px; height: 400px"] {
            height: 320px;
        }
        
        /* Дополнительные улучшения для очень маленьких экранов */
        .max-w-md {
            max-width: 100%;
        }
    }

    @media (max-width: 360px) {
        /* Стили для очень маленьких экранов */
        .text-2xl {
            font-size: 1.5rem;
        }
        
        .p-4 {
            padding: 0.875rem;
        }
    }
    
    /* Улучшение для touch-устройств */
    @media (hover: none) and (pointer: coarse) {
        button, a {
            min-height: 44px;
            min-width: 44px;
        }
        
        .cursor-pointer {
            cursor: default;
        }
    }
</style>