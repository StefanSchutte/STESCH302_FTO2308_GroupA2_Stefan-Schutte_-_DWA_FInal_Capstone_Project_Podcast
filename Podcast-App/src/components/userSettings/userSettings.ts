// Remembering the last listened show and episode: table named 'user_history' in your Supabase database with columns 'user_id', 'last_listened_show_id', and 'last_listened_episode_id'

// Function to update the last listened show and episode
import supabase from "../../supabase.ts";

export const saveLastListened = async (userId: string, showId: string, episodeId: string, episodeTitle, podcastData,) => {
    console.log(showId);
    console.log('userId:', userId);
    console.log('podcastData:', podcastData);

    console.log(showId)
// Check if podcast data and selected season/episode are available
    if (podcastData !== null) {
        const { data, error } = await supabase
            .from('user_history')
            .insert({
                user_id: userId,
                last_listened_episode_id: episodeId,
                last_listened_show_id: showId,
                // episode_title: episodeTitle,
            });

        if (error) {
            console.error('Error updating last listened:', error.message);
            return null;
        }
        return data;
    }
};

// Function to retrieve the last listened show and episode need episode id
export const getLastListened = async (userId: string) => {
    const { data, error } = await supabase
        .from('user_history')
        .select('last_listened_show_id, last_listened_episode_id')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error fetching last listened:', error.message);
        return null;
    }
    if (!data) {
        console.error('No data found for the user');
        return null;
    }
    return data;
};