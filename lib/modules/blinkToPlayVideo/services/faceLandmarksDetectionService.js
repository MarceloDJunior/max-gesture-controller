import { prepareRunChecker } from "../../../shared/util.js"

const { shouldRun } = prepareRunChecker({ timerDelay: 500 })

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

  #euclideanDistance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }

  async handBlinked(predictions) {
    if (!predictions.length) return false

    for (const prediction of predictions) {
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

      const rightEyeRatio =
        rightEyeHorizontalDistance / rightEyeVerticalDistance
      const leftEyeRatio = leftEyeHorizontalDistance / leftEyeVerticalDistance
      const ratio = (rightEyeRatio + leftEyeRatio) / 2
      const blinked = ratio > CLOSED_EYE_RATIO

      if (!blinked) continue
      if (!shouldRun()) continue

      return blinked
    }
    return false
  }

  async estimateFaces(video) {
    return await this.#detector.estimateFaces(video, {
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true,
    })
  }
}
