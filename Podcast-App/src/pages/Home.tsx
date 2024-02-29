import { useEffect, useState } from 'react';
import Hero from '../components/Hero/Hero';
import Row from '../components/Views/Row';
import axios from 'axios';

interface Podcast {
    id: number;
    title: string;
    description: string;
    image: string;
    genres: number[];
    updated: string;
    seasons: number;
}

function Home(): JSX.Element {
    const [genres, setGenres] = useState<number[]>([]);

    useEffect(() => {
        // Fetch data from the API to extract genres
        axios.get<Podcast[]>('https://podcast-api.netlify.app/shows')
            .then(response => {
                // Once data is fetched, extract the genres
                const podcastsData = response.data;
                const genresData = podcastsData.flatMap(podcast => podcast.genres);
                const uniqueGenres = [...new Set(genresData)];
                // Set the genres in the state
                setGenres(uniqueGenres);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Genre mapping
    const genreMapping: Record<number, string> = {
        1: 'Personal Growth',
        2: 'True Crime and Investigative Journalism',
        3: 'History',
        4: 'Comedy',
        5: 'Entertainment',
        6: 'Business',
        7: 'Fiction',
        8: 'News',
        9: 'Kids and Family'
    };

    return (
        <div>
            <Hero />
            {/* Render a separate Row component for each genre */}
            {genres.map((genreId, index) => (
                <Row key={index} rowId={`row-${genreId}`} title={genreMapping[genreId]} fetchURL={`https://podcast-api.netlify.app/shows?.genres=${genreId}`} />
            ))}
        </div>
    );
}

export default Home;