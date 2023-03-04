export default class HandGestureView {
  #scrollTimer
  #timerDelay
  #canScroll = true

  constructor({ timerDelay }) {
    this.#timerDelay = timerDelay
    this.#setScrollThrottle()
  }

  #setScrollThrottle() {
    window.addEventListener('scroll', () => {
      this.#canScroll = false
      clearTimeout(this.#scrollTimer);
      this.#scrollTimer = setTimeout(() => {
        this.#canScroll = true
      }, this.#timerDelay);
    })
  }

  loop(fn) {
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    if (this.#canScroll) {
      window.scroll({
        top,
        behavior: 'smooth',
      })
    }
  }
}