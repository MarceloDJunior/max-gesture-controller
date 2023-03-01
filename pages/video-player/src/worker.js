onmessage = ({ data }) => {
  console.log("data", data);
  postMessage({
    response: 'ok'
  })
}