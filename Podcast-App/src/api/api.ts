/**
 * Represents the URL of the podcast api.
 */
const API_URL: string = 'https://podcast-api.netlify.app/shows';

/**
 * Retrieves a list of shows from the podcast api.
 * Endpoint from which the podcast shows will be fetched.
 * Fetch data from the API_URL using the fetch function.
 * Awaits the response from the api.
 * If the response.ok is false, it throws an error indicating that the fetching process failed.
 * If the response is okay, it proceeds to extract JSON data from the response body using the response.json() method, which returns another Promise.
 * The function then returns the JSON data.
 * If any errors occur during the process, they're caught by the catch block, and an empty array [] is returned as a fallback value.
 * @returns A Promise that resolves to an array of show data.
 */
const getShowsFromAPI = async (): Promise<any[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default getShowsFromAPI;

import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';

export class SupabaseWrapper {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    // Generic function to handle requests
    async request<T>(action: () => Promise<PostgrestResponse<T>>): Promise<T[] | null> {
        const { data, error } = await action();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getFavorites(userId: string){
        return this.request(() =>
            this.supabase
                .from('favorites')
                .select()
        );
    }

    async insertFavoriteEpisode(userId: string, episodeId: string) {
        return this.request(() =>
            this.supabase
                .from('favorites')
                .insert([{ user_id: userId, episode_id: episodeId }])
        );
    }

    async insertFavoriteSeason(userId: string, seasonId: string) {
        return this.request(() =>
            this.supabase
                .from('favorites')
                .insert([{ user_id: userId, season_id: seasonId }])
        );
    }

}
