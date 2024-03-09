const API_URL = 'https://podcast-api.netlify.app/shows';

const getShowsFromAPI = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default getShowsFromAPI;