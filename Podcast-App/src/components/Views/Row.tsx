import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import Podcast from './Podcast';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import {useShows} from "../../API/ShowsContext.tsx";

interface RowProps {
    /** The title of the row. */
    title: string;
    /** The URL to fetch data for the row. */
    fetchURL: string;
    /** The unique identifier for the row. */
    rowId: string;
    /** Function to open an overlay for a podcast. */
    openOverlay: () => void;
}

/**
 * Row component to display a horizontal row of podcasts.
 * @param {RowProps} props - Props for the Row component.
 * @returns {JSX.Element} Row component.
 */
const Row: React.FC<RowProps> = ({ title, fetchURL, rowId, openOverlay }) => {

    //const [podcasts, setPodcasts] = useState<any[]>([]);
    const { podcasts } = useShows();

    // useEffect(() => {
    //     axios.get(fetchURL)
    //         .then((response) => {
    //             setPodcasts(response.data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, [fetchURL]);

    /**
     * Handles sliding the row to the left.
     */
    const slideLeft = () => {
        let slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft - 500;
    };

    /**
     * Handles sliding the row to the right.
     */
    const slideRight = () => {
        let slider = document.getElementById('slider' + rowId);
        if (slider) slider.scrollLeft = slider.scrollLeft + 500;
    };

    return (
        <div>
            <h2 className="text-white font-bold md:text-xl p-4">{title}</h2>
            <div className="relative flex items-center group ">
                <MdChevronLeft
                    onClick={slideLeft}
                    size={60}
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
                    size={60}
                    className="bg-white right-0 rounded absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block"
                />
            </div>
        </div>
    );
};

export default Row;