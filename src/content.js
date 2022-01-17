let lastImageClicked;

const attach = () => {
  document.querySelectorAll("img").forEach((img) => {
    img.oncontextmenu = () => {
      lastImageClicked = img;
    };
  });
};

const toLoading = (img) => {
  const container = document.createElement("div");
  container.style = img.style;
  container.style.position = "relative";
  container.appendChild(img.cloneNode());

  const spinner = document.createElement("img");
  spinner.src = chrome.runtime.getURL("src/img/loading.gif");
  spinner.style.background = "transparent";
  spinner.style.height = "16px";

  const loading = document.createElement("div");
  loading.style.position = "absolute";
  loading.style.bottom = "0";
  loading.style.left = "0";
  loading.style.padding = `6px 8px`;
  loading.style.background = "#10b981";
  loading.style.borderTopRightRadius = "5px";
  loading.id = "ffmpeg_convert_loading";
  loading.appendChild(spinner);

  container.appendChild(loading);
  img.parentNode.replaceChild(container, img);
  return container;
};

chrome.runtime.onMessage.addListener(({ data, type }) => {
  const container = toLoading(lastImageClicked);

  switch (type) {
    case "embed_conversion_requested": {
      const { width, height, style } = lastImageClicked;

      return chrome.runtime.sendMessage(
        { data: { src: data.src }, type: "conversion_requested" },
        async function ({ blobText, mimeType }) {
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
          video.loop = true;

          const source = document.createElement("source");
          source.src = url;
          source.type = mimeType;

          video.appendChild(source);

          if (container.parentNode.nodeName !== "A") {
            container.parentNode.replaceChild(video, container);
            return;
          }

          // If there was a link wrapping the GIF, replace it as it will hijack mouse events
          container.parentNode.parentNode.replaceChild(
            video,
            container.parentNode
          );
        }
      );
    }
    case "download_conversion_requested": {
      const img = lastImageClicked.cloneNode();

      return chrome.runtime.sendMessage(
        { data: { src: data.src }, type: "conversion_requested" },
        async function ({ blobText, mimeType }) {
          // A bit of a hack, as it decodes the blob://{{ base64 }} into an usable
          // blob for URL.createObjectURL
          const blob = await (await fetch(blobText)).blob();
          const url = URL.createObjectURL(blob);
          chrome.runtime.sendMessage({
            data: { url },
            type: "download_requested",
          });

          container.parentNode.replaceChild(img, container);
          attach();
        }
      );
    }
  }
});

attach();
