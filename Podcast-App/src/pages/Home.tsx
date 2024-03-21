import { useState } from 'react';
import Hero from '../components/Hero/Hero';
import Row from '../components/Views/Row';
import PodcastInfo from '../components/Views/PodcastInfo.tsx';
import { useShows } from "../api/ShowsContext.tsx";
import {Podcast} from "../types.ts";

/**
 * Home component representing the main page of the application.
 * @returns {JSX.Element} JSX representation of the Home component.
 */
function Home(): JSX.Element {
    const { podcasts } = useShows();
    /**
     * Manage the state of whether the overlay is shown or not.
     * Initializes showOverlay state to false and provides a function setShowOverlay to update this state.
     */
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    /**
     * Manage the state of the selected podcast.
     * Initializes selectedPodcast state to null and provides a function setSelectedPodcast to update this state.
     */
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

    /**
     * Function to open the overlay with the selected podcast data.
     * Sets the selected podcast.
     * @param {Podcast} podcast - The podcast data to display in the overlay.
     */
    const openOverlay = (podcast: Podcast) => {
        setSelectedPodcast(podcast);
        setShowOverlay(true);
    };
    /**
     * Function to close the overlay.
     * Sets showOverlay state to false.
     */
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    /**
     * Function to handle saving the podcast.
     * @param {string} episodeId - The ID of the episode being saved.
     * @param {string | null} seasonId - The ID of the season being saved.
     */
    const handleSave = (episodeId: string, seasonId: string | null) => {
        // Add your logic to save the podcast here
        console.log('Saving podcast:', episodeId, seasonId);
    }

    return (
        <div>
            <Hero />
            <Row
                rowId="all-shows"
                title="Browse All Shows"
                podcasts={podcasts}
                openOverlay={openOverlay}
            />
            {showOverlay && selectedPodcast &&
                <PodcastInfo
                    item={selectedPodcast}
                    showOverlay={showOverlay}
                    closeOverlay={closeOverlay}
                    onSave={handleSave}
                />}
        </div>
    );
}

export default Home;