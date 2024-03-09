import { useEffect, useState } from 'react';
import playButtonDub from '/play-button.png';
import { useShows } from '../../API/ShowsContext.tsx';
import Overlay from "../Views/Overlay.tsx";
import Genres from "../../helpers/Genres.tsx";

interface Podcast {
    title: string;
    image: string;
    updated: string;
    description: string;
    id: string;
    genres: string[];
}

/**
 * Functional component representing the hero section of the application.
 */
function Hero(): JSX.Element {

    const [podcast, setPodcast] = useState<Podcast | undefined>();
    const { podcasts } = useShows(); // Use the useShows hook to access the fetched data
    const [showOverlay, setShowOverlay] = useState<boolean>(false);

    useEffect(() => {
        const changeHero = () => {
            if (podcasts.length > 0) {
                const randomPodcast = podcasts[Math.floor(Math.random() * podcasts.length)];
                setPodcast(randomPodcast);
            }
        }
        // Call changeHero initially and then every 2 minutes
        changeHero();
        const interval = setInterval(changeHero,60 * 1000);

        // Cleanup function to clear the interval when the component unmounts or the podcasts change
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
     */
    const handlePlayButtonClick = () => {
        setShowOverlay(true);
    };

    /**
     * Function to close the overlay.
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
                        <button className="py-2 px-5"><img src={playButtonDub} alt='Play' onClick={handlePlayButtonClick}/></button>
                    </div>
                    <span className="text-gray-300 text-sm"><Genres genres={podcast?.genres || []} /></span>
                    <p className="w-full md:max-w-[60%] lg:max-w-[70%] xl:max-w-[80%] text-yellow-400 mt-4">
                        {truncateString(podcast?.description || '', 300)}
                    </p>
                </div>
            </div>
            {showOverlay && <Overlay item={podcast} showOverlay={showOverlay} closeOverlay={closeOverlay} />}
        </div>
    );
}

export default Hero;