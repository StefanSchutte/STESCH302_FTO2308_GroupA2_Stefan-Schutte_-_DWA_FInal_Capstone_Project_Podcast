import { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Row from '../components/Views/Row';
import Overlay from '../components/Views/Overlay.tsx';
import { useShows } from "../API/ShowsContext.tsx";
import supabase from "../supabase.ts";

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
    console.log(supabase)
    const { podcasts } = useShows();

    //const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null); // State variable for selected podcast data


// Function to open the overlay with the selected podcast data
    const openOverlay = (podcast: Podcast) => {
        setSelectedPodcast(podcast);
        setShowOverlay(true);
    };
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    // Function to handle saving the podcast
    const handleSave = (episodeId: string, seasonId: string | null) => {
        // Add your logic to save the podcast here
        console.log('Saving podcast:', episodeId, seasonId);
    }

    return (
        <div>
            <Hero />

            <Row  rowId="all-shows" title="Browse All Shows" podcasts={podcasts} openOverlay={openOverlay} />

            {/* Render the Overlay component conditionally */}
            {showOverlay && selectedPodcast && <Overlay item={selectedPodcast} showOverlay={showOverlay} closeOverlay={closeOverlay} onSave={handleSave} />}
        </div>
    );
}

export default Home;