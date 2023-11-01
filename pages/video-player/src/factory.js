import Camera from "../../../lib/shared/camera.js"
import { supportsWorkerType } from "../../../lib/shared/util.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

const [rootPath] = window.location.href.split("/pages/")
const dbUrl = `${rootPath}/assets/database.json`

const service = new Service({
  faceLandmarksDetection: window.faceLandmarksDetection,
  dbUrl,
})

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("initialize esm workers")
    const worker = new Worker("./src/worker.js", { type: "module" })
    return worker
  }
  console.warn("your browser does not support workers")
}

const worker = await getWorker()

const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      worker,
      camera: new Camera(),
      service,
    })
  },
}

export default factory
