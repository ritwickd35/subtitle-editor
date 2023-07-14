<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card shadow flex justify-content-center my-5">
          <div class="card-header">
            <div class="row">
              <div class="col-10">
                <h2 class="mx-4 my-1">Upload video and Subtitles</h2>
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
                <h2 class="mx-4 my-1">Video</h2>
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
              <input class="form-control" v-model="backendFileName" />
              <button
                class="btn btn-primary my-3"
                @click="getVideo"
                @disabled="backendFileName"
              >
                Fetch Video From Server
              </button>
              <div class="col-12" v-if="videoNameSelected">
                <video controls="true" id="video1" style="max-height: 300px">
                  <source type="video/mp4" height="200" width="200" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 py-5" v-if="subtitleEditorEnabled">
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
              <div class="col-12">
                <form @submit.prevent="captionSubmitted">
                  <div class="form-group">
                    <label for="inputFileName">File Name</label>
                    <input
                      name="fileName"
                      type="text"
                      class="form-control"
                      id="inputFileName"
                      placeholder="sample"
                    />
                  </div>
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="inputStartTime">Caption Start time</label>
                      <input
                        type="text"
                        name="captionStartTime"
                        class="form-control"
                        id="inputStartTime"
                        placeholder="hh:mm:ss.ttt"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputEndTime">Caption End Time</label>
                      <input
                        type="text"
                        name="captionEndTime"
                        class="form-control"
                        id="inputEndTime"
                        placeholder="hh:mm:ss.ttt"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="inputCaptionCOntent">Caption Content</label>
                    <input
                      type="text"
                      class="form-control"
                      name="captionContent"
                      id="inputCaptionCOntent"
                      placeholder="Caption"
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="!videoLoaded"
                  >
                    Update Subtitle
                  </button>
                </form>
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
import { ref, type Ref, nextTick, TrackOpTypes } from "vue";
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
const backendFileName = ref(null);
const videoNameSelected = ref(false);
const videoLoaded = ref(false);
const subtitleEditorEnabled = ref(true);
const urlVideo = ref("");
const urlSubtitle = ref("");
const serverUrl = "http://localhost:5000";

const selectFile = (event: any) => {
  if (event.target && event.target.files && event.target.files[0]) {
    file = event.target.files[0];
    if (file) filePath.value = file.name;
    videoUploaded.value = true;
    showToast("success", "success", "file selected successfully");
    console.log("here");
  }
};
const sendFile = () => {
  console.log("sending file to the server");
  const formData = new FormData();
  formData.append("file", file);
  axios
    .post("http://localhost:5000/save-file", formData)
    .then((message) => {
      console.log("video uploaded successfully", message);
      showToast("success", message.data.status, message.data.message);
    })
    .catch((err) => {
      console.log(err);
      showToast("error", err.response.data.status, err.response.data.message);
    });
};

const captionSubmitted = (event) => {
  const data = new FormData(event.target);
  const requestBody = {};
  const bodyArr = [...data.entries()];
  bodyArr.forEach((val) => {
    requestBody[val[0]] = val[1];
  });
  console.log(requestBody);
  axios
    .post(serverUrl + "/update-caption", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      showToast("success", res.data.status, res.data.message, 500);
      showToast(
        "info",
        "refetching subtitles",
        "refetching new subtitles from server",
        500
      );
      const videoEle = document.querySelector("video");
      if (videoEle) {
        videoEle.src = urlVideo.value;
        fetchSubtitles(videoEle);
      }
    })
    .catch((err) => {
      showToast("error", "error", err.response?.data?.message);
    });
};
const showToast = (
  category: ToastSeverityType,
  summary: string,
  detail: string,
  duration: number = 1000
) => {
  toast.add({
    severity: category,
    summary,
    detail,
    life: duration,
  });
};
const getVideo = () => {
  videoNameSelected.value = true;
  urlVideo.value = serverUrl + `/display/${backendFileName.value}.mp4`;
  urlSubtitle.value = serverUrl + `/display/${backendFileName.value}.vtt`;
  nextTick().then(() => {
    const videoEle = document.querySelector("video");
    if (videoEle) {
      videoEle.src = urlVideo.value;
      videoLoaded.value = true;
      fetchSubtitles(videoEle);
    }
  });
};

function fetchSubtitles(videoEle: HTMLVideoElement) {
  axios(urlSubtitle.value)
    .then((res) => {
      const binaryData: any[] = [];
      binaryData.push(res.data);
      const trackEle = document.createElement("track");
      trackEle.kind = "captions";
      trackEle.label = "English";
      trackEle.srclang = "en";
      trackEle.src = URL.createObjectURL(
        new Blob(binaryData, { type: "application/zip" })
      );

      for (let i = 0; i < videoEle.textTracks.length; i++) {
        videoEle.textTracks[i]["mode"] = "disabled";
      }

      videoEle.append(trackEle);
      videoEle.textTracks[videoEle.textTracks.length - 1].mode = "showing";
      console.log(videoEle.textTracks);
    })
    .catch((err) => {
      console.log(err);
      showToast("error", "request failed", err.response?.data?.message);
    });
}
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
