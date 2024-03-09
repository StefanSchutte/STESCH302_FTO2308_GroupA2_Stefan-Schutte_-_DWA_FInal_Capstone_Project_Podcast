import React, {useEffect, useState} from 'react';
import closeFav from "/close.png";
import PlayButton from '../../helpers/PlayButton.tsx'
import { useShows } from "../../API/ShowsContext.tsx";
import Genres from "../../helpers/Genres.tsx";
import seeMoreFav from '/seeMore.png'
import EpisodeList from "../../pages/List.tsx";
import { Link } from 'react-router-dom';


interface OverlayProps {
    item: {
        id: string,
        image: string;
        title: string;
        updated: string; // Add other necessary properties
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
}

/**
 * Overlay component to display detailed information about a podcast.
 * @param item - The podcast item containing details.
 * @param showOverlay - Boolean to control the visibility of the overlay.
 * @param closeOverlay - Function to close the overlay.
 */
const Overlay: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay, }) => {

    const [podcastData, setPodcastData] = useState<any>(null);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
    const formattedUpdated = new Date(item.updated).toISOString().split('T')[0].replace(/-/g, '/');
    const [loading, setLoading] = useState(false); // Initialize loading state
    const [lastListenedShow, setLastListenedShow] = useState<string | null>(null);
    const [lastListenedEpisode, setLastListenedEpisode] = useState<string | null>(null);

    const [showAllEpisodes, setShowAllEpisodes] = useState(false);
    const [showEpisodeList, setShowEpisodeList] = useState(false);

    const [seeMore, setSeeMore] = useState(false)

    /**
     * Fetches podcast data from API and sets it in the state.
     */
    useEffect(() => {

            const lastShow = localStorage.getItem('lastListenedShow');
            const lastEpisode = localStorage.getItem('lastListenedEpisode');
            setLastListenedShow(lastShow);
            setLastListenedEpisode(lastEpisode);

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
                document.body.classList.remove('overflow-hidden');
                window.removeEventListener('resize', handleBodyOverflow);
            }

        }, [item, showOverlay]);

        useEffect(() => {
            if (showOverlay && item) {
                const fetchPodcastData = async () => {
                    setLoading(true);
                    try {
                        const response = await fetch(`https://podcast-api.netlify.app/id/${item.id}`);
                        const data = await response.json();
                        setPodcastData(data);
                    } catch (error) {
                        console.error('Error fetching podcast data:', error);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchPodcastData();
            }
        }, [item, showOverlay]);

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
    };

    const handleSeeMoreClick = () => {
        setSeeMore(true)
    };

    /**
     * Conditional rendering of the overlay based on the visibility flag
     */
    if (!showOverlay) return null;

    return (

                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[90] overflow-hidden">

                        <div className="text-yellow-400 fixed top-0 left0 w-screen h-full flex  justify-center items-center bg-black bg-opacity-80 z-[100] ">

                            <div className="w-full h-full bg-cover bg-center rounded-t-lg " style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})`}}>

                                <div className="p-4 m-4 rounded-lg max-w-screen h-screen  overflow-auto">



                                        <div className="flex items-center mb-4">
                                            <div className="mr-4">
                                                <img src={item.image} className='max-w-40 h-40 object-cover '/>
                                            </div>

                                            <div className='font-bold text-yellow-400 flex items-center'>
                                                <h2 className='text-4xl underline'>
                                                    {item.title}
                                                </h2>

                                            </div>
                                        </div>

                                    <div className='mb-4 '>
                                        <div className='flex items-center mb-4 mt-8'>
                                            <Genres genres={item.genres} />
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

                                    {loading ? ( // Render loading spinner if data is loading
                                        <div className="flex justify-center items-center">
                                            <div className="text-blue-500 text-5xl">Loading...</div>
                                        </div>
                                    ) : (

                                    podcastData && (
                                        <div >
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
                                                        <option key={i + 1} value={i + 1}>Season {i + 1}

                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='flex items-center'>
                                                <div className='pr-4 text-purple-500'>Select Episode:</div>
                                                {/* Choose Episode dropdown */}
                                                <select
                                                    value={selectedEpisode || ''}
                                                    onChange={(e) => handleEpisodeSelect(parseInt(e.target.value))}
                                                    className='p-3 my-2 bg-gray-600 rounded w-2/3'
                                                >
                                                    <option value="">Choose Episode</option>
                                                    {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: any, index: number) => (
                                                        <option key={index + 1} value={index + 1}>{episode.title}

                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Play button */}
                                            {/* Render the PlayButton component */}
                                            <PlayButton
                                                audioUrl={selectedSeason && selectedEpisode && podcastData && podcastData.seasons[selectedSeason - 1].episodes[selectedEpisode - 1].file}
                                                showId={item.id}

                                            />



                                            <Link to="/episodeList">
                                                <img src={seeMoreFav} alt='See More' className='' />
                                            </Link>

                                        </div>
                                    )
                                    )}

                                    <button className="absolute top-4 right-4 " onClick={closeOverlay}>
                                    <img src={closeFav} alt="close" className='w-15 h-15 ml-2'/>
                                    </button>
                                </div>
                                </div>
                            </div>
                    </div>
                </>
    );
};

export default Overlay;


