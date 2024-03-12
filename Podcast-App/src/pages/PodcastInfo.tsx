import React, {useEffect, useState} from 'react';
import closeFav from "/close.png";
import PlayButton from '../components/audio/PlayButton.tsx'
import Genres from "../helpers/Genres.tsx";
import seeMoreFav from '/seeMore.png';
import saveBtnFav from "/save.png";

/**
 * Props interface for the PodcastInfo component.
 */
interface OverlayProps {
    item: {
        id: string,
        image: string;
        title: string;
        updated: string;
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
    onSave: (episodeId: string, seasonId: string | null) => void;
}

/**
 * PodcastInfo component to display detailed information about a podcast.
 * The PodcastInfo component is a functional component that takes OverlayProps as its props.
 * @param item - The podcast item containing details.
 * @param showOverlay - Boolean to control the visibility of the overlay.
 * @param closeOverlay - Function to close the overlay.
 * @param onSave
 */
const PodcastInfo: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay, onSave}) => {

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
    const [loading, setLoading] = useState(false); // Initialize loading state
    const [expanded, setExpanded] = useState(false);
    const [seasonExpanded, setSeasonExpanded] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [tooltipIndex, setTooltipIndex] = useState(-1);

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
                document.body.classList.remove('overflow-hidden');
                window.removeEventListener('resize', handleBodyOverflow);
            }

        }, [item, showOverlay]);

    /**
     * Fetches podcast data when the overlay is shown, based on changes in item and showOverlay.
     */
        useEffect(() => {
            if (showOverlay && item) {
                const fetchPodcastData = async () => {
                    setLoading(true);
                    try {
                        const response = await fetch(`https://podcast-api.netlify.app/id/${item.id}`);
                        const data = await response.json();
                        setPodcastData(data);
                        //console.log(data)
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

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const toggleSeasonExpanded = () => {
        setSeasonExpanded(!seasonExpanded);
    };

    /**
     * Function to handle mouse enter.
     * Set index of hovered episode.
     * Set description to display
     * @param index
     * @param description
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

    // /**
    //  * Handles saving of podcast episodes.
    //  */
    // const handleSave = () => {
    //     if (selectedSeason !== null) {
    //         const episodeId = selectedEpisode ? podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1]?.id : '';
    //         const seasonId = selectedSeason ? String(selectedSeason) : null;
    //         onSave(episodeId, seasonId);
    //     }
    // }

    /**
     * Handles saving of podcast episodes.
     */
    const handleSave = () => {
        if (selectedSeason !== null && selectedEpisode !== null && podcastData) {
            const episode = podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1];
            if (episode) {
                //onSave(episode.id, String(selectedSeason));
                onSave(episode)
            } else {
                console.error('Selected episode not found.');
            }
        } else {
            console.error('Selected season or episode is null, or podcast data is not available.');
        }
    };

    /**
     * Conditional rendering of the overlay based on the visibility flag.(showOverlay)
     * Renders the podcast details, loading indicator, season/episode selectors, and a button to close the overlay.
     */
    if (!showOverlay) return null;

    return (
                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[90] overflow-hidden">

                        <div className="text-yellow-400 fixed top-0 left0 w-screen h-full flex  justify-center items-center bg-black bg-opacity-80 z-[100] ">

                            <div className="w-full h-full bg-cover bg-center rounded-t-lg " style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})`}}>

                                <div className="p-4 m-4 rounded-lg max-w-screen h-screen  overflow-auto scrollbar-hide">

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
                                                        {seasonExpanded ? <img src={closeFav}/> : <img src={seeMoreFav}/>}
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
                                                                        onClick={() => handleSeasonSelect(i + 1)}>
                                                                        Season {i + 1}
                                                                    </button>
                                                                </div>
                                                                {/*<button className='w-12 h-12' onClick={() => onSave(episode.id, selectedSeason ? String(selectedSeason) : null)}>*/}
                                                                {/*<img src={saveBtnFav} alt='Save'/>*/}
                                                                {/*</button>*/}
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
                                                            {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: any, index: number) => (
                                                                <option key={index + 1} value={index + 1}>
                                                                    {episode.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {/* See More button */}
                                                        <button className="ml-3 w-12 h-12" onClick={toggleExpanded}>
                                                            {expanded ? <img src={closeFav}/> : <img src={seeMoreFav}/>}
                                                        </button>
                                                    </div>
                                                    {/* Episode list */}
                                                    <div className={`w-full ${expanded ? 'block' : 'hidden'}`}>
                                                        <ul className="p-3 my-2 bg-gray-600 rounded">
                                                            {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode, index) => (
                                                                <li
                                                                    key={index + 1}
                                                                    className="py-2 px-4 border-b border-gray-700 flex justify-between items-center relative"
                                                                    onMouseEnter={() => handleMouseEnter(index, episode.description)}
                                                                    onMouseLeave={() => handleMouseLeave()}
                                                                >
                                                                    <button
                                                                        onClick={() => handleEpisodeSelect(index + 1)}>
                                                                        {episode.title}
                                                                    </button>
                                                                    {tooltipIndex === index && (
                                                                        <div
                                                                            className="absolute left-0 mt-8 ml-2 bg-black text-amber-50 p-2 rounded z-20"
                                                                            style={{top: '50%', left: '0'}}>
                                                                            {tooltipText}
                                                                        </div>
                                                                    )}
                                                                    <button onClick={handleSave} className='w-12 h-12'><img src={saveBtnFav} alt='Save'/></button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        <PlayButton
                                        audioUrl={selectedSeason && selectedEpisode && podcastData && podcastData.seasons[selectedSeason - 1].episodes[selectedEpisode - 1].file}
                                        showId={item.id}
                                        />
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

export default PodcastInfo;