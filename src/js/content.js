const addClickHandlersAllElements = () => {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.src.includes(".gif")) return;
    const gif = img;
    const { width, height, style, src } = gif;

    const wrapper = document.createElement("div");
    wrapper.style = style;
    wrapper.style.position = "relative";
    wrapper.appendChild(gif.cloneNode());

    const convert = document.createElement("div");
    convert.style.fontFamily = "sans-serif";
    convert.style.letterSpacing = -0.25;
    convert.style.position = "absolute";
    convert.style.bottom = "0";
    convert.style.left = "0";
    convert.style.padding = `10px 18px`;
    convert.style.background = "rgba(255,255,255,.8)";
    convert.style.borderTopRightRadius = "5px";
    convert.style.fontWeight = 700;
    convert.style.cursor = "pointer";
    convert.style.color = "#000";
    convert.textContent = "Convert to video";
    convert.onclick = (e) => {
      convert.remove();
      start(wrapper, { width, height, style, src });
      return false;
    };

    wrapper.appendChild(convert);
    gif.parentNode.replaceChild(wrapper, gif);
  });
};

const start = async (container, { width, height, style, src }) => {
  const spinner = document.createElement("img");
  spinner.src = chrome.runtime.getURL("src/img/loading.gif");
  spinner.style.background = "transparent";
  spinner.style.height = "22px";

  const loading = document.createElement("div");
  loading.style.position = "absolute";
  loading.style.bottom = "0";
  loading.style.left = "0";
  loading.style.padding = `10px 12px`;
  loading.style.background = "rgba(255,255,255,.8)";
  loading.style.borderTopRightRadius = "5px";
  loading.appendChild(spinner);

  container.appendChild(loading);

  chrome.extension.sendMessage({ src }, async function ({ blobText }) {
    const blob = await (await fetch(blobText)).blob();
    const url = URL.createObjectURL(blob);

    const video = document.createElement("video");
    video.width = width;
    video.height = height;
    video.style.width = `${width}px`;
    video.style.height = `${height}px`;
    video.style = style;
    video.controls = true;
    video.autoplay = true;

    const source = document.createElement("source");
    source.src = url;
    source.type = "video/mp4";

    video.appendChild(source);
    container.parentNode.replaceChild(video, container);
  });
};

(async () => {
  addClickHandlersAllElements();
})();
