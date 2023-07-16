<template>
  <Dialog
    v-model:visible="displayCreateFileDialog"
    header="Header"
    :style="{ width: '40vw' }"
    position="top"
    :modal="true"
    :draggable="false"
  >
    <p class="m-0">
      Subtitles for this video is not saved. Do you want to create a new
      subtitle file?
    </p>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        @click="displayCreateFileDialog = false"
        text
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        @click="createSubtitles"
        autofocus
      />
    </template>
  </Dialog>
  <div class="col-12">
    <div class="card shadow flex justify-content-center">
      <div class="card-header">
        <div class="row">
          <div class="col-10">
            <h4 class="mx-4 my-1">Video</h4>
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
          <input class="form-control" v-model="backendFileName" />
          <Button
            raised
            severity="success"
            label="Fetch Video From Server"
            class="my-4"
            @click="getVideo"
            :disabled="!backendFileName"
          ></Button>
          <div class="col-12" v-if="videoNameSelected">
            <video controls="true" id="video1" style="max-height: 300px">
              <source type="video/mp4" height="200" width="200" />
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, type Ref, nextTick, TrackOpTypes, watch } from "vue";
import axios, { AxiosError } from "axios";
import { showToast } from "../services/toastService";
import { useToast } from "primevue/usetoast";
import { useVideoStore } from "../stores/videoDetails";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const urlVideo = ref("");
const urlSubtitle = ref("");
const backendFileName = ref(null);
const videoNameSelected = ref(false);
const displayCreateFileDialog = ref(false); // dialog flag controlling create file dialog box
const serverUrl = "http://localhost:5000";
const videoLoaded = ref(false);
const toast = useToast();
const videoStore = useVideoStore();

const { _videoChangeFlag } = storeToRefs(videoStore);
console.log(_videoChangeFlag.value);

watch(_videoChangeFlag, () => {
  console.log("video change detected");
  const videoEle = document.querySelector("video");
  if (videoEle) {
    fetchSubtitles(videoEle);
  }
});

/**
 * reloads the video HTML player and gets the video by file name entered
 */
const getVideo = () => {
  videoNameSelected.value = false;
  const videoEle = document.querySelector("video");
  if (videoEle) {
    videoEle.pause(); // pausing the video
    videoEle.currentTime = 0; //reseting to 0
  }
  urlVideo.value = serverUrl + `/display/${backendFileName.value}.mp4`;
  urlSubtitle.value = serverUrl + `/display/${backendFileName.value}.vtt`;
  videoStore.$patch({
    _videoUrl: urlVideo.value,
    _captionUrl: urlSubtitle.value,
  });

  fetch(urlVideo.value)
    .then((res) => {
      if (res.status > 400) {
        return new AxiosError("file not found");
      }
      return res.blob();
    })

    .then(function (videoBlob) {
      if (videoBlob.message) {
        return void showToast(
          toast,
          "error",
          "could not load video",
          videoBlob.message,
          3000
        );
      }
      videoNameSelected.value = true;

      nextTick().then(async () => {
        const videoEle = document.querySelector("video");
        if (videoEle) {
          const videoBlobUrl = URL.createObjectURL(videoBlob);
          videoEle.src = videoBlobUrl;
          videoEle.load();
          videoEle.onloadeddata = function () {
            videoStore.updateVideoName(backendFileName.value);
            // URL.revokeObjectURL(this.src); // freeing up memory
          };

          showToast(
            toast,
            "success",
            "fetched video",
            "fetched video from server",
            2500
          );
          fetchSubtitles(videoEle);
        }
      });
    });
};

/**
 * fetches the subtitle corresponding to video file name
 * @param videoEle the video element to render the subtitles
 */
function fetchSubtitles(videoEle: HTMLVideoElement) {
  if (videoEle.textTracks.length > 1) {
    // if the total no of subs in video is more than 1 then reload
    console.log("more sub reloaded");
    getVideo();
  } else {
    axios(urlSubtitle.value)
      .then((res) => {
        videoStore.setCaptionLoadedStatus(true); // setting caption loaded status true in store
        const binaryData: any[] = [];
        binaryData.push(res.data);
        const trackEle = document.createElement("track");
        trackEle.kind = "captions";
        trackEle.label = "English";
        trackEle.srclang = "en";
        trackEle.src = URL.createObjectURL(
          new Blob(binaryData, { type: "application/zip" })
        );

        videoEle.append(trackEle);
        videoStore.setSubtileFoundStatus(true);

        videoEle.textTracks[videoEle.textTracks.length - 1].mode = "showing";
        videoStore.setSubtileEnabledStatus(true);

        showToast(
          toast,
          "success",
          "subtitle found",
          "subtitle found and added to video",
          3000
        );
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === "file not found") {
          videoStore.setCaptionLoadedStatus(false); // caption not found

          displayCreateFileDialog.value = true;
        }
        showToast(
          toast,
          "error",
          "subtitle error",
          err.response?.data?.message,
          3000
        );
      });
  }
}

/**
 * creates a subtitle file for the video
 */
const createSubtitles = () => {
  displayCreateFileDialog.value = false;
  axios
    .post(serverUrl + "/create-subtitle", {
      fileName: videoStore.videoName,
    })
    .then((res) => {
      videoStore.setCaptionLoadedStatus(true); // setting caption loaded status true in store
      showToast(
        toast,
        "success",
        "created a new subtitle file ",
        "created a new subtitle file for the video. add your first subtitle now!",
        3000
      );
    })
    .catch((err) => {
      showToast(
        toast,
        "error",
        "subtitle file creation error",
        err.response?.data?.message,
        3000
      );
    });
};
</script>
