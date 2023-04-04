import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css"; 
import Notiflix from 'notiflix';
import {searchQuery} from "./js/fetch";

const searchForm = document.querySelector('.js-search-form');
const gallery = document.querySelector('.js-gallery');
const loadMore = document.querySelector('.js-load-more');
lightbox = new SimpleLightbox('.gallery a', {CaptionDelay: 250, captions: true, captionsData: 'alt'});

searchForm.addEventListener('submit', searchInformation);
loadMore.addEventListener('click', onButtonClick);

async function searchInformation(event) {
    event.preventDefault();
    loadMore.classList.add('is-hidden');
    searchQuery.page = 1;

    const query = event.target.elements.searchQuery.value.trim();
    const response = await searchQuery.searchPictures(query);
    const galleryItem = response.hits;

    try {
        gallery.innerHTML = '';
        if (galleryItem.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
        } else if (!query) {
            return Notiflix.Notify.info("What are you looking for?");
        } else {
            Notiflix.Notify.success(`Ok! Look we found ${response.totalHits} images. It's great! isn't it?`);
            renderingMarkup(response.hits);
            loadMore.classList.remove('is-hidden');
        }
    } catch (error) {
        console.log(error.message);
    }
    console.log(response);
}

async function onButtonClick() {
    searchQuery.page += 1;

    const response = await searchQuery.searchPictures();
    if (searchQuery.page > response.totalHits / searchQuery.per_page) {
        loadMore.classList.add('is-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
    renderingMarkup(response.hits);

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight *2,
            behavior: "smooth",
        });
}

function renderingMarkup(array) {
    gallery.insertAdjacentHTML('beforeend', galleryMarkup(array));
    lightbox.refresh();
}

function galleryMarkup(array) {
    return array.reduce((acc, {largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => acc + `
    <a href="${largeImageURL}" class="gallery__link">
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b> Likes </b> ${likes}
                </p>
                <p class="info-item">
                    <b> Views </b> ${views}
                </p>
                <p class="info-item>
                    <b> Comments </b> ${comments}
                </p>
                <p class="info-item">
                    <b> Downloads </b> ${downloads}
                </p>
            </div>
        </div>
        </a>`, "");
};

