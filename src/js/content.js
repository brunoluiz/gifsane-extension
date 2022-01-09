const createFileName = (ext) =>
  `${Math.floor(Math.random() * Math.pow(2, 32) + 1)}.${ext}`;
let ffmpeg;

const init = async () => {
  if (ffmpeg) return;

  const corePath = chrome.runtime.getURL("src/vendor/ffmpeg-core.js");
  const settings = { corePath };

  ffmpeg = await FFmpeg.createFFmpeg(settings);
  await ffmpeg.load();
};

const addClickHandlersAllElements = () => {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.src.includes(".gif")) return;
    img.addEventListener("click", () => start(img));
  });
};

const start = async (obj) => {
  const gif = obj;
  const { width, height, style } = gif;

  const loading = document.createElement("div");
  const loadingGif = document.createElement("img");
  loading.style = style;
  loading.style.display = "flex";
  loading.style.alignItems = "center";
  loading.style.justifyContent = "center";
  loading.style.height = `${height}px`;
  loading.style.width = `${width}px`;
  loading.style.border = "1px solid #eee";
  loading.style.background = "transparent";

  loadingGif.src = chrome.runtime.getURL("src/img/loading.gif");
  loadingGif.width = 48;
  loadingGif.height = 48;
  loadingGif.style = {
    width: 48,
    height: 48,
  };
  loading.appendChild(loadingGif);
  gif.parentNode.replaceChild(loading, gif);

  // this is 100% racy
  await init();

  const [inputFileName, outputFileName] = [
    createFileName("gif"),
    createFileName("mp4"),
  ];
  const file = await FFmpeg.fetchFile(obj.src);
  ffmpeg.FS("writeFile", inputFileName, file);
  await ffmpeg.run("-f", "gif", "-i", inputFileName, outputFileName);
  const data = ffmpeg.FS("readFile", outputFileName);
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );

  const video = document.createElement("video");
  video.width = width;
  video.height = height;
  video.style = style;
  video.controls = true;
  video.autoplay = true;

  const source = document.createElement("source");
  source.src = url;
  source.type = "video/mp4";

  video.appendChild(source);
  loading.parentNode.replaceChild(video, loading);
};

(async () => {
  await init();
  addClickHandlersAllElements();
})();
