import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection"
import Service from "../services/faceLandmarksDetectionService.js"
import { prepareRunChecker } from "../../../shared/util.js"

// Ensure there is at least 50ms of time interval between each call to the model, to avoid high memory usage
const { shouldRun } = prepareRunChecker({ timerDelay: 50 })

let service
let hasStartedCapturing = false
let mode = "blink"
let previousClosed

async function init() {
  // On the main thread we use window
  // but on worker thread we use self
  self.tf.setBackend("webgl")
  service = new Service({ faceLandmarksDetection: self.faceLandmarksDetection })
  console.log("loading tf model")
  await service.loadModel()
  console.log("tf model loaded")
  postMessage({ type: "READY" })
}

function handleStartedCapturing() {
  hasStartedCapturing = true
  postMessage({ type: "STARTED" })
}

onmessage = async ({ data }) => {
  if (data.type === "INIT") {
    await init()
    return
  }
  if (data.type === "MODE") {
    mode = data.mode
    return
  }
  if (data.type === "FRAME") {
    if (!shouldRun()) return

    const { data: imageData, width, height } = data.frame
    const predictions = await service.estimateFaces(
      new ImageData(imageData, width, height),
    )
    if (!hasStartedCapturing) return handleStartedCapturing()

    postMessage({ type: "DRAW", predictions })

    if (mode === "close") {
      const closed = service.hasClosedEyes(predictions, previousClosed)
      if (closed === previousClosed) return
      previousClosed = closed
      postMessage({ type: "CLOSED", closed })
    } else {
      const blinked = service.hasBlinked(predictions)
      if (!blinked) return
      postMessage({ type: "BLINK", blinked })
    }
  }
}
