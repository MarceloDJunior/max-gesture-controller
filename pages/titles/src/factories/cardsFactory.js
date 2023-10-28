import "../../lib/sdk.js"
import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"

const [rootPath] = window.location.href.split("/pages/")

const cardListWorker = new Worker("./src/workers/cardListWorker.js", {
  type: "module",
})

const factory = {
  async initalize() {
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
