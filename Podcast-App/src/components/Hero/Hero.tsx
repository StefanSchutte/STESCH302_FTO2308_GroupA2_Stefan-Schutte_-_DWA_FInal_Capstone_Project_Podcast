import { useEffect, useState } from 'react';
import playButtonDub from '/play-button.png';
import { useShows } from '../../services/ShowsContext.tsx';
import PodcastInfo from "../Views/PodcastInfo.tsx";
import Genres from "../../helpers/Genres.tsx";
import {Podcast} from "../../types.ts";

/**
 * Functional component representing the hero section of the application.
 * Sets up state variables using the useState hook:
 * 'podcast' state to hold the currently displayed podcast.
 * 'showOverlay' state to manage whether the overlay is visible or not.
 */
function Hero(): JSX.Element {

    const [podcast, setPodcast] = useState<Podcast | undefined>(undefined);
    const { podcasts } = useShows(); // Use the useShows hook to access the fetched data
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    /**
     * Effect runs when the component mounts ([] dependency array), and whenever the podcasts state changes.
     * Selects a random podcast from the fetched podcasts and updates the podcast state.
     * Interval is set up to change the displayed podcast.
     * Cleanup function to clear the interval when the component unmounts or the podcasts change.
     */
    useEffect(() => {
        const changeHero = () => {
            if (podcasts.length > 0) {
                const randomPodcast = podcasts[Math.floor(Math.random() * podcasts.length)];
                setPodcast(randomPodcast);
            }
        }
        changeHero();
        const interval = setInterval(changeHero,60 * 1000);
        return () => clearInterval(interval);
    }, [podcasts]);

    /**
     * Truncate a string to a specified length.
     * @param str - The string to truncate.
     * @param num - The maximum length of the truncated string.
     * @returns The truncated string.
     */
    const truncateString = (str: string, num: number): string => {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    };

    /**
     * Function to handle the click event on the play button.
     * Sets the showOverlay state to true.
     */
    const handlePlayButtonClick = () => {
        setShowOverlay(true);
    };

    /**
     * Function to close the overlay.
     * Set the showOverlay state to false.
     */
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (

        <div className="flex">
            {/*<Menu/> */}
            <div className="w-full h-[600px] relative">
                <div className="absolute w-full h-[600px] bg-gradient-to-r from-black"></div>
                <img className="w-full h-full object-cover" src={podcast?.image} alt={podcast?.title}/>

                <div className="absolute w-full top-[20%] p-4 md:p-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-yellow-400">{podcast?.title}</h1>

                    <div className="my-4">
                        <button className="py-2 px-5"><img src={playButtonDub} alt='Play' title='Listen' onClick={handlePlayButtonClick}/></button>
                    </div>
                    <span className="text-gray-300 text-sm"><Genres genres={(podcast?.genres || []) as string[]} /></span>
                    <p className="w-full md:max-w-[60%] lg:max-w-[70%] xl:max-w-[80%] text-yellow-400 mt-4">
                        {truncateString(podcast?.description || '', 300)}
                    </p>
                </div>
            </div>
            {showOverlay && podcast && <PodcastInfo item={podcast} showOverlay={showOverlay} closeOverlay={closeOverlay} />}
        </div>
    );
}

export default Hero;