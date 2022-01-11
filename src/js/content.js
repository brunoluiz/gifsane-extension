const addClickHandlersAllElements = () => {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.src.includes(".gif")) return;
    img.addEventListener("click", () => start(img));
  });
};

const start = async (obj) => {
  const gif = obj;
  const { width, height, style } = gif;

  const wrapper = document.createElement("div");
  wrapper.style = style;
  wrapper.style.position = "relative";
  wrapper.style.height = `${height}px`;
  wrapper.style.width = `${width}px`;

  const loading = document.createElement("img");
  loading.src = chrome.runtime.getURL("src/img/loading.gif");
  loading.style.position = "absolute";
  loading.style.bottom = "0";
  loading.style.left = "0";
  loading.style.padding = `10px`;
  loading.style.height = "32px";
  loading.style.background = "rgba(255,255,255,.8)";
  loading.style.borderTopRightRadius = "5px";

  wrapper.appendChild(gif.cloneNode());
  wrapper.appendChild(loading);
  gif.parentNode.replaceChild(wrapper, gif);

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
    wrapper.parentNode.replaceChild(video, wrapper);
  });
};

(async () => {
  addClickHandlersAllElements();
})();
