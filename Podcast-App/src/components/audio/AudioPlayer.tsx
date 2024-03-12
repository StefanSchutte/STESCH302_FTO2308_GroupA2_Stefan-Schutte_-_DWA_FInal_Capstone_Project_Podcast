import React, {useRef} from 'react';
import closeBtnFav from '/close.png'

/**
 * Props interface for the AudioPlayer component.
 * The URL of the audio file to be played.
 * Callback function invoked when the audio player is closed.
 */
interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void;
}

/**
 * Functional component representing an audio player.
 * AudioPlayer is a functional component declared using the React.FC type,
 * which is a generic type that allows specifying the type of props the component will receive.
 * @param {AudioPlayerProps} props - Props for the AudioPlayer component.
 * @returns JSX.Element
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onClose }) => {
    /**
     * Used to create a reference (audioRef) to the <audio> element.
     * This reference will be used to interact with the <audio> element in the component, such as controlling playback or accessing its properties.
     */
    const audioRef = useRef<HTMLAudioElement>(null);

    /**
     * Handles the close button click event.
     * Invokes the onClose callback provided as a prop whenever the close button is clicked.
     */
    const handleClose = () => {
        const confirmPrompt = window.confirm('Are you sure you want to close the Audio Player?');

        if (confirmPrompt) {
            onClose();
        }
    };

    /**
     * <audio> element with controls, using the provided audioUrl.
     * Close button represented by an <img> element, which triggers the handleClose function when clicked.
     */
    return (
        <div
            className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-3xl text-white py-4 px-6 flex items-center justify-between">

            <audio className="w-full" ref={audioRef} controls>
                <source src={audioUrl} type="audio/mpeg"/>
            </audio>

            <button onClick={handleClose}>
                <img src={closeBtnFav} alt='X' className='w-12 h-12 ml-1 cursor-pointer'/>
            </button>

        </div>
    );
};

export default AudioPlayer;