import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImgsApiService from './js/ImgsApiService';
import RenderGallery from './js/RenderGallery';
import scrollToTop from './js/scrollToTop';
import { showSpinner, hideSpinner } from './js/spinner';

let isAllCollection = false;

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  sentinel: document.querySelector('.sentinel'),
};

const imgsApiService = new ImgsApiService();
const renderGallery = new RenderGallery(refs.gallery);

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  const currentSearchQuery = e.currentTarget.elements.searchQuery.value;

  const isValid = validationSearchQueryValue(currentSearchQuery);

  if (!isValid) {
    return;
  }

  imgsApiService.query = currentSearchQuery;

  scrollToTop();
  renderGallery.onClear();
  imgsApiService.resetPage();
  showSpinner();

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

      renderGallery.onRender(data.hits);
      onCheckCollectionEnd(data.totalHits);
      registerIntersectionObserver();
    })
    .catch(error => {
      Notify.failure(error.message);
      console.log(error);
    })
    .finally(() => {
      hideSpinner();
    });
}

function validationSearchQueryValue(currentSearchQuery) {
  if (imgsApiService.query === currentSearchQuery) {
    Notify.failure('Enter new value');

    return false;
  }

  if (!currentSearchQuery) {
    Notify.failure('Enter a valid value');

    return false;
  }

  return true;
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
        console.log('load');
        showSpinner();

        imgsApiService
          .fetchImgs()
          .then(data => {
            renderGallery.onRender(data.hits);
            onCheckCollectionEnd(data.totalHits);
          })
          .catch(error => {
            Notify.failure(error.message);
            console.log(error);
          })
          .finally(() => {
            hideSpinner();
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
