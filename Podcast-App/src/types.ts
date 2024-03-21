export interface Podcast {
    id: string,
    image: string;
    title: string;
    updated: string;
    description: string;
    genres: string;
    seasons: number;
}

export interface User {
    id: string;
    email?: string;
}

export interface AuthContextType {
    signUp: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
}

export interface ShowsContextType {
    podcasts: Podcast[];
    loading: boolean;
    selectedSeason: number | null;
    selectSeason: (seasonNumber: number) => void;
}

export interface PodcastFavorite {
    id: string;
    image: string;
    title: string;
    season_id: string;
    season_image: string;
    season_title: string;
    episode_title: string;
    date_saved: string;
    mp3_file: string;
    seasons_titles: { title: string }[];
}

export interface OverlayProps {
    item: {
        id: string,
        image: string;
        title: string;
        updated: string;
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
    onSave: (episodeId: string, seasonId: string | null) => void;
}