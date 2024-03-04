
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loginFav from '/public/log-in.png'
import addUserFav from '/add-user.png'
import logoutFav from '/logout.png'
import accountFav from '/account.png'
import Menu from "./Menu.tsx";
import menuFav from '/menu-bar.png'

interface User {
    email: string;
    // Add any other properties you have in your user object
}

function Navbar(): JSX.Element {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
       // Check if user is logged in
        setIsLoggedIn(!!user);
     }, [user]);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
            setIsLoggedIn(false);
            console.log('logged out');
        } catch (error) {
            console.log(error);
        }
    };

    const handleMenuClick = () => {
        // Toggle the overlay visibility
        setShowOverlay(!showOverlay);
    };
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <div className="flex items-center justify-between p-4 z-[80] w-full absolute brightness-30 ">
            <Link to="/">
                <h1 className="text-amber-50 text-6xl font-bold cursor-pointer ">
                    PODCASTED</h1>
            </Link>
            <button
                onClick={handleMenuClick}
                className="text-amber-50   rounded cursor-pointer flex items-center"
            >
                <img src={menuFav} alt="Menu"/>
            </button>
            <div className="flex items-center">
                {isLoggedIn ? (
                    <>
                        <Link to="/account" className="pr-4">
                            <button
                                className="text-amber-50 pr-4 bg-blue-600 px-6 py-4 rounded cursor-pointer flex items-center">Account
                                <img src={accountFav} alt="account" className='w-6 h-6 ml-2'/>
                            </button>
                        </Link>
                        <button onClick={handleLogout}
                                className="text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer flex items-center">
                            Log Out
                            <img src={logoutFav} alt="Log Out" className='w-6 h-6 ml-2'/>
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="pr-4">
                            <button
                                className="text-amber-50 pr-4 bg-blue-600 px-6 py-4 rounded cursor-pointer flex items-center">
                                Log In
                                <img src={loginFav} alt="Log In" className='w-6 h-6 ml-2'/>
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button
                                className="text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer flex items-center">Sign
                                Up
                                <img src={addUserFav} alt="Sign Up" className='w-6 h-6 ml-2'/>
                            </button>
                        </Link>
                    </>
                )}
            </div>
            {showOverlay && <Menu closeOverlay={closeOverlay}/>}
        </div>
    );
}

export default Navbar;

