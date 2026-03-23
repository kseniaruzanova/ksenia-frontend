export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('bearer-token')
  const publicRoutes = new Set<string>(['/', '/login', '/register'])
  
  // Если пользователь не авторизован и пытается попасть не на страницу входа
  if (!cookie.value && !publicRoutes.has(to.path)) {
    return navigateTo('/login')
  }
  
  // Если пользователь авторизован и пытается попасть на страницу входа
  if (cookie.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/cabinet')
  }
}) 