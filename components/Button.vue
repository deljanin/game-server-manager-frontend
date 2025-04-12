<script setup>
defineProps({
  type: String,
});
</script>

<template>
  <button :type="type || 'button'">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  display: inline-block;
  font-size: medium;
  font-weight: 500;
  border: none;
  background-color: var(--10);
  color: var(--30);
  border-radius: 5px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    scale: 1.1;
  }
}
</style>
