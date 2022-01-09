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
  loading.style.background = "rgba(0,0,0,.1)";

  loadingGif.src = chrome.runtime.getURL("src/img/loading.gif");
  loadingGif.width = 48;
  loadingGif.height = 48;
  loadingGif.style = {
    width: 48,
    height: 48,
  };
  loading.appendChild(loadingGif);
  gif.parentNode.replaceChild(loading, gif);

  chrome.extension.sendMessage({ src: gif.src }, async function ({ blobText }) {
    const blob = await (await fetch(blobText)).blob();
    const url = URL.createObjectURL(blob);

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
  });
};

(async () => {
  addClickHandlersAllElements();
})();
