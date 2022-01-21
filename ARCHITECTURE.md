# Architecture

## Event flow

It uses events to control the signalling between context menu, background workers (ffmpeg and download manager) and content script.

### "Replace with Video Player" flow

1. User clicks on Context Menu
1. `./src/context-menu.js` emits `embed_conversion_requested` event
1. `./src/content.js` receives `embed_conversion_requested` and set a loading component within the image
1. `./src/content.js` emits `conversion_requested` event
1. `./src/handlers/ffmpeg-handler.js` receives `conversion_requested` and process the input
1. `./src/handlers/ffmpeg-handler.js` triggers the `sendResponse` callback
1. `./src/content.js` receives callback and replace image component

### "Download as Video" flow

1. User clicks on Context Menu
1. `./src/context-menu.js` emits `download_conversion_requested` event
1. `./src/content.js` receives `embed_conversion_requested` and set a loading component within the image
1. `./src/content.js` emits `conversion_requested` event
1. `./src/handlers/ffmpeg-handler.js` receives `conversion_requested` and process the input
1. `./src/handlers/ffmpeg-handler.js` triggers the `sendResponse` callback
1. `./src/content.js` receives callback and emits `conversion_requested`
1. `./src/handlers/download-handler.js` receives `conversion_requested` and triggers a download

## Folder structure

From `./src`:

- `content.js`: scripts required to interact with the DOM elements (loading state, for example) and dispatch messages to the handlers
- `context-menu.js`: register `GIFSane` to image's context menu (right-click mouse menu)
- `handlers/`: background scripts (in the future, workers)
  - `ffmpeg-handler.js`: handle `conversion_requested` events sent by the content script, which triggers FFMpeg conversion
  - `download-handler.js`: handle `download_requested` events sent by the content script, which triggers a Chrome download based on a blob URL
- `middlewares/`
  - `request-middleware.js`: change CSP headers to allow the injection of `blob:...` URLs through changes on `media-src`
- `img/`: keep static images used by the script and manifest
- `vendor/`: keep vendor source, as this doesn't rely on build scripts of any sort
