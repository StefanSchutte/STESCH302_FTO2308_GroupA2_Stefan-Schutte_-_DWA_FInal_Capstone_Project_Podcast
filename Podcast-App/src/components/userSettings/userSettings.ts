// Remembering the last listened show and episode: table named 'user_history' in your Supabase database with columns 'user_id', 'last_listened_show_id', and 'last_listened_episode_id'

// Function to update the last listened show and episode
import supabase from "../../supabase.ts";

export const saveLastListened = async (userId: string, showId: string, episodeId: string, podcastData, selectedEpisode, selectedSeason) => {

    // Check if user is authenticated
    if (!userId) {
        console.error('User is not authenticated');
        return;
    }

    // Check if podcast data and selected season/episode are available
    if (podcastData && selectedSeason !== null && selectedEpisode !== null) {
        // Extract selected episode data
        const selectedEpisodeData = podcastData.seasons[selectedSeason - 1]?.episodes[selectedEpisode - 1];


        // Construct the upsert object
        const upsertData = {
            user_id: userId,
            last_listened_show_id: selectedEpisodeData.id,
            last_listened_episode_id: selectedEpisodeData.title,
            episode_title: selectedEpisodeData.title,
        };

        // Perform the upsert operation
        const { data, error } = await supabase
            .from('user_history')
            .upsert([upsertData], { onConflict: ['user_id'] });

        if (error) {
            console.error('Error updating last listened:', error.message);
            return null;
        }

        return data;
    }
};

// Function to retrieve the last listened show and episode
export const getLastListened = async (userId: string) => {
    // const { data, error } = await supabase
    //     .from('user_history')
    //     .select('last_listened_show_id, last_listened_episode_id')
    //     .eq('user_id', userId)
    //     .single();
    // if (error) {
    //     console.error('Error fetching last listened:', error.message);
    //     return null;
    // }
    // if (!data) {
    //     console.error('No data found for the user');
    //     return null;
    // }
    // return data;
};

// Remembering which shows and episodes the user listened to all the way through: table named 'completed_episodes' in your Supabase database with columns 'user_id' and 'episode_id'

// Function to mark an episode as completed
const markEpisodeCompleted = async (userId: string, episodeId: string) => {
    const { error } = await supabase
        .from('completed_episodes')
        .insert([{ user_id: userId, episode_id: episodeId }]);
    if (error) {
        console.error('Error marking episode as completed:', error.message);
    }
};

// Function to check if an episode is completed
const isEpisodeCompleted = async (userId: string, episodeId: string) => {
    const { data, error } = await supabase
        .from('completed_episodes')
        .select('id')
        .eq('user_id', userId)
        .eq('episode_id', episodeId)
        .single();
    if (error) {
        console.error('Error checking if episode is completed:', error.message);
        return false;
    }
    return !!data; // Return true if episode is completed, false otherwise
};

// Remembering the timestamp where the user stopped listening: table named 'episode_progress' in your Supabase database with columns 'user_id', 'episode_id', and 'timestamp'

// Function to update the timestamp where the user stopped listening
const updateEpisodeProgress = async (userId: string, episodeId: string, timestamp: number) => {
    const { error } = await supabase
        .from('episode_progress')
        .upsert([{ user_id: userId, episode_id: episodeId, timestamp: timestamp }], { onConflict: ['user_id', 'episode_id'] });
    if (error) {
        console.error('Error updating episode progress:', error.message);
    }
};

// Function to retrieve the timestamp where the user stopped listening
const getEpisodeProgress = async (userId: string, episodeId: string) => {
    const { data, error } = await supabase
        .from('episode_progress')
        .select('timestamp')
        .eq('user_id', userId)
        .eq('episode_id', episodeId)
        .single();
    if (error) {
        console.error('Error fetching episode progress:', error.message);
        return null;
    }
    return data ? data.timestamp : null;
};

// Function to reset all user progress
const resetUserProgress = async (userId: string) => {
    const { error } = await supabase
        .from('user_history')
        .delete()
        .eq('user_id', userId);
    if (error) {
        console.error('Error resetting user progress:', error.message);
    }
};
