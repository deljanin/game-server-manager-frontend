<script setup></script>
<template>
  <div>
    <div class="navbar">
      <ul>
        <NuxtLink to="/"><li>Dashboard</li></NuxtLink>
        <NuxtLink to="/login"><li>Login</li></NuxtLink>
        <NuxtLink to="/create"><li>Create server</li></NuxtLink>
      </ul>
    </div>
    <slot />
  </div>
</template>
<style lang="scss">
.navbar {
  padding: 1rem;
  box-shadow: 0 0 30px rgba($color: #000000, $alpha: 0.5);
  ul {
    display: flex;
    align-items: center;
    justify-items: start;
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

      &:hover {
        scale: 1.05;
      }
    }
  }
}
</style>
