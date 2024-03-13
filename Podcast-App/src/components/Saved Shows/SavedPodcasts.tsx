import { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.tsx";
import { AiOutlineClose } from 'react-icons/ai';
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

                // // Group episodes by season
                // const groupedFavorites = data.reduce((acc: { [key: string]: Podcast[] }, episode: Podcast) => {
                //     const seasonId = episode.season_id || 'No Season';
                //     if (!acc[seasonId]) {
                //         acc[seasonId] = [];
                //     }
                //     acc[seasonId].push(episode);
                //     return acc;
                // }, {});
                // console.log('Grouped Favorites:', groupedFavorites);

                setFavorites(data || []);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    /**
     * Deletes a podcast from the user's favorites.
     * Deletes podcast by calling the appropriate Supabase query.
     * @param id - The ID of the podcast to be deleted.
     */
    const deletePodcast = async (id: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            setFavorites(favorites.filter(favorite => favorite.id !== id));
        } catch (error) {
            console.error('Error deleting podcast:', error.message);
        }
    };

    /**
     * Saves a podcast episode to the user's favorites.
     * Save logic here, making an api call or interacting with Supabase.
     * After successfully saving the podcast, fetch the updated favorites.
     * @param episodeId - The ID of the podcast episode.
     * @param seasonId - The ID of the podcast season.
     * @param podcastData - Data of the podcast episode to be saved.
     */

    //here fix
    const savePodcast = async (episodeId: string, seasonId: string | null, podcastData: Podcast) => {
        try {
            // save logic here, such as making an api call or interacting with Supabase

            const { data, error } = await supabase
                .from('favorites')
                //.insert(podcastData);
                .insert([{ user_id: user.id, episode_id: episodeId, season_id: seasonId, ...podcastData }]);
            if (error) {
                throw error;
            }
            console.log('Podcast saved successfully:', data);

            fetchFavorites();
            console.log("Saving Episode:", episodeId);
            console.log("Saving Season:", seasonId);
        } catch (error) {
            console.error('Error saving episode:', error.message);
        }
    };
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null); // State to track the selected episode ID
    const [showOverlay, setShowOverlay] = useState(false);

    // Function to handle opening the overlay page with the selected episode details
    const handleEpisodeClick = (episode: Podcast) => {
        setSelectedEpisode(episode);
        setShowOverlay(true);
    };
    // /**
    //  * Handle clicking on an episode ID.
    //  * Set the selectedEpisodeId state to the clicked episode ID.
    //  */
    // const handleEpisodeClick = (episodeId: string) => {
    //     setSelectedEpisodeId(episodeId);
    // };

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

                {/*<ul>*/}
                {/*    {favorites.map((episode, index) => (*/}
                {/*        <li key={index}>*/}
                {/*            Episode ID: {episode.episode_id}*/}
                {/*            /!* Render other episode details as needed *!/*/}
                {/*        </li>*/}
                {/*    ))}*/}
                {/*</ul>*/}

                {/*<ul>*/}
                {/*    {favorites.map((episode, index) => (*/}
                {/*        <li key={index}>*/}
                {/*        <span*/}
                {/*            onClick={() => handleEpisodeClick(episode.episode_id)} // Call handleEpisodeClick function when clicked*/}
                {/*            style={{ cursor: 'pointer' }} // Add cursor pointer style for better UX*/}
                {/*        >*/}
                {/*            Episode ID: {episode.episode_id}*/}
                {/*        </span>*/}
                {/*            /!* Render other episode details as needed *!/*/}
                {/*        </li>*/}
                {/*    ))}*/}
                {/*</ul>*/}
                {/*/!* Render the overlay page based on the selectedEpisodeId state *!/*/}
                {/*{selectedEpisodeId && (*/}
                {/*    <div className="overlay">*/}
                {/*        /!* Render the overlay content here *!/*/}
                {/*        <button onClick={() => setSelectedEpisodeId(null)}>Close Overlay</button>*/}
                {/*    </div>*/}
                {/*)}*/}

                <ul>
                    {favorites.map((episode, index, seasonId) => (
                        <li key={index} onClick={() => handleEpisodeClick(episode)} style={{ cursor: 'pointer' }}>
                            {episode.episode_id}{seasonId.title}
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