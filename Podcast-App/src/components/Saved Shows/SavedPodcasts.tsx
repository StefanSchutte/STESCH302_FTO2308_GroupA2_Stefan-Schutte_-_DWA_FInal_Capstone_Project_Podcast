import React, {useStae, useEffect, useState} from 'react';
import {MdChevronLeft, MdChevronRight} from "react-icons/md";
import {useAuth} from "../../context/AuthContext.tsx";
import { AiOutlineClose } from 'react-icons/ai'

//import {updateDoc, doc, onSnapshot} from '@supabase/supabase-js'
function SavedPodcasts() {
    const [podcasts, setPodcasts] = useState([])
    const {user} = useAuth()

    const slideLeft = () => {
        let slider = document.getElementById('slider' );
        if (slider) slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        let slider = document.getElementById('slider' );
        if (slider) slider.scrollLeft = slider.scrollLeft + 500;
    };

    //firebase logic

    // useEffect(() => {
    //     onSnapshot(doc(db, 'users', `${user?.email}`, (doc)=> {
    //         setPodcasts(doc.data()?.savedPodcasts)
    //     } ))
    // }, [user?.email])

    // const podcastRef = doc(db, 'users', `${user?.email}`)
    // const deleteShow = async (passedID) => {
    //     try {
    //         const result = podcast.filter((item) => item.id !== passedID)
    //         await updateDoc(movieRef, {
    //             savedPodcasts: result,
    //         })
    //     }catch (error) {
    //         console.log(error)
    //     }
    // }

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

        </>
    );
}

export default SavedPodcasts;