<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card shadow flex justify-content-center my-5">
          <div class="card-header">
            <div class="row">
              <div class="col-10">
                <h2 class="mx-4 my-1">Upload video</h2>
              </div>
              <div class="col-2">
                <img
                  alt="Vue logo"
                  class="logo"
                  src="@/assets/logo.svg"
                  width="50"
                  height="50"
                />
              </div>
            </div>
          </div>
          <div class="card-body px-5">
            <div class="row">
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
      <div class="col-12">
        <div class="card shadow flex justify-content-center">
          <div class="card-header">
            <div class="row">
              <div class="col-10">
                <h2 class="mx-4 my-1">Add Subtitles</h2>
              </div>
              <div class="col-2">
                <img
                  alt="Vue logo"
                  class="logo"
                  src="@/assets/logo.svg"
                  width="50"
                  height="50"
                />
              </div>
            </div>
          </div>
          <div class="card-body px-5">
            <div class="row">
              <div class="col-3">
                <div class="flex flex-column gap-2">
                  <label for="start-time small">Starting Timestamp</label>
                  <InputText
                    id="start-time"
                    v-model="startTimeStamp"
                    aria-describedby="username-help"
                  />
                  <br />
                  <small id="username-help"
                    >Enter the starting timestamp
                  </small>
                </div>
              </div>
              <div class="col-3">
                <div class="flex flex-column gap-2">
                  <label for="end-time small">Ending Timestamp</label>
                  <InputText
                    id="end-time"
                    v-model="endTimeStamp"
                    aria-describedby="username-help"
                  /><br />
                  <small id="username-help">Enter the ending timestamp </small>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="subtitle-text">Subtitles</label>
                  <input
                    class="form-control"
                    id="subtitle-text"
                    placeholder="Subtitles"
                    v-model="subtitleInput"
                  />
                </div>
              </div>
              <div class="col-12">
                <Button label="Update Subtitle" raised></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";
import { ref, type Ref } from "vue";
import { type ToastSeverityType } from "../types/ToastSeverityType";
import InputText from "primevue/inputtext";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const filePath = ref("");
const startTimeStamp = ref(null);
const endTimeStamp = ref(null);
const subtitleInput = ref(null);
let file: Blob | null = null;
const videoUploaded = ref(false);

const selectFile = (event: any) => {
  if (event.target && event.target.files && event.target.files[0]) {
    file = event.target.files[0];
    if (file) filePath.value = file.name;
    videoUploaded.value = true;
    show("success", "success", "file selected successfully");
    console.log("here");
  }
};
const sendFile = () => {
  console.log("sending file to the server");
  const formData = new FormData();
  formData.append("video", file);
  axios
    .post("http://192.168.1.105:4000/upload", formData)
    .then(() => {
      console.log("video uploaded successfully");
      show("success", "success", "file uploaded successfully");
    })
    .catch((err) => {
      console.log(err);
      show("error", "error", "File Upload Error " + err);
    });
};
const show = (category: ToastSeverityType, summary: string, detail: string) => {
  toast.add({
    severity: category,
    summary,
    detail,
    life: 3000,
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
