import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  auth.initializeTokens();
});
