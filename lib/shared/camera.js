export default class Camera {
  isPlaying = false

  constructor() {
    this.video = document.createElement("video")
  }

  async init() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Browser API navigator.mediaDevices.getUserMedia not available",
        )
      }

      const videoConfig = {
        audio: false,
        video: {
          width: globalThis.screen.availWidth,
          height: globalThis.screen.availHeight,
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(videoConfig)

      this.video.srcObject = stream

      // debug reasons
      // camera.video.height = 240
      // camera.video.width = 320
      // document.body.append(camera.video)

      // wait for camera
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          resolve(this.video)
        }
      })

      this.video.play()
      this.isPlaying = true
    } catch (err) {
      console.error(err)
      return null
    }
  }
}
