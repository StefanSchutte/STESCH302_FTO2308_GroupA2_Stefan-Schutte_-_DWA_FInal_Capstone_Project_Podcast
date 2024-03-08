import React, { createContext, useContext, useEffect, useState } from 'react';
import getShowsFromAPI from './api';

interface Podcast {
    // Define your podcast interface
}

interface ShowsContextType {
    podcasts: Podcast[];
    loading: boolean;
}

const ShowsContext = createContext<ShowsContextType>({ podcasts: [], loading: true });

export const useShows = () => useContext(ShowsContext);

export const ShowsProvider: React.FC = ({ children }) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getShowsFromAPI();
                setPodcasts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <ShowsContext.Provider value={{ podcasts, loading }}>
            {children}
        </ShowsContext.Provider>
    );
};