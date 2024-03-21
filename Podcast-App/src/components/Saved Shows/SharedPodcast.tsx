import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import supabase from '../../supabase';

interface Episode {
    season_id: string;
    episode_title: string;
    season_title: string;
    season_image: string;
    date_saved: string;
    mp3_file: string;
    seasons_titles?: { title: string }[];

}

function SharedPodcast() {
    const { userId } = useParams();
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data, error } = await supabase
                .from('favorites')
                .select('season_id, episode_title, season_title, season_image, date_saved, mp3_file, seasons_titles')
                .eq('user_id', userId);
            if (error) {
                throw error;
            }
            if (data) {
                const episodesData: Episode[] = data.map((episode: any) => ({
                    season_id: episode.season_id,
                    episode_title: episode.episode_title,
                    season_title: episode.season_title,
                    season_image: episode.season_image,
                    date_saved: episode.date_saved,
                    mp3_file: episode.mp3_file,
                    seasons_titles: episode.seasons_titles,
                }));
                setEpisodes(episodesData);
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [userId]);

    if (loading) {
        return <div className='flex items-center justify-center h-screen text-blue-500 text-5xl'>Loading...</div>;
    }

    if (episodes.length === 0) {
        return <div>Error: Episodes not found</div>;
    }

    return (
        <div>

            <div className='flex justify-center text-yellow-400 text-5xl mt-5 p-5 text-bold'>
                Shared Favorites
            </div>

        <div className='justify-center items-center text-gray-500 overflow-y-auto '>
            <ul className='items-center z-[100]'>
                {episodes.map((episode, index) => (
                    <li key={index} className='border bg-black rounded m-4 flex justify-between items-center text-yellow-400 '>
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
                                    {episode.seasons_titles && episode.seasons_titles[index]?.title ? episode.seasons_titles[index]?.title : episode.season_title}
                                </div>
                                <div className=' flex items-center m-2 mb-3'>
                                    <p className='text-gray-500 pr-2'>Date Saved:</p>
                                    {format(new Date(episode.date_saved), 'dd/MM/yyyy HH:mm')}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
}

export default SharedPodcast;
