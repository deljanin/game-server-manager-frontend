import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  authStore.initializeTokens(); // Initialize the tokens from localStorage
});
