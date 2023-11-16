import "./lib/sdk.js"
import CardsController from "./controllers/cardsController.js"
import CardsView from "./views/cardsView.js"
import CardsService from "./services/cardsService.js"
import { supportsWorkerType } from "../../shared/util.js"

const rootPath = window.location.protocol + "//" + window.location.host

let cardListWorker

if (supportsWorkerType()) {
  new Worker(`${rootPath}/lib/modules/cards/workers/cardsListWorker.js`, {
    type: "module",
  })
}

const factory = {
  async initialize() {
    return CardsController.initialize({
      view: new CardsView(),
      service: new CardsService({
        dbUrl: `${rootPath}/assets/database.json`,
        cardListWorker,
      }),
    })
  },
}

export default factory
