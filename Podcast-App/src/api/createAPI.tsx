import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function RenderAPI() {
    const [previewData, setPreviewData] = useState([]);
    const [selectedShowData, setSelectedShowData] = useState(null);
    const [error, setError] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);
    const [selectedEpisode, setSelectedEpisode] = useState(null); // New state for selected episode

    useEffect(() => {
        // Fetch PREVIEW objects
        fetch('https://podcast-api.netlify.app/shows')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPreviewData(data);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    const handleCardClick = async (showId) => {
        try {
            const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSelectedShowData(data);
            // Assuming data contains episodes, select the first episode by default
            if (data.episodes && data.episodes.length > 0) {
                setSelectedEpisode(data.episodes[0]);
            }
        } catch (error) {
            setError(error);
        }
    };

    const toggleDescription = (id) => {
        setExpandedItem(expandedItem === id ? null : id);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {previewData.map(preview => (
                <Card key={preview.id} style={{ margin: '10px', minWidth: '150px', maxWidth: '300px' }} onClick={() => handleCardClick(preview.id)}>
                    <img src={preview.image} alt={preview.title} style={{ width: '100%', height: 'auto' }} />
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {preview.title}
                        </Typography>
                        <Typography color="textSecondary">
                            ID: {preview.id}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {expandedItem === preview.id || preview.description.length <= 150
                                ? preview.description
                                : `${preview.description.slice(0, 150)}...`}
                        </Typography>
                        {preview.description.length > 150 && (
                            <button onClick={() => toggleDescription(preview.id)}>
                                {expandedItem === preview.id ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </CardContent>
                </Card>
            ))}
            {selectedShowData && (
                <Card style={{ margin: '10px', minWidth: '150px', maxWidth: '300px' }}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {selectedShowData.title}
                        </Typography>
                        <Typography color="textSecondary">
                            ID: {selectedShowData.id}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {selectedShowData.description}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default RenderAPI;