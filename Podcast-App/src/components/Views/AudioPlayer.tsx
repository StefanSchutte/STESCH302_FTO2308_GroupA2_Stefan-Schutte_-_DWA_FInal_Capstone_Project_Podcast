import React, {useRef} from 'react';
import closeBtnFav from '/close.png'

interface AudioPlayerProps {
    audioUrl: string;
    onClose: () => void; // Function to handle closing the player
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    //const closePlayer = () => {
    //     if (audioRef.current) {
    //         audioRef.current.pause();
    //         setIsPlaying(false);
    //     }
    // };

    const handleClose = () => {
        onClose();
    };


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