import React, {useEffect, useState} from 'react';
import axios from "axios";
//import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Podcast from "./Podcast.tsx";
import {MdChevronLeft, MdChevronRight} from 'react-icons/md'

const Row = ({title, fetchURL, rowId}) => {

    const [podcasts, setPodcasts] = useState([])


    useEffect(()=>{
        axios.get(fetchURL).then((response) => {
            setPodcasts(response.data) //results?
        })
    },[fetchURL])

    const slideLeft = () => {
        let slider = document.getElementById('slider' + rowId)
        slider.scrollLeft = slider.scrollLeft - 500;
    }

    const slideRight = () => {
        let slider = document.getElementById('slider' + rowId)
        slider.scrollLeft = slider.scrollLeft + 500;
    }

    return (
        <div>
            <h2 className='text-white fonr-bold md:text-xl p4'>{title}</h2>
            <div className='relative flex items-center group'>

                <MdChevronLeft
                    onClick={slideLeft}
                    size={40}
                    className='bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'/>
                <div id={'slider' + rowId} className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'>
                    {podcasts.map((item, id) => (
                        <Podcast key={id} item={item}/>
                    ))}
                </div>
                <MdChevronRight
                    onClick={slideRight}
                    size={40}
                    className='bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'/>
            </div>
        </div>
    );
}

export default Row;