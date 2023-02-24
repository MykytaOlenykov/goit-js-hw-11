import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchImgs from './js/fetchImgs';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  if (!searchQuery) {
    Notify.failure('Enter a valid value');
    return;
  }

  fetchImgs(searchQuery).then(data => {
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = createCardsMarkup(data.hits);
    addCardsMarkup(markup);
  });
}

function createCardsMarkup(dataCards) {
  return dataCards
    .map(
      dataCard =>
        `
  <div class="photo-card">
    <img src="${dataCard.webformatURL}" alt="${dataCard.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${dataCard.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${dataCard.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${dataCard.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${dataCard.downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
}

function addCardsMarkup(markup) {
  refs.gallery.innerHTML = markup;
}
