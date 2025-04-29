import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
  }),

  actions: {
    initializeTokens() {
      if (process.server) {
        const cookieStr = useRequestHeaders(['cookie']).cookie || '';
        const accessMatch = cookieStr.match(/accessToken=([^;]+)/);
        const refreshMatch = cookieStr.match(/refreshToken=([^;]+)/);

        if (accessMatch) this.accessToken = accessMatch[1];
        if (refreshMatch) this.refreshToken = refreshMatch[1];
      }

      if (process.client) {
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
      }
    },

    storeTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;

      // Set tokens in localStorage for client
      if (process.client) {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
      }

      // Set cookies
      document.cookie = `accessToken=${access}; path=/`;
      document.cookie = `refreshToken=${refresh}; path=/`;
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'accessToken=; Max-Age=0; path=/';
        document.cookie = 'refreshToken=; Max-Age=0; path=/';
      }
    },
  },

  getters: {
    isAuthenticated(state) {
      return !!state.accessToken;
    },
  },
});
