export default class VideoPlayerController {
  #view
  #worker
  #camera
  #service
  #blinkCounter = 0
  #movie
  #hasStarted = false
  #mode = "blink"

  constructor({ view, worker, camera, service }) {
    this.#view = view
    this.#camera = camera
    this.#service = service
    this.#worker = worker
    this.#view.configureOnBtnClick(this.onBtnStartClick.bind(this))
    this.#view.configureModeChange(this.onModeChange.bind(this))
  }

  static async initialize(deps) {
    const controller = new VideoPlayerController(deps)
    controller.#view.updateStatusText("Not yet detecting eye blink.")
    return controller.init()
  }

  async #configureWorker() {
    this.#worker.postMessage({ type: "INIT" })
    this.#worker.onmessage = ({ data }) => {
      if (data.type === "READY") {
        console.log("worker is ready")
        this.#startDetection()
        return
      }
      if (data.type === "STARTED") {
        this.#hasStarted = true
        console.log("started detecting blink")
        return
      }
      if (data.type === "DRAW") {
        this.#view.drawFace(data.predictions)
      }
      if (data.type === "BLINK") {
        this.#blinkCounter += 1
        this.#view.togglePlayVideo()
      }
      if (data.type === "CLOSED") {
        const closed = data.closed
        if (closed) {
          this.#view.pauseVideo()
        } else {
          this.#view.playVideo()
        }
      }
    }
  }

  async init() {
    console.log("Init!!")

    const searchParams = new URLSearchParams(window.location.search)
    const title = searchParams.get("id")

    this.#movie = await this.#service.getMovieById(title)

    const youtubeVideoId = this.#movie.trailerUrl.split("/").pop()

    window.loadYTPlayer(youtubeVideoId)
  }

  loop() {
    if (!this.#camera.isPlaying) return
    const video = this.#camera.video
    const imageData = this.#view.getVideoFrame(video)
    const { data, width, height } = imageData
    this.#worker.postMessage({ type: "FRAME", frame: { data, width, height } })
    if (this.#hasStarted) {
      this.logBlinkedTimes()
    }
    requestAnimationFrame(this.loop.bind(this))
  }

  logBlinkedTimes() {
    if (this.#mode === "close") {
      this.#view.updateStatusText("Close your eyes to pause the video")
      return
    }
    if (this.#blinkCounter === 0) {
      this.#view.updateStatusText("Blink to play/pause the video")
      return
    }
    const times = `Blinked ${this.#blinkCounter} times`
    this.#view.updateStatusText(times)
  }

  async onBtnStartClick() {
    this.#view.updateStatusText("Preparing blink detection model...")
    this.#view.setButtonDisabled(true)
    await this.#camera.init()
    this.#configureWorker()
  }

  onModeChange(mode) {
    this.#mode = mode
    this.#worker.postMessage({ type: "MODE", mode })
  }

  #startDetection() {
    this.#view.updateStatusText("Initializing... This can take some seconds")
    this.#blinkCounter = 0
    this.loop()
  }
}
