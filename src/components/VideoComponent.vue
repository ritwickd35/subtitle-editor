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
          <div class="col-11">
            <h4 class="mx-4 my-1">Video</h4>
          </div>
          <div class="col-1">
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
          <input
            class="form-control"
            v-model="backendFileName"
            placeholder="Enter the saved video file name"
          />
          <Button
            raised
            severity="success"
            label="Fetch Video From Server"
            class="my-4"
            @click="getVideo"
            :disabled="!backendFileName"
          ></Button>
          <div class="col-6" v-if="videoNameSelected">
            <video controls="true" id="video1" style="max-height: 320px">
              <source type="video/mp4" />
            </video>
          </div>
          <div class="col-6 py-1" v-if="captionsLoaded">
            Choose a caption to navigate to
            <Listbox
              :options="subtitleTimestampArr"
              optionLabel="content"
              class="w-full md:w-14rem py-2"
              listStyle="max-height:290px"
            >
              <template #option="slotProps">
                <div class="row">
                  <div class="col-11">
                    <div
                      class="flex align-items-center"
                      @click="
                        subtitleNavigate(slotProps.option.startTimeSeconds)
                      "
                    >
                      <div>
                        {{ slotProps.option.startTime }} - {{ slotProps.option.endTime }} :: 
                        {{ slotProps.option.content }}
                      </div>
                    </div>
                  </div>
                  <div class="col-1" @click="subtitleDelete(slotProps.option)">
                    <img src="../assets/close-btn.png" height="30" style="margin-right: 30px; padding-bottom: 7px;"/>
                  </div>
                </div>
              </template>
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, type Ref, nextTick, TrackOpTypes, watch } from "vue";
import { parseWebVttCaptions } from "../services/parseCaptions";
import axios, { AxiosError } from "axios";
import { showToast } from "../services/toastService";
import { useToast } from "primevue/usetoast";
import { useVideoStore } from "../stores/videoDetails";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Listbox from "primevue/listbox";

const urlVideo = ref("");
const urlSubtitle = ref("");
const backendFileName = ref(null);
const videoNameSelected = ref(false);
const captionsLoaded = ref(false);
const subtitleTimestampArr = ref([]);
const displayCreateFileDialog = ref(false); // dialog flag controlling create file dialog box
const serverUrl = import.meta.env.VITE_SERVER_URL;
const toast = useToast();
const videoStore = useVideoStore();

const { _videoChangeFlag } = storeToRefs(videoStore);

watch(_videoChangeFlag, () => {
  const videoEle = document.querySelector("video");
  if (videoEle) {
    fetchSubtitles(videoEle);
  }
});

/**
 * reloads the video HTML player and gets the video by file name entered
 */
const getVideo = () => {
  showToast(
          toast,
          "info",
          "fetching video",
          "fetching "+backendFileName.value+".mp4 from the server",
          3000
        );
  captionsLoaded.value = false;
  videoNameSelected.value = false;
  const videoEle = document.querySelector("video");
  if (videoEle) {
    videoEle.pause(); // pausing the video
    videoEle.currentTime = 0; //reseting to 0
  }
  urlVideo.value = serverUrl + `/display/${backendFileName.value}.mp4`;
  urlSubtitle.value = serverUrl + `/display/${backendFileName.value}.vtt`;

  // setting
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
  captionsLoaded.value = false;

  // if the total no of subs in video is more than 1 then reload
  if (videoEle.textTracks.length > 1) {
    getVideo();
  } else {
    axios(urlSubtitle.value)
      .then((res) => {
        videoStore.setCaptionLoadedStatus(true); // setting caption loaded status true in store
        const responseData = res.data;

        // parsing captions into caption array to parse the timestamps
        const items = responseData.split("\n\n");
        subtitleTimestampArr.value = parseWebVttCaptions(items);

        // appending the caption track to video element in DOM
        const trackEle = document.createElement("track");
        trackEle.kind = "captions";
        trackEle.label = "English";
        trackEle.srclang = "en";

        // converting video data to blob
        const binaryData: any[] = [];
        binaryData.push(responseData);

        // creating object URL to append to caption track src
        trackEle.src = URL.createObjectURL(
          new Blob(binaryData, { type: "application/zip" })
        );

        // appending to video element
        videoEle.append(trackEle);
        videoStore.setSubtileFoundStatus(true);

        // set mode to showing
        if (videoEle.textTracks.length > 1) {
          videoEle.textTracks[0].mode = "disabled";
        }
        videoEle.textTracks[videoEle.textTracks.length - 1].mode = "showing";
        videoStore.setSubtileEnabledStatus(true);
        captionsLoaded.value = true; // setting caption loaded flag

        showToast(
          toast,
          "success",
          "subtitle loaded",
          "subtitle found and added to video",
          3000
        );
      })
      .catch((err) => {
        if (err.response.data.message === "file not found") {
          videoStore.setCaptionLoadedStatus(false); // caption not found

          displayCreateFileDialog.value = true; // display create file dialog box
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

/**
 * programmatically navigate to time instant
 * @param startTime timeInstant to navigate to
 */
const subtitleNavigate = (startTime: number) => {
  const videoEle = document.querySelector("video");
  if (videoEle) videoEle.currentTime = Math.round(startTime);
};

/**
 *
 * @param subtitleObj Delete a specific subtitle
 */
const subtitleDelete = (subtitleObj) => {
  delete subtitleObj?.startTimeSeconds;
  delete subtitleObj?.endTimeSeconds;
  subtitleObj["fileName"] = backendFileName.value;
  axios
    .post(serverUrl + "/delete-caption", subtitleObj)
    .then((res) => {
      showToast(
        toast,
        "success",
        "deleted subtitle",
        "Deleted the selected subtitle",
        3000
      );
      const videoEle = document.querySelector("video");
      if (videoEle) {
        fetchSubtitles(videoEle);
      }
    })
    .catch((err) => {
      showToast(
        toast,
        "error",
        "subtitle deletion error",
        err.response?.data?.message,
        3000
      );
    });
};
</script>
