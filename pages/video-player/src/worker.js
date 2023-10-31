import "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js"
import "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js"
import "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js"
import "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js"

import Service from "./service.js"

let service

async function init() {
  // On the main thread we use window
  // but on worker thread we use self
  const { tf, faceLandmarksDetection } = self
  tf.setBackend("webgl")

  service = new Service({ faceLandmarksDetection })
  console.log("loading tf model")
  await service.loadModel()
  console.log("tf model loaded")
  postMessage("READY")
}

onmessage = async ({ data }) => {
  if (data === "init") {
    await init()
  } else {
    const blinked = await service.handBlinked(data)
    if (!blinked) return
    postMessage({ blinked })
  }
}
