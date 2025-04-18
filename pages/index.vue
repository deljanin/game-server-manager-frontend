<script setup>
import ConfirmModal from '@/components/ConfirmModal.vue';
import { ref, onMounted } from 'vue';
import { withAuth } from '@/utils/withAuth.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const servers = ref([]);
const loading = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalConfirmAction = ref(() => {});
const selectedServer = ref(null);
const config = useRuntimeConfig();

async function fetchServers(accessToken) {
  const response = await fetch(`${config.public.apiBase}/api/game-server/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }

  return await response.json();
}

onMounted(async () => {
  try {
    const data = await withAuth(fetchServers);
    servers.value = data;
  } catch (error) {
    console.error('Error fetching servers:', error);
  } finally {
    loading.value = false;
  }
});

function openModal({ title, message, onConfirm, server }) {
  modalTitle.value = title;
  modalMessage.value = message;
  modalConfirmAction.value = () => {
    onConfirm(server);
    showModal.value = false;
  };
  selectedServer.value = server;
  showModal.value = true;
}

function confirmStop(server) {
  openModal({
    title: 'Confirm Stop',
    message: `Are you sure you want to stop "${server.server_name}"?`,
    onConfirm: stopGameServer,
    server,
  });
}

async function startGameServer(server) {
  try {
    const response = await withAuth(async (accessToken) => {
      const startResponse = await fetch(
        `${config.public.apiBase}/api/game-server/${server.id}/start/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!startResponse.ok) {
        const errorText = await startResponse.text();
        throw new Error(
          `Error starting server: ${startResponse.status} - ${errorText}`
        );
      }

      server.is_running = true;
      router.push(`/${server.id}`); // Redirect to the server page
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
async function stopGameServer(server) {
  try {
    const response = await withAuth(async (accessToken) => {
      const stopResponse = await fetch(
        `${config.public.apiBase}/api/game-server/${server.id}/stop/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!stopResponse.ok) {
        const errorText = await stopResponse.text();
        throw new Error(
          `Error starting server: ${stopResponse.status} - ${errorText}`
        );
      }

      server.is_running = false;
    });
  } catch (error) {
    console.error('Error stopping server:', error);
  }
}
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>
    <div v-if="loading">Loading servers...</div>
    <span v-if="servers.length === 0">
      There are no servers.
      <NuxtLink to="/create"><u>Create one?</u></NuxtLink>
    </span>
    <div v-else class="servers">
      <div v-for="(server, index) in servers" :key="index" class="server">
        <h2>{{ server.server_name }}</h2>
        <div>
          <span :class="server.is_running ? 'status-online' : 'status-offline'">
            {{ server.is_running ? 'running' : 'not running' }}
          </span>
          <div>
            <Button
              @click="
                server.is_running
                  ? confirmStop(server)
                  : startGameServer(server)
              ">
              {{ server.is_running ? 'Stop' : 'Start' }}
            </Button>
          </div>
          <NuxtLink :to="`/${server.id}`">
            <Button>Info</Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    @confirm="modalConfirmAction"
    @cancel="() => (showModal = false)" />
</template>

<style lang="scss" scoped>
.container {
  padding-top: 8rem;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-color: var(--60);
}

.servers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 1000px;
  padding: 0 1rem;
}

.server {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--30);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  h2,
  span {
    display: flex;
    align-items: center;
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  /* Mobile responsive: 1 column layout on smaller screens */
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

.status-online {
  color: green;
  font-weight: bold;
}

.status-offline {
  color: red;
  font-weight: bold;
}
</style>
