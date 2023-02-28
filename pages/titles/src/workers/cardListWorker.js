onmessage = ({ data }) => {
  let counter = 0

  console.log('activating blocking operation...', data.maxItens)
  console.time('blocking-op')

  // blocking function
  for (; counter < data.maxItens; counter++) console.log('.')
  console.timeEnd('blocking-op')

  postMessage({ response: "ok", data: { counter } })
}