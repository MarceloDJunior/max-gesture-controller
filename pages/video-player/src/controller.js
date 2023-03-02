export default class Controller {
  #view
  #service
  #worker

  constructor({ view, service, worker }) {
    this.#view = view
    this.#service = service
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps);
    controller.log('not yet detecting eye blink. Click on the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    worker.onmessage = (msg) => {
      if(msg.data === 'READY') {
        this.#view.enableButton()
        return
      }
    }
  }

  async init() {
    console.log('Init!!')
  }

  log(text) {
    this.#view.log(`logger: ${text}`)
  }

  onBtnStart() {
    this.log('initializing detection...')
  }
}