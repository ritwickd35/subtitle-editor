<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card shadow flex justify-content-center my-5">
          <div class="card-header">
            <div class="row">
              <div class="col-10">
                <h4 class="mx-4 my-1">Upload video and Subtitles</h4>
              </div>
              <div class="col-2">
                <img
                  alt="Vue logo"
                  class="logo"
                  src="@/assets/logo.svg"
                  width="40"
                  height="40"
                />
              </div>
            </div>
          </div>
          <div class="card-body px-5">
            <div class="row">
              <div class="col-12">
                Upload video and Subtitles. The video and subtitle file should
                have the same file name
              </div>
              <div class="col-10">
                <form enctype="multipart/form-data" @submit.prevent="sendFile">
                  <div class="browse-wrap">
                    <div class="title">Choose a file to upload</div>
                    <input
                      type="file"
                      name="upload"
                      class="upload form-control-file"
                      title="Choose a file to upload"
                      @change="selectFile"
                    />
                  </div>
                  <span class="upload-path">{{ filePath }}</span>
                </form>
              </div>
              <div class="col-2">
                <Button
                  raised
                  size="large"
                  :disabled="!videoUploaded"
                  label="Submit"
                  class="my-4"
                  @click="sendFile"
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoComponent></VideoComponent>

      <CaptionUpdate v-if="_captionFileFetched"></CaptionUpdate>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import VideoComponent from "../components/VideoComponent.vue";
import CaptionUpdate from "../components/CaptionUpdate.vue";
import { showToast } from "../services/toastService";
import { useVideoStore } from "../stores/videoDetails";

import axios from "axios";
import { useToast } from "primevue/usetoast";

const videoStore = useVideoStore();

const toast = useToast();
const filePath = ref("");

let file: string | Blob = "null"; // store file blob
const videoUploaded = ref(false); // stores if file is uploaded
const serverUrl = "http://localhost:5000"; // server url
const { _captionFileFetched } = storeToRefs(videoStore); // flag from store to render caption component when video element is present
const allowedFileExtensions = [".vtt", ".mp4"];

const selectFile = (event: any) => {
  if (event.target && event.target.files && event.target.files[0]) {
    const extension = event.target.files[0].name.substring(
      event.target.files[0].name.lastIndexOf(".")
    );

    if (!allowedFileExtensions.includes(extension)) {
      showToast(
        toast,
        "error",
        "invalid file",
        "File extension not supported!"
      );
      return;
    }
    file = event.target.files[0];
    console.log(file);

    if (file) filePath.value = file.name;
    videoUploaded.value = true;
    showToast(toast, "success", "success", "file selected successfully");
  }
};

const sendFile = () => {
  console.log("sending file to the server");
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post(serverUrl + "/save-file", formData)
    .then((message) => {
      console.log("video uploaded successfully", message);
      showToast(toast, "success", message.data.status, message.data.message);
    })
    .catch((err) => {
      console.log(err);
      showToast(
        toast,
        "error",
        err.response.data.status,
        err.response.data.message
      );
    });
};
</script>
<style scoped>
div.browse-wrap {
  top: 0;
  left: 0;
  margin: 20px;
  cursor: pointer;
  overflow: hidden;
  padding: 20px 60px;
  text-align: center;
  position: relative;
  background-color: #f6f7f8;
  border: solid 1px #d2d2d7;
}
div.title {
  color: #3b5998;
  font-size: 14px;
  font-weight: bold;
  font-family: tahoma, arial, sans-serif;
}
input.upload {
  right: 0;
  margin: 0;
  bottom: 0;
  padding: 0;
  opacity: 0;
  height: 300px;
  outline: none;
  cursor: inherit;
  position: absolute;
  font-size: 1000px !important;
}
span.upload-path {
  text-align: center;
  margin: 20px;
  display: block;
  font-size: 80%;
  color: #3b5998;
  font-weight: bold;
  font-family: tahoma, arial, sans-serif;
}
</style>
