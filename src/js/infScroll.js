import InfiniteScroll from 'infinite-scroll';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33901204-9e2cee760dcc4c2bf1fca35a0';
const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

const infScroll = new InfiniteScroll('#gallery', {
  responseBody: 'json',
  history: false,
  path() {
    const url = `${BASE_URL}?${searchParams}&q=cat&page=${this.pageIndex}`;
    return url;
  },
});

console.log(infScroll.pageIndex);
infScroll.loadNextPage();

infScroll.on('load', function (body, path, response) {
  console.log(response);
  console.log(body);
  console.log(path);
});
