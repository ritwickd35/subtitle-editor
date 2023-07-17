# subtitle-editor

This is a Vue application which can be used to edit subtitles for a Video File.\
The video must be less than 64MB(due to ec2 restrictions) and be in mp4 format. The subtitles should be in standard webVTT format.  

This application will work even even if a video does not have a subtitle track associated with it. It will simply ask the user if they want to create a new caption file for the video in the server.

Once a video has caption track associated with it, a list of all the captions with their associated timestamps will be rendered. User can navigate to any point in the video by selecting a specific timestamp from the list.  

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Currently, this app has the following features:
- Upload a video and subtitle file to the server  
- Fetch the video and subtitle file  
- Navigate to a point in the video by selecting the caption from the caption list  
- Delete a specific caption 


## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
docker-compose up --build
```

### Compile and Hot-Reload for Development

```sh
npm install
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
