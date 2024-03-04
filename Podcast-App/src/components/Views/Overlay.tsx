import React, {useEffect, useState} from 'react';

interface OverlayProps {
    item: {
        image: string;
        title: string;
        updated: string; // Add other necessary properties
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
    podcast: any;
}

const Overlay: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay, podcast }) => {

    const [podcastData, setPodcastData] = useState<any>(null);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

    useEffect(() => {
        const fetchPodcastData = async () => {
            try {
                const response = await fetch(`https://podcast-api.netlify.app/id/${item.id}`);
                const data = await response.json();
                setPodcastData(data);
            } catch (error) {
                console.error('Error fetching podcast data:', error);
            }
        };

        if (showOverlay && item) {
            fetchPodcastData();
        }
    }, [item, showOverlay]);

    const handleSeasonSelect = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
        setSelectedEpisode(null)
    };

    const handleEpisodeSelect = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);
        // Handle episode selection here, e.g., play the selected episode
        console.log(`Selected episode ${episodeNumber} of season ${selectedSeason}`);
    };

    const handlePlayButtonClick = () => {
        // Implement logic to play the selected podcast episode
        if (selectedEpisode !== null && podcastData) {
            const episodeToPlay = podcastData.seasons[selectedSeason - 1].episodes[selectedEpisode - 1];
            // Example: Open a new tab to play the episode in an external player
            window.open(episodeToPlay.audio_url, '_blank');
        }
    };

    if (!showOverlay) return null;
    return (

                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[90] "></div>

                    <div className="text-yellow-400 fixed top-0 left0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-80 z-[100] overflow-auto">



                            <div className="w-full h-full bg-cover bg-center rounded-t-lg " style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})`}}>

                                <div className="p-4 m-4 rounded-lg max-w-screen h-screen flex-col justify-center">

                                <div><img src={item.image} className='w-40 h-40 '/></div>
                                <div className='font-bold text-yellow-400 flex items-center'><h2 className='text-amber-50'>Title: </h2> {item.title}</div>
                                <div className='text-gray-500 flex items-center'><p className='text-amber-50'>Release Date: </p>{item.updated}</div>
                                <div className="whitespace-pre-wrap flex items-center">
                                    <p className='text-amber-50'>Description: </p> {item.description}
                                </div>
                                <div className='text-yellow-400 flex items-center'><p className='text-amber-50'>Genre: </p>{item.genres}</div>
                                <div className='text-yellow-400 flex items-center'><p className='text-amber-50'>Seasons: </p>{item.seasons}</div>
                                {/* Add more details here */}

                                {podcastData && (
                                    <div>
                                        <button onClick={() => console.log(podcastData)}>Play Podcast</button>
                                        {/* Display episodes or other podcast details here */}
                                    </div>
                                )}

                                {podcastData && (
                                    <div >
                                        <div className='flex items-center'>
                                        {/* Choose Season dropdown */}
                                            <div>Select Season:</div>
                                        <select
                                            value={selectedSeason || ''}
                                            onChange={(e) => handleSeasonSelect(parseInt(e.target.value))}
                                            className='p-3 my-2 bg-gray-600 rounded'
                                        >
                                            <option value="">Choose Season</option>
                                            {Array.from({ length: item.seasons }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>Season {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='flex items-center'>
                                        <div>Select Episode:</div>
                                        {/* Choose Episode dropdown */}
                                        <select
                                            value={selectedEpisode || ''}
                                            onChange={(e) => handleEpisodeSelect(parseInt(e.target.value))}
                                            className='p-3 my-2 bg-gray-600 rounded'
                                        >
                                            <option value="">Choose Episode</option>
                                            {selectedSeason && podcastData.seasons[selectedSeason - 1].episodes.map((episode: any, index: number) => (
                                                <option key={index + 1} value={index + 1}>{episode.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                        {/* Play button */}
                                        <button className="border bg-green-500 text-amber-50 border-gray-300 py-2 px-5" onClick={handlePlayButtonClick}>Play Podcast</button>
                                    </div>
                                )}

                                <button className="border bg-red-500 text-amber-50 border-gray-300 py-2 px-5" onClick={closeOverlay}>Close</button>

                                </div>
                            </div>
                        </div>

                </>

    );
};

export default Overlay;


