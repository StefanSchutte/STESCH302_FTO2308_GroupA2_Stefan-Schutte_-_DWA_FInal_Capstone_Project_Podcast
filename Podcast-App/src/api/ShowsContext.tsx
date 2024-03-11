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
 * Interface representing the auth value for the ShowsContext.
 */
interface ShowsContextType {
    podcasts: Podcast[];
    loading: boolean;
    selectedSeason: number | null;
    selectSeason: (seasonNumber: number) => void;
}

/**
 * Context for managing podcasts data.
 * creates a auth named ShowsContext using createContext.
 * The initial auth value includes an empty array for podcasts, loading set to true, selectedSeason set to null, and a dummy selectSeason function.
 */
const ShowsContext = createContext<ShowsContextType>({ podcasts: [], loading: true, selectedSeason: null,
    selectSeason: () => {}, });

/**
 * Custom hook for accessing the ShowsContext.
 * Created to conveniently access the ShowsContext within functional components using useContext.
 */
export const useShows = () => useContext(ShowsContext);

/**
 * Provider component for managing podcasts data.
 * Serves as the provider for the ShowsContext.
 * Sets up state variables using useState hook: podcasts to store fetched podcast data, loading to track whether data is being fetched,
 * and selectedSeason to track the currently selected season.
 * @param children - The child components to be wrapped by the provider.
 */
export const ShowsProvider: React.FC = ({ children }) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    /**
     * Fetching data from the api when the component mounts (empty dependency array [] ensures it runs only once).
     * FetchData is defined, fetches data from the api using getShowsFromAPI function.
     */
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

    /**
     * Updates the selectedSeason state with the passed seasonNumber.
     * @param seasonNumber
     */
    const selectSeason = (seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    };

    return (
        <ShowsContext.Provider value={{ podcasts, loading, selectedSeason, selectSeason }}>
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