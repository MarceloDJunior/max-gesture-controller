import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection"

import Service from "../services/faceLandmarksDetectionService.js"

let service
let hasCapturedFirstBlink = false

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

onmessage = async ({ data }) => {
  if (data.type === "INIT") {
    await init()
  } else {
    const { data: imageData, width, height } = data.frame
    const predictions = await service.estimateFaces(
      new ImageData(imageData, width, height),
    )

    postMessage({ type: "DRAW", predictions })

    const blinked = await service.handBlinked(predictions)
    if (!hasCapturedFirstBlink) {
      hasCapturedFirstBlink = true
      postMessage({ type: "STARTED" })
      return
    }
    if (!blinked) return
    postMessage({ type: "BLINK", blinked })
  }
}
