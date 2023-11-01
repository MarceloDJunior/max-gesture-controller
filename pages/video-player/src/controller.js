export default class Controller {
  #view
  #worker
  #camera
  #service
  #blinkCounter = 0
  #movie
  #hasStarted = false

  constructor({ view, worker, camera, service }) {
    this.#view = view
    this.#camera = camera
    this.#service = service
    this.#worker = worker
    this.#view.configureOnBtnClick(this.onBtnStartClick.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.#view.updateStatusText("Not yet detecting eye blink.")
    return controller.init()
  }

  async #configureWorker() {
    this.#worker.postMessage("init")
    this.#worker.onmessage = ({ data }) => {
      if (data === "READY") {
        console.log("worker is ready")
        this.#startDetection()
        return
      }
      if (data === "STARTED") {
        this.#hasStarted = true
        console.log("started detecting blink")
      }
      const blinked = data.blinked
      this.#blinkCounter += 1
      this.#view.togglePlayVideo()
      console.log("blinked", blinked)
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
    if (!this.#camera.video) return
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.postMessage(img)
    if (this.#hasStarted) {
      this.logBlinkedTimes()
    }
    setTimeout(() => this.loop(), 100)
  }

  logBlinkedTimes() {
    if (this.#blinkCounter === 0) {
      this.#view.updateStatusText("Blink to play/pause the video")
      return
    }
    const times = `Blinked ${this.#blinkCounter} times`
    this.#view.updateStatusText(times)
  }

  async onBtnStartClick() {
    this.#view.updateStatusText("Initializing detection...")
    this.#view.setButtonDisabled(true)
    await this.#camera.init()
    this.#configureWorker()
  }

  #startDetection() {
    this.#blinkCounter = 0
    this.loop()
  }
}
