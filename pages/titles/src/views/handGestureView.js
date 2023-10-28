export default class HandGestureView {
  #scrollTimer
  #canScroll = true
  #handsCanvas = document.querySelector("#hands")
  #canvasContext = this.#handsCanvas.getContext("2d")
  #fingerLoopUpIndexes
  #styler

  constructor({ timerDelay, fingerLoopUpIndexes, styler }) {
    this.#setScrollThrottle(timerDelay)
    this.#handsCanvas.width = window.screen.availWidth
    this.#handsCanvas.height = window.screen.availHeight
    this.#fingerLoopUpIndexes = fingerLoopUpIndexes
    this.#styler = styler

    // load styles asynchronously to avoid screen freeze
    setTimeout(() => styler.loadDocumentStyles(), 200)
  }

  clearCanvas() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#handsCanvas.width,
      this.#handsCanvas.height,
    )
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue

      this.#canvasContext.fillStyle = "rgba(44, 212, 103)"
      this.#canvasContext.strokeStyle = "white"
      this.#canvasContext.lineWidth = 8
      this.#canvasContext.lineJoin = "round"

      this.#drawJoints(keypoints)
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  clickOnElement(x, y) {
    const element = document.elementFromPoint(x, y)
    if (!element) return

    const rect = element.getBoundingClientRect()
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y,
    })

    element.dispatchEvent(event)
  }

  #drawJoints(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath()
      const newX = x - 2
      const newY = y - 2
      const radius = 3
      const startAngle = 0
      const endAngle = 2 * Math.PI

      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
      this.#canvasContext.fill()
    }
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLoopUpIndexes)
    for (const finger of fingers) {
      const points = this.#fingerLoopUpIndexes[finger].map(
        (index) => keypoints[index],
      )
      const region = new Path2D()
      // All point start from [0] and [0] is the palm
      const { x, y } = points[0]
      region.moveTo(x, y)
      for (const point of points) {
        region.lineTo(point.x, point.y)
      }
      this.#canvasContext.stroke(region)
      this.#hoverElement(finger, points)
    }
  }

  #hoverElement(finger, points) {
    if (finger !== "indexFinger") return
    const tip = points.find((item) => item.name === "index_finger_tip")
    const element = document.elementFromPoint(tip.x, tip.y)
    if (!element) return
    const fn = () => this.#styler.toggleStyle(element, ":hover")
    fn()
    setTimeout(fn, 500)
  }

  #setScrollThrottle(timerDelay) {
    window.addEventListener("scroll", () => {
      this.#canScroll = false
      clearTimeout(this.#scrollTimer)
      this.#scrollTimer = setTimeout(() => {
        this.#canScroll = true
      }, timerDelay)
    })
  }

  loop(fn) {
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    if (this.#canScroll) {
      window.scroll({
        top,
        behavior: "smooth",
      })
    }
  }
}
