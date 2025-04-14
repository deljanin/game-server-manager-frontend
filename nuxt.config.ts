// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/main.scss'],
  modules: ['@nuxt/fonts', '@pinia/nuxt'],
  fonts: {
    families: [
      {
        name: 'K2D',
        provider: 'google',
      },
    ],
  },
  plugins: ['~/plugins/initStore.js'],
});
