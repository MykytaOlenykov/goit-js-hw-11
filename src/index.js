import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgsApiService from './js/ImgsApiService';
import RenderGallery from './js/RenderGallery';
import scrollToTop from './js/scrollToTop';

let isAllCollection = false;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  sentinel: document.querySelector('.sentinel'),
  spinner: document.querySelector('.js-spinner'),
};

const imgsApiService = new ImgsApiService();
const renderGallery = new RenderGallery(refs.gallery);

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
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

  isAllCollection = false;
  scrollToTop();

  imgsApiService.resetPage();

  imgsApiService
    .fetchImgs()
    .then(data => {
      if (!data.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      renderGallery.onClear();
      renderGallery.onRender(data.hits);
      onCheckCollectionEnd(data.totalHits);
    })
    .catch(error => {
      Notify.failure(error.message);
      console.log(error);
    });
}

function onCheckCollectionEnd(totalHits) {
  if (totalHits <= refs.gallery.children.length) {
    Notify.success(
      "We're sorry, but you've reached the end of search results."
    );

    isAllCollection = true;
  }
}

function showSpinner() {
  refs.spinner.classList.remove('is-hidden');
}

function hideSpinner() {
  refs.spinner.classList.add('is-hidden');
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (!isAllCollection && entry.isIntersecting && imgsApiService.query) {
      console.log('load');
      showSpinner();

      imgsApiService
        .fetchImgs()
        .then(data => {
          renderGallery.onRender(data.hits);
          hideSpinner();
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
  rootMargin: '150px',
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);
