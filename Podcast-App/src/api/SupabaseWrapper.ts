// import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';
// import supabase from '../supabase.ts'
//
// export class SupabaseWrapper {
//     private supabase: SupabaseClient;
//
//     constructor(supabaseClient: SupabaseClient) {
//         this.supabase = supabaseClient;
//     }
//
//     async fetchFavorites(userId: string){
//
//     }
//
//     async insertFavoriteEpisode(userId: string, episodeId: string) {
//         return  this.supabase
//             .from('favorites')
//             .insert([{ user_id: userId, episode_id: episodeId }]);
//
//     }
//
//     async insertFavoriteSeason(userId: string, seasonId: string) {
//         return this.supabase
//             .from('favorites')
//             .insert([{ user_id: userId, season_id: seasonId }]);
//     }
//
// }
import supabase from "../supabase.ts";

export const addFavorite = async (episode: Podcast, userId: string, seasonId: string|null) => {
    const { data, error } = await supabase
        .from('favorites')
        .insert([{ episode_id: episode.id, user_id: userId, season_id: seasonId }]);

    if (error) {
        console.error('Error adding favorite:', error);
    } else {
        console.log('Favorite added successfully:', data);
    }
};

export const getFavorites = async (userId: string) => {
    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error getting favorites:', error);
        return [];
    } else {
        return data;
    }
};

export const removeFavorite = async (favoriteId: number) => {
    const { data, error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

    if (error) {
        console.error('Error removing favorite:', error);
    } else {
        console.log('Favorite removed successfully:', data);
    }
};