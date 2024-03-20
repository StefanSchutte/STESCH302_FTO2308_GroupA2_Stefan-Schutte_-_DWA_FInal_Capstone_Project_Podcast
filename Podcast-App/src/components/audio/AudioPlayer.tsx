import React, {useEffect, useRef, useState} from 'react';
import closeBtnFav from '/close.png';
import { markEpisodeCompleted } from "../userSettings/userSettings.ts";
import { useAudioPlayer } from "./AudioPlayerContext.tsx";

/**
 * Props interface for the AudioPlayer component.
 * The URL of the audio file to be played.
 * Callback function invoked when the audio player is closed.
 */
interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void;
    userId: string;
    episodeId: string;
    episodeProgress: number | null;
}

/**
 * Functional component representing an audio player.
 * AudioPlayer is a functional component declared using the React.FC type,
 * which is a generic type that allows specifying the type of props the component will receive.
 * @param {AudioPlayerProps} props - Props for the AudioPlayer component.
 * @returns JSX.Element
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onClose, userId, episodeProgress }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);


    //episode progress
    useEffect(() => {
        if (audioRef.current && typeof episodeProgress === 'number' && isFinite(episodeProgress)) {
            // Set the current playback position of the audio element to the episode progress
            audioRef.current.currentTime = episodeProgress;
        }
    }, [episodeProgress]);
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
        try {
            await markEpisodeCompleted(userId);
            console.log('Episode marked as completed.');
        } catch (error) {
            console.error('Error marking episode as completed:', error);
        }
    };

    const handleAudioEnded = () => {
        console.log('Audio playback ended.');
        handleEpisodeCompletion();
    };

    /**
     * <audio> element with controls, using the provided audioUrl.
     * Close button represented by an <img> element, which triggers the handleClose function when clicked.
     */
    return (
        <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-3xl text-white py-4 px-6 flex items-center justify-between">
            <audio
                className="w-full"
                ref={audioRef}
                controls
                onEnded={handleAudioEnded} onTimeUpdate={() => setProgress(audioRef.current ? audioRef.current.currentTime : 0)}>
                <source src={audioUrl} type="audio/mpeg"/>
            </audio>
            <button onClick={handleClose}>
                <img src={closeBtnFav} alt='X' className='w-12 h-12 ml-1 cursor-pointer'/>
            </button>
        </div>
    );
};

export default AudioPlayer;