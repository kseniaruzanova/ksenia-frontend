<template>
  <div>
    <Navbar />
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Рассылка на почту</h1>
          <p class="mt-2 text-sm text-gray-600">
            Получатели — пользователи платформы и клуба с email в логине. Отметьте нужных и отправьте письмо.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div class="lg:col-span-7">
            <form class="bg-white shadow rounded-lg p-6 space-y-6" @submit.prevent="sendMailing">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Тема письма</label>
                <input
                  v-model="subject"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Тема"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Текст (plain)</label>
                <textarea
                  v-model="text"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Текст письма. Если не заполнить HTML ниже, текст будет отправлен как простое письмо с переносами строк."
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">HTML (необязательно)</label>
                <textarea
                  v-model="html"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Если указать HTML, он уйдёт как HTML-часть; для почтовиков без HTML останется plain-текст (из поля выше или авто из HTML)."
                />
              </div>

              <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

              <div class="flex flex-wrap gap-3 items-center">
                <button
                  type="submit"
                  :disabled="sending || selectedCount === 0 || selectedOverLimit"
                  class="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {{ sending ? 'Отправка…' : 'Отправить выбранным' }}
                </button>
                <span class="text-xs text-gray-500">
                  Выбрано: {{ selectedCount }}. Максимум {{ maxRecipients }} за один запрос.
                </span>
              </div>
            </form>

            <div
              v-if="sending"
              class="mt-6 overflow-hidden rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 shadow-md"
              role="status"
              aria-live="polite"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="relative mx-auto h-16 w-16 shrink-0 sm:mx-0">
                  <div class="absolute inset-0 rounded-full border-4 border-indigo-200/80" />
                  <div
                    class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600 border-r-violet-500"
                  />
                  <div class="absolute inset-2 rounded-full bg-white/60 animate-pulse" />
                </div>
                <div class="min-w-0 flex-1 text-center sm:text-left">
                  <p class="text-lg font-semibold text-indigo-950">Идёт отправка писем</p>
                  <p class="mt-1 text-sm text-indigo-900/90">
                    Обработано
                    <strong>{{ liveProcessed }}</strong>
                    из
                    <strong>{{ liveTotal }}</strong>
                    · Успешно:
                    <strong class="text-emerald-700">{{ liveSent }}</strong>
                    <template v-if="liveFailed > 0">
                      · Ошибок:
                      <strong class="text-red-700">{{ liveFailed }}</strong>
                    </template>
                  </p>
                  <div class="mt-4 h-3 w-full overflow-hidden rounded-full bg-indigo-200/70 shadow-inner">
                    <div
                      class="email-send-progress-bar h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-sm"
                      :style="{ width: progressPercent + '%' }"
                    />
                  </div>
                  <p class="mt-2 text-xs text-indigo-800/70">{{ progressPercent }}% завершено</p>
                </div>
              </div>
            </div>

            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="result && !sending"
                class="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
                  <h2 class="text-lg font-semibold text-gray-900">Итог рассылки</h2>
                  <p class="mt-0.5 text-sm text-gray-600">Финальная статистика по этому запуску</p>
                </div>
                <div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                  <div class="rounded-lg border border-gray-100 bg-slate-50 px-4 py-4 text-center">
                    <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Всего в очереди</p>
                    <p class="mt-2 text-3xl font-bold tabular-nums text-gray-900">{{ result.total }}</p>
                  </div>
                  <div class="rounded-lg border border-emerald-100 bg-emerald-50/80 px-4 py-4 text-center">
                    <p class="text-xs font-medium uppercase tracking-wide text-emerald-800/80">Отправлено</p>
                    <p class="mt-2 text-3xl font-bold tabular-nums text-emerald-700">{{ result.sent }}</p>
                  </div>
                  <div class="rounded-lg border border-red-100 bg-red-50/80 px-4 py-4 text-center">
                    <p class="text-xs font-medium uppercase tracking-wide text-red-800/80">Не удалось</p>
                    <p class="mt-2 text-3xl font-bold tabular-nums text-red-700">{{ result.failedCount ?? 0 }}</p>
                  </div>
                </div>
                <div
                  v-if="result.failed?.length"
                  class="border-t border-gray-100 px-6 py-4"
                >
                  <p class="text-sm font-medium text-red-800">Детали ошибок</p>
                  <ul class="mt-2 max-h-52 space-y-1.5 overflow-y-auto text-sm text-red-800">
                    <li v-for="(f, i) in result.failed" :key="i" class="break-all border-b border-red-100 pb-1.5 font-mono last:border-0">
                      {{ f.email }} — {{ f.error }}
                    </li>
                  </ul>
                </div>
              </div>
            </Transition>
          </div>

          <aside class="lg:col-span-5">
            <div
              class="rounded-lg border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24 flex flex-col max-h-[min(80vh,720px)]"
            >
              <div class="border-b border-gray-200 px-4 py-3 shrink-0 space-y-3">
                <h2 class="text-base font-semibold text-gray-900">Получатели</h2>
                <p class="text-xs text-gray-500">
                  Платформа (кастомеры) и клуб — только логины в виде email.
                </p>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="listLoading || recipientRows.length === 0"
                    @click="selectAll"
                  >
                    Выбрать всех
                  </button>
                  <button
                    type="button"
                    class="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40"
                    :disabled="selectedCount === 0"
                    @click="clearSelection"
                  >
                    Снять выбор
                  </button>
                </div>
                <p class="text-sm text-gray-700">
                  В каталоге: <strong>{{ recipientRows.length }}</strong>
                  · Выбрано: <strong>{{ selectedCount }}</strong>
                  <span v-if="selectedOverLimit" class="block mt-1 text-amber-700 text-xs font-medium">
                    Снимите лишних: больше {{ maxRecipients }} за раз нельзя.
                  </span>
                </p>
              </div>

              <div class="px-4 py-2 shrink-0 min-h-[2.5rem] flex items-center border-b border-gray-100">
                <span v-if="listLoading" class="text-sm text-gray-500">Загрузка списка…</span>
                <span v-else-if="listError" class="text-sm text-red-600">{{ listError }}</span>
              </div>

              <ul class="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 min-h-[220px]">
                <li
                  v-if="!listLoading && recipientRows.length === 0"
                  class="px-2 py-4 text-sm text-gray-500 text-center"
                >
                  Нет пользователей с email в логине.
                </li>
                <li
                  v-for="row in recipientRows"
                  :key="row.email"
                  class="rounded-md px-2 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      class="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      :checked="selected.has(row.email)"
                      @change="toggle(row.email)"
                    />
                    <span class="min-w-0 flex-1">
                      <span class="block text-sm font-mono text-gray-900 break-all">{{ row.email }}</span>
                      <span class="mt-1 flex flex-wrap gap-1">
                        <span
                          v-for="s in row.sources"
                          :key="s"
                          class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
                          :class="sourceBadgeClass(s)"
                        >
                          {{ sourceLabel(s) }}
                        </span>
                      </span>
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin',
});

const maxRecipients = 1000;

const config = useRuntimeConfig();
const token = useCookie('bearer-token', {
  maxAge: 60 * 60 * 16,
  path: '/',
  sameSite: 'lax',
});

const subject = ref('');
const text = ref('');
const html = ref('');
const sending = ref(false);
const formError = ref('');
const result = ref(null);
const sendProgress = ref(null);

const listLoading = ref(false);
const listError = ref('');
const recipientRows = ref([]);
const selected = ref(new Set());

const selectedCount = computed(() => selected.value.size);

const selectedOverLimit = computed(() => selectedCount.value > maxRecipients);

const liveTotal = computed(() => {
  const t = sendProgress.value?.total;
  if (typeof t === 'number' && t > 0) return t;
  return selectedCount.value || 1;
});

const liveProcessed = computed(() => sendProgress.value?.processed ?? 0);
const liveSent = computed(() => sendProgress.value?.sent ?? 0);
const liveFailed = computed(() => sendProgress.value?.failedCount ?? 0);

const progressPercent = computed(() => {
  const t = liveTotal.value;
  const p = liveProcessed.value;
  if (t <= 0) return 0;
  return Math.min(100, Math.round((p / t) * 100));
});

function sourceLabel(s) {
  if (s === 'platform') return 'Платформа';
  if (s === 'club') return 'Клуб';
  return s;
}

function sourceBadgeClass(s) {
  if (s === 'platform') return 'bg-indigo-100 text-indigo-800';
  if (s === 'club') return 'bg-violet-100 text-violet-800';
  return 'bg-gray-100 text-gray-700';
}

function toggle(email) {
  const next = new Set(selected.value);
  if (next.has(email)) {
    next.delete(email);
  } else {
    next.add(email);
  }
  selected.value = next;
}

function selectAll() {
  selected.value = new Set(recipientRows.value.map((r) => r.email));
}

function clearSelection() {
  selected.value = new Set();
}

async function loadRecipients() {
  listLoading.value = true;
  listError.value = '';
  try {
    const response = await fetch(`${config.public.apiBase}/api/email-broadcast/recipients`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Ошибка ${response.status}`);
    }
    recipientRows.value = Array.isArray(data.recipients) ? data.recipients : [];
  } catch (e) {
    listError.value = e.message || 'Не удалось загрузить список';
    recipientRows.value = [];
  } finally {
    listLoading.value = false;
  }
}

onMounted(() => {
  loadRecipients();
});

async function readNdjsonStream(response) {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Браузер не поддерживает поток ответа');
  }
  const decoder = new TextDecoder();
  let buffer = '';
  let completePayload = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let msg;
      try {
        msg = JSON.parse(trimmed);
      } catch {
        continue;
      }
      if (msg.type === 'progress') {
        sendProgress.value = {
          processed: msg.processed,
          total: msg.total,
          sent: msg.sent,
          failedCount: msg.failedCount,
        };
      } else if (msg.type === 'complete') {
        completePayload = {
          total: msg.total,
          sent: msg.sent,
          failedCount: msg.failedCount ?? 0,
          failed: Array.isArray(msg.failed) ? msg.failed : [],
        };
      }
    }
  }

  return completePayload;
}

async function sendMailing() {
  formError.value = '';
  result.value = null;

  if (!subject.value.trim()) {
    formError.value = 'Укажите тему';
    return;
  }
  if (!text.value.trim() && !html.value.trim()) {
    formError.value = 'Укажите текст или HTML';
    return;
  }
  if (selectedCount.value === 0) {
    formError.value = 'Выберите хотя бы одного получателя';
    return;
  }
  if (selectedOverLimit.value) {
    formError.value = `Не больше ${maxRecipients} получателей за раз`;
    return;
  }

  const chosen = [...selected.value];
  sendProgress.value = {
    processed: 0,
    total: chosen.length,
    sent: 0,
    failedCount: 0,
  };
  sending.value = true;

  try {
    const body = {
      subject: subject.value.trim(),
      text: text.value,
      html: html.value,
      recipients: chosen,
    };

    const response = await fetch(`${config.public.apiBase}/api/email-broadcast`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
        'X-Stream-Progress': '1',
      },
      body: JSON.stringify(body),
    });

    const ct = response.headers.get('content-type') || '';

    if (!response.ok) {
      const errText = await response.text();
      let msg = errText;
      try {
        const j = JSON.parse(errText);
        msg = j.message || msg;
      } catch {
        /* plain text */
      }
      throw new Error(msg || `Ошибка ${response.status}`);
    }

    if (ct.includes('ndjson')) {
      const completePayload = await readNdjsonStream(response);
      if (!completePayload) {
        throw new Error('Сервер не вернул итог рассылки');
      }
      result.value = completePayload;
    } else {
      const data = await response.json().catch(() => ({}));
      result.value = {
        total: data.total,
        sent: data.sent,
        failedCount: data.failedCount ?? 0,
        failed: Array.isArray(data.failed) ? data.failed : [],
      };
      sendProgress.value = {
        processed: data.total,
        total: data.total,
        sent: data.sent,
        failedCount: data.failedCount ?? 0,
      };
    }
  } catch (e) {
    formError.value = e.message || 'Не удалось выполнить рассылку';
    result.value = null;
  } finally {
    sending.value = false;
    sendProgress.value = null;
  }
}
</script>

<style scoped>
.email-send-progress-bar {
  transition: width 0.35s ease-out;
}
</style>
