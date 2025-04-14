<script setup>
import { ref, defineExpose } from 'vue';

const isDragging = ref(false);
const files = ref([]);
const fileInput = ref(null);

function onChange() {
  const selected = fileInput.value.files[0];
  if (selected) {
    files.value = [selected];
  }
}

function makeName(name) {
  const parts = name.split('.');
  const ext = parts.pop();
  const base = parts.join('.');
  return base.substring(0, 3) + '...' + ext;
}

function remove() {
  files.value = [];
  fileInput.value.value = '';
}

function dragover(e) {
  e.preventDefault();
  isDragging.value = true;
}

function dragleave() {
  isDragging.value = false;
}

function drop(e) {
  e.preventDefault();
  isDragging.value = false;

  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    files.value = [droppedFile];
  }
}
defineExpose({
  files,
});
</script>

<template>
  <div
    class="dropzone-container"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop">
    <input
      type="file"
      name="file"
      id="fileInput"
      class="hidden-input"
      @change="onChange"
      ref="fileInput"
      accept=".zip" />

    <label for="fileInput" class="file-label">
      <div v-if="isDragging">Release to drop files here.</div>
      <div v-else>
        Drop .zip file here or <br /><u>click here</u> to upload it.
      </div>
    </label>

    <div class="preview-container" v-if="files[0]">
      <div class="preview-card">
        <div>
          <p :title="files[0].name">
            {{ makeName(files[0].name) }}
          </p>
        </div>
        <div>
          <button type="button" @click="remove">Remove</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropzone-container {
  background-color: var(--30);
  border-radius: 1rem;
  border: 2px solid var(--10);
  padding: 4rem;
}
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.file-label {
  display: block;
  cursor: pointer;
  text-align: center;
}
.preview-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.preview-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 5px;
  border: 2px solid var(--10);
  padding: 0.5rem;
  button {
    background-color: var(--10);
    border-radius: 5px;
    color: var(--60);
    padding: 0.3rem 0.6rem;
    transition: scale 200ms ease-in-out;
    &:hover {
      scale: 1.05;
    }
  }
}
</style>
