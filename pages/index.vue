<script setup>
import { ref } from 'vue';
const servers = [
  { id: 1, name: 'Minecraft', status: 'running' },
  { id: 2, name: 'ARK', status: 'not running' },
  { id: 3, name: 'BLR', status: 'running' },
  { id: 4, name: 'CS:GO', status: 'running' },
  { id: 5, name: 'Rust', status: 'not running' },
];

const showModal = ref(false);
const selectedServer = ref(null);

function confirmStop(server) {
  selectedServer.value = server;
  showModal.value = true;
}

function stopServer() {
  if (selectedServer.value) {
    selectedServer.value.status = 'not running';
    showModal.value = false;
  }
}
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>
    <div class="servers">
      <div v-for="(server, index) in servers" :key="index" class="server">
        <h2>{{ server.name }}</h2>

        <span
          :class="
            server.status === 'running' ? 'status-online' : 'status-offline'
          ">
          {{ server.status }}
        </span>

        <div class="">
          <Button
            @click="
              server.status === 'running'
                ? confirmStop(server)
                : (server.status = 'running')
            ">
            {{ server.status === 'running' ? 'Stop' : 'Start' }}
          </Button>
        </div>
        <NuxtLink :to="`/${server.id}`">
          <Button>Logs</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirm Stop</h3>
        <p>Are you sure you want to stop {{ selectedServer?.name }} server?</p>
        <div class="modal-actions">
          <Button @click="stopServer">Yes, Stop</Button>
          <Button @click="showModal = false">Cancel</Button>
        </div>
      </div>
    </div>
  </Teleport>
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
  max-width: 600px;
  padding: 0 1rem;
}

.server {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: var(--30);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  h2,
  span {
    display: flex;
    align-items: center;
  }
  div,
  a {
    text-decoration: none;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}
</style>
