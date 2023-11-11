import { prepareRunChecker } from "../../../shared/util.js"

// Add an interval between each blink check to avoid multiple detections for each blink
const { shouldRun } = prepareRunChecker({ timerDelay: 400 })

const CLOSED_EYE_RATIO = 2.5

export default class FaceLandmarksDetectionService {
  #detector = null
  #faceLandmarksDetection

  constructor({ faceLandmarksDetection }) {
    this.#faceLandmarksDetection = faceLandmarksDetection
  }

  async loadModel() {
    const model = this.#faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    const detectorConfig = {
      runtime: "tfjs",
      maxFaces: 1,
    }
    this.#detector = await this.#faceLandmarksDetection.createDetector(
      model,
      detectorConfig,
    )
  }

  async estimateFaces(video) {
    return await this.#detector.estimateFaces(video, {
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true,
    })
  }

  hasBlinked(predictions) {
    if (!predictions.length) return false

    for (const prediction of predictions) {
      const blinked = this.#areEyesClosed(prediction)

      if (!blinked) continue
      if (!shouldRun()) continue

      return blinked
    }
    return false
  }

  hasClosedEyes(predictions, currentState) {
    if (!predictions.length) return currentState
    let areEyesClosed = currentState
    for (const prediction of predictions) {
      const closedEyes = this.#areEyesClosed(prediction)
      if (!shouldRun()) continue
      areEyesClosed = closedEyes
    }
    return areEyesClosed
  }

  #areEyesClosed(prediction) {
    const rightEyeHorizontalRight = prediction.keypoints[33]
    const rightEyeHorizontalLeft = prediction.keypoints[133]

    const rightEyeVerticalTop = prediction.keypoints[159]
    const rightEyeVerticalBottom = prediction.keypoints[145]

    const leftEyeHorizontalRight = prediction.keypoints[362]
    const leftEyeHorizontalLeft = prediction.keypoints[263]

    const leftEyeVerticalTop = prediction.keypoints[386]
    const leftEyeVerticalBottom = prediction.keypoints[264]

    const rightEyeHorizontalDistance = this.#euclideanDistance(
      rightEyeHorizontalRight,
      rightEyeHorizontalLeft,
    )
    const rightEyeVerticalDistance = this.#euclideanDistance(
      rightEyeVerticalTop,
      rightEyeVerticalBottom,
    )
    const leftEyeHorizontalDistance = this.#euclideanDistance(
      leftEyeHorizontalRight,
      leftEyeHorizontalLeft,
    )
    const leftEyeVerticalDistance = this.#euclideanDistance(
      leftEyeVerticalTop,
      leftEyeVerticalBottom,
    )

    const rightEyeRatio = rightEyeHorizontalDistance / rightEyeVerticalDistance
    const leftEyeRatio = leftEyeHorizontalDistance / leftEyeVerticalDistance
    const ratio = (rightEyeRatio + leftEyeRatio) / 2
    const closed = ratio > CLOSED_EYE_RATIO
    return closed
  }

  #euclideanDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }
}
