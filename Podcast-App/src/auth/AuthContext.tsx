import { createContext, useContext, useEffect, useState } from "react";
import supabase, { auth } from '../supabase.ts';
import {Session} from "@supabase/supabase-js";

/**
 * Interface representing the user object.
 */
interface User {
    id: string;
    email?: string | undefined;
}

/**
 * Interface representing the authentication auth.
 */
interface AuthContextType {
    signUp: (email: string, password: string | number) => Promise<void>;
    logIn: (email: string, password: string | number) => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
}

/**
 * Authentication auth for managing user authentication state.
 * Creates a auth for managing authentication-related data and functions. It's initialized with a type of AuthContextType.
 */
const AuthContext = createContext<AuthContextType | null>(null);


/**
 * Authentication auth provider component.
 * This component wraps its children with the authentication auth provider.
 * It maintains the current user state (user) using the useState hook.
 * Defines functions (signUp, logIn, logOut) to handle user authentication using Supabase methods.
 * Sets up an effect using useEffect to listen for changes in authentication state (onAuthStateChange) and update the user state accordingly.
 * @param children - Child components to be wrapped by the provider.
 */
export function AuthContextProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
    // useEffect(() => {
    //     const currentUser = supabase.auth.user();
    //     setUser(currentUser)
    //     const authListener = supabase.auth.onAuthStateChange((event, session) => {
    //         setUser(session?.user ?? null)
    //     })
    //     return () => {
    //         authListener.unsubscribe();
    //     }
    //     },[])
    /**
     * Signs up a new user.
     * @param email - User's email address.
     * @param password - User's password.
     */
    async function signUp(email: string | undefined, password: string | number | undefined): Promise<void> {
        const { data: userData, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Error signing up:", error.message);
            return;
        }
        setUser(userData);
    }
// i changed user to data
    // USER SIGNUP
    // let { data, error } = await supabase.auth.signUp({
    //     email: 'someone@email.com',
    //     password: 'HOOxpIoRNBAGtFiIoCYW'
    // })

    /**
     * Logs in an existing user.
     * @param email - User's email address.
     * @param password - User's password.
     */
    async function logIn(email: string | undefined, password: string | number | undefined): Promise<void> {
        const { data: userData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Error signing in:", error.message);
            return;
        }
        setUser(userData);
    }

    // USER LOGIN
     //let { data, error } = await supabase.auth.signInWithPassword({
    //     email: 'someone@email.com',
    //     password: 'HOOxpIoRNBAGtFiIoCYW'
     //})

    /**
     * Logs out the current user.
     */
    async function logOut(): Promise<void> {
        const { error } = await auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
            return;
        }
        setUser(null);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook for accessing the authentication auth.
 * @returns The authentication auth, using the useContext hook.
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
}