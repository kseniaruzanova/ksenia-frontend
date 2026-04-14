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
        id: decoded.customerId || decoded.clubMemberId || decoded.id,
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
  const isClubMember = computed(() => user.value?.role === 'club_member');
  const tariff = computed(() => user.value?.tariff ?? 'none');
  const username = computed(() => user.value?.username ?? '');

  return { user, isAdmin, isCustomer, isClubMember, tariff, username };
}; 