# Max Gesture Controller

This project is a web application designed to detect hand and eye gestures and perform corresponding actions on a web page. It utilizes TensorFlow.js for accurate gesture detection.

## Features
- Hand Gesture Detection:
  - Scroll Gesture: When two fingers are up, the application detects the hand's position on the screen and scrolls accordingly. If the hand is at the top, it scrolls to the top, and if it's at the bottom, it scrolls to the bottom.
  - Click Gesture: When one finger is up or when a pinch gesture is detected, the application triggers a click action on the hovered element.
  - Pseudo Styler Integration: The application leverages the pseudo styler library to add hover effects to elements based on the hand position.

- Eye Gesture Detection:
  - Play/Pause Gesture (Blink Mode): The application detects eye blinks and performs play/pause actions on a YouTube video. Whenever the user blinks, the video toggles between play and pause.
  - Play/Pause Gesture (Eyes Closed/Open Mode): In this mode, the application pauses the YouTube video when the user closes their eyes and resumes playing when the eyes are open.

## Preview

## Technologies Used
- HTML/CSS: Used for designing and styling the web page.
- JavaScript: Implements the gesture detection logic and interacts with web page elements.
- TensorFlow: A popular machine learning framework for training and deploying deep learning models.
- Web Workers: Used to perform heavy operations without blocking the UI. This allows for a responsive user experience while running computationally intensive tasks in the background.
- Pseudo Styler: A library for applying pseudo styles to HTML elements.
- YouTube iframe API: Allows integration and control of YouTube videos using an iframe.

## Installation
1. Clone the project repository from GitHub.
2. Install the required dependencies using `npm install`.
3. Run the application using `npm start`.

## Usage
1. Open [http://localhost:3000](http://localhost:3000) in a browser.
2. Grant necessary camera permissions (if prompted).
3. Position your hand and/or face within the camera's view.
4. Perform hand gestures to trigger scroll and click actions on the web page.
5. Observe real-time gesture detection and corresponding actions.
6. For eye gestures, follow the specific mode instructions to play/pause the YouTube video.

### References
- Project initially created during [JS Expert Week 7.0](https://github.com/ErickWendel/semana-javascript-expert07) by [Erick Wendel](https://github.com/ErickWendel).  
- Layout based on the project [Streaming Service](https://codepen.io/Gunnarhawk/pen/vYJEwoM) by [gunnarhawk](https://github.com/Gunnarhawk)
- TensorFlow lib: hand-pose-detection: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection
- TensorFlow lib: face-landmarks-detection: https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
- Blink detection code took from https://hackernoon.com/a-prototype-that-leverages-facial-expressions-to-facilitate-non-vocal-communication
- TensorFlow HandPoseDetection diagram: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection#keypoint-diagram
- Web Workers API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- PseudoStyler lib: https://github.com/TSedlar/pseudo-styler
- Youtube iframe API: https://developers.google.com/youtube/iframe_api_reference
