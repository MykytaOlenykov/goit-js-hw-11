import throttle from 'lodash.throttle';

let heightDocument = document.documentElement.clientHeight;

window.addEventListener(
  'resize',
  throttle(() => {
    heightDocument = document.documentElement.clientHeight;
  }, 300)
);

export default function onScrollAfterLoad() {
  window.scrollBy({
    top: heightDocument - 140,
    behavior: 'smooth',
  });
}
