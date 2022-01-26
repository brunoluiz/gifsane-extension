(async () => {
  try {
    importScripts("/src/vendor/ffmpeg-core.js", "/src/vendor/ffmpeg.min.js");
  } catch (e) {
    console.error(e);
  }

  const corePath = chrome.runtime.getURL("src/vendor/ffmpeg-core.js");
  const settings = { corePath, log: true };

  ffmpeg = await FFmpeg.createFFmpeg(settings);
  await ffmpeg.load();
})();
