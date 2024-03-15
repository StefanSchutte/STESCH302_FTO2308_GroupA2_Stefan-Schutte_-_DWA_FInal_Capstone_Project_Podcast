const fetchPodcastData = async (itemId: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setPodcastData: React.Dispatch<React.SetStateAction<any>>) => {
    setLoading(true);

    try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${itemId}`);
        const data = await response.json();
        setPodcastData(data);
    } catch (error) {
        console.error('Error fetching podcast data:', error);
    } finally {
        setLoading(false);
    }
};

export default fetchPodcastData;