import axios from "axios";

const API_KEY = "49648787-23678a34732312ef5f90b1ecb";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page = 1, perPage = 15) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: perPage,
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Помилка отримання даних:", error);
    return { hits: [], totalHits: 0 };
  }
}
