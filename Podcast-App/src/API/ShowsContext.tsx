import React, { createContext, useContext, useEffect, useState } from 'react';
import getShowsFromAPI from './api';

interface Podcast {
    id: string,
    image: string;
    title: string;
    updated: string;
    description: string;
    genres: string;
    seasons: number;
}

/**
 * Interface representing the context value for the ShowsContext.
 */
interface ShowsContextType {
    podcasts: Podcast[];
    loading: boolean;
}

/** Context for managing podcasts data. */
const ShowsContext = createContext<ShowsContextType>({ podcasts: [], loading: true });

/** Custom hook for accessing the ShowsContext. */
export const useShows = () => useContext(ShowsContext);

/**
 * Provider component for managing podcasts data.
 * @param children - The child components to be wrapped by the provider.
 */
export const ShowsProvider: React.FC = ({ children }) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getShowsFromAPI();

                setPodcasts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }  finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <ShowsContext.Provider value={{ podcasts, loading }}>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-blue-500 text-5xl">Loading...</div>
                </div>
            ) : (
                children // Render children when data fetching is complete
            )}
        </ShowsContext.Provider>
    );
};