# GIFSane

Converts GIFs to sane controllable embed video players ~Basically does something browsers should do natively~.
If your favourite platform doesn't convert user GIFs into videos, this extension will help you.

![](./demo/demo.webp)

> The animation above uses WebM (more optimised than GIF) which is not currently supported for now

## Install

Due to the usage of WASM, is a bit tricky to upload this extension into web extension stores.

- Chrome and other Chromium browsers
  - Go to `chrome://extensions/`
  - Enable the `Developer mode` (toggle on top right corner)
  - `Load unpacked` and point to the extension folder

- Firefox:
  - Run `npm run link:firefox` (or run the script present on the `package.json` script for this task)
  - Go to `about:debugging`
  - `Load temporary add-on...` and point to the extension `manifest.json`

## Try it out

Here is a short GIF you can try to convert once you install the extension. You need to `Right Click -> GIFSane` and choose your preferred conversion method.

![](./demo/demo.gif)


## Caveats

- It uses `ffmpeg.wasm`, which is quite slow for long videos
- It uses Manifest V2 because some WASM CSP directives are not implemented and `ffmpeg.wasm` uses `document` selectors within its code. To port it to Manifest V3, the code will need to be placed in a worker which doesn't have access to the DOM (`document`).
- It can't be published on Chrome Store due to Manifest V2 :)
- It will stop working in January 2023 in Chrome if this can't be ported to Manifest V3.

## Related notes and blog posts

- [GIFs (sane) playback control using WASM and FFmpeg](https://brunoluiz.net/blog/2022/jan/gif-sane-playback-control-ffmpegwasm/): how it was implemented, and some caveats and tricks that were required during the implementation

## To-do

- Add support to sending to a remote server
- Write down landing page
- Try to replace FFMPEG with something else?
- Deal with `.webp` (ffmpegwasm doesn't seem to like those)

## Attributions

- FFMpeg.wasm: https://github.com/ffmpegwasm/ffmpeg.wasm (fork used at https://github.com/brunoluiz/ffmpeg.wasm)
- FFMpeg.wasm-core https://github.com/ffmpegwasm/ffmpeg.wasm-core (fork used at https://github.com/brunoluiz/ffmpeg.wasm-core)
- FFMpeg: https://github.com/FFmpeg/FFmpeg
