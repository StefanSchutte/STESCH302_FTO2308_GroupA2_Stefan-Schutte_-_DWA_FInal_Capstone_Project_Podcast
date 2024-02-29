import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function MediaPlayer({ selectedEpisode, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (selectedEpisode) {
            playEpisode(selectedEpisode.audioUrl);
        }
    }, [selectedEpisode]);

    const playEpisode = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
        setIsPlaying(true);
    };

    const pauseEpisode = () => {
        setIsPlaying(false);
    };

    return (
        <Drawer
            anchor="right"
            open={!!selectedEpisode}
            onClose={onClose}
            style={{ width: '20vw' }} // Adjust the width here
        >
            <div style={{ padding: '16px' }}>
                {selectedEpisode && (
                    <div>
                        <Typography variant="h5">{selectedEpisode.title}</Typography>
                        <Typography variant="body1">{selectedEpisode.description}</Typography>
                        <Button onClick={isPlaying ? pauseEpisode : () => playEpisode(selectedEpisode.audioUrl)}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                    </div>
                )}
            </div>
        </Drawer>
    );
}

export default MediaPlayer;

