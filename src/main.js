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
let totalHits = 0;

// Функція для старту нового пошуку
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

  // Очищаємо галерею та скидаємо сторінку на 1
  clearGallery();
  hideLoadMore();
  showLoader();

  currentQuery = query;
  currentPage = 1; // Reset page to 1 for new search

  // Отримуємо перші 15 зображень
  const data = await getImagesByQuery(query, currentPage, perPage);
  hideLoader();

  if (data.hits.length === 0) {
    iziToast.error({
      title: "Error",
      message: "Sorry, there are no images matching your search query. Please try again!",
    });
    return;
  }

  // Додаємо зображення в галерею
  totalHits = data.totalHits;
  createGallery(data.hits);

  // Перевіряємо, чи є ще зображення
  if (currentPage * perPage < totalHits) {
    showLoadMore(); // Показуємо кнопку Load More, якщо є ще зображення
  } else {
    hideLoadMore();
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  // Плавне прокручування до нових зображень
  scrollToNewImages();
});

// Завантаження нових зображень при натисканні Load More
loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1;
  showLoaderUnderButton();

  // Отримуємо нові зображення для наступної сторінки
  const data = await getImagesByQuery(currentQuery, currentPage, perPage);
  hideLoaderUnderButton();

  // Додаємо нові зображення до існуючих
  createGallery(data.hits);

  // Перевіряємо, чи є ще зображення
  if (currentPage * perPage >= totalHits) {
    hideLoadMore();
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  // Плавне прокручування після додавання нових зображень
  scrollToNewImages();
});

// Плавне прокручування
function scrollToNewImages() {
  const lastImageCard = gallery.querySelector("li:last-child");  // остання картка в галереї
  if (lastImageCard) {
    const cardHeight = lastImageCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2, // Прокручуємо вниз на 2 висоти картки
      behavior: "smooth", // Плавна прокрутка
    });
  }
}

// Показати/сховати кнопку Load More
function showLoadMore() {
  loadMoreBtn.hidden = false;
}

function hideLoadMore() {
  loadMoreBtn.hidden = true;
}

// Показати/сховати індикатор завантаження під кнопкою
function showLoaderUnderButton() {
  loader.classList.add("visible");
}

function hideLoaderUnderButton() {
  loader.classList.remove("visible");
}
