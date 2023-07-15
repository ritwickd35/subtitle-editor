<template>
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
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, type Ref, nextTick, TrackOpTypes, watch } from "vue";
import axios from "axios";
import { showToast } from "../services/toastService";
import { useToast } from "primevue/usetoast";
import { useVideoStore } from "../stores/videoDetails";

const urlVideo = ref("");
const urlSubtitle = ref("");
const backendFileName = ref(null);
const videoNameSelected = ref(false);
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
    .then((res) => res.blob())
    .then(function (videoBlob) {
      videoNameSelected.value = true;

      nextTick().then(async () => {
        const videoEle = document.querySelector("video");
        if (videoEle) {
          const videoBlobUrl = URL.createObjectURL(videoBlob);
          videoEle.src = videoBlobUrl;
          videoEle.load();
          videoEle.onloadeddata = function () {
            // URL.revokeObjectURL(this.src); // freeing up memory
            videoStore.setVideoLoadedStatus(true);
          };

          showToast(
            toast,
            "success",
            "fetched video",
            "fetched video from server",
            900
          );
          fetchSubtitles(videoEle);
        }
      });

      videoStore.updateVideoName(backendFileName.value);
    })
    .catch((err) => {
      console.log(err);
      showToast(
        toast,
        "error",
        "could not load video",
        err.response?.data?.message
      );
    });
};

function fetchSubtitles(videoEle: HTMLVideoElement) {
  showToast(
    toast,
    "info",
    "fetching subtitles",
    "fetching subtitles for video"
  );
  if (videoEle.textTracks.length > 1) {
    getVideo();
  } else {
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

        //   for (let i = 0; i < videoEle.textTracks.length; i++) {
        //     videoEle.textTracks[i]["mode"] = "disabled";
        //   }

        videoEle.append(trackEle);
        videoStore.setSubtileFoundStatus(true);

        videoEle.textTracks[videoEle.textTracks.length - 1].mode = "showing";
        videoStore.setSubtileEnabledStatus(true);

        showToast(
          toast,
          "success",
          "subtitle found",
          "subtitle found and added to video",
          2000
        );
      })
      .catch((err) => {
        console.log(err);
        showToast(
          toast,
          "error",
          "request failed",
          err.response?.data?.message
        );
      });
  }
}
</script>
