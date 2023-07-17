<template>
  <div class="col-12 py-4" v-if="subtitleEditorEnabled">
    <div class="card shadow flex justify-content-center">
      <div class="card-header">
        <div class="row">
          <div class="col-11">
            <h4 class="mx-4 my-1">Add Subtitles</h4>
          </div>
          <div class="col-1 px-4">
            <img
              alt="Vue logo"
              class="logo"
              src="@/assets/edit-btn.svg"
              width="35"
              height="30"
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

              <div class="form-group col-12 py-2">
                <label for="inputCaptionCOntent">Caption Content</label>
                <div class="p-inputgroup flex-1">
                  <InputText
                    type="text"
                    class="form-control"
                    name="captionContent"
                    id="inputCaptionCOntent"
                    placeholder="Caption"
                  />
                  <Button label="Update Subtitle" type="submit" />
                </div>
              </div>
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
import { extractTimeComponents } from "../services/verifyTimestampService";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
const videoLoaded = ref(false);
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { showToast } from "../services/toastService";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const videoStore = useVideoStore();
const toast = useToast();

const subtitleEditorEnabled = ref(true);

/**
 * 
 * @param event send submitted captions to backend for saving
 */
const captionSubmitted = (event) => {
  const data = new FormData(event.target);
  const requestBody = {
    fileName: videoStore.videoName,
  };
  const bodyArr = [...data.entries()];
  bodyArr.forEach((val) => {
    requestBody[val[0]] = val[1];
  });
  const startInstant = extractTimeComponents(requestBody.captionStartTime);
  const endInstant = extractTimeComponents(requestBody.captionEndTime);

  if (startInstant && endInstant && endInstant >= startInstant) {
    axios
      .put(serverUrl + "/insert-caption", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        showToast(
          toast,
          "success",
          "sent subtitles",
          "sent updated subtitles to server for updation",
          3000
        );

        const videoEle = document.querySelector("video");

        videoStore._videoChangeFlag = !videoStore._videoChangeFlag;
      })
      .catch((err) => {
        console.log(err);
        showToast(toast, "error", "error", err.response?.data?.message);
      });
  } else {
    showToast(toast, "error", "error", "Invalid Time Instants!");
  }
};
</script>
