import React, {useRef} from 'react';
import closeBtnFav from '/close.png'
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    //const closePlayer = () => {
    //     if (audioRef.current) {
    //         audioRef.current.pause();
    //         setIsPlaying(false);
    //     }
    // };

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        onClose(); // Call the onClose function prop to close the player
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-50 rounded-3xl text-white py-4 px-6 flex items-center justify-between">

            <audio className="w-full" ref={audioRef} controls>
                <source src={audioUrl} type="audio/mpeg"/>
            </audio>

            <img src={closeBtnFav} alt='X' className='w-12 h-12 ml-1 cursor-pointer' onClick={closePlayer}/>

        </div>
    );
};

export default AudioPlayer;