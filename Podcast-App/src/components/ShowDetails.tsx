import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function ShowDetails() {
    const { showId } = useParams(); // Assuming you're passing the show ID as a parameter in the URL
    const [showData, setShowData] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch SHOW object for the selected show ID
        fetch(`https://podcast-api.netlify.app/id/${showId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setShowData(data);
                setEpisodes(data.episodes); // Assuming the episodes are available directly under the 'episodes' property
            })
            .catch(error => {
                setError(error);
            });
    }, [showId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!showData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{showData.title}</h2>
            <Typography variant="body1">{showData.description}</Typography>
            <h3>Episodes</h3>
            <div>
                {episodes.map(episode => (
                    <Card key={episode.id}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {episode.title}
                            </Typography>
                            <Typography color="textSecondary">
                                {episode.date} {/* Assuming 'date' is a property in each episode */}
                            </Typography>
                            <audio controls>
                                <source src={episode.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ShowDetails;