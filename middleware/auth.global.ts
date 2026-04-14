import { jwtDecode } from 'jwt-decode'

function decodeAuthPayload(token: string): { role?: string; tariff?: string } | null {
  try {
    return jwtDecode<{ role?: string; tariff?: string }>(token)
  } catch {
    return null
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('bearer-token')
  const clubIntentCookie = useCookie('ksenia-club-intent')

  /** Токен клуба не даёт «вход» на платформу: на публичных страницах платформы сессия клуба сбрасывается. */
  const platformPublicEntryPaths = new Set<string>(['/platform', '/login', '/register'])
  if (cookie.value && platformPublicEntryPaths.has(to.path)) {
    const payload = decodeAuthPayload(cookie.value)
    if (payload?.role === 'club_member') {
      cookie.value = null
      clubIntentCookie.value = null
      return navigateTo({ path: to.path, query: to.query, hash: to.hash }, { replace: true })
    }
  }

  const publicRoutes = new Set<string>([
    '/',
    '/platform',
    '/club',
    '/club/login',
    '/club/register',
    '/club/pay/success',
    '/login',
    '/register',
    '/notification/success',
    '/notification/fail'
  ])

  if (!cookie.value && !publicRoutes.has(to.path) && !to.path.startsWith('/notification/')) {
    return navigateTo('/login')
  }

  if (
    cookie.value &&
    (to.path === '/login' ||
      to.path === '/register' ||
      to.path === '/club/login' ||
      to.path === '/club/register')
  ) {
    const payload = decodeAuthPayload(cookie.value)
    const clubIntent = clubIntentCookie.value === '1'
    const tariff = payload?.tariff ?? 'none'
    if (
      clubIntent &&
      (payload?.role === 'customer' || payload?.role === 'club_member') &&
      tariff !== 'tg_max'
    ) {
      return navigateTo('/club/pay')
    }
    return navigateTo('/cabinet')
  }
}) 