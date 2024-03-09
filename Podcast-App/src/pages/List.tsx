import React, { useState } from 'react';
import { useShows} from "../API/ShowsContext.tsx";

interface ListProps {
    seasons: number;
    podcastData: any; // Adjust type as per your data structure
}

const List: React.FC<ListProps> = ({ seasons, podcastData }) => {
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    const handleSeasonSelect = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    // Filter episodes based on the selected season
    const filteredEpisodes = selectedSeason ? podcastData.seasons[selectedSeason - 1]?.episodes : [];

    return (
        <div>
            {/* Season selection dropdown */}
            <select
                value={selectedSeason || ''}
                onChange={(e) => handleSeasonSelect(parseInt(e.target.value))}
            >
                <option value="">Choose Season</option>
                {Array.from({length: seasons}, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        Season {i + 1}
                    </option>
                ))}
            </select>

            {/* List of episodes for the selected season */}
            <div>
                {filteredEpisodes.map((episode: any, index: number) => (
                    <div key={index}>
                        {/* Render episode details */}
                        <p>{episode.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;