chrome.runtime.onMessage.addListener(function ({ data: { url }, type }) {
  if (type !== "download_requested") return;

  chrome.downloads.download({ url });
});
