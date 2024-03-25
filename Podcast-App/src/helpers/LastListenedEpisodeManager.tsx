import { useEffect, useState } from 'react';
import { useAudioPlayer } from '../services/AudioPlayerContext.tsx';
import AudioPlayer from '../components/audio/AudioPlayer.tsx';

const LastListenedEpisodeManager: React.FC = () => {
    const { showAudioPlayer, setShowAudioPlayer, audioUrl } = useAudioPlayer();
    const [lastListenedUrl, setLastListenedUrl] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve the last listened show and episode URL from local storage
        const lastListenedUrl = localStorage.getItem('last_listened_url');
        if (lastListenedUrl) {
            // If there's a last listened URL, display the audio player with the last listened episode
            setLastListenedUrl(lastListenedUrl);
            setShowAudioPlayer(true);
        } else {
            // If there's no last listened URL, hide the audio player
            setShowAudioPlayer(false);
        }
    }, []);

    // Close the audio player when there's no URL or when it's manually closed
    const handleClose = () => {
        setLastListenedUrl(null);
        setShowAudioPlayer(false);
    };

    return (
        <>
            {/* Render the AudioPlayer component with the last listened episode URL */}
            {showAudioPlayer && lastListenedUrl &&  (
                <AudioPlayer audioUrl={lastListenedUrl} onClose={handleClose} />
            )}
        </>
    );
};

export default LastListenedEpisodeManager;