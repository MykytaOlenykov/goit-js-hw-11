const spinnerEl = document.querySelector('.js-spinner');

function showSpinner() {
  spinnerEl.classList.remove('is-hidden');
}

function hideSpinner() {
  spinnerEl.classList.add('is-hidden');
}

export { showSpinner, hideSpinner };
