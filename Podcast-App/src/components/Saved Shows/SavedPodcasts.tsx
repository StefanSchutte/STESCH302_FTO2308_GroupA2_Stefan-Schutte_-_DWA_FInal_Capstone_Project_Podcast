import { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext.tsx";
import { AiOutlineClose } from 'react-icons/ai';
import supabase from "../../supabase.ts";
import Overlay from "../Views/Overlay.tsx";

interface Podcast {
    id: string;
    image: string;
    title: string;
}

/**
 * Functional component representing the saved podcasts section.
 * Sets up a state variable favorites using the useState hook to manage the list of saved podcasts.
 * Retrieves the user object from the useAuth hook, which provides information about the authenticated user.
 *
 * @returns JSX.Element
 */
function SavedPodcasts(): JSX.Element {
    const [favorites, setFavorites] = useState<Podcast[]>([]);
    const { user } = useAuth();

    /**
     * Fetch the user's favorite podcasts from the database whenever the user object changes.
     * This ensures that the component updates its state when the user logs in or out.
     */
    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    /**
     * Fetches the user's favorite podcasts from the database.
     * Retrieves the user's favorite podcasts from the database using supabase.
     */
    const fetchFavorites = async () => {
        try {
            if (user) {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('user_id', user.id);
                if (error) {
                    throw error;
                }
                setFavorites(data || []);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    /**
     * Deletes a podcast from the user's favorites.
     * Deletes podcast by calling the appropriate Supabase query.
     * @param id - The ID of the podcast to be deleted.
     */
    const deletePodcast = async (id: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', id);
            if (error) {
                throw error;
            }
            setFavorites(favorites.filter(favorite => favorite.id !== id));
        } catch (error) {
            console.error('Error deleting podcast:', error.message);
        }
    };

    /**
     * Saves a podcast episode to the user's favorites.
     * @param episodeId - The ID of the podcast episode.
     * @param seasonId - The ID of the podcast season.
     * @param podcastData - Data of the podcast episode to be saved.
     */
    const savePodcast = async (episodeId: string, seasonId: string | null, podcastData: any) => {
        try {
            // save logic here, such as making an API call or interacting with Supabase

            const { data, error } = await supabase
                .from('podcasts')
                .insert(podcastData);
            if (error) {
                throw error;
            }
            console.log('Podcast saved successfully:', data);

// After successfully saving the podcast, fetch the updated favorites
            fetchFavorites();
            console.log("Saving Episode:", episodeId);
            console.log("Saving Season:", seasonId);
        } catch (error) {
            console.error('Error saving episode:', error.message);
        }
    };

    /**
     * Renders a section titled "Saved for Later" and maps through the favorites array to display each saved podcast item.
     * Each podcast item is displayed with its image and title.
     * It provides a delete button for each podcast item, allowing users to remove it from their favorites.
     * The Overlay component is used to provide additional functionality for each podcast item, such as saving the episode.
     */
    return (
        <>
            <div>
                <h2 className="text-white font-bold md:text-xl p-4">Saved for Later</h2>
                {/* Render each saved podcast item */}
                {favorites.map((podcastItem, index) => (
                    <div key={index} className='w-[160px] sm:w-[200px] md:w-[240px] lg:w[240px] inline-block cursor-pointer relative p-2'>
                        {/* Display podcast item content */}
                        <img className='w-full h-auto block' src={podcastItem?.image} alt={podcastItem?.title}/>
                        <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-amber-50'>
                            <p className='whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center'>{podcastItem?.title}</p>
                            {/* Add a button to delete the podcast item */}
                            <p onClick={() => deletePodcast(podcastItem.id)} className='absolute text-gray-300 top-4 right-4'><AiOutlineClose/></p>
                            {/* Pass onSave function to the Overlay component */}
                            <Overlay
                                item={podcastItem}
                                showOverlay={true}
                                closeOverlay={() => {}}
                                onSave={savePodcast}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default SavedPodcasts;