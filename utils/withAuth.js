import { useAuthStore } from '~/store/auth';

export async function withAuth(fetchFunction, ...args) {
  const authStore = useAuthStore();

  // If accessToken is missing, try refreshing first before throwing
  if (!authStore.accessToken) {
    try {
      const newAccessToken = await authStore.refreshAccessToken();
      return await fetchFunction(newAccessToken, ...args);
    } catch {
      throw new Error('User is not authenticated');
    }
  }

  try {
    return await fetchFunction(authStore.accessToken, ...args);
  } catch (error) {
    if (error.message.includes('401')) {
      // If token is expired, try refreshing
      const newAccessToken = await authStore.refreshAccessToken();
      return await fetchFunction(newAccessToken, ...args);
    }
    throw error;
  }
}
