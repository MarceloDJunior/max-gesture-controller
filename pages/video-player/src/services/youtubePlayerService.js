export default class YoutubePlayerService {
  #dbUrl = ""

  constructor({ dbUrl }) {
    this.#dbUrl = dbUrl
  }

  async getMovieById(id) {
    const response = await fetch(this.#dbUrl)
    const database = await response.json()
    const movie = database.find((t) => t.show_id === id)
    return movie
  }
}
