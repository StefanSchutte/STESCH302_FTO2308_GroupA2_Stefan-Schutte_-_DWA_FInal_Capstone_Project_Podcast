import React, { useState } from 'react';
import AudioPlayer from "./AudioPlayer.tsx";
import playFav from '/play-button.png'

interface PlayButtonProps {
    audioUrl: string;
    showId: string;
    episodeId: string;
}

/**.
 * State variable showAudioPlayer initialized with useState.
 * This state tracks whether the audio player should be shown or not.
 * The component renders a button with an image of a play button (playFav). When clicked, it triggers the handlePlayButtonClick function.
 * If showAudioPlayer is true, it renders the AudioPlayer component passing the audioUrl prop and a function to close the player (onClose).
 * @param audioUrl
 * @param showId
 * @param episodeId
 * @constructor
 */
const PlayButton: React.FC<PlayButtonProps> = ({ audioUrl, showId, episodeId }) => {
    const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);

    /**
     * Called when the play button is clicked.
     * It updates the showAudioPlayer state to true and stores the last listened show and episode in the local storage.
     */
    const handlePlayButtonClick = () => {

        // Store the last listened show and episode in local storage
        localStorage.setItem('lastListenedShow', showId);
        localStorage.setItem('lastListenedEpisode', episodeId);
        setShowAudioPlayer(true);
    };

    /**
     * Called when the audio player is closed. It updates the showAudioPlayer state to false.
     */
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