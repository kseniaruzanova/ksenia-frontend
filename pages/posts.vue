<template>
  <div>
    <Navbar />

    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Посты</h1>
            <p class="mt-2 text-gray-600">
              Лента публикаций с фото, видео и файлами в формате канала.
            </p>
          </div>

          <button
            v-if="isAdmin"
            @click="openCreateModal"
            class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-purple-700"
          >
            Создать пост
          </button>
        </div>

        <transition name="fade">
          <div
            v-if="notification"
            :class="[
              'mb-6 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm',
              notification.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            ]"
          >
            {{ notification.message }}
          </div>
        </transition>

        <div v-if="loading" class="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p class="text-gray-500">Загрузка постов...</p>
        </div>

        <div v-else-if="posts.length === 0" class="rounded-3xl bg-white p-12 text-center shadow-sm">
          <p class="text-lg font-medium text-gray-700">Постов пока нет</p>
          <p class="mt-2 text-gray-500">
            {{ isAdmin ? 'Создайте первую публикацию для ленты.' : 'Загляните позже, скоро здесь появятся материалы.' }}
          </p>
        </div>

        <div v-else class="space-y-6">
          <article
            v-for="post in posts"
            :key="post._id"
            class="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-lg shadow-purple-100/50"
          >
            <div class="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
              <div class="flex min-w-0 items-start gap-3">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                  П
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-semibold text-gray-900">Лента канала</p>
                    <span
                      v-if="post.isPinned"
                      class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"
                    >
                      Закреплено
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{{ formatDate(post.publishedAt || post.createdAt) }}</p>
                </div>
              </div>

              <div v-if="isAdmin" class="flex items-center gap-2">
                <button
                  @click="editPost(post)"
                  class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  Изменить
                </button>
                <button
                  @click="removePost(post)"
                  class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div class="space-y-5 px-5 py-5 sm:px-6">
              <div v-if="post.title" class="text-xl font-semibold text-gray-900">
                {{ post.title }}
              </div>

              <p v-if="post.content" class="whitespace-pre-line text-[15px] leading-7 text-gray-700">
                {{ post.content }}
              </p>

              <div
                v-if="getAttachmentsByKind(post, 'image').length"
                class="grid gap-3"
                :class="getAttachmentsByKind(post, 'image').length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'"
              >
                <a
                  v-for="attachment in getAttachmentsByKind(post, 'image')"
                  :key="attachment.filename"
                  :href="attachmentUrl(attachment)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block overflow-hidden rounded-2xl bg-gray-100"
                >
                  <img
                    :src="attachmentUrl(attachment)"
                    :alt="attachment.originalName"
                    class="h-full max-h-[420px] w-full object-cover transition hover:scale-[1.02]"
                  >
                </a>
              </div>

              <div v-if="getAttachmentsByKind(post, 'video').length" class="space-y-3">
                <video
                  v-for="attachment in getAttachmentsByKind(post, 'video')"
                  :key="attachment.filename"
                  :src="attachmentUrl(attachment)"
                  controls
                  preload="metadata"
                  class="w-full rounded-2xl bg-black"
                />
              </div>

              <div v-if="getAttachmentsByKind(post, 'file').length" class="space-y-2">
                <a
                  v-for="attachment in getAttachmentsByKind(post, 'file')"
                  :key="attachment.filename"
                  :href="attachmentUrl(attachment)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-purple-300 hover:bg-purple-50"
                >
                  <div class="min-w-0">
                    <p class="truncate font-medium text-gray-800">{{ attachment.originalName }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                  </div>
                  <span class="flex-shrink-0 text-sm font-semibold text-purple-700">Открыть</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
    >
      <div class="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div class="border-b border-gray-100 px-5 py-4 sm:px-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ editingPost ? 'Редактирование поста' : 'Новый пост' }}
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                Добавьте текст и любые вложения: фото, видео, документы.
              </p>
            </div>

            <button
              @click="closeModal"
              class="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form class="space-y-5 px-5 py-5 sm:px-6" @submit.prevent="savePost">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Заголовок</label>
            <input
              v-model="currentPost.title"
              type="text"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Например: важное обновление"
            >
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Текст поста</label>
            <textarea
              v-model="currentPost.content"
              rows="8"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Напишите текст публикации..."
            ></textarea>
          </div>

          <label class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <input v-model="currentPost.isPinned" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-purple-600">
            <span class="text-sm font-medium text-gray-700">Закрепить пост вверху ленты</span>
          </label>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Вложения</label>
            <input
              ref="attachmentsInput"
              type="file"
              multiple
              class="block w-full rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600"
              @change="handleAttachmentsChange"
            >
            <p class="mt-2 text-xs text-gray-500">
              Можно загрузить несколько фото, видео и файлов за один раз.
            </p>
          </div>

          <div v-if="currentPost.attachments.length || newAttachmentFiles.length" class="space-y-3">
            <div v-if="currentPost.attachments.length">
              <p class="mb-2 text-sm font-medium text-gray-700">Текущие вложения</p>
              <div class="space-y-2">
                <div
                  v-for="(attachment, index) in currentPost.attachments"
                  :key="attachment.filename"
                  class="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 px-4 py-3"
                >
                  <div class="min-w-0">
                    <p class="truncate font-medium text-gray-800">{{ attachment.originalName }}</p>
                    <p class="mt-1 text-xs uppercase tracking-wide text-gray-500">{{ attachment.kind }}</p>
                  </div>
                  <button
                    type="button"
                    @click="removeExistingAttachment(index)"
                    class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Убрать
                  </button>
                </div>
              </div>
            </div>

            <div v-if="newAttachmentFiles.length">
              <p class="mb-2 text-sm font-medium text-gray-700">Новые вложения</p>
              <div class="space-y-2">
                <div
                  v-for="(file, index) in newAttachmentFiles"
                  :key="`${file.name}-${index}`"
                  class="flex items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3"
                >
                  <div class="min-w-0">
                    <p class="truncate font-medium text-gray-800">{{ file.name }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                  <button
                    type="button"
                    @click="removeNewAttachment(index)"
                    class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                  >
                    Убрать
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              @click="closeModal"
              class="rounded-2xl border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
            >
              {{ saving ? 'Сохранение...' : editingPost ? 'Обновить пост' : 'Опубликовать пост' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "customer-or-admin"
})

type AttachmentKind = "image" | "video" | "file"

interface PostAttachment {
  filename: string
  originalName: string
  mimeType: string
  size: number
  kind: AttachmentKind
}

interface PostItem {
  _id?: string
  title: string
  content: string
  attachments: PostAttachment[]
  isPinned: boolean
  publishedAt?: string
  createdAt?: string
}

const { isAdmin } = useAuth()
const config = useRuntimeConfig()
const token = useCookie<string | null>("bearer-token")

const posts = ref<PostItem[]>([])
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingPost = ref<PostItem | null>(null)
const attachmentsInput = ref<HTMLInputElement | null>(null)
const newAttachmentFiles = ref<File[]>([])
const notification = ref<{ message: string; type: "success" | "error" } | null>(null)

const currentPost = ref<PostItem>({
  title: "",
  content: "",
  attachments: [],
  isPinned: false
})

function showNotification(message: string, type: "success" | "error" = "success") {
  notification.value = { message, type }

  setTimeout(() => {
    notification.value = null
  }, 3000)
}

function resetForm() {
  editingPost.value = null
  currentPost.value = {
    title: "",
    content: "",
    attachments: [],
    isPinned: false
  }
  newAttachmentFiles.value = []
  if (attachmentsInput.value) attachmentsInput.value.value = ""
}

function openCreateModal() {
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function editPost(post: PostItem) {
  editingPost.value = post
  currentPost.value = {
    _id: post._id,
    title: post.title || "",
    content: post.content || "",
    attachments: [...(post.attachments || [])],
    isPinned: Boolean(post.isPinned),
    publishedAt: post.publishedAt,
    createdAt: post.createdAt
  }
  newAttachmentFiles.value = []
  if (attachmentsInput.value) attachmentsInput.value.value = ""
  showModal.value = true
}

function handleAttachmentsChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (!files.length) return

  newAttachmentFiles.value = [...newAttachmentFiles.value, ...files]
  target.value = ""
}

function removeExistingAttachment(index: number) {
  currentPost.value.attachments.splice(index, 1)
}

function removeNewAttachment(index: number) {
  newAttachmentFiles.value.splice(index, 1)
}

function getAuthHeaders(includeJson = false): HeadersInit {
  const headers: Record<string, string> = {}

  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`
  }

  if (includeJson) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

async function loadPosts() {
  loading.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/api/posts`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error("Не удалось загрузить посты")
    }

    posts.value = await response.json()
  } catch (error: any) {
    posts.value = []
    showNotification(error?.message || "Ошибка при загрузке постов", "error")
  } finally {
    loading.value = false
  }
}

async function savePost() {
  const hasContent = Boolean(currentPost.value.title.trim() || currentPost.value.content.trim())
  const hasAttachments = Boolean(currentPost.value.attachments.length || newAttachmentFiles.value.length)
  const isEditing = Boolean(editingPost.value)

  if (!hasContent && !hasAttachments) {
    showNotification("Добавьте текст, заголовок или хотя бы одно вложение", "error")
    return
  }

  saving.value = true

  try {
    const formData = new FormData()
    formData.append("title", currentPost.value.title.trim())
    formData.append("content", currentPost.value.content.trim())
    formData.append("isPinned", String(currentPost.value.isPinned))
    formData.append("existingAttachments", JSON.stringify(currentPost.value.attachments))

    newAttachmentFiles.value.forEach((file) => {
      formData.append("attachments", file)
    })

    const url = editingPost.value?._id
      ? `${config.public.apiBase}/api/posts/${editingPost.value._id}`
      : `${config.public.apiBase}/api/posts`

    const response = await fetch(url, {
      method: editingPost.value ? "PUT" : "POST",
      headers: getAuthHeaders(),
      body: formData
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || "Не удалось сохранить пост")
    }

    closeModal()
    await loadPosts()
    showNotification(isEditing ? "Пост обновлен" : "Пост опубликован", "success")
  } catch (error: any) {
    showNotification(error?.message || "Ошибка при сохранении поста", "error")
  } finally {
    saving.value = false
  }
}

async function removePost(post: PostItem) {
  if (!post._id || !confirm(`Удалить пост "${post.title || "без заголовка"}"?`)) return

  try {
    const response = await fetch(`${config.public.apiBase}/api/posts/${post._id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || "Не удалось удалить пост")
    }

    await loadPosts()
    showNotification("Пост удален", "success")
  } catch (error: any) {
    showNotification(error?.message || "Ошибка при удалении поста", "error")
  }
}

function getAttachmentsByKind(post: PostItem, kind: AttachmentKind) {
  return (post.attachments || []).filter((attachment) => attachment.kind === kind)
}

function attachmentUrl(attachment: PostAttachment) {
  return `${config.public.apiBase}/api/uploads/posts/${encodeURIComponent(attachment.filename)}`
}

function formatDate(value?: string) {
  if (!value) return ""

  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

function formatFileSize(size?: number) {
  if (!size) return "0 Б"

  const units = ["Б", "КБ", "МБ", "ГБ"]
  let nextSize = size
  let unitIndex = 0

  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024
    unitIndex += 1
  }

  return `${nextSize.toFixed(nextSize >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
