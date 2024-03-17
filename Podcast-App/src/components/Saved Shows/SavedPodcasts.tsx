import { useEffect, useState } from 'react';
import { useAuth } from "../../auth/AuthContext.tsx";
import supabase from "../../supabase.ts";
import removeFav from '/remove.png'
import shareFav from '/share.png'
import playFav from "/play-button.png";
import { format } from 'date-fns'

import AudioPlayer from "../audio/AudioPlayer.tsx";

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

    // State variable to store the ID of the selected episode for audio playback
    const [selectedEpisodeForAudio, setSelectedEpisodeForAudio] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string>('');

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
                    .select('season_id, episode_title, season_title, season_image, date_saved, mp3_file, seasons_titles')
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

console.log(favorites)

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
     * Function to handle opening the audio player for the selected episode.
     * Set the selected episode ID for audio playback.
     * Find the episode with the given ID.
     * @param {string} episodeId - The ID of the episode to be played.
     */
    const openAudioPlayer = (episodeId: string) => {
        const selectedEpisode = favorites.find(episode => episode.id === episodeId);
        if (selectedEpisode) {
            setSelectedEpisodeForAudio(selectedEpisode.mp3_file);
        } else {
            console.error('Error: Episode not found with ID:', episodeId);
        }
    };


    /**
     * share
     */
    const generateShareUrl = () => {
        // Generate a unique share URL based on the user's ID or session
        const uniqueIdentifier = user ? user.id : Date.now().toString();
        const url = `${window.location.origin}/shared-favorites/${uniqueIdentifier}`;
        setShareUrl(url);
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
                            {/*{JSON.stringify(episode)}*/}
                            <div className="flex items-center">
                            <div>
                                <img src={episode.season_image} alt={episode.title} className='w-52 h-full ml-4'/>
                            </div>
                            <div className="flex flex-col ml-6">
                                <div className='font-bold m-3 underline'>{episode.season_title}</div>
                                <div className=' flex items-center m-2'>
                                    <p className='text-gray-500 pr-4'>Episode:</p>
                                    {episode.episode_title}
                                </div>
                                <div className=' flex items-center m-2'>
                                    <p className='text-gray-500 pr-6'>Season:</p>
                                    {/*{episode.seasons_titles[index]?.title}*/}
                                    {episode.seasons_titles && episode.seasons_titles[index]?.title ? episode.seasons_titles[index]?.title : episode.season_title}
                                </div>
                                <div className=' flex items-center m-2 mb-3'>
                                    <p className='text-gray-500 pr-2'>Date Saved:</p>
                                    {format(new Date(episode.date_saved), 'dd/MM/yyyy HH:mm')}
                                </div>
                            </div>
                            </div>
                            <div className='m-3'>
                                <div>
                                    <button onClick={() => openAudioPlayer(episode.id)}>
                                        <img src={playFav} alt='Play' title='Play' className='w-14 h-14 m-2'/>
                                    </button>
                                </div>

                                <div>
                                    <img src={shareFav} alt='Share' title='Share' className='w-14 h-14 m-2' onClick={generateShareUrl}/>
                                    {/*share url*/}
                                    {shareUrl && (
                                        <div className='bg-blue-500'>
                                            <input type="text" value={shareUrl} readOnly />
                                            <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy URL</button>
                                        </div>
                                    )}
                                </div>

                                <div onClick={() => deletePodcast(episode.id)}>
                                    <img src={removeFav} alt='Remove' title='Remove' className='w-14 h-14 m-2 mt-3'/>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedEpisodeForAudio && (
                <AudioPlayer
                    audioUrl={selectedEpisode.mp3_file}
                    onClose={() => setSelectedEpisodeForAudio(null)}
                />
            )}
        </>
    );
}

export default SavedPodcasts;