import React, {useState} from 'react';
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {useAuth} from "../../context/AuthContext.tsx";
import supabase from "../../supabase.ts";
//import Overlay from "./Overlay.tsx";

interface PodcastProps {
    item: {
        image: string;
        title: string;
        // Add any other properties of the item object here
    };
    openOverlay: (podcast: any) => void;
}

const Podcast: React.FC<PodcastProps> = ({item, openOverlay}) => {

    const [like, setLike] = useState(false)


     const [saved, setSaved] = useState(false)
     const { user } = useAuth();

    const savePodcast = async () => {
        if (user?.email) {
            setLike(!like);
            setSaved(true);

            const updatedPodcasts = [...(user.savedPodcasts || []), item];

            const { data, error } = await supabase
                .from('users')
                .update({ savedPodcasts: updatedPodcasts })
                .match({ email: user.email });
            if (error) {
                console.error('Error saving podcast:', error.message);
            } else {
                console.log('Podcast saved successfully:', data);
            }
        } else {
            alert('Log In to save a podcast');
        }
    };

    const [showOverlay, setShowOverlay] = useState(false);
    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };



    const handleClick = () => {
        // When the podcast is clicked, call the openOverlay function with the podcast data
        openOverlay(item);
    };
    // const podcastID = doc(db, 'users', `${user?.email}`)
    //
    // const savePodcast = async() => {
    //     if(user?.email) {
    //         setLike(!like)
    //         setSaved(true)
    //         await updateDoc(podcastID, {
    //             savedPodcasts: arrayUnion({
    //                 id: item.id,
    //                 title: item.title,
    //                 image: item.image,
    //             })
    //         })
    //     } else {
    //         alert('Log In to save a podcast')
    //     }
    // }


    return (
        <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w[240px] inline-block cursor-pointer relative p-2'>
            <img className='w-full h-auto block' src={item?.image} alt={item?.title}/>
            <div
                className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-amber-50'>
                <p className='whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>{item?.title}</p>


                <p onClick={savePodcast}>
                    {like ? <FaHeart className='absolute top-4 left-4 text-gray-300 '/> :
                        <FaRegHeart className='absolute top-4 left-4 text-gray-300 '/>}
                </p>

                <button onClick={handleClick}
                        className="absolute bottom-4 left-4 border bg-green-500 text-amber-50 border-gray-300 py-2 px-5">
                    See More!
                </button>

            </div>

        </div>
    )
        ;
}

export default Podcast;