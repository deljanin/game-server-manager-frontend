<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/store/auth';
import { useRouter } from 'vue-router';
import { withAuth } from '~/utils/withAuth';

import DropZone from '~/components/DropZone.vue';
const loading = ref(false);
const server_name = ref('');
const run_command = ref('');
const dropzoneRef = ref(null);
const errorMessage = ref('');
const router = useRouter();

async function createGameServer() {
  const formData = new FormData();
  formData.append('server_name', server_name.value);
  formData.append('run_command', run_command.value);

  const file = dropzoneRef.value?.files?.[0];
  if (file) {
    formData.append('server_files', file); // 👈 assumes backend expects this key
  }

  try {
    loading.value = true;
    await withAuth(async (accessToken) => {
      const response = await fetch('http://localhost:8000/api/game-server/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // ❗ DO NOT set Content-Type when using FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create game server');
      }

      const data = await response.json();
      router.push(`/${data.id}`);
    });
  } catch (error) {
    console.error('Error during creation:', error);
    errorMessage.value = 'Error during creation.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <div>
      <h1>Add new server</h1>
      <form @submit.prevent="createGameServer">
        <div>
          <label for="server_name">Server name</label>
          <input
            v-model="server_name"
            type="text"
            placeholder="Minecraft 1.21.5" />
        </div>
        <div>
          <label for="run_command">Run command</label>
          <input
            v-model="run_command"
            type="text"
            placeholder="java -Xmx1024M -Xms1024M -jar server.jar nogui" />
        </div>

        <!-- 👇 bind the DropZone ref -->
        <DropZone ref="dropzoneRef" />

        <Button type="submit" :disabled="loading">Submit</Button>
        <span v-if="loading">Uploading...</span>
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
