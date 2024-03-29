export default class HandGestureView {
  #scrollTimer = 50
  #canScroll = true
  #handsCanvas = document.querySelector("#hands")
  #canvasContext = this.#handsCanvas.getContext("2d")
  #fingerIndexes
  #styler
  #scrollTopZone = document.querySelector("#scrollTopZone")
  #scrollBottomZone = document.querySelector("#scrollBottomZone")

  constructor({ timerDelay, fingerIndexes, styler }) {
    this.#setScrollThrottle(timerDelay)
    this.#handsCanvas.width = window.innerWidth
    this.#handsCanvas.height = window.innerHeight
    this.#fingerIndexes = fingerIndexes
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

  clearScrollZone() {
    this.#scrollTopZone?.classList.remove("visible")
    this.#scrollBottomZone?.classList.remove("visible")
  }

  drawResults(hands) {
    for (const { keypoints } of hands) {
      if (!keypoints) continue

      this.#canvasContext.fillStyle = "rgba(44, 212, 103)"
      this.#canvasContext.strokeStyle = "white"
      this.#canvasContext.lineWidth = 8
      this.#canvasContext.lineJoin = "round"

      this.#drawJoints(keypoints)
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  drawScrollZone(height) {
    if (!this.#scrollTopZone || !this.#scrollBottomZone) return

    const element = document.documentElement || document.body
    const isAtTop = element.scrollTop === 0
    if (!isAtTop) {
      this.#scrollTopZone.style.height = height + "px"
      this.#scrollTopZone?.classList.add("visible")
    }

    const scrollPosition = element.scrollTop
    const documentHeight = element.scrollHeight
    const viewportHeight = element.clientHeight

    const isAtBottom = scrollPosition + viewportHeight >= documentHeight
    if (!isAtBottom) {
      this.#scrollBottomZone.style.height = height + "px"
      this.#scrollBottomZone?.classList.add("visible")
    }
  }

  #isElementAtPoint(element, x, y) {
    const errorMargin = 30
    const rect = element.getBoundingClientRect()
    return (
      x >= rect.left - errorMargin &&
      x <= rect.right + errorMargin &&
      y >= rect.top - errorMargin &&
      y <= rect.bottom + errorMargin
    )
  }

  #getClickableElementAtPoint(x, y, parentElement = null) {
    let element
    if (!parentElement) {
      element = document.elementFromPoint(x, y)
    } else {
      element = parentElement
    }

    if (!element) return null

    if (this.#isElementAtPoint(element, x, y)) {
      return element
    }

    const children = element.children
    for (const child of children) {
      const clickableChild = this.#getClickableElementAtPoint(x, y, child)
      if (clickableChild) {
        return clickableChild
      }
    }

    return null // No clickable element found at the given point
  }

  clickOnElement(x, y) {
    const element = this.#getClickableElementAtPoint(x, y)
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
    const fingers = Object.keys(this.#fingerIndexes)
    for (const finger of fingers) {
      const points = this.#fingerIndexes[finger].map(
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
