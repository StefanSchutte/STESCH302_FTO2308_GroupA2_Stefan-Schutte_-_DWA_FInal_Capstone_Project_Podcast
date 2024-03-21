import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import supabase from '../../supabase';

function SharedPodcast() {
    const { userId, episodeId } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const { data, error } = await supabase
                .from('favorites')
                .select('season_id, episode_title, season_title, season_image, date_saved, mp3_file, seasons_titles')
                .eq('user_id', userId); // Use userId from useParams
            if (error) {
                throw error;
            }
            if (data) {
                setEpisodes(data); // Set episodes data to state
                setLoading(false); // Set loading to false after data is fetched
            }
        };

        fetchFavorites(); // Call fetchFavorites function
    }, [userId]); // Add userId to dependency array

    if (loading) {
        return <div>Loading...</div>;
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
                {episodes.map((episode, index) => ( // Map over episodes array
                    <li key={index} className='border bg-black rounded m-4 flex justify-between items-center text-yellow-400 cursor-pointer'>
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
