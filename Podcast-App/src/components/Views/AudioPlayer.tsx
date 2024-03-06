import React, {useRef, u} from 'react';

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    //const closePlayer = () => {
    //     if (audioRef.current) {
    //         audioRef.current.pause();
    //         setIsPlaying(false);
    //     }
    // };


    return (
        <div className="fixed bottom-0 left-0 w-full  text-white py-4 px-6 flex items-center justify-between">

            <audio className="w-full" ref={audioRef} controls>
                <source src={audioUrl} type="audio/mpeg"/>
            </audio>

        </div>
    );
};

export default AudioPlayer;