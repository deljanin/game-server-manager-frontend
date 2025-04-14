<script setup>
import { useAuthStore } from '~/store/auth';

const auth = useAuthStore();

function logout() {
  auth.clearTokens();
  return navigateTo('/login');
}
</script>
<template>
  <div class="navbar">
    <ul>
      <NuxtLink to="/"><li>Dashboard</li></NuxtLink>
      <NuxtLink to="/create"><li>Create Server</li></NuxtLink>
      <li @click="logout">Logout</li>
    </ul>
  </div>
  <slot />
</template>
<style lang="scss">
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  display: flex;
  z-index: 5;
  background-color: var(--30);
  box-shadow: var(--shadow);
  ul {
    width: 100%;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 1rem;
    li {
      list-style: none;
      display: inline-block;
      padding: 0.5rem 1rem;
      background-color: var(--10);
      border-radius: 5px;
      transition: all 400ms cubic-bezier(0.075, 0.82, 0.165, 1);
      color: var(--60);
      text-decoration: none;
      cursor: pointer;
      &:hover {
        scale: 1.05;
      }
    }
    @media (max-width: 768px) {
      justify-content: space-between;
      li {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
