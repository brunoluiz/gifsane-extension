const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

chrome.runtime.onMessage.addListener(function ({ src }, _, sendResponse) {
  const create = async () => {
    let ffmpeg = undefined;

    const corePath = chrome.runtime.getURL("src/vendor/ffmpeg-core.js");
    const settings = { corePath, log: false, mainName: "proxy_main" };

    ffmpeg = await FFmpeg.createFFmpeg(settings);
    await ffmpeg.load();

    return ffmpeg;
  };

  const process = async () => {
    const ffmpeg = await create();

    const [inputFile, outputFile] = [`${Date.now()}.gif`, `${Date.now()}.mp4`];

    // Write file binary into ECScripten/WASM FS
    // More details at https://emscripten.org/docs/api_reference/Filesystem-API.html
    const inputFileData = await FFmpeg.fetchFile(src);
    ffmpeg.FS("writeFile", inputFile, inputFileData);

    // Run ffmpeg command -- be aware it is quite limited and many options are not
    // supported without recompiling
    await ffmpeg.run("-f", "gif", "-i", inputFile, outputFile);

    // Read output from WASM FS
    const outputFileData = ffmpeg.FS("readFile", outputFile);

    // Frees ffmpeg instance once it exits with process.exit(0)
    await ffmpeg.exit();

    // Convert output data into blob, as it can be later imported as `blob://...`
    const blob = new Blob([outputFileData.buffer], { type: "video/mp4" });

    // This is a bit of a hack: to pass this blob back to the content script without losing
    // data, as send response only sends string marshalled data, convert the blob into base64
    const blobText = await blobToBase64(blob);

    sendResponse({ blobText });
  };

  // "fire and forget" style
  process();

  // this return is required otherwise the listener fails (webex oddities)
  return true;
});
