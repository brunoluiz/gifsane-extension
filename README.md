# GIF.mp4

Converts GIFs to embed video players, giving playback control over them. ~Basically does something browsers should do natively~

![](./demo/SampleGIFImage_40kbmb.gif)

## Caveats

- It uses `ffmpeg.wasm`, which is quite slow for long videos
- It uses Manifest V2 because some WASM CSP directives are not implemented and `ffmpeg.wasm` uses `document` selectors within its code. To port it to Manifest V3, the code will need to be placed in a worker which doesn't have access to the DOM (`document`).

## To-do

- Add support to sending to a remote server
- Write down landing page
- Clean-up boilerplate assets from other extension (mainly icons and landing page)
- Publish on Chrome Store
- Review license
