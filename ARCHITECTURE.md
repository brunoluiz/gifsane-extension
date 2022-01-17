# Architecture

## Event flow

WIP

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
