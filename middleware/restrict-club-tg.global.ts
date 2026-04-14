import { jwtDecode } from 'jwt-decode'

function decodePayload(token: string): { role?: string; tariff?: string } | null {
  try {
    return jwtDecode<{ role?: string; tariff?: string }>(token)
  } catch {
    return null
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('bearer-token').value
  if (!token) return

  const payload = decodePayload(token)
  if (!payload?.role) return

  const tariff = payload.tariff ?? 'none'
  const clubIntent = useCookie('ksenia-club-intent').value === '1'

  if ((payload.role === 'customer' || payload.role === 'club_member') && tariff === 'tg_max') {
    const allowed = new Set([
      '/cabinet',
      '/subscription',
      '/club/pay',
      '/club/pay/success',
      '/notification/success',
      '/notification/fail'
    ])
    if (allowed.has(to.path) || to.path.startsWith('/notification/')) return
    return navigateTo('/cabinet')
  }

  if ((payload.role === 'customer' || payload.role === 'club_member') && tariff === 'none' && clubIntent) {
    const allowed = new Set([
      '/club/pay',
      '/club/pay/success',
      '/club',
      '/club/login',
      '/club/register',
      '/',
      '/platform',
      '/login',
      '/register',
      '/notification/success',
      '/notification/fail'
    ])
    if (allowed.has(to.path) || to.path.startsWith('/notification/')) return
    if (to.path === '/cabinet') return navigateTo('/club/pay')
    return navigateTo('/club/pay')
  }
})
