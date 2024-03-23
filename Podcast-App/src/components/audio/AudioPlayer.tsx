import React, {useEffect, useRef, useState} from 'react';
import closeBtnFav from '/close.png';
import completedFav from'/checklist.png'
import incompletedFav from '/incomplete.png'
import removeFav from "/remove.png";

//ons pass nou van PlayButton data na hierdie AudioPlayer
interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void;
    userId: string;
    episodeId: number;
    showId: number;
    seasonId: number;
    episodeProgress: number | null;
}

/**
 * Functional component representing an audio player.
 * AudioPlayer is a functional component declared using the React.FC type,
 * which is a generic type that allows specifying the type of props the component will receive.
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onClose, episodeProgress, episodeId, seasonId, showId, userId}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [isEpisodeCompleted, setIsEpisodeCompleted] = useState(false);

    useEffect(() => {
        if (audioRef.current && typeof episodeProgress === 'number' && isFinite(episodeProgress)) {
            // Set the current playback position of the audio element to the episode progress
            audioRef.current.currentTime = episodeProgress;
        }
    }, [episodeProgress]);

    useEffect(() => {

        const storedProgress = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_progress`);
        if (storedProgress) {
            const parsedProgress = parseFloat(storedProgress);
            setProgress(parsedProgress);
            if (audioRef.current) {
                audioRef.current.currentTime = parsedProgress;
            }
        }

        //Todo EpisodeId is null hier
        const storedCompletionStatus = localStorage.getItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_completed`);
        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        }
    }, [episodeId, seasonId, showId, userId]);

    const markEpisodeCompleted = () => {
        setIsEpisodeCompleted(true);
        localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_completed`, 'true');
    };

    /**
     * Used to create a reference (audioRef) to the <audio> element.
     * This reference will be used to interact with the <audio> element in the component, such as controlling playback or accessing its properties.
     */
    const handleClose = () => {
        const confirmPrompt = window.confirm('Are you sure you want to close the Audio Player?');
        if (confirmPrompt) {
            onClose();
        }
    };

    /**
     * Handles the close button click event.
     * Invokes the onClose callback provided as a prop whenever the close button is clicked.
     */
    const handleEpisodeCompletion = async () => {

        setIsEpisodeCompleted(true);
        localStorage.setItem(`episode_${episodeId}_completed`, 'true');
    };

    const handleAudioEnded = () => {
        console.log('Audio playback ended.');
        handleEpisodeCompletion();
        markEpisodeCompleted();
    };

    useEffect(() => {
        const storedCompletionStatus = localStorage.getItem(`episode_${episodeId}_completed`);
        if (storedCompletionStatus === 'true') {
            setIsEpisodeCompleted(true);
        }
    }, []); // This effect runs only once when the component mounts

    const handleClearLocalStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleProgressUpdate = () => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            setProgress(currentTime);
            localStorage.setItem(`${userId}-${showId}_season_${seasonId}_episode_${episodeId}_progress`, currentTime.toString());
        }
    };


    // Function to store the last listened show and episode in localStorage
    const storeLastListenedEpisode = (showId, episodeId) => {
        localStorage.setItem('last_listened_show', showId.toString());
        localStorage.setItem('last_listened_episode', episodeId.toString());
    };

// Function to retrieve the last listened show and episode from localStorage
    const getLastListenedEpisode = () => {
        const lastListenedShowId = localStorage.getItem('last_listened_show');
        const lastListenedEpisodeId = localStorage.getItem('last_listened_episode');
        return {
            showId: lastListenedShowId ? parseInt(lastListenedShowId) : null,
            episodeId: lastListenedEpisodeId ? parseInt(lastListenedEpisodeId) : null
        };
    };


    /**
     * <audio> element with controls, using the provided audioUrl.
     * Close button represented by an <img> element, which triggers the handleClose function when clicked.
     */
    return (
        <div className=''>

            <div
                className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-3xl text-white py-4 px-6 flex items-center justify-between">
                <audio
                    className="w-full"
                    ref={audioRef}
                    controls
                    onEnded={handleAudioEnded}
                    // onTimeUpdate={() => setProgress(audioRef.current ? audioRef.current.currentTime : 0)}
                    onTimeUpdate={handleProgressUpdate}
                >
                    <source src={audioUrl} type="audio/mpeg"/>
                </audio>
                <button onClick={handleClearLocalStorage}>
                    <img src={removeFav} alt='Clear Local Storage' title='Clear Local Storage' className='w-10 h-10 m-3'/>
                </button>
                <div>
                    {isEpisodeCompleted ?
                        <p><img src={completedFav} alt='Completed' title='Completed' className='w-10 h-10 m-3'/></p>
                        : <p><img src={incompletedFav} alt='Not Completed' title='Not Completed'
                                  className='w-10 h-10 m-3'/></p>}
                </div>
                <button onClick={handleClose}>
                    <img src={closeBtnFav} alt='Close' title='Close' className='w-12 h-12 m-3 cursor-pointer'/>
                </button>
            </div>

        </div>
    );
};

export default AudioPlayer;