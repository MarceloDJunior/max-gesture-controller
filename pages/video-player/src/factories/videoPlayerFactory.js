import Camera from "../../../../lib/shared/camera.js"
import { supportsWorkerType } from "../../../../lib/shared/util.js"
import VideoPlayerController from "../controllers/videoPlayerController.js"
import VideoPlayerService from "../services/videoPlayerService.js"
import VideoPlayerView from "../views/videoPlayerView.js"

const [rootPath] = window.location.href.split("/pages/")
const dbUrl = `${rootPath}/assets/database.json`

const service = new VideoPlayerService({
  faceLandmarksDetection: window.faceLandmarksDetection,
  dbUrl,
})

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("initialize esm workers")
    const worker = new Worker("./src/workers/faceLandmarksDetectionWorker.js", { type: "module" })
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
