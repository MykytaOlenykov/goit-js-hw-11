import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgsApiService from './js/ImgsApiService';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  loadMore: document.querySelector('#load-more'),
};

const imgsApiService = new ImgsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  const currentSearchQuery = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === currentSearchQuery) {
    Notify.failure('Enter new value');
    return;
  }

  if (!refs.loadMore.classList.contains('is-hidden')) {
    onHideBtn();
  }

  imgsApiService.query = currentSearchQuery;

  if (!imgsApiService.searchQuery) {
    Notify.failure('Enter a valid value');
    return;
  }

  imgsApiService.resetPage();
  imgsApiService.fetchImgs().then(data => {
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    clearGallery();
    const markup = createCardsMarkup(data.hits);
    addCardsMarkup(markup);
    onShowBtn();
  });
}

function onLoadMore() {
  onDisableBtn();

  setTimeout(() => {
    imgsApiService.fetchImgs().then(data => {
      const markup = createCardsMarkup(data.hits);
      addCardsMarkup(markup);
      onEnableBtn();
    });
  }, 3000);
}

function createCardsMarkup(dataCards) {
  return dataCards
    .map(
      dataCard =>
        `
  <a class="photo-card" href="#">
    <div class="photo-card-thumb">
      <img class="photo-card-img" src="${dataCard.webformatURL}" alt="${dataCard.tags}" loading="lazy" />
    </div>  
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
  </a>`
    )
    .join('');
}

function addCardsMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// for loadMore -------------------------------------

function onShowBtn() {
  refs.loadMore.classList.replace('is-hidden', 'is-active');
}

function onHideBtn() {
  refs.loadMore.classList.replace('is-active', 'is-hidden');
}

function onDisableBtn() {
  refs.loadMore.setAttribute('disabled', '');
  refs.loadMore.classList.remove('is-active');
  refs.loadMore.classList.add('spinner');
}

function onEnableBtn() {
  refs.loadMore.removeAttribute('disabled');
  refs.loadMore.classList.add('is-active');
  refs.loadMore.classList.remove('spinner');
}
