function supportsWorkerType() {
  let supports = false
  const tester = {
    // eslint-disable-next-line getter-return
    get type() {
      supports = true
    },
  }
  try {
    // We use "blob://" as url to avoid an useless network request.
    // This will either throw in Chrome
    // either fire an error event in Firefox
    // which is perfect since
    // we don't need the worker to actually start,
    // checking for the type of the script is done before trying to load it.
    // @ts-ignore
    new Worker("blob://", tester).terminate()
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return supports
  }
}

function prepareRunChecker({ timerDelay }) {
  let lastEvent = Date.now()
  return {
    shouldRun() {
      const result = Date.now() - lastEvent > timerDelay
      if (result) {
        lastEvent = Date.now()
      }
      return result
    },
  }
}

export { supportsWorkerType, prepareRunChecker }
