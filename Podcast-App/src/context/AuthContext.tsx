import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../supabase.ts';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);

    async function signUp(email, password) {
        const { user, error } = await auth.signUp({ email, password });
        if (error) {
            console.error("Error signing up:", error.message);
            return;
        }
        setUser(user);
    }

    async function logIn(email, password) {
        const { user, error } = await auth.signIn({ email, password });
        if (error) {
            console.error("Error signing in:", error.message);
            return;
        }
        setUser(user);
    }

    async function logOut() {
        const { error } = await auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
            return;
        }
        setUser(null);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}