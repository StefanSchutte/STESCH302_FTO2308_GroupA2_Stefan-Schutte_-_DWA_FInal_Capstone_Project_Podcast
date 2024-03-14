import { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.tsx";
import supabase from "../../supabase.ts";
import PodcastInfo from "../../pages/PodcastInfo.tsx";


interface Podcast {
    id: string;
    image: string;
    title: string;
}

/**
 * Functional component representing the saved podcasts section.
 * Sets up a state variable favorites using the useState hook to manage the list of saved podcasts.
 * Retrieves the user object from the useAuth hook, which provides information about the authenticated user.
 *
 * @returns JSX.Element
 */
function SavedPodcasts(): JSX.Element {
    const [favorites, setFavorites] = useState<Podcast[]>([]);
    const { user } = useAuth();
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null); // State to track the selected episode ID
    const [showOverlay, setShowOverlay] = useState(false);
    /**
     * Fetch the user's favorite podcasts from the database whenever the user object changes.
     * This ensures that the component updates its state when the user logs in or out.
     */
    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);


    /**
     * Fetches the user's favorite podcasts from the database.
     * Retrieves the user's favorite podcasts from the database using supabase.
     */
    const fetchFavorites = async () => {
        try {
            if (user) {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('user_id', user.id);
                if (error) {
                    throw error;
                }
                setFavorites(data || []);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    // /**
    //  * Deletes a podcast from the user's favorites.
    //  * Deletes podcast by calling the appropriate Supabase query.
    //  * @param id - The ID of the podcast to be deleted.
    //  */
    // const deletePodcast = async (id: string) => {
    //     try {
    //         const { error } = await supabase
    //             .from('favorites')
    //             .delete()
    //             .eq('id', id);
    //         if (error) {
    //             throw error;
    //         }
    //         setFavorites(favorites.filter(favorite => favorite.id !== id));
    //     } catch (error) {
    //         console.error('Error deleting podcast:', error.message);
    //     }
    // };

    /**
     * Handle clicking on an episode ID.
     * Set the selectedEpisodeId state to the clicked episode ID.
     */
    //Function to handle opening the overlay page with the selected episode details
    const handleEpisodeClick = (episode: Podcast) => {
        setSelectedEpisode(episode);
        setShowOverlay(true);
    };

    // const handleEpisodeClick = (episode: Podcast) => {
    //         // Construct the route path for the PodcastInfo page with the episode ID as a parameter
    //         const path = `https://podcast-api.netlify.app/id/${episode.id}`;
    //         // Navigate to the PodcastInfo page with the constructed path
    //         window.location.href = path;
    //     };
    // Function to close the overlay page
    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

console.log(favorites)

    /**
     * Renders a section titled "Saved for Later" and maps through the favorites array to display each saved podcast item.
     * Each podcast item is displayed with its image and title.
     * It provides a delete button for each podcast item, allowing users to remove it from their favorites.
     * The PodcastInfo component is used to provide additional functionality for each podcast item, such as saving the episode.
     */
    return (
        <>
            <div className='flex justify-center text-yellow-400'>
                <h2 className="text-white font-bold md:text-xl p-4">Saved for Later</h2>

                <ul className='items-center  z-[100]'>
                    {favorites.map((episode, index, seasonId) => (
                        <li key={index} onClick={() => handleEpisodeClick(episode)} style={{ cursor: 'pointer' }}>
                            {/*{episode.episode_id}{seasonId.title}*/}
                            {JSON.stringify(episode)}


                        </li>
                    ))}
                </ul>
                {/* Render the overlay page with the selected episode details */}
                {selectedEpisode && (
                    <PodcastInfo
                        item={selectedEpisode}
                        showOverlay={showOverlay}
                        closeOverlay={handleCloseOverlay}

                    />
                )}
            </div>
        </>
    );
}

export default SavedPodcasts;