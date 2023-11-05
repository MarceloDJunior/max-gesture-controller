export default class VideoPlayerView {
  #btnInit = document.querySelector("#init")
  #statusElement = document.querySelector("#status")
  #videoFrameCanvas = document.querySelector("#cameraCanvas")
  #canvasContext = this.#videoFrameCanvas.getContext("2d", {
    willReadFrequently: true,
  })

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas
    const [width, height] = [video.videoWidth, video.videoHeight]
    canvas.width = width
    canvas.height = height

    this.#canvasContext.drawImage(video, 0, 0, width, height)
    return this.#canvasContext.getImageData(0, 0, width, height)
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
}
