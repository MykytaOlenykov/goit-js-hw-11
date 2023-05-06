import axios from 'axios/dist/axios.min.js';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33901204-9e2cee760dcc4c2bf1fca35a0';

const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

export default class ImgsApiService {
  #searchQuery;
  #page;

  constructor() {
    this.#searchQuery = '';
    this.#page = 0;
  }

  async fetchImgs() {
    this.#incrementPage();

    const url = `${BASE_URL}?${searchParams}&q=${this.#searchQuery}&page=${
      this.#page
    }`;

    const response = await axios.get(url);

    return response.data;
  }

  #incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 0;
  }

  set query(newQuery) {
    this.#searchQuery = newQuery;
  }

  get query() {
    return this.#searchQuery;
  }
}
