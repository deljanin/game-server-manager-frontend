<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function loginUser() {
  alert(`User data:\nUsername: ${username.value}\nPassword: ${password.value}`);
}
</script>

<template>
  <div class="container">
    <div>
      <h1>Login</h1>
      <form @submit.prevent="loginUser">
        <div>
          <label for="username">Username</label>
          <input v-model="username" type="text" placeholder="username" />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="password" type="password" placeholder="#12313" />
        </div>
        <Button>Submit</Button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--60);
  background: -webkit-linear-gradient(var(--gradient-bg));
  background: linear-gradient(var(--gradient-bg));

  > div {
    padding: 3rem;
    border-radius: 1rem;
    background-color: var(--60);
    box-shadow: var(--shadow);
    h1 {
      text-align: center;
    }
    form {
      margin-top: 0.7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        input {
          font-size: 1rem;
          padding: 0.3rem 0.5rem;
          border: 2px solid var(--10);
          border-radius: 5px;
          background-color: var(--30);
        }
      }
      button {
        margin-top: 0.7rem;
      }
    }
    @media screen and (width >= 640px) {
      padding: 7rem;
    }
  }
}
</style>
