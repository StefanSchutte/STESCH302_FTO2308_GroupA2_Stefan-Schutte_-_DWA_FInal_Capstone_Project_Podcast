// import { createContext, useContext, useEffect, useState } from "react";
// import { auth } from '../supabase.ts'
// import {createUserNameWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'supabase/auth'
//
// const AuthContext = createContext()
//
// export function AuthContextProvider({children}){
//
//     const [user, setUser] = useState({})
//
//     function signUp(email, password){
//         return createUserNameWithEmailAndPassword(auth, email, password)
//     }
//
//     function logIn (email, password){
//         return signInWithEmailAndPassword(auth, email, password)
//     }
//
//     function logOut() {
//         return signOut(auth)
//     }
//
//     useEffect(()=> {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser)=> {
//             setUser(currentUser)
//         })
//         return () => {
//             unsubscribe()
//         }
//     })
//
//     return (
//         <AuthContext.Provider value={signUp, user}>
//             {children}
//             </AuthContext.Provider>
//     )
// }
//
// export function UserAuth() {
//     return useContext(AuthContext)
// }

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from '../supabase.ts'

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

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
        setUser({});
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? {});
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