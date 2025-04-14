<script setup>
definePageMeta({
  layout: 'empty',
});
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const authStore = useAuthStore();

async function loginUser() {
  const requestBody = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await fetch('http://localhost:8000/api/user/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access;
      const refreshToken = data.refresh;

      // Store tokens in Pinia store and localStorage
      authStore.storeTokens(accessToken, refreshToken);

      router.push('/');
    } else {
      const errorData = await response.json();
      errorMessage.value = errorData.detail || 'An error occurred during login';
    }
  } catch (error) {
    console.error('Error during login:', error);
    errorMessage.value = 'Network error, please try again later.';
  }
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
          <input v-model="password" type="password" placeholder="******" />
        </div>
        <Button type="submit">Submit</Button>
      </form>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
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

    .error-message {
      margin-top: 1rem;
      color: red;
    }

    @media screen and (width >= 640px) {
      padding: 7rem;
    }
  }
}
</style>
