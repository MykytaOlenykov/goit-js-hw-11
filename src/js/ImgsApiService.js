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
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImgs() {
    const url = `${BASE_URL}?${searchParams}&q=${this.searchQuery}&page=${this.page}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      this.#incrementPage();
      return response.json();
    });
  }

  #incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }
}
