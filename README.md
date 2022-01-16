# GIFSane

Converts GIFs to sane controllable embed video players ~Basically does something browsers should do natively~.
If your favourite platform doesn't convert user GIFs into videos (looking at you GitHub), this extension will
help you. The main application for this is for long guide videos that are recorded in GIFs instead of a more
~sane~ normal format.

![](./demo/demo.gif)

## Install

- Chrome: 
  - Go to `chrome://extensions/` and point to this extension folder

- Firefox:
  - Run `npm run link:firefox` (or run the script present on the `package.json` script for this task)
  - Go to `about://debugging/`
  - `Load temporary add-on...` and point to this extension `manifest.json`

## Caveats

- It uses `ffmpeg.wasm`, which is quite slow for long videos
- It uses Manifest V2 because some WASM CSP directives are not implemented and `ffmpeg.wasm` uses `document` selectors within its code. To port it to Manifest V3, the code will need to be placed in a worker which doesn't have access to the DOM (`document`).
- It can't be published on Chrome Store due to Manifest V2 :)
- It will stop working in January 2023 in Chrome if this can't be ported to Manifest V3.

## To-do

- Add support to sending to a remote server
- Write down landing page
