import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryContainer = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

let lightbox;

export function createGallery(images) {
  const markup = images
    .map(
      (image) => `
    <a href="${image.largeImageURL}" class="gallery-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p>❤️ ${image.likes} | 👁️ ${image.views} | 💬 ${image.comments} | ⬇️ ${image.downloads}</p>
      </div>
    </a>`
    )
    .join("");

  // Додаємо новий контент до існуючого
  galleryContainer.insertAdjacentHTML("beforeend", markup);

  // Ініціалізація або оновлення SimpleLightbox
  if (!lightbox) {
    lightbox = new SimpleLightbox(".gallery a");
  } else {
    lightbox.refresh(); // Оновлюємо lightbox після додавання нових елементів
  }
}

export function clearGallery() {
  galleryContainer.innerHTML = "";
}

export function showLoader() {
  loader.classList.add("visible");
}

export function hideLoader() {
  loader.classList.remove("visible");
}
