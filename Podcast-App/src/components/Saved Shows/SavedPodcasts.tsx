import { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.tsx";
import supabase from "../../supabase.ts";
import PodcastInfo from "../../pages/PodcastInfo.tsx";
import SavedPodcastInfo from "./SavedPodcastInfo.tsx";
import removeFav from '/remove.png'
import { format } from 'date-fns'

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

    const [podcastData, setPodcastData] = useState<any>(null); // State to manage podcast data
    const [loading, setLoading] = useState(false); // State to manage loading st

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
                    .select('season_id, episode_title, season_title, season_image, date_saved')
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

    /**
     * Fetch podcast data from the API using the provided season ID.
     * @param {string} seasonId - The ID of the season to fetch podcast data for.
     */
    const fetchPodcastDataFromSupaBase = async (seasonId) => {
        setLoading(true);
console.log(seasonId)
        try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${seasonId}`);
            const data = await response.json();
            setPodcastData(data);
            console.log(response)
        } catch (error) {
            console.error('Error fetching podcast data:', error);
        } finally {
            setLoading(false);
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
     * Handle clicking on an episode ID.
     * Set the selectedEpisodeId state to the clicked episode ID.
     */
    //Function to handle opening the overlay page with the selected episode details
    const handleEpisodeClick = (episode: Podcast) => {
        setSelectedEpisode(episode);
        setShowOverlay(true);

            // Check if the episode has a nested object with a 'season_id' property
            if (episode.season_id) {
                // Access the 'season_id' property from the nested object
                fetchPodcastDataFromSupaBase(episode.season_id);
            } else {
                console.error('Error: No season_id found in episode:', episode);
            }
    };

    // Function to close the overlay page
    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

console.log(favorites)
    //console.log("showOverlay value:", showOverlay);

    //filters
    const sortFavoritesByShowAZ = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => a.season_title.localeCompare(b.season_title));
        setFavorites(sortedFavorites);
    };

    const sortFavoritesByShowZA = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => b.season_title.localeCompare(a.season_title));
        setFavorites(sortedFavorites);
    };
    const sortFavoritesByDateAscending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(a.date_saved) - new Date(b.date_saved));
        setFavorites(sortedFavorites);
    };
    const sortFavoritesByDateDescending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(b.date_saved) - new Date(a.date_saved));
        setFavorites(sortedFavorites);
    };

    /**
     * Renders a section titled "Saved for Later" and maps through the favorites array to display each saved podcast item.
     * Each podcast item is displayed with its image and title.
     * It provides a delete button for each podcast item, allowing users to remove it from their favorites.
     * The PodcastInfo component is used to provide additional functionality for each podcast item, such as saving the episode.
     */
    return (
        <>
            <div className='flex justify-center items-center text-yellow-400 mt-14'>
                <h1 className="text-white font-bold text-4xl p-4 mt-8">Favorites</h1>
            </div>

            <div className="flex justify-center mt-2">
            <button onClick={sortFavoritesByShowAZ} className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400' title='Select'>Sort A-Z</button>
            <button onClick={sortFavoritesByShowZA} className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400' title='Select'>Sort Z-A</button>
            <button onClick={sortFavoritesByDateAscending} className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400' title='Select'>Ascending Date</button>
            <button onClick={sortFavoritesByDateDescending} className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400' title='Select'>Descending Date</button>
            </div>

            <div className='justify-center items-center text-gray-500 overflow-y-auto max-h-screen'>
                <ul className='items-center z-[100]'>
                    {favorites.map((episode, index, seasonId) => (
                        <li key={index}
                            onClick={() => handleEpisodeClick(episode)}
                            className='border bg-black rounded m-4 flex justify-between items-center text-yellow-400 cursor-pointer'>
                            {/*{episode.episode_id}{seasonId.title}*/}
                            {/*{JSON.stringify(episode)}*/}

                            <div>
                                {/* Render episode image */}
                                <img src={episode.season_image} alt={episode.title} className='w-32 h-32 ml-3'/>
                            </div>
                            <div className="flex flex-col ml-4">

                                <div className='font-bold m-3'>{episode.season_title}</div>

                                <div className=' flex items-center m-2'>
                                    <p className='text-gray-500 pr-4'>Episode: </p> {episode.episode_title}
                                </div>
                                <div className=' flex items-center m-2'>
                                    <p className='text-gray-500 pr-6'>Season:</p> {episode.season_title}
                                </div>
                                <div className=' flex items-center m-2 mb-3'>
                                    <p className='text-gray-500 pr-2'>Date
                                        Saved:</p> {format(new Date(episode.date_saved), 'dd/MM/yyyy HH:mm')}
                                </div>
                            </div>
                            <div onClick={() => deletePodcast(episode.id)}>
                                <img src={removeFav} alt='Remove' title='Remove'/>
                            </div>
                        </li>
                    ))}
                </ul>
                {/* Render the overlay page with the selected episode details */}
                {/*{showOverlay && (*/}
                {/*    <SavedPodcastInfo*/}
                {/*        item={selectedEpisode}*/}
                {/*        showOverlay={showOverlay}*/}
                {/*        closeOverlay={handleCloseOverlay}*/}
                {/*        podcastData={podcastData}*/}
                {/*        loading={loading}*/}

                {/*    />*/}
                {/*)}*/}
            </div>


        </>
    );
}

export default SavedPodcasts;