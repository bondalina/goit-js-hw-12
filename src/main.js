// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

import axios from "axios";

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const galleryList = document.querySelector('.gallery-list');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const inputValue = searchInput.value.trim();

    if (inputValue === '') {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query!',
            position: 'topRight',
        });
        return;
    }

    currentQuery = inputValue;
    currentPage = 1;
    loader.style.display = 'block';
    galleryList.innerHTML = '';
    loadMoreButton.style.display = 'none';

    await searchImages(currentQuery, currentPage);
});

loadMoreButton.addEventListener('click', async () => {
    currentPage++;
    loader.style.display = 'block';
    await searchImages(currentQuery, currentPage);
});

async function searchImages(query, page) {
    const apiKey = '36996517-56800863ae540be6945d0f4f2';
    const perPage = 15;
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.hits.length === 0) {
            iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
                timeout: 3000,
            });
            return;
        }

        galleryList.innerHTML += data.hits.map(image => {
            const imageElement = 
            `<li class="gallery-item">
                <a href="${image.largeImageURL}" data-lightbox="gallery" data-title="${image.tags}">
                    <img class="img-item" src="${image.webformatURL}" alt="${image.tags}">
                </a>
                <ul class="image-properties">
                    <li>Likes <br/>${image.likes}</li>
                    <li>Views <br/>${image.views}</li>
                    <li>Comments <br/>${image.comments}</li>
                    <li>Downloads <br/>${image.downloads}</li>
                </ul>
            </li>`;
            return imageElement;
        }).join('');

        loader.style.display = 'none';
        lightbox.refresh();

        if (data.totalHits > page * perPage) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        iziToast.error({
            message: 'There has been a problem with your fetch operation!',
            position: 'topRight',
            timeout: 3000,
        });
        loader.style.display = 'none';
    }
}