import React, { useState } from 'react';
import AudioPlayer from "../components/Views/AudioPlayer.tsx";
import playFav from '/play-button.png'

interface PlayButtonProps {
    audioUrl: string;
    showId: string; // Add the showId prop
    episodeId: string; // Add the episodeId prop
}

const PlayButton: React.FC<PlayButtonProps> = ({ audioUrl, showId, episodeId }) => {
    const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);

    const handlePlayButtonClick = () => {

        // Store the last listened show and episode in local storage
        localStorage.setItem('lastListenedShow', showId);
        localStorage.setItem('lastListenedEpisode', episodeId);
        setShowAudioPlayer(true);
    };

    const handleClosePlayer = () => {
        setShowAudioPlayer(false);
    };



    return (
        <>
            <button
                className="py-2 px-5 absolute top-2 right-16 w-15 h-15"
                onClick={handlePlayButtonClick}
            >
                <img src={playFav} alt='Play'/>
            </button>
            {showAudioPlayer && (
                <AudioPlayer audioUrl={audioUrl} onClose={handleClosePlayer}/>
            )}
        </>
    );
};

export default PlayButton;