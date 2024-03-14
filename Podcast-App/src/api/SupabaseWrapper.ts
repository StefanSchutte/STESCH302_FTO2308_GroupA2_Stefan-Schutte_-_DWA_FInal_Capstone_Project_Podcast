import { SupabaseClient, PostgrestResponse } from '@supabase/supabase-js';

export class SupabaseWrapper {
    private supabase: SupabaseClient;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;
    }

    async fetchFavorites(userId: string){

    }

    async insertFavoriteEpisode(userId: string, episodeId: string) {
        return  this.supabase
            .from('favorites')
            .insert([{ user_id: userId, episode_id: episodeId }]);

    }

    async insertFavoriteSeason(userId: string, seasonId: string) {
        return this.supabase
            .from('favorites')
            .insert([{ user_id: userId, season_id: seasonId }]);
    }

}
