import { useEffect, useState } from 'react';
import Hero from '../components/Hero/Hero';
import Row from '../components/Views/Row';
import axios from 'axios';
import Overlay from '../components/Views/Overlay.tsx';
import Menu from "../components/NavBar/Menu.tsx";

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
    //const [genres, setGenres] = useState<number[]>([]);
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null); // State variable for selected podcast data


    useEffect(() => {


        // Fetch data from the API to extract genres
        axios.get<Podcast[]>('https://podcast-api.netlify.app/shows')
            .then(response => {
                 //Once data is fetched, extract the genres
                //const podcastsData = response.data;
                //const genresData = podcastsData.flatMap(podcast => podcast.genres);
                //const uniqueGenres = [...new Set(genresData)];
                 //Set the genres in the state
                //setGenres(uniqueGenres);
                setPodcasts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


// Function to open the overlay with the selected podcast data
    const openOverlay = (podcast: Podcast) => {
        setSelectedPodcast(podcast);
        setShowOverlay(true);
    };
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    // Genre mapping
    // const genreMapping: Record<number, string> = {
    //     1: 'Personal Growth',
    //     2: 'True Crime and Investigative Journalism',
    //     3: 'History',
    //     4: 'Comedy',
    //     5: 'Entertainment',
    //     6: 'Business',
    //     7: 'Fiction',
    //     8: 'News',
    //     9: 'Kids and Family'
    // };

    return (
        <div>
            <Hero />

             {/*Render a separate Row component for each genre*/}
            {/*{genres.map((genreId, index) => (*/}
            {/*    <Row  key={index} rowId={`row-${genreId}`}*/}
            {/*          title={genreMapping[genreId]}*/}
            {/*          fetchURL={`https://podcast-api.netlify.app/shows?genres=${genreId}`}*/}
            {/*          openOverlay={openOverlay}/>*/}
            {/*))}*/}

            <Row  rowId="all-shows" title="Browse All Shows" podcasts={podcasts} openOverlay={openOverlay} fetchURL={`https://podcast-api.netlify.app/shows?genres=${podcasts}`}/>

            {/* Render the Overlay component conditionally */}
            {showOverlay && selectedPodcast && <Overlay item={selectedPodcast} showOverlay={showOverlay} closeOverlay={closeOverlay} />}
        </div>
    );
}

export default Home;