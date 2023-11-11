import { prepareRunChecker } from "../../../../lib/shared/util.js"

const { shouldRun: clickShouldRun } = prepareRunChecker({ timerDelay: 200 })

export default class HandGestureController {
  #view
  #service
  #camera
  #lastDirection = {
    direction: "",
    y: 0,
  }

  constructor({ view, service, camera }) {
    this.#view = view
    this.#service = service
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  #scrollPage(y) {
    const pixelsPerScroll = 100
    const screenHeight = window.innerHeight
    const middle = screenHeight / 2
    let direction
    if (y > middle) {
      direction = "down"
    }
    if (y < middle) {
      direction = "up"
    }
    if (!direction) return
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y =
        direction === "down"
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view.scrollPage(this.#lastDirection.y)
  }

  async #estimateHands() {
    try {
      if (!this.#camera) return
      const hands = await this.#service.estimateHands(this.#camera.video)
      this.#view.clearCanvas()
      if (hands?.length) {
        this.#view.drawResults(hands)
      }
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if (event === "click") {
          if (!clickShouldRun()) continue
          this.#view.clickOnElement(x, y)
          continue
        }
        if (event === "scroll") {
          this.#scrollPage(y)
        }
      }
    } catch (error) {
      console.error("erro", error)
    }
  }

  async #loop() {
    if (await this.#camera.isPlaying) {
      await this.#service.initializeDetector()
      await this.#estimateHands()
    }
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}
