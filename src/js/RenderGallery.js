import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = new SimpleLightbox('#gallery a');

export default class RenderGallery {
  #galleryRef;

  constructor(galleryRef) {
    this.#galleryRef = galleryRef;
  }

  onRender(dataCards) {
    const markup = this.#createCardsMarkup(dataCards);
    this.#addCardsMarkup(markup);
    gallery.refresh();
  }

  onClear() {
    this.#galleryRef.innerHTML = '';
  }

  #createCardsMarkup(dataCards) {
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

  #addCardsMarkup(markup) {
    this.#galleryRef.insertAdjacentHTML('beforeend', markup);
  }
}
