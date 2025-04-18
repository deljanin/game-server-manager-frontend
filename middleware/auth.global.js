import { useAuthStore } from '~/store/auth';
export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;

  const auth = useAuthStore();

  // Only allow access to /login if not authenticated
  if (
    !auth.isAuthenticated &&
    to.path !== '/login' &&
    to.path !== '/register'
  ) {
    return navigateTo('/login');
  }

  // If user is already logged in and tries to go to login again, redirect to dashboard
  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
});
