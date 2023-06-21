import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37648737-76093e0db6038ebde4a82f299';

const formEl = document.getElementById('search-form');
const inputEl = document.querySelector('[name="searchQuery"]');

formEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  getImages()
    .then(data => {
      renderImages(data.data.hits[1]);
    })
    .catch(
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      )
    );
  formEl.reset();
}

async function getImages() {
  const searchQuery = inputEl.value;
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}

function renderImages({ webformatURL, largeImageURL, tags }) {
  formEl.insertAdjacentHTML(
    'afterend',
    `<div class="gallery">
    <a href="${webformatURL}"><img src="${largeImageURL}" alt="${tags}" title=""/></a>
</div>`
  );

  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox', function () {
    // do something…
  });
}
