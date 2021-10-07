const createFileName = (ext) => `${ Math.floor((Math.random() * Math.pow(2, 32)) + 1) }.${ext}`;
let ffmpeg;

const load = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.type = "text/javascript";
    script.onload = () => {
      resolve();
    };
    script.onerror = (e) => {
      reject(e)
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  })
}

const init = async () => {
  if (ffmpeg) return

  console.log('loading ffmpeg...')
  ffmpeg = await FFmpeg.createFFmpeg();
  await ffmpeg.load();
  console.log('ffmpeg loaded')
}

const addClickHandlersAllElements = () => {
  document.querySelectorAll('img').forEach(img => {
    if (!img.src.includes('.gif')) return;
    img.addEventListener('click', () => start(img))
  })
}

const start = async (obj) => {
  const gif = obj
  const { width, height, style } = gif

  const loading = document.createElement('div');
  const loadingGif = document.createElement('img')
  loading.width = width
  loading.height = height
  loading.style.display = 'flex',
  loading.style.alignItems = 'center'
  loading.style.justifyContent = 'center'
  loading.style.height = height
  loading.style.width = width
  loading.style.border = '1px solid #eee'

  loadingGif.src = '/loading.gif'
  loadingGif.width = 48
  loadingGif.height= 48
  loadingGif.style = {
    width: 48,
    height: 48
  }
  loading.appendChild(loadingGif)
  gif.parentNode.replaceChild(loading, gif)

  // this is 100% racy
  await init();

  const [ inputFileName, outputFileName ] = [ createFileName('gif'), createFileName('mp4') ]
  const file = await FFmpeg.fetchFile(obj.src);
  ffmpeg.FS("writeFile", inputFileName, file);
  await ffmpeg.run("-f", "gif", "-i", inputFileName, outputFileName);
  const data = ffmpeg.FS("readFile", outputFileName);
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))

  const video = document.createElement('video');
  video.width = width
  video.height = height
  video.style = style
  video.controls = true
  video.autoplay = true

  const source = document.createElement('source');
  source.src = url
  source.type = "video/mp4";

  video.appendChild(source)
  loading.parentNode.replaceChild(video, loading)
}

(async() => {
  await load('/ffmpeg.min.js');
  addClickHandlersAllElements();
})()
