import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery, clearGallery, showLoader, hideLoader } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const searchInput = form.querySelector("input[name='search-text']");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.getElementById("load-more-btn");
const loader = document.getElementById("loader");

let currentQuery = "";
let currentPage = 1;
const perPage = 15;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search query!",
    });
    return;
  }

  // Очищаємо галерею перед кожним новим пошуком
  clearGallery();
  hideLoadMore(); // Сховуємо кнопку "Load more" при пошуку
  showLoader(); // Показуємо індикатор завантаження

  currentQuery = query;
  currentPage = 1; // Скидаємо сторінку до першої

  // Отримуємо зображення
  const { hits, totalHits } = await getImagesByQuery(query, currentPage, perPage);
  hideLoader(); // Ховаємо індикатор після завантаження

  if (hits.length === 0) {
    iziToast.error({
      title: "Error",
      message: "Sorry, there are no images matching your search query. Please try again!",
    });
    return;
  }

  // Додаємо нові зображення
  createGallery(hits);

  if (currentPage * perPage < totalHits) {
    showLoadMore(); // Показуємо кнопку "Load more", якщо є ще зображення
  } else {
    hideLoadMore();
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  // Плавне прокручування після завантаження зображень
  scrollToNewImages();
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1; // Збільшуємо номер сторінки
  showLoaderUnderButton(); // Показуємо індикатор для кнопки

  const { hits, totalHits } = await getImagesByQuery(currentQuery, currentPage, perPage);
  hideLoaderUnderButton(); // Ховаємо індикатор

  // Додаємо нові зображення до існуючих
  createGallery(hits);

  if (currentPage * perPage >= totalHits) {
    hideLoadMore(); // Ховаємо кнопку, якщо більше немає зображень
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  // Плавне прокручування після додавання нових зображень
  scrollToNewImages();
});

// Функція для плавного прокручування сторінки
function scrollToNewImages() {
  const firstImageCard = gallery.querySelector("li"); // перший елемент в галереї
  if (firstImageCard) {
    const cardHeight = firstImageCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2, // прокручування на дві висоти картки
      behavior: "smooth", // плавна анімація
    });
  }
}

// Show/hide button and loader under it
function showLoadMore() {
  loadMoreBtn.hidden = false;
}

function hideLoadMore() {
  loadMoreBtn.hidden = true;
}

function showLoaderUnderButton() {
  loader.classList.add("visible");
}

function hideLoaderUnderButton() {
  loader.classList.remove("visible");
}
