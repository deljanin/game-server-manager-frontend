<script setup>
import { ref, watch } from 'vue';

const mockData = {
  name: 'Minecraft',
  status: 'running',
  logs: `
[09:21:03] [Server thread/INFO]: Starting Minecraft server version 1.20.1
[09:21:04] [Server thread/INFO]: Loading properties
[09:21:05] [Server thread/INFO]: Default game type: SURVIVAL
[09:21:06] [Server thread/INFO]: Generating keypair
[09:21:07] [Server thread/INFO]: Starting Minecraft server on *:25565
[09:21:08] [Server thread/INFO]: Preparing level "world"
[09:21:09] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld
[09:21:12] [Server thread/INFO]: Done (8.123s)! For help, type "help"
[09:21:14] [User Authenticator #1/INFO]: UUID of player Steve is 123e4567-e89b-12d3-a456-426614174000
[09:21:15] [Server thread/INFO]: Steve[/192.168.0.42:57832] logged in with entity id 123 at (100.5, 64.0, -50.5)
[09:21:16] [Server thread/INFO]: Steve joined the game
[09:22:00] [Server thread/INFO]: Steve issued server command: /give Steve diamond_sword
[09:22:10] [Server thread/INFO]: Steve left the game
[09:21:03] [Server thread/INFO]: Starting Minecraft server version 1.20.1
[09:21:04] [Server thread/INFO]: Loading properties
[09:21:05] [Server thread/INFO]: Default game type: SURVIVAL
[09:21:06] [Server thread/INFO]: Generating keypair
[09:21:07] [Server thread/INFO]: Starting Minecraft server on *:25565
[09:21:08] [Server thread/INFO]: Preparing level "world"
[09:21:09] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld
[09:21:12] [Server thread/INFO]: Done (8.123s)! For help, type "help"
[09:21:14] [User Authenticator #1/INFO]: UUID of player Steve is 123e4567-e89b-12d3-a456-426614174000
[09:21:15] [Server thread/INFO]: Steve[/192.168.0.42:57832] logged in with entity id 123 at (100.5, 64.0, -50.5)
[09:21:16] [Server thread/INFO]: Steve joined the game
[09:22:00] [Server thread/INFO]: Steve issued server command: /give Steve diamond_sword
[09:22:10] [Server thread/INFO]: Steve left the game
[09:21:03] [Server thread/INFO]: Starting Minecraft server version 1.20.1
[09:21:04] [Server thread/INFO]: Loading properties
[09:21:05] [Server thread/INFO]: Default game type: SURVIVAL
[09:21:06] [Server thread/INFO]: Generating keypair
[09:21:07] [Server thread/INFO]: Starting Minecraft server on *:25565
[09:21:08] [Server thread/INFO]: Preparing level "world"
[09:21:09] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld
[09:21:12] [Server thread/INFO]: Done (8.123s)! For help, type "help"
[09:21:14] [User Authenticator #1/INFO]: UUID of player Steve is 123e4567-e89b-12d3-a456-426614174000
[09:21:15] [Server thread/INFO]: Steve[/192.168.0.42:57832] logged in with entity id 123 at (100.5, 64.0, -50.5)
[09:21:16] [Server thread/INFO]: Steve joined the game
[09:22:00] [Server thread/INFO]: Steve issued server command: /give Steve diamond_sword
[09:22:10] [Server thread/INFO]: Steve left the game
  `, // Get this via websockets later
};

const logRef = ref(null);
const autoScrollEnabled = ref(true);

// Detect when logs change
watch(
  () => mockData.logs,
  () => {
    if (autoScrollEnabled.value && logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight;
    }
  }
);

// Watch for user scroll (disable auto-scroll if user scrolls up)
const handleScroll = () => {
  if (!logRef.value) return;
  const isAtBottom =
    logRef.value.scrollHeight - logRef.value.scrollTop <=
    logRef.value.clientHeight + 10;
  autoScrollEnabled.value = isAtBottom;
};

// Optional: button to resume auto-scroll manually
const enableAutoScroll = () => {
  autoScrollEnabled.value = true;
  if (logRef.value) {
    logRef.value.scrollTop = logRef.value.scrollHeight;
  }
};
</script>
<!-- id {{ $route.params.serverId }} -->
<template>
  <div class="container">
    <div>
      <h1>{{ mockData.name }}</h1>
      <div class="server-info">
        <div>
          <span>Logs:</span>
          <div>
            <Button>{{
              mockData.status === 'running' ? 'Stop' : 'Start'
            }}</Button
            ><Button v-if="!autoScrollEnabled" @click="enableAutoScroll">
              Resume Auto-Scroll
            </Button>
          </div>
        </div>
        <div class="server-stream">
          <pre ref="logRef" @scroll="handleScroll">{{ mockData.logs }}</pre>
        </div>
      </div>
    </div>
  </div>
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
    max-width: 70%;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 1.3rem;
      }
      > div {
        display: flex;
        gap: 1rem;
      }
    }
    .server-stream {
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
      }
    }
  }
}
</style>
