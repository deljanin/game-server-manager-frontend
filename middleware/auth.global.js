// middleware/auth.global.ts
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  auth.initializeTokens();

  if (
    !auth.isAuthenticated &&
    to.path !== '/login' &&
    to.path !== '/register'
  ) {
    return navigateTo('/login');
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
