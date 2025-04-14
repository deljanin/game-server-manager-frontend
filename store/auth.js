// store/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
  }),

  actions: {
    initializeTokens() {
      if (process.client) {
        if (!this.accessToken) {
          this.accessToken = localStorage.getItem('accessToken');
        }
        if (!this.refreshToken) {
          this.refreshToken = localStorage.getItem('refreshToken');
        }
      }
    },

    storeTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },

    clearTokens() {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    // Refresh the access token using the refresh token
    async refreshAccessToken() {
      const refreshToken = this.refreshToken;
      if (!refreshToken) return;

      const response = await fetch('http://localhost:8000/api/token/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.storeTokens(data.access, refreshToken); // Store new access token
        return data.access; // Return the new access token
      } else {
        this.clearTokens(); // If refresh fails, clear tokens
        throw new Error('Session expired, please log in again.');
      }
    },
  },

  getters: {
    isAuthenticated() {
      return !!this.accessToken;
    },
  },
});
