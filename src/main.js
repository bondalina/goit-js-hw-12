// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form')
const searchInput = document.querySelector('.search-input')
const galleryList = document.querySelector('.gallery-list')
const loader = document.querySelector('.loader')

const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', (event) => {
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
    
    // Показати індикатор завантаження
    loader.style.display = 'block';
    
    galleryList.innerHTML = '';

    const apiKey = '36996517-56800863ae540be6945d0f4f2';
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.hits.length === 0) {

                // Приховати індикатор завантаження якщо помилка
            loader.style.display = 'none';
            
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'topRight',
                    timeout: 3000,
                });
                
                return;
            }
            
            
        setTimeout(() => {
            galleryList.innerHTML = data.hits.map(image => {
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

        
        searchInput.value = '';

        // Приховати індикатор завантаження після отримання відповіді
        loader.style.display = 'none';

        
            lightbox.refresh();
        }, 2000); // Зробила затримку відображення зображень на 2 секунди
        })


        .catch(error => {
            iziToast.error({
                message: 'There has been a problem with your fetch operation!',
                position: 'topRight',
                timeout: 3000,
            });
            
            searchInput.value = '';

            // Приховати індикатор завантаження якщо помилка
            loader.style.display = 'none';
        });
});


