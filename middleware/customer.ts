import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {
  const { isCustomer, isClubMember } = useAuth();

  if (!isCustomer.value && !isClubMember.value) {
    return navigateTo('/cabinet');
  }
}); 