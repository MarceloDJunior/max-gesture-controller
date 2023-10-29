const youtubePlayer = {
  instance: {},
  videoId: "",
}

function loadPlayer(videoId) {
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  const firstScriptTag = document.getElementsByTagName("script")[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  youtubePlayer.videoId = videoId
}

// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  // eslint-disable-next-line no-undef
  youtubePlayer.instance = new YT.Player("video", {
    videoId: youtubePlayer.videoId,
    height: "100%",
    width: "100%",
    playerVars: {
      playsinline: 1,
    },
  })

  window.YTPlayer = youtubePlayer.instance
}

window.loadYTPlayer = loadPlayer
