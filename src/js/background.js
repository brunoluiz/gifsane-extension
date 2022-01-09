const createFileName = (ext) =>
  `${Math.floor(Math.random() * Math.pow(2, 32) + 1)}.${ext}`;
let ffmpeg;

const init = async () => {
  if (ffmpeg) return;

  const corePath = chrome.runtime.getURL("src/vendor/ffmpeg-core.js");
  const settings = { corePath, log: true };

  ffmpeg = await FFmpeg.createFFmpeg(settings);
  await ffmpeg.load();
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

chrome.extension.onMessage.addListener(function (
  { src },
  sender,
  sendResponse
) {
  const process = async () => {
    const [inputFileName, outputFileName] = [
      createFileName("gif"),
      createFileName("mp4"),
    ];

    const file = await FFmpeg.fetchFile(src);
    ffmpeg.FS("writeFile", inputFileName, file);

    await ffmpeg.run("-f", "gif", "-i", inputFileName, outputFileName);

    const data = ffmpeg.FS("readFile", outputFileName);
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    const blobText = await blobToBase64(blob);

    sendResponse({ blobText });
  };

  process();
  return true;
});

(async () => {
  await init();
})();
