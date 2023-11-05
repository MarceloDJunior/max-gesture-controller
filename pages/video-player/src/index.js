import videoPlayerFactory from "./factories/videoPlayerFactory.js"
import handGestureFactory from "../../titles/src/factories/handGestureFactory.js"

await videoPlayerFactory.initialize()
await handGestureFactory.initialize()
