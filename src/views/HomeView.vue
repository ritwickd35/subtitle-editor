<script setup lang="ts">
import { ref, type Ref } from "vue";
let file: Ref<null> | null = null;
let videoUploaded = ref(false);

const videoInput = ref(null);

const selectFile = (event: any) => {
  if (event.target && event.target.files) {
    file = event.target.files[0];
    console.log(file);
    videoUploaded.value = true;
  }
};
const sendFile = () => {
  console.log("sending file to the server");
};
</script>

<template>
  <main>
    <h2>Click Here to upload a video</h2>
    <form enctype="multipart/form-data" @submit.prevent="sendFile">
      <label for="video">Upload Video</label>
      <input type="file" ref="videoInput" @change="selectFile" />
      <button :disabled="!videoUploaded" class="btn btn-primary">Submit</button>
    </form>
  </main>
</template>
