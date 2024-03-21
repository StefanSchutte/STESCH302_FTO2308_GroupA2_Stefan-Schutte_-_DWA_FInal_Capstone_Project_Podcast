import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from '../supabase';
import {AuthContextType, User} from "../types.ts";

// Create a context with an initial undefined value. This will be overridden with an actual value in the provider.
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        // This effect sets the user on mount and listens for auth state changes.
        const { data: { subscription, } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password,): Promise<void> => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) console.error("Error signing up:", error.message);

    };

    const logIn = async (email: string, password: string): Promise<void> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) console.error("Error signing in:", error.message);
    };

    const logOut = async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Error signing out:", error.message);
    };

    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook for accessing the authentication auth.
 * @returns The authentication auth, using the useContext hook.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
    return context;
};
