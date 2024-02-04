import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const galleryList = document.querySelector('.gallery-list');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

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
    loader.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    currentQuery = inputValue;
    currentPage = 1;
    galleryList.innerHTML = '';
    
    await searchImages(currentQuery, currentPage);
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    loader.style.display = 'block';
    await searchImages(currentQuery, currentPage);
    smoothScroll();
});

async function searchImages(query, page) {
    const apiKey = '36996517-56800863ae540be6945d0f4f2';
    const perPage = 15;
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        searchInput.value = '';
        if (data.hits.length === 0) {
            iziToast.error({
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
                timeout: 3000,
            });
            loader.style.display = 'none';
            return;
        }     
        const imageElements = data.hits.map(image =>              
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
            </li>`           
        ).join('');
        galleryList.insertAdjacentHTML("beforeend", imageElements)
        
        loader.style.display = 'none';
        lightbox.refresh(); 

        const totalResults = data.totalHits;
        if (totalResults <= page * perPage) {
            loadMoreBtn.style.display = 'none';
                    iziToast.error({
                    message: "We're sorry, but you've reached the end of search results.",
                    position: 'topRight',
                    timeout: 3000,
                });
            }
        else {
            loadMoreBtn.style.display = 'block';
        }

}   catch (error) {
        iziToast.error({
            message: 'There has been a problem with your fetch operation!',
            position: 'topRight',
            timeout: 3000,
        });
        loader.style.display = 'none';
    }}

// Плавна прокрутка сторінки
function smoothScroll() {
    // Отримати висоту однієї карточки галереї
    const galleryItemHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
    // Плавна прокрутка сторінки
    window.scrollBy({
        top: galleryItemHeight * 2,
        behavior: 'smooth' 
        });
    }