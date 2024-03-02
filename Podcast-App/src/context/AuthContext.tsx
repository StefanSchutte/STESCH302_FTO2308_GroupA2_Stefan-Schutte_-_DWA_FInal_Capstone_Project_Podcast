// // import { createContext, useContext, useEffect, useState } from "react";
// // import { auth } from '../supabase.ts'
// // import {createUserNameWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'supabase/auth'
// //
// // const AuthContext = createContext()
// //
// // export function AuthContextProvider({children}){
// //
// //     const [user, setUser] = useState({})
// //
// //     function signUp(email, password){
// //         return createUserNameWithEmailAndPassword(auth, email, password)
// //     }
// //
// //     function logIn (email, password){
// //         return signInWithEmailAndPassword(auth, email, password)
// //     }
// //
// //     function logOut() {
// //         return signOut(auth)
// //     }
// //
// //     useEffect(()=> {
// //         const unsubscribe = onAuthStateChanged(auth, (currentUser)=> {
// //             setUser(currentUser)
// //         })
// //         return () => {
// //             unsubscribe()
// //         }
// //     })
// //
// //     return (
// //         <AuthContext.Provider value={signUp, user}>
// //             {children}
// //             </AuthContext.Provider>
// //     )
// // }
// //
// // export function UserAuth() {
// //     return useContext(AuthContext)
// // }


import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../supabase.ts';

interface User {
    id: string;
    email: string | number;
    // Add any other user properties here
}

interface AuthContextType {
    signUp: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    async function signUp(email: string, password: string): Promise<void> {
        const { user, error } = await auth.signUp({ email, password });
        if (error) {
            console.error("Error signing up:", error.message);
            return;
        }
        setUser(user);
    }

    async function logIn(email: string, password: string): Promise<void> {
        const { user, error } = await auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Error signing in:", error.message);
            return;
        }
        setUser(user);
    }

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

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
}