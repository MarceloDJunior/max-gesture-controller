export default class VideoPlayerView {
  #btnInit = document.querySelector("#init")
  #statusElement = document.querySelector("#status")
  #videoFrameCanvas = document.querySelector("#webcam")
  #videoFrameCanvasContext = this.#videoFrameCanvas.getContext("2d", {
    willReadFrequently: true,
  })
  #facepointsCanvas = document.querySelector("#facepoints")
  #facepointsCanvasContext = this.#facepointsCanvas.getContext("2d")

  constructor() {
    this.#facepointsCanvas.width = window.innerWidth
    this.#facepointsCanvas.height = window.innerHeight
  }

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas
    const [width, height] = [video.videoWidth, video.videoHeight]
    canvas.width = width
    canvas.height = height

    this.#videoFrameCanvasContext.drawImage(video, 0, 0, width, height)
    return this.#videoFrameCanvasContext.getImageData(0, 0, width, height)
  }

  togglePlayVideo() {
    if (this.isVideoPaused()) {
      this.playVideo()
      return
    }
    this.pauseVideo()
  }

  isVideoPaused() {
    const playingValue = 1
    return window.YTPlayer.getPlayerState() !== playingValue
  }

  playVideo() {
    window.YTPlayer.playVideo()
  }

  pauseVideo() {
    window.YTPlayer.pauseVideo()
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener("click", fn)
  }

  updateStatusText(text) {
    this.#statusElement.innerHTML = text
  }

  setButtonDisabled(disabled) {
    this.#btnInit.disabled = disabled
  }

  drawFace(predictions) {
    const prediction = predictions[0]
    if (!prediction) return // do not draw if there is no mesh
    const keyPoints = prediction.keypoints
    if (!keyPoints) return // do not draw if there is no keypoints
    this.#facepointsCanvasContext.clearRect(
      0,
      0,
      this.#facepointsCanvasContext.canvas.width,
      this.#facepointsCanvasContext.canvas.height,
    ) //clear the canvas after every drawing

    for (let keyPoint of keyPoints) {
      this.#facepointsCanvasContext.beginPath()
      const newX = keyPoint.x
      const newY = keyPoint.y
      const radius = 2
      const startAngle = 0
      const endAngle = 3 * Math.PI
      this.#facepointsCanvasContext.arc(newX, newY, radius, startAngle, endAngle)
      this.#facepointsCanvasContext.fillStyle = "white"
      this.#facepointsCanvasContext.fill()
    }
  }
}
