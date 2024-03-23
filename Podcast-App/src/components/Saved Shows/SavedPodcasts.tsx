import { useEffect, useState } from 'react';
import { useAuth } from "../../services/AuthContext.tsx";
import supabase from "../../supabase.ts";
import removeFav from '/remove.png'
import shareFav from '/share.png'
import playFav from "/play-button.png";
import { format } from 'date-fns'
import AudioPlayer from "../audio/AudioPlayer.tsx";
import {Podcast, PodcastFavorite} from "../../types.ts";

/**
 * Functional component representing the saved podcasts section.
 * Sets up a state variable favorites using the useState hook to manage the list of saved podcasts.
 * Retrieves the user object from the useAuth hook, which provides information about the authenticated user.
 */
function SavedPodcasts(): JSX.Element {
    const [favorites, setFavorites] = useState<PodcastFavorite[]>([]);
    const { user } = useAuth();
    const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
    const [podcastData, setPodcastData] = useState<Podcast | null>(null);
    const [loading, setLoading] = useState(false);
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
                if (data) {
                const transformedData = data.map((item: any) => ({
                    id: item.season_id,
                    episode_title: item.episode_title,
                    season_title: item.season_title,
                    season_image: item.season_image,
                    date_saved: item.date_saved,
                    mp3_file: item.mp3_file,
                    seasons_titles: item.seasons_titles,
                    image: '',
                    title: '',
                    season_id: item.season_id,
                }));
                setFavorites(transformedData);
            } else {
                setFavorites([]);
            }
            }
        } catch (error) {
            console.error('Error fetching favorites:', (error as Error).message);
        }
    };

    /**
     * Fetch podcast data from the API using the provided season ID.
     */
    const fetchPodcastDataFromSupaBase = async (seasonId: string) => {
        setLoading(true);

        try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${seasonId}`);
            const data = await response.json();
            setPodcastData(data);
        } catch (error) {
            console.error('Error fetching podcast data:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Deletes a podcast from the user's favorites.
     * Deletes podcast by calling the appropriate Supabase query.
     */
    const deletePodcast = async (season_id: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('season_id', season_id);
            if (error) {
                throw error;
            }
            setFavorites(favorites.filter(favorite => favorite.season_id !== season_id));
        } catch (error) {
            console.error('Error deleting podcast:', (error as Error).message);
        }
    };

    const handleDeleteClick = (season_id: string) => {
        deletePodcast(season_id);
    }

    /**
     * Handle clicking on an episode ID.
     * Set the selectedEpisodeId state to the clicked episode ID.
     * Function to handle opening the overlay page with the selected episode details.
     * Check if the episode has a nested object with a 'season_id' property.
     * Access the 'season_id' property from the nested object.
     */
    const handleEpisodeClick = (episode: PodcastFavorite ) => {
        setSelectedEpisode(episode);
console.log(episode)
            if (episode.season_id) {
                fetchPodcastDataFromSupaBase(episode.season_id);
            } else {
                console.error('Error: No season_id found in episode:', episode);
            }
    };

//console.log(favorites)

    /**
     * Sorts the podcasts alphabetically by season title in ascending order (A-Z).
     */
    const sortFavoritesByShowAZ = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => a.season_title.localeCompare(b.season_title));
        setFavorites(sortedFavorites);
    };

    /**
     * Sorts the podcasts alphabetically by season title in descending order (Z-A).
     */
    const sortFavoritesByShowZA = () => {
        const sortedFavorites = [...favorites].filter(podcast => podcast.season_title).sort((a, b) => b.season_title.localeCompare(a.season_title));
        setFavorites(sortedFavorites);
    };
    /**
     * Sorts the podcasts by the date they were saved in ascending order (oldest to newest).
     */
    const sortFavoritesByDateAscending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(a.date_saved).getTime() - new Date(b.date_saved).getTime());
        setFavorites(sortedFavorites);
    };

    /**
     * Sorts the podcasts by the date they were saved in descending order (newest to oldest).
     */
    const sortFavoritesByDateDescending = () => {
        const sortedFavorites = [...favorites].sort((a, b) => new Date(b.date_saved).getTime() - new Date(a.date_saved).getTime());
        setFavorites(sortedFavorites);
    };

    const filterAndGroupBySeason = () => {
        const groupedBySeason: { [key: string]: { [key: string]: PodcastFavorite[] } } = {};

        favorites.map((episode, index) => {
            const seasonKey = episode.season_title;
            const subSeasonKey = episode.seasons_titles && episode.seasons_titles[index]?.title;

            if (!groupedBySeason[seasonKey]) {
                groupedBySeason[seasonKey] = {};
            }

            if (!groupedBySeason[seasonKey][subSeasonKey]) {
                groupedBySeason[seasonKey][subSeasonKey] = [];
            }

            groupedBySeason[seasonKey][subSeasonKey].push(episode);
        });

        setFavorites(Object.values(groupedBySeason).flatMap(Object.values).flat());
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
    const generateShareUrl = (episode) => {
        // Generate a unique share URL based on the user's ID or session and the podcast ID
        const uniqueIdentifier = user ? user.id : Date.now().toString();
        const url = `${window.location.origin}/shared-favorites/${uniqueIdentifier}/${episode.id}`;
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
                <h1 className="text-white font-bold text-4xl p-4 mt-1">Favorites</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center mt-2">
                <button onClick={sortFavoritesByShowAZ}
                        className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400'
                        title='Select'>Sort A-Z
                </button>
                <button onClick={sortFavoritesByShowZA}
                        className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400'
                        title='Select'>Sort Z-A
                </button>
                <button onClick={sortFavoritesByDateAscending}
                        className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400'
                        title='Select'>Ascending Date
                </button>
                <button onClick={sortFavoritesByDateDescending}
                        className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400'
                        title='Select'>Descending Date
                </button>
                <button onClick={filterAndGroupBySeason}
                        className='cursor-pointer mr-4 bg-gray-600 border border-amber-50 rounded-full p-2 mt-2 text-yellow-400'
                        title='Select'>Group by Season
                </button>
            </div>

            <div className='justify-center items-center text-gray-500 overflow-y-auto max-h-screen'>
                <ul className='items-center z-[100]'>
                {favorites.map((episode, index) => (
                        <li key={index}
                            onClick={() => handleEpisodeClick(episode)}
                            className='border bg-black rounded m-4 flex justify-between items-center text-yellow-400 cursor-pointer'>
                            {/*{JSON.stringify(episode)}*/}
                            <div className="flex flex-col sm:flex-row items-center">
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
                            <div className=' m-3'>
                                <div>
                                    <button onClick={() => openAudioPlayer(episode.id)}>
                                        <img src={playFav} alt='Play' title='Play' className='w-14 h-14 m-2'/>
                                    </button>
                                </div>

                                <div>
                                    <img src={shareFav} alt='Share' title='Share' className='w-14 h-14 m-2'
                                         onClick={() => generateShareUrl(episode)}/>

                                    {episode.id === selectedEpisode?.id && shareUrl && (
                                        <div className='bg-blue-500'>
                                            <input type="text" value={shareUrl} readOnly/>
                                            <button onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy URL
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => handleDeleteClick(episode.season_id)}>
                                    <img src={removeFav} alt='Remove' title='Remove' className='w-14 h-14 m-2 mt-3'/>
                                </button>

                            </div>
                        </li>
                ))}
                </ul>
            </div>
            {selectedEpisodeForAudio && selectedEpisode && (
                <AudioPlayer
                    audioUrl={selectedEpisode.mp3_file}
                    onClose={() => setSelectedEpisodeForAudio(null)}

                />
            )}
        </>
    );
}

export default SavedPodcasts;