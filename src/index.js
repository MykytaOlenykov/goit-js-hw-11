import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgsApiService from './js/ImgsApiService';
import onScrollAfterLoad from './js/scrollAfterLoad';

import 'simplelightbox/dist/simple-lightbox.min.css';

let isAllCollection = false;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  sentinel: document.querySelector('.sentinel'),
};

const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const imgsApiService = new ImgsApiService();

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  const currentSearchQuery = e.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === currentSearchQuery) {
    Notify.failure('Enter new value');

    return;
  }

  imgsApiService.query = currentSearchQuery;

  if (!imgsApiService.query) {
    Notify.failure('Enter a valid value');

    return;
  }

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
    onCheckCollectionEnd(data.totalHits);
    registerIntersectionObserver();
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
  }
}

function registerIntersectionObserver() {
  const onEntry = entries => {
    entries.forEach(entry => {
      if (isAllCollection) {
        observer.disconnect();
        isAllCollection = false;
      }

      if (entry.isIntersecting && imgsApiService.query) {
        console.log('Load');
        imgsApiService
          .fetchImgs()
          .then(data => {
            renderGallery(data.hits);
            onCheckCollectionEnd(data.totalHits);
          })
          .catch(error => {
            Notify.failure(error.message);
            console.log(error);
          });
      }
    });
  };

  const options = {
    rootMargin: '200px',
  };
  const observer = new IntersectionObserver(onEntry, options);
  observer.observe(refs.sentinel);
}
