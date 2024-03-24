import React from 'react';
import AudioPlayer from "./AudioPlayer.tsx";
import playFav from '/play-button.png'
import { useAudioPlayer } from "./AudioPlayerContext.tsx";

interface PlayButtonProps {
    audioUrl: string;
    showId: string;
    episodeId: number;
    seasonId: any;
}

/**.
 * State variable showAudioPlayer initialized with useState.
 * This state tracks whether the audio player should be shown or not.
 * The component renders a button with an image of a play button (playFav). When clicked, it triggers the handlePlayButtonClick function.
 * If showAudioPlayer is true, it renders the AudioPlayer component passing the audioUrl prop and a function to close the player (onClose).
 */
const PlayButton: React.FC<PlayButtonProps> = ({
               audioUrl,
               showId,
               episodeId,
               seasonId,
               userId,
               episodeProgress,
               selectedSeason,
               selectedEpisode,
               podcastData
    }) => {

    const { showAudioPlayer, setShowAudioPlayer, setAudioUrl } = useAudioPlayer()

    /**
     * Called when the play button is clicked.
     * It updates the showAudioPlayer state to true and stores the last listened show and episode in the local storage.
     */
    const handlePlayButtonClick = () => {
        //die is waty  ek print om te sien watse data on nou in hierdietempalte ding het
        console.log(episodeId, showId, seasonId)
        setShowAudioPlayer(true);
        setAudioUrl(audioUrl);
    };

    return (
        <>
            <button
                className="py-2 px-5 absolute top-2 right-16 w-15 h-15"
                onClick={handlePlayButtonClick}
                title='Play'
            >
                <img src={playFav} alt='Play'/>
            </button>
            {showAudioPlayer && (
                // hier pass ons nou data wat on indie template ontvang het, af na AudioPlayer
                <AudioPlayer
                    audioUrl={audioUrl}
                    onClose={() => setShowAudioPlayer(false)}
                    userId={userId}
                    episodeProgress={episodeProgress}
                    episodeId={episodeId}
                    showId={showId}
                    seasonId={seasonId.selectedSeason}
                />
            )}
        </>
    );
};

export default PlayButton;
