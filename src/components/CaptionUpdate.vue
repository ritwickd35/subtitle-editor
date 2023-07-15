<template>
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
              <button type="submit" class="btn btn-primary">
                Update Subtitle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick, TrackOpTypes, watch } from "vue";
import { useVideoStore } from "../stores/videoDetails";

const videoLoaded = ref(false);
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { showToast } from "../services/toastService";

const serverUrl = "http://localhost:5000";

const videoStore = useVideoStore();
const toast = useToast();

const subtitleEditorEnabled = ref(true);

const videoChangeFlag = ref(videoStore._videoChangeFlag);

watch(videoChangeFlag, async (newVal, oldVal) => {
  console.log("video changes");
});

const captionSubmitted = (event) => {
  const data = new FormData(event.target);
  const requestBody = {
    fileName: videoStore.videoName,
  };
  const bodyArr = [...data.entries()];
  bodyArr.forEach((val) => {
    requestBody[val[0]] = val[1];
  });
  console.log(requestBody);
  showToast(
    toast,
    "info",
    "sending subs for updation",
    "sending subs to server for updation",
    500
  );
  axios
    .post(serverUrl + "/update-caption", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      showToast(
        toast,
        "info",
        "sent subtitles",
        "sent updated subtitles to server for updation",
        500
      );

      const videoEle = document.querySelector("video");

      videoStore._videoChangeFlag = !videoStore._videoChangeFlag;
    })
    .catch((err) => {
      console.log(err);
      showToast(toast, "error", "error", err.response?.data?.message);
    });
};
</script>
