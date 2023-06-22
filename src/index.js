import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37648737-76093e0db6038ebde4a82f299';

const formEl = document.getElementById('search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

let page = 0;
let currentSearchQuery = '';
const perPage = 40;

async function onSearch(e) {
  e.preventDefault();
  if (inputEl.value !== '') {
    currentSearchQuery = inputEl.value;
    page = 1;
    await performSearch();
    formEl.reset();
  } else {
    showError();
  }
}

async function onLoadMore() {
  page += 1;

  await performSearch();
  scrollToNextGroup();
}

async function performSearch() {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${currentSearchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    const { data } = response;
    const images = data.hits;
    const totalPages = Math.ceil(data.totalHits / perPage);
    console.log(totalPages);

    if (images.length === 0) {
      if (page === 1) {
        showError();
      } else {
        showEndMessage();
      }
    } else {
      if (page === 1) {
        galleryEl.innerHTML = '';
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      renderImages(images);

      if (images.length < perPage) {
        hideElement(loadMoreBtn);
      }

      if (page === totalPages) {
        showEndMessage();
      }
    }
  } catch (error) {
    console.log(error);
    showError();
  }
}

function renderImages(images) {
  const markup = images
    .map(
      image => `<div class="photo-card">
  <a href="${image.webformatURL}"><img src="${image.largeImageURL}" alt="${image.tags}" loading="lazy" class="photo"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${image.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  galleryEl.innerHTML += markup;

  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();

  showElement(loadMoreBtn);
}

function hideElement(element) {
  element.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

function scrollToNextGroup() {
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
  hideElement(loadMoreBtn);
}
