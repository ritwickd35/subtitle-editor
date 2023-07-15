import { defineStore } from "pinia";

export const useVideoStore = defineStore("videoDetails", {
  state: () => {
    return {
      _videoName: null as string | null,
      _videoDuration: null as string | null,
      _videoElementInserted: false as boolean,
      _subtitlesFound: false as boolean,
      _subtitlesEnabled: false as boolean,
      _videoUrl: null as string | null,
      _captionUrl: null as string | null,
      _videoChangeFlag: false as boolean,
    };
  },

  getters: {
    videoName: (state): string | null => state._videoName,
    videoDuration: (state): string | null => state._videoDuration,
    videoElementInserted: (state): boolean => state._videoElementInserted,
    subtitlesFound: (state): boolean => state._subtitlesFound,
    subtitlesEnabled: (state): boolean => state._subtitlesEnabled,
  },

  actions: {
    updateVideoName(videoName: string) {
      this._videoName = videoName;
    },
    setVideoDuration(videoDuration: number) {
      this._videoDuration = videoDuration;
    },
    setVideoLoadedStatus(videoLoadStatus: boolean) {
      this._videoElementInserted = videoLoadStatus;
    },
    setSubtileFoundStatus(subtitleFoundStatus: boolean) {
      this._subtitlesFound = subtitleFoundStatus;
    },
    setSubtileEnabledStatus(subtitleEnabledStatus: boolean) {
      this._subtitlesEnabled = subtitleEnabledStatus;
    },
  },
});
