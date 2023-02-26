import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgsApiService from './js/ImgsApiService';

import 'simplelightbox/dist/simple-lightbox.min.css';

let isAllCollection = false;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  loadMore: document.querySelector('#load-more'),
};

const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
const imgsApiService = new ImgsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const currentSearchQuery = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === currentSearchQuery) {
    Notify.failure('Enter new value');

    if (refs.gallery.children.length && !isAllCollection) {
      onShowBtn();
    }

    return;
  }

  if (!refs.loadMore.classList.contains('is-hidden')) {
    onHideBtn();
  }

  imgsApiService.query = currentSearchQuery;

  if (!imgsApiService.searchQuery) {
    Notify.failure('Enter a valid value');

    if (refs.gallery.children.length && !isAllCollection) {
      onShowBtn();
    }

    return;
  }

  isAllCollection = false;
  imgsApiService.resetPage();

  try {
    const data = await imgsApiService.fetchImgs();

    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    clearGallery();
    renderGallery(data.hits);
    onShowBtn();
    onCheckCollectionEnd(data.totalHits);
  } catch (error) {
    Notify.failure(error.message);
    console.log(error);
  }
}

async function onLoadMore() {
  onDisableBtn();

  try {
    const data = await imgsApiService.fetchImgs();

    onEnableBtn();
    renderGallery(data.hits);
    onCheckCollectionEnd(data.totalHits);
  } catch (error) {
    Notify.failure(error.message);
    console.log(error);
  }
}

function renderGallery(dataCards) {
  const markup = createCardsMarkup(dataCards);
  addCardsMarkup(markup);
  gallery.refresh();
}

function createCardsMarkup(dataCards) {
  return dataCards
    .map(
      dataCard =>
        `
  <a class="photo-card" href="${dataCard.largeImageURL}">
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

function onCheckCollectionEnd(totalHits) {
  if (totalHits <= refs.gallery.children.length) {
    Notify.success(
      "We're sorry, but you've reached the end of search results."
    );

    isAllCollection = true;

    onHideBtn();
  }
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
