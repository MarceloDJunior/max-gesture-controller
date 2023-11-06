const { GestureDescription, Finger, FingerCurl } = window.fp

const ScrollGesture = new GestureDescription("scroll") // 🤞
const ClickGesture = new GestureDescription("click") // 👈

// Scroll
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.4)
ScrollGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 0.8)

ScrollGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.4)
ScrollGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 0.8)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4)

ScrollGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0)

ScrollGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0)

// Click
// -----------------------------------------------------------------------------
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 0.6)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.8)

ClickGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9)

const knownGestures = [ScrollGesture, ClickGesture]

const gestureStrings = {
  scroll: "🤞",
  click: "👈",
}

export { knownGestures, gestureStrings }
