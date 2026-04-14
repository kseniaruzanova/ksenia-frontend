import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isCustomer, isClubMember, isAdmin } = useAuth();

  if (!isCustomer.value && !isClubMember.value && !isAdmin.value) {
    return navigateTo('/cabinet');
  }
});