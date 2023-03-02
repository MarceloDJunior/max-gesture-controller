import Camera from "../../../lib/shared/camera.js"
import { supportsWorkerType } from "../../../lib/shared/util.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

const [rootPath] = window.location.href.split('/pages/')

async function getWorker() {
  if (supportsWorkerType()) {
    const worker = new Worker('./src/worker.js', { type: 'module' })
    return worker
  }

  const workerMock = {
    async postMessage() { },
    onmessage(msg) { }
  }
  console.log('this browser does not support workers')
  return workerMock
}

const worker = await getWorker()

const camera = Camera.init()
const factory = {
  async initalize() {
    return Controller.initialize({
      view: new View(),
      service: new Service({}),
      worker
    })
  }
}

export default factory