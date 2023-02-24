const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33901204-9e2cee760dcc4c2bf1fca35a0';

const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

export default function fetchImgs(searchQuery) {
  const url = `${BASE_URL}?${searchParams}&q=${searchQuery}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
