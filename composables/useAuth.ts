import { jwtDecode } from 'jwt-decode';

interface AuthUser {
  id: string;
  role: string;
  login?: string; // для админа
  username?: string; // для кастомера
  tariff: string;
}

export const useAuth = () => {
  const tokenCookie = useCookie<string | undefined>('bearer-token');

  const user = computed<AuthUser | null>(() => {
    if (!tokenCookie.value) {
      return null;
    }
    try {
      // Декодируем токен, чтобы получить данные пользователя
      const decoded = jwtDecode<any>(tokenCookie.value);

      return {
        // Ищем ID в полях customerId ( для кастомера) или id (для админа).
        // Это делает логику более гибкой.
        id: decoded.customerId || decoded.id, 
        role: decoded.role,
        login: decoded.login,
        username: decoded.username,
        tariff: decoded.tariff
      };
    } catch (e) {
      console.error('Invalid token:', e);
      tokenCookie.value = undefined;
      return null;
    }
  });
  
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isCustomer = computed(() => user.value?.role === 'customer');
  const tariff = user.value?.tariff;
  const username = user.value?.username;

  return { user, isAdmin, isCustomer, tariff, username };
}; 