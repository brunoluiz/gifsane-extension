const main = () => {
  const isURL = (string) => {
    try {
      return Boolean(new URL(string, window.location.origin));
    } catch (e) {
      return false;
    }
  };

  // adds convert handler to all GIFs
  document.querySelectorAll("img").forEach((img) => {
    // This is a hack as some GIF srcs do not end in `.gif` but have HTML
    // attributes indicating it is a gif
    const isGif = Array.from(img.attributes).some((attr) => {
      return isURL(attr.nodeValue) && attr.nodeValue.includes(".gif");
    });
    if (!isGif) return;

    img.onload = () => handler(img);
  });
};

const handler = (img) => {
  const { width, height, style, src } = img;
  if (width < 72) return;

  const wrapper = document.createElement("div");
  wrapper.style = style;
  wrapper.style.position = "relative";
  wrapper.appendChild(img.cloneNode());

  const convert = document.createElement("div");
  convert.style.fontFamily = "sans-serif";
  convert.style.letterSpacing = -0.25;
  convert.style.position = "absolute";
  convert.style.bottom = "0";
  convert.style.left = "0";
  convert.style.padding = `4px 10px`;
  convert.style.background = "#10b981";
  convert.style.borderTopRightRadius = "5px";
  convert.style.fontWeight = 700;
  convert.style.cursor = "pointer";
  convert.style.color = "#000";
  convert.style.fontSize = "12px";
  convert.textContent = "Convert ❯";
  convert.onclick = () => {
    convert.remove();
    start(wrapper, { width, height, style, src });
    return false;
  };

  wrapper.appendChild(convert);
  img.parentNode.replaceChild(wrapper, img);
};

const start = async (container, { width, height, style, src }) => {
  const spinner = document.createElement("img");
  spinner.src = chrome.runtime.getURL("src/img/loading.gif");
  spinner.style.background = "transparent";
  spinner.style.height = "16px";

  const loading = document.createElement("div");
  loading.style.position = "absolute";
  loading.style.bottom = "0";
  loading.style.left = "0";
  loading.style.padding = `4px 8px`;
  loading.style.background = "#10b981";
  loading.style.borderTopRightRadius = "5px";
  loading.appendChild(spinner);

  container.appendChild(loading);

  chrome.runtime.sendMessage({ src }, async function ({ blobText, mimeType }) {
    // A bit of a hack, as it decodes the blob://{{ base64 }} into an usable
    // blob for URL.createObjectURL
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
    source.type = mimeType;

    video.appendChild(source);
    container.parentNode.replaceChild(video, container);
  });
};

main();
