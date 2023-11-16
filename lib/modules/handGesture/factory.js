import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"
import "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
import "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection"
import "https://cdn.jsdelivr.net/npm/fingerpose"

import HandGestureController from "./controllers/handGestureController.js"
import HandGestureView from "./views/handGestureView.js"
import HandGestureService from "./services/handGestureService.js"
import Camera from "../../../lib/shared/camera.js"
import {
  knownGestures,
  gestureStrings,
  fingerIndexes,
} from "./util/util.js"

// eslint-disable-next-line no-undef
const styler = new PseudoStyler()
const camera = new Camera()

const factory = {
  async initialize() {
    return HandGestureController.initialize({
      camera,
      view: new HandGestureView({
        timerDelay: 10,
        fingerIndexes,
        styler,
      }),
      service: new HandGestureService({
        fingerpose: window.fp,
        handPoseDetection: window.handPoseDetection,
        handsVersion: window.VERSION,
        knownGestures,
        gestureStrings,
      }),
    })
  },
}

export default factory
