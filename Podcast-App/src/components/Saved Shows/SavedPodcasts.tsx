import React, {useEffect, useState} from 'react';
import {MdChevronLeft, MdChevronRight} from "react-icons/md";
import {useAuth} from "../../context/AuthContext.tsx";
import { AiOutlineClose } from 'react-icons/ai'
import supabase from "../../supabase.ts";
import Overlay from "../Views/Overlay.tsx";

//import {updateDoc, doc, onSnapshot} from '@supabase/supabase-js'
function SavedPodcasts() {
     const [podcasts, setPodcasts] = useState([])

    const slideLeft = () => {
        let slider = document.getElementById('slider' );
        if (slider) slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        let slider = document.getElementById('slider' );
        if (slider) slider.scrollLeft = slider.scrollLeft + 500;
    };
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const userId = BigInt("0x" + user.id.replace(/-/g, ""));
            const { data, error } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', user.id);
            if (error) {
                throw error;
            }
            setFavorites(data || []);
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    const deletePodcast = async (id) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            // Update state or perform any necessary actions after deletion
            // For example, you can remove the deleted item from the favorites array
            setFavorites(favorites.filter(favorite => favorite.id !== id));
        } catch (error) {
            console.error('Error deleting podcast:', error.message);
        }
    };

    const savePodcast = (episodeId: string, seasonId: string | null) => {
        console.log("Saving Episode:", episodeId);
        console.log("Saving Season:", seasonId);
        // Add logic to save the episode or season to favorites
        // You can make a request to your backend or directly interact with Supabase here
    };

    return (
        <>
            <div>
                <h2 className="text-white font-bold md:text-xl p-4">Saved for Later</h2>


                <div className="relative flex items-center group">
                    <MdChevronLeft
                        onClick={slideLeft}
                        size={40}
                        className="bg-white left-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                    />
                    <div
                        id={'slider' }
                        className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
                    >
                        {podcasts.map((item: any, id: number) => (
                            <div
                                key={id}
                                className='w-[160px] sm:w-[200px] md:w-[240px] lg:w[240px] inline-block cursor-pointer relative p-2'>
                                <img className='w-full h-auto block' src={item?.image} alt={item?.title}/>
                                <div
                                    className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-amber-50'>
                                    <p className='whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>{item?.title}</p>
                                    <p
                                        onClick={() => deletePodcast(item.id)}
                                        className='absolute text-gray-300 top-4 right-4'><AiOutlineClose/></p>


                                </div>

                            </div>
                        ))}
                    </div>
                    <MdChevronRight
                        onClick={slideRight}
                        size={40}
                        className="bg-white right-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                    />
                </div>
            </div>
            <Overlay item={item} showOverlay={true} closeOverlay={() => {}} onSave={savePodcast} />
        </>
    );
}

export default SavedPodcasts;