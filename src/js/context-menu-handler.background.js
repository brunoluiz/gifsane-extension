const isURL = (str) => {
  try {
    return Boolean(new URL(str, window.location.origin));
  } catch (e) {
    return false;
  }
};

const isGIF = (str) => isURL(str) && str.includes(".gif");

chrome.contextMenus.create({
  title: "Convert to Video Player",
  contexts: ["image"],
  onclick: (info, tab) => {
    const { srcUrl: src } = info;
    if (!isGIF(src)) {
      console.error("extension used in non-GIF image");
      return;
    }

    chrome.tabs.sendMessage(tab.id, { data: { src }, type: "embed_video" });
  },
});

chrome.contextMenus.create({
  title: "Download as Video",
  contexts: ["image"],
  onclick: (info, tab) => {
    const { srcUrl: src } = info;
    if (!isGIF(src)) {
      console.error("extension used in non-GIF image");
      return;
    }

    chrome.tabs.sendMessage(tab.id, { data: { src }, type: "embed_video" });
  },
});
