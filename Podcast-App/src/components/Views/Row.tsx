// import React, {useEffect, useState} from 'react';
// import axios from "axios";
// //import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import Podcast from "./Podcast.tsx";
// import {MdChevronLeft, MdChevronRight} from 'react-icons/md'
//
// const Row = ({title, fetchURL, rowId}) => {
//
//     const [podcasts, setPodcasts] = useState([])
//
//
//     useEffect(()=>{
//         axios.get(fetchURL).then((response) => {
//             setPodcasts(response.data) //results?
//         })
//     },[fetchURL])
//
//     const slideLeft = () => {
//         let slider = document.getElementById('slider' + rowId)
//         slider.scrollLeft = slider.scrollLeft - 500;
//     }
//
//     const slideRight = () => {
//         let slider = document.getElementById('slider' + rowId)
//         slider.scrollLeft = slider.scrollLeft + 500;
//     }
//
//     return (
//         <div>
//             <h2 className='text-white font-bold md:text-xl p-4'>{title}</h2>
//             <div className='relative flex items-center group'>
//
//                 <MdChevronLeft
//                     onClick={slideLeft}
//                     size={40}
//                     className='bg-white left-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'/>
//                 <div id={'slider' + rowId} className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'>
//                     {podcasts.map((item, id) => (
//                         <Podcast key={id} item={item}/>
//                     ))}
//                 </div>
//                 <MdChevronRight
//                     onClick={slideRight}
//                     size={40}
//                     className='bg-white right-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'/>
//             </div>
//         </div>
//     );
// }
//
// export default Row;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Podcast from './Podcast'; // Assuming Podcast component is also a TypeScript file
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

interface RowProps {
    title: string;
    fetchURL: string;
    rowId: string;
}

const Row: React.FC<RowProps> = ({ title, fetchURL, rowId, openOverlay }) => {
    const [podcasts, setPodcasts] = useState([]);

    // useEffect(() => {
    //     axios.get(fetchURL).then((response) => {
    //         setPodcasts(response.data);
    //     });
    // }, [fetchURL]);

    useEffect(() => {
        axios.get(fetchURL)
            .then((response) => {
                setPodcasts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [fetchURL]);

    const slideLeft = () => {
        let slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft - 500;
    };

    const slideRight = () => {
        let slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft + 500;
    };

    return (
        <div>
            <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
            <div className="relative flex items-center group">
                <MdChevronLeft
                    onClick={slideLeft}
                    size={40}
                    className="bg-white left-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                />
                <div
                    id={'slider' + rowId}
                    className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
                >
                    {podcasts.map((item: any, id: number) => (
                        <Podcast key={id} item={item} openOverlay={openOverlay}/>
                    ))}
                </div>
                <MdChevronRight
                    onClick={slideRight}
                    size={40}
                    className="bg-white right-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                />
            </div>
        </div>
    );
};

export default Row;