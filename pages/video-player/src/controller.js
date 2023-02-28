export default class Controller {
  constructor({ }) {

  }

  static async initialize(deps) {
    const controller = new Controller();
    return controller.init()
  }

  async init() {
    console.log('Init!!')
  }
}