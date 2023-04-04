import axios from "axios";

const API_URL = "https://pixabay.com/api/";
const API_KEY = '35064729-5cad51e5e90c0cd3dd8e63421';

export default async function fetchImages(searchValue, currentPage) {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                key: API_KEY,
                q: searchValue,
                image_type: 'photo',
                orientation: 'horizontal',
                page: currentPage,
                per_page: 40,
                safesearch: true,
            },
        });

        return response.data.hits;
    } catch (error) {
        throw new Error(error.message);
    }
}
