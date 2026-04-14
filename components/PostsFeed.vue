<template>
  <div>
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

          <div v-if="isAdmin && showAdminActions" class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              @click="$emit('edit', post)"
            >
              Изменить
            </button>
            <button
              type="button"
              class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              @click="$emit('remove', post)"
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
</template>

<script setup lang="ts">
type AttachmentKind = 'image' | 'video' | 'file'

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

const props = withDefaults(
  defineProps<{
    posts: PostItem[]
    loading: boolean
    showAdminActions?: boolean
  }>(),
  { showAdminActions: true }
)

defineEmits<{
  edit: [post: PostItem]
  remove: [post: PostItem]
}>()

const { isAdmin } = useAuth()
const config = useRuntimeConfig()

function getAttachmentsByKind(post: PostItem, kind: AttachmentKind) {
  return (post.attachments || []).filter((attachment) => attachment.kind === kind)
}

function attachmentUrl(attachment: PostAttachment) {
  return `${config.public.apiBase}/api/uploads/posts/${encodeURIComponent(attachment.filename)}`
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatFileSize(size?: number) {
  if (!size) return '0 Б'
  const units = ['Б', 'КБ', 'МБ', 'ГБ']
  let nextSize = size
  let unitIndex = 0
  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024
    unitIndex += 1
  }
  return `${nextSize.toFixed(nextSize >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}
</script>
