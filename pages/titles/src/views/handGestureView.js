export default class HandGestureView {
  loop(fn) {
    requestAnimationFrame(fn)
  }
}