import Camera from "../../shared/camera.js"
import { supportsWorkerType } from "../../shared/util.js"
import VideoPlayerController from "./controllers/videoPlayerController.js"
import YoutubePlayerService from "./services/youtubePlayerService.js"
import VideoPlayerView from "./views/videoPlayerView.js"

const rootPath = window.location.protocol + "//" + window.location.host
const dbUrl = `${rootPath}/assets/database.json`

const service = new YoutubePlayerService({
  faceLandmarksDetection: window.faceLandmarksDetection,
  dbUrl,
})

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("initialize esm workers")
    const worker = new Worker(`${rootPath}/lib/modules/blinkToPlayVideo/workers/faceLandmarksDetectionWorker.js`, {
      type: "module",
    })
    return worker
  }
  console.warn("your browser does not support workers")
}

const worker = await getWorker()

const videoPlayerFactory = {
  async initialize() {
    return VideoPlayerController.initialize({
      view: new VideoPlayerView(),
      worker,
      camera: new Camera(),
      service,
    })
  },
}

export default videoPlayerFactory
