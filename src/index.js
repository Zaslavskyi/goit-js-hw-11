import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"; 
import Notiflix from "notiflix";
import fetchImages from './js/fetch';

const lightbox = new SimpleLightbox('.gallery a', {
    captionData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 300,
    });

const searchForm = document.querySelector('.search-form');
const buttonElement = document.querySelector('[type="submit"]');
const galleryElement = document.querySelector('.gallery');
const loadButton = document.querySelector('.load-button');

searchForm.addEventListener('submit', formSubmit);
loadButton.addEventListener('click', loadMoreClick);

let currentPage = 1;
let formValue = '';

async function formSubmit(e) {
    e.preventDefault();
    clearMarkup();

    formValue = e.target.elements.searchQuery.value.trim();

    if (!formValue) {
        hideLoadMoreBtn();
        Notiflix.Notify.info('What are you looking for?');
        return;
    }

    currentPage = 1;

    try {
        loadButton.classList.remove('hidden');
        const response = await fetchImages(formValue, currentPage);
        makeGalleryUI(response);
    } catch (error) {
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    }
}

async function loadMoreClick() {
    currentPage += 1;
    try {
        const response = await fetchImages(formValue, currentPage);
        makeGalleryUI(response);
        smothScroll();
    } catch (error) {
        hideLoadMoreBtn();
        Notiflix.Notify.info(`Sorry, no more images.`);
    }
}

function makeGalleryUI(photos) {
    if (!photos) {
        hideLoadMoreBtn();
        return;
    }

    if (photos.length < 40) {
        hideLoadMoreBtn();
    }

    if (photos.length === 0) {
        hideLoadMoreBtn();
        Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    const markup = makeGallery(photos);
    galleryElement.insertAdjacentHTML('beforeend', markup);

    Notiflix.Notify.success(`
    Ok! Look we found ${document.querySelectorAll('.photo-card').length} images. It's great! isn't it?
    `);
    lightbox.refresh();
}

function makeGallery(array) {
    return array.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads,}) => {
        return `
        <div class="photo-card">
        <a class="gallery__link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes ${likes} </b>
                    </p>
                    <p class="info-item">
                        <b>Views ${views} </b>
                    </p>
                    <p class="info-item">
                        <b>Comments ${comments} </b>
                    </p>
                    <p class="info-item">
                        <b>Downloads ${downloads} </b>
                    </p>
                </div>
        </div>
        `;
    })
    .join('');
}

function smothScroll() {
    const {height: cardHeight} = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
};

function  clearMarkup() {
    galleryElement.innerHTML = '';
};

function hideLoadMoreBtn() {
    loadButton.classList.add('hidden');
};


