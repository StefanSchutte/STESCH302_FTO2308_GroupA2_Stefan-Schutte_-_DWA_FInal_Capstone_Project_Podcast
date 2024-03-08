import React, {useEffect, useState} from 'react';
import closeFav from "/close.png";
import PlayButton from '../PlayButton.tsx'
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

    const [lastListenedShow, setLastListenedShow] = useState<string | null>(null);
    const [lastListenedEpisode, setLastListenedEpisode] = useState<string | null>(null);


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

        const lastShow = localStorage.getItem('lastListenedShow');
        const lastEpisode = localStorage.getItem('lastListenedEpisode');
        setLastListenedShow(lastShow);
        setLastListenedEpisode(lastEpisode);

        if (showOverlay && item) {
            fetchPodcastData();
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [item, showOverlay]);

    const handleSeasonSelect = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    const handleEpisodeSelect = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);
    };

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
                                        <div className='text-yellow-400 flex items-center mb-4'>
                                                {item.genres}
                                        </div>

                                        <div className='text-gray-500 flex items-center mb-4'>
                                            {item.updated}
                                        </div>

                                        <div className="whitespace-pre-wrap flex items-center mb-4">
                                            {item.description}
                                        </div>

                                        <div className='text-yellow-400 flex items-center mb-4'>
                                            <p className='text-amber-50'>
                                                Seasons:
                                            </p>{item.seasons}</div>
                                    </div>

                                    {podcastData && (
                                        <div>
                                            <div className='flex items-center'>
                                                {/* Choose Season dropdown */}
                                                <div>Select Season:</div>
                                                <select
                                                    value={selectedSeason || ''}
                                                    onChange={(e) => handleSeasonSelect(parseInt(e.target.value))}
                                                    className='p-3 my-2 bg-gray-600 rounded w-2/3 pr-2'
                                                >
                                                    <option value="">Choose Season</option>
                                                    {Array.from({length: item.seasons}, (_, i) => (
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
                                                    className='p-3 my-2 bg-gray-600 rounded w-2/3'
                                                >
                                                    <option value="">Choose Episode</option>
                                                    {selectedSeason && podcastData.seasons[selectedSeason - 1]?.episodes.map((episode: any, index: number) => (
                                                        <option key={index + 1} value={index + 1}>{episode.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Play button */}
                                            {/* Render the PlayButton component */}
                                            <PlayButton audioUrl={selectedSeason && selectedEpisode && podcastData && podcastData.seasons[selectedSeason - 1].episodes[selectedEpisode - 1].file}
                                                        // showId={item.id}
                                                        // episodeId={podcastData.seasons[selectedSeason - 1].episodes[selectedEpisode - 1].id}
                                            />
                                        </div>
                                    )}

                                    <button className="absolute top-4 right-3 " onClick={closeOverlay}><img
                                        src={closeFav} alt="close" className='w-15 h-15 ml-2'/></button>

                                </div>
                                </div>
                            </div>
                    </div>
                </>
    );
};

export default Overlay;


