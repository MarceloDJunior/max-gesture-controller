export default class Controller {
  #view
  #worker
  #camera
  #service
  #blinkCounter = 0
  #movie

  constructor({ view, worker, camera, service }) {
    this.#view = view
    this.#camera = camera
    this.#service = service
    this.#worker = worker
    this.#view.configureOnBtnClick(this.onBtnStartClick.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log("not yet detecting eye blink. Click on the button to start")
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
    this.log("detecting eye blink...")

    setTimeout(() => this.loop(), 100)
  }

  log(text) {
    const times = `      - blinked times ${this.#blinkCounter}`
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""))
  }

  async onBtnStartClick() {
    await this.#camera.init()
    this.#configureWorker()
  }

  #startDetection() {
    this.log("initializing detection...")
    this.#blinkCounter = 0
    this.loop()
  }
}
