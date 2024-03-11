import {ReactNode} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";

/**
 * Functional component representing a protected route that redirects to the home page if the user is not authenticated.
 * Destructures the children prop, which represents the child components to be rendered within the protected route.
 * Uses the useAuth hook to get the current user information.
 * If there is no user (!user), it returns a Navigate component to redirect the user to the home page.
 * @param children - The child components to be rendered if the user is authenticated.
 * @returns JSX.Element | Navigate
 */
const ProtectedRoute = ({children}: { children: ReactNode }): JSX.Element | Navigate => {

    const {user} = useAuth()

    if (!user){
        return <Navigate to='/' />
    } else {
        return children
    }
}

export default ProtectedRoute;