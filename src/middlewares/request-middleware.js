const isCSPHeader = (headerName) =>
  headerName === "CONTENT-SECURITY-POLICY" || headerName === "X-WEBKIT-CSP";

// Listens on new request
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    for (let i = 0; i < details.responseHeaders.length; i += 1) {
      if (!isCSPHeader(details.responseHeaders[i].name.toUpperCase())) {
        continue;
      }

      const values = details.responseHeaders[i].value.split(";");
      details.responseHeaders[i].value = values
        .map((v) => {
          if (!v.includes("media-src")) return v;

          // required to allow script to inject converted video
          return `${v} blob:`;
        })
        .join(";");
    }

    return {
      responseHeaders: details.responseHeaders,
    };
  },
  {
    urls: ["*://*/*"],
    types: ["main_frame"],
  },
  ["blocking", "responseHeaders"]
);
