import React, {useEffect, useState} from 'react';
import PlayButton from '../audio/PlayButton.tsx'
import Genres from "../../helpers/Genres.tsx";
import supabase from "../../supabase.ts";
import {useAuth} from "../../services/AuthContext.tsx";
import {getShowDetailFromApi} from "../../api/API.ts";
import { useAudioPlayer } from "../audio/AudioPlayerContext.tsx";
import {OverlayProps} from "../../types.ts";
import {Podcast} from '../../types.ts'
import seeMoreFav from '/seeMore.png';
import saveBtnFav from "/save.png";
import closeFav from "/close.png";

/**
 * PodcastInfo component to display detailed information about a podcast.
 * The PodcastInfo component is a functional component that takes OverlayProps as its props.
 * @param item - The podcast item containing details.
 * @param showOverlay - Boolean to control the visibility of the overlay.
 * @param closeOverlay - Function to close the overlay.
 * @param onSave
 */
const PodcastInfo: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay}) => {

    /**
     * State Initialization.
     * Initialized using the useState hook:
     * podcastData: Holds podcast-related data fetched asynchronously.
     * selectedSeason: Represents the selected season.
     * selectedEpisode: Represents the selected episode.
     * formattedUpdated: Formats the date of the podcast's last update.
     * loading: Indicates whether podcast data is being loaded.
     * expanded and seasonExpanded: Control the visibility of additional content sections.
     */
    const [podcastData, setPodcastData] = useState<any>(null);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
    const formattedUpdated = item && item.updated ? new Date(item.updated).toISOString().split('T')[0].replace(/-/g, '/') : '';
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [seasonExpanded, setSeasonExpanded] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [tooltipIndex, setTooltipIndex] = useState(-1);
    const { user } = useAuth();
    const { showAudioPlayer, setShowAudioPlayer, setAudioUrl } = useAudioPlayer();

    /**
     * Fetches podcast data from api and sets it in the state.
     * Manages the body overflow and fetches podcast data based on changes in item and showOverlay.
     */
    useEffect(() => {

            // scroll
            const handleBodyOverflow = () => {
                if (showOverlay && item) {
                    document.body.classList.add('overflow-hidden');
                } else {
                    document.body.classList.remove('overflow-hidden');
                }
            };

            handleBodyOverflow();

            window.addEventListener('resize', handleBodyOverflow);

            return () => {
                if (showOverlay) {
                    document.body.classList.remove('overflow-hidden');
                }
                window.removeEventListener('resize', handleBodyOverflow);
            }

        }, [showOverlay]);

    /**
     * Fetches podcast data when the overlay is shown, based on changes in item and showOverlay.
     * Call the getShowDetailFromApi function from the imported module
     */
    useEffect(() => {
        if (showOverlay && item) {
            setLoading(true);
            getShowDetailFromApi(item.id)
                .then(data => {
                    setPodcastData(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching podcast data:', error);
                    setLoading(false);
                });
        }
    }, [item, showOverlay]);

    /**
     * Save data to Supabase.
     * Ensure selectedSeason and selectedEpisode are not null.
     * Get the current date and time.
     * Insert the favorite episode into the database.
     * Fetch all favorite data after insertion.
     */
    const handleSave = async () => {
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        if (selectedSeason !== null && selectedEpisode !== null && podcastData) {
            const selectedEpisodeData = podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1];
            const selectedSeasonData = podcastData;
            const currentDate = new Date().toISOString();

            const { error } = await supabase
                .from('favorites')
                .insert([{
                    user_id: user.id,
                    episode_id: selectedEpisodeData.id,
                    season_id: selectedSeasonData.id,
                    episode_title: selectedEpisodeData.title,
                    season_title: selectedSeasonData.title,
                    season_image: selectedSeasonData.image,
                    seasons_titles: selectedSeasonData.seasons,
                    date_saved: currentDate,
                    mp3_file: selectedEpisodeData.file,
                }]);

            if (error) {
                console.error('Error inserting favorite episode:', error);
                return;
            }
            const { error: fetchError } = await supabase.from('favorites').select();

            if (fetchError) {
                console.error('Error fetching all favorites:', fetchError);
                return;
            }
        }
    };

    /**
     * Handles the selection of a season.
     * @param seasonNumber - The selected season number.
     */
    const handleSeasonSelect = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    /**
     * Handles the selection of an episode.
     * @param episodeNumber - The selected episode number.
     */
    const handleEpisodeSelect = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);


        if (podcastData && selectedSeason !== null) {
            const selectedEpisodeFile = podcastData.seasons[selectedSeason - 1].episodes[episodeNumber - 1].file;
            setAudioUrl(selectedEpisodeFile);
        }
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const toggleSeasonExpanded = () => {
        setSeasonExpanded(!seasonExpanded);
    };

    /**
     * Function to handle mouse enter.
     * Set index of hovered episode.
     * Set description to display.
     */
    const handleMouseEnter = (index: number, description: string) => {
        setTooltipIndex(index);
        setTooltipText(description);
    };

    /**
     * Function to handle mouse leave.
     * Reset index and clear description.
     *
     */
    const handleMouseLeave = () => {
        setTooltipIndex(-1);
        setTooltipText('');
    };


    // // Function to check if all episodes in a season are completed
    // const isSeasonCompleted = (season: any) => {
    //     if (!season || !season.episodes) return false;
    //     return season.episodes.every((episode: any) => {
    //         const episodeId = episode.id;
    //         const storedCompletionStatus = localStorage.getItem(`${user?.id}-${item.id}_season_${season.id}_episode_${episodeId}_completed`);
    //         return storedCompletionStatus === 'true';
    //     });
    // };
    //
    // // Function to determine the completion status of each season
    // const getSeasonCompletionStatus = () => {
    //     if (!podcastData) return [];
    //     return podcastData.seasons.map((season: any) => ({
    //         seasonId: season.id,
    //         completed: isSeasonCompleted(season),
    //     }));
    // };
    //
    // const renderSeasonCompletion = () => {
    //     const seasonCompletionStatus = getSeasonCompletionStatus();
    //     return (
    //         <div className="flex items-center mt-4">
    //             {seasonCompletionStatus.map((seasonStatus: any) => (
    //                 <div key={seasonStatus.seasonId} className="mr-4">
    //                     <p>Season {seasonStatus.seasonId}: {seasonStatus.completed ? 'Completed' : 'Not Completed'}</p>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };


    /**
     * Conditional rendering of the overlay based on the visibility flag.(showOverlay)
     * Renders the podcast details, loading indicator, season/episode selectors, and a button to close the overlay.
     * Render loading spinner if data is loading.
     */
    if (!showOverlay) return null;

    const handleCloseOverlay = () => {
        closeOverlay(); // Close the overlay

        setShowAudioPlayer(true);
    };

    return (
                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[90] overflow-hidden">

                        <div className="text-yellow-400 fixed top-0 left0 w-screen h-full flex  justify-center items-center bg-black bg-opacity-80 z-[100] ">

                            <div className="w-full h-full bg-cover bg-center rounded-t-lg " style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})`}}>

                                <div className="p-4 m-4 rounded-lg max-w-screen h-screen  overflow-auto scrollbar-hide">

                                        <div className="flex items-center flex-col mb-4 sm:flex-row sm:items-center sm:justify-start">
                                            <div className="mr-4">
                                                <img src={item.image} alt='img' className='max-w-40 h-40 object-cover '/>
                                            </div>
                                            <div className='font-bold text-yellow-400 flex items-center'>
                                                <h2 className='text-4xl underline mt-3'>
                                                    {item.title}
                                                </h2>
                                            </div>
                                        </div>

                                    <div className='mb-4 '>
                                        <div className='flex items-center mb-4 mt-8'>
                                            <Genres genres={Array.isArray(item.genres) ? item.genres : [item.genres]} />
                                        </div>
                                        <div className='text-gray-500 flex items-center mb-4'>
                                            {formattedUpdated}
                                        </div>
                                        <div className="whitespace-pre-wrap flex items-center mb-4">
                                            {item.description}
                                        </div>
                                        <div className='text-yellow-400 flex items-center mb-4'>
                                            <p className='text-amber-50'>
                                                Seasons:
                                            </p>{item.seasons}</div>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-blue-500 text-5xl">Loading...</div>
                                        </div>
                                    ) : (
                                    podcastData && (
                                        <div>
                                            <div className='grid-cols-2'>
                                                <div className='flex items-center'>


                                                    {/* Choose Season dropdown */}
                                                    <div className='pr-6 text-purple-500'>Select Season:</div>
                                                    <select
                                                        value={selectedSeason || ''}
                                                        onChange={(e) => handleSeasonSelect(parseInt(e.target.value))}
                                                        className='p-3 my-2 bg-gray-600 rounded w-2/3 '
                                                    >
                                                        <option value="">Choose Season</option>
                                                        {Array.from({length: item.seasons}, (_, i) => (
                                                            <option key={i + 1} value={i + 1}>
                                                                Season {i + 1}
                                                            </option>
                                                        ))}
                                                    </select>


                                                    {/* See More button */}
                                                    <button className="ml-3 w-12 h-12" onClick={toggleSeasonExpanded}>
                                                        {seasonExpanded ? <img src={closeFav} alt='close' title='Close'/> :
                                                            <img src={seeMoreFav} alt='See More' title='See More'/>}
                                                    </button>
                                                </div>

                                                <div className={`w-full ${seasonExpanded ? 'block' : 'hidden'}`}>
                                                    <ul className="p-3 my-2 bg-gray-600 rounded">
                                                        {Array.from({length: item.seasons}, (_, i) => (
                                                            <li key={i + 1}
                                                                className="py-2 px-4 border-b border-gray-700 flex justify-between items-center">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={podcastData.seasons[i]?.image}
                                                                        alt={`Season ${i + 1} Image`}
                                                                        className="w-16 h-16 mr-4"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleSeasonSelect(i + 1)}
                                                                        title='Select Season'>
                                                                        <div className='flex items-center'>
                                                                            <p className='text-gray-300 pr-3'> Season {i + 1}:</p> {podcastData.seasons[i]?.title || 'Untitled'}
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                                <div className='flex items-center'>
                                                                    <p className='text-gray-300 pr-2'>Episodes: </p>
                                                                    {String(podcastData.seasons[i]?.episodes.length || 0).padStart(2, '0')}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className=''>
                                                    <div className='flex items-center'>
                                                        <div className='pr-4 text-purple-500'>
                                                            Select Episode:
                                                        </div>
                                                        {/* Choose Episode dropdown */}
                                                        <select
                                                            value={selectedEpisode || ''}
                                                            onChange={(e) => handleEpisodeSelect(parseInt(e.target.value))}
                                                            className='p-3 my-2 bg-gray-600 rounded w-2/3'
                                                        >
                                                            <option value="">Choose Episode</option>
                                                            {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: Podcast, index: number) => (
                                                                <option key={index + 1} value={index + 1}>
                                                                    {episode.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* See More button */}
                                                        <button className="ml-3 w-12 h-12" onClick={toggleExpanded}>
                                                            {expanded ? <img src={closeFav} title='Close'/> :
                                                                <img src={seeMoreFav} title='See More'/>}
                                                        </button>
                                                    </div>
                                                    {/* Episode list */}
                                                    <div className={`w-full ${expanded ? 'block' : 'hidden'}`}>
                                                        <ul className="p-3 my-2 bg-gray-600 rounded">
                                                            {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: Podcast, index: number) => (
                                                                <li
                                                                    key={index + 1}
                                                                    className="py-2 px-4 border-b border-gray-700 flex justify-between items-center relative"
                                                                    onMouseEnter={() => handleMouseEnter(index, episode.description)}
                                                                    onMouseLeave={() => handleMouseLeave()}
                                                                >
                                                                    <button
                                                                        onClick={() => handleEpisodeSelect(index + 1)}
                                                                        title='Select Episode'>
                                                                        {episode.title}
                                                                    </button>
                                                                    {tooltipIndex === index && (
                                                                        <div
                                                                            className="absolute left-0 mt-8 ml-2 bg-black text-amber-50 p-2 rounded z-20"
                                                                            style={{top: '50%', left: '0'}}>
                                                                            {/*{tooltipText}*/}
                                                                            {episode.description ? episode.description : "No description available."}
                                                                        </div>
                                                                    )}
                                                                    <button onClick={handleSave} className='w-12 h-12'>
                                                                        <img src={saveBtnFav} alt='Save'
                                                                             title='Select Episode to Save'/></button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            {showOverlay &&  selectedSeason && selectedEpisode &&
                                                <PlayButton
                                                    audioUrl={podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1]?.file}
                                                    showId={item.id}
                                                    episodeId={selectedEpisode}
                                                    seasonId={{selectedSeason}}
                                                    setShowAudioPlayer={setShowAudioPlayer}
                                                    setAudioUrl={setAudioUrl}
                                                    />
                                            }
                                        </div>
                                    )
                                    )}
                                    <button className="absolute top-4 right-4 " onClick={handleCloseOverlay}>
                                        <img src={closeFav} alt="close" className='w-15 h-15 ml-2' title='CLose'/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
    );
};

export default PodcastInfo;
// onClick={closeOverlay}