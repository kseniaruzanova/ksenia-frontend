import { jwtDecode } from 'jwt-decode'

/**
 * Участник клуба (club_member) не ходит по разделам платформы с тем же токеном —
 * только кабинет, продление подписки, клуб и уведомления об оплате.
 * Страницы /platform, /login, /register обрабатываются в auth.global (сброс сессии клуба).
 */
export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('bearer-token').value
  if (!cookie) return

  let role: string | undefined
  try {
    role = (jwtDecode(cookie) as { role?: string })?.role
  } catch {
    return
  }
  if (role !== 'club_member') return

  const path = to.path
  if (path === '/') return

  const allowedPrefixes = ['/cabinet', '/subscription', '/club', '/notification']
  for (const p of allowedPrefixes) {
    if (path === p || path.startsWith(`${p}/`)) return
  }

  return navigateTo('/cabinet')
})
