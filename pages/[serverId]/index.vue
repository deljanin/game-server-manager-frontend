<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { withAuth } from '@/utils/withAuth.js';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/store/auth';

const config = useRuntimeConfig();
const route = useRoute();
const server = ref(null);
const loading = ref(true);
const logRef = ref(null);
const logs = ref('');
const autoScrollEnabled = ref(true);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalConfirmAction = ref(() => {});
const router = useRouter();
let socket = null;

const serverId = route.params.serverId;

watch(logs, () => {
  if (autoScrollEnabled.value && logRef.value) {
    nextTick(() => {
      logRef.value.scrollTop = logRef.value.scrollHeight;
    });
  }
});

onMounted(() => {
  if (logRef.value) {
    logRef.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (logRef.value) {
    logRef.value.removeEventListener('scroll', handleScroll);
  }
});

const handleScroll = () => {
  const el = logRef.value;
  if (!el) return;
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
  autoScrollEnabled.value = nearBottom;
};

async function fetchServer(accessToken) {
  const response = await fetch(
    `${config.public.apiBase}/api/game-server/${serverId}/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }

  return await response.json();
}

onMounted(async () => {
  try {
    const data = await withAuth(fetchServer);
    server.value = data;
    if (server.value?.is_running) {
      connectWebSocket();
    }
  } catch (error) {
    console.error('Error fetching server:', error);
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
  showModal.value = true;
}

function confirmDelete(server) {
  openModal({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${server.server_name}"? This cannot be undone.`,
    onConfirm: deleteGameServer,
    server,
  });
}

async function deleteGameServer(server) {
  try {
    const response = await withAuth(async (accessToken) => {
      const deleteResponse = await fetch(
        `${config.public.apiBase}/api/game-server/${serverId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        throw new Error(
          `Error deleting server: ${deleteResponse.status} - ${errorText}`
        );
      }

      router.push('/');
    });
  } catch (error) {
    console.error('Error deleting server:', error);
    alert('There was an error deleting the server. Please try again.');
  }
}

function confirmStop(server) {
  openModal({
    title: 'Confirm Stop',
    message: `Are you sure you want to stop "${server.server_name}"?`,
    onConfirm: stopGameServer,
    server,
  });
}

async function stopGameServer(server) {
  try {
    const response = await withAuth(async (accessToken) => {
      const stopResponse = await fetch(
        `${config.public.apiBase}/api/game-server/${serverId}/stop/`,
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

async function startGameServer(server) {
  try {
    const response = await withAuth(async (accessToken) => {
      const startResponse = await fetch(
        `${config.public.apiBase}/api/game-server/${serverId}/start/`,
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
      connectWebSocket();
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

function connectWebSocket() {
  const authStore = useAuthStore();

  if (socket) {
    socket.close(); // Close existing socket if any
  }

  socket = new WebSocket(
    `${config.public.wsBase}/ws/server/${serverId}/?token=${authStore.accessToken}`
  );
  socket.onopen = () => {
    logs.value = 'WebSocket connected!\n';
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    logs.value += data['log'];
  };

  socket.onclose = () => {
    logs.value += 'WebSocket closed!\n';
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

onUnmounted(() => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
});
</script>

<template>
  <div class="container">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h1>{{ server.server_name }}</h1>
      <div class="server-info">
        <div>
          <div>
            <Button
              @click="
                server.is_running
                  ? confirmStop(server)
                  : startGameServer(server)
              "
              >{{ server.is_running ? 'Stop' : 'Start' }}</Button
            >
            <Button
              :disabled="autoScrollEnabled"
              :class="{ 'disabled-button': autoScrollEnabled }"
              @click="
                autoScrollEnabled = !autoScrollEnabled;
                nextTick(() => {
                  logRef.value.scrollTop = logRef.value.scrollHeight;
                });
              ">
              Auto-Scroll
            </Button>
            <Button @click="confirmDelete(server)">Delete Server</Button>
          </div>
        </div>
        <div class="logs">
          <pre ref="logRef" @scroll="handleScroll">{{
            logs || 'No logs available.'
          }}</pre>
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: var(--60);
  padding: 0 1rem;
  h1 {
    text-align: center;
  }
  > div {
    min-width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
  }
  .server-info {
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        display: flex;
        gap: 1rem;
      }
    }
    .logs {
      width: 100%;
      max-width: 800px;
      min-width: 500px;
      margin-top: 1rem;

      padding: 1rem 0.5rem;
      border-radius: 1rem;
      box-shadow: var(--shadow);
      background-color: var(--30);
      pre {
        width: 100%;
        height: 50vh;
        overflow-y: scroll;
        font-family: monospace;
        font-size: 1rem;
        white-space: pre-wrap;
        overflow-x: auto;
        word-break: break-all;
      }
      @media screen and (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        min-width: 100%;
      }
    }
  }
}
.disabled-button {
  opacity: 0.5;
  cursor: not-allowed;
  &:hover {
    scale: 1;
  }
}
</style>
