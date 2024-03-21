import {createContext, ReactNode, useContext, useState} from 'react';

interface AudioPlayerProviderProps {
    children: ReactNode;
}

// Create the context
const AudioPlayerContext = createContext<any>(null);

// Custom hook to use the context
export const useAudioPlayer = () => useContext(AudioPlayerContext);

// Context provider component
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');

    // Function to toggle the audio player visibility
    const toggleAudioPlayer = () => {
        setShowAudioPlayer((prev) => !prev);
    };

    return (
        <AudioPlayerContext.Provider value={{ showAudioPlayer, setShowAudioPlayer, toggleAudioPlayer, audioUrl, setAudioUrl }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};