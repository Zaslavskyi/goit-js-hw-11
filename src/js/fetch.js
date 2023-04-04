import axios from "axios";
const API_URL = "https://pixabay.com/api/";

export class searchQuery {
    static key = '35064729-5cad51e5e90c0cd3dd8e63421';
    static orientation = 'horizontal';
    static query = '';
    static page = 1;
    static min_width = 320;
    static image_type = 40;
    static async searchPictures(query = '') {
        if (query.trim()) searchQuery.query = query;

        const config = {
            params: {
                key: searchQuery.key,
                orientation: searchQuery.orientation,
                q: searchQuery.query,
                page: searchQuery.page,
                min_width: searchQuery.min_width,
                image_type: searchQuery.image_type,
                per_page: searchQuery.per_page,
            }
        };

        const response = await axios.get(`${API_URL}`, config);
        return response.data;
    };
};