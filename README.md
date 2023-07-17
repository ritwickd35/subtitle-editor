# subtitle-editor

This is a Vue application which can be used to edit subtitles for a Video File.\
The video must be less than 64MB(due to ec2 restrictions) and be in mp4 format. The subtitles should be in standard webVTT format.  

Once a video has caption, a list with all the captions with their associated timestamps will be rendered. User can navigate to any point in the video by selecting a specific timestamp.  

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Currently, this app has the following features:
- Upload a video and subtitle file to the server  
- Fetch the video and subtitle file  
- Navigate the video by selecting the caption you want to view from the caption list  
- Delete the specific caption that you do not want  
- If you upload/request a video file which does not have a caption, you will be given an option to create a empty caption file, in which you can add your own captions  


## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
