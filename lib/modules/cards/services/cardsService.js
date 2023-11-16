export default class CardService {
  #database = []
  #dbUrl = ""
  #cardListWorker

  constructor({ dbUrl, cardListWorker }) {
    this.#dbUrl = dbUrl
    this.#cardListWorker = cardListWorker
  }

  async loadCards() {
    const response = await fetch(this.#dbUrl)
    this.#database = await response.json()
  }

  filterTitles(keyword) {
    const titles = this.#database.filter(({ title }) =>
      keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : true,
    )

    if (keyword && this.#cardListWorker) {
      this.#cardListWorker.postMessage({ maxItens: 1e5 })
    }

    const cards = titles.map((item) => {
      return {
        background: item.imageUrl,
        title: item.title,
        description: item.description,
        show_id: item.show_id,
        duration: item.duration,
      }
    })
    return cards
  }
}
