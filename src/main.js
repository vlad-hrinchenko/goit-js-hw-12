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

  
  clearGallery();
  hideLoadMore();
  showLoader();

  currentQuery = query;
  currentPage = 1; 

 
  const data = await getImagesByQuery(query, currentPage, perPage);
  hideLoader();

  if (data.hits.length === 0) {
    iziToast.error({
      title: "Error",
      message: "Sorry, there are no images matching your search query. Please try again!",
    });
    return;
  }

 
  totalHits = data.totalHits;
  createGallery(data.hits);

 
  if (currentPage * perPage < totalHits) {
    showLoadMore(); 
  } else {
    hideLoadMore();
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  
  scrollToNewImages();
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1;
  showLoaderUnderButton();

  const data = await getImagesByQuery(currentQuery, currentPage, perPage);
  hideLoaderUnderButton();

  createGallery(data.hits);

  if (currentPage * perPage >= totalHits) {
    hideLoadMore();
    iziToast.info({
      title: "Info",
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  scrollToNewImages();
});

function scrollToNewImages() {
  const lastImageCard = gallery.querySelector(".gallery-item:last-child");  // остання картка в галереї
  if (lastImageCard) {
    const cardHeight = lastImageCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2, 
      behavior: "smooth", 
    });
  }
}

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
