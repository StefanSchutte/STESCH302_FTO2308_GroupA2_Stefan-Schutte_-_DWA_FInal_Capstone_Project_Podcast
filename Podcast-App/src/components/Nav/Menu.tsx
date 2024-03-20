import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import homeLogo from "/home.png";
import settingLogo from '/setting.png'
import loginFav from "/public/log-in.png";
import addUserFav from "/add-user.png";
import closeFav from '/close.png'
import menuFav from "/menu.png";
import accountFav from "/account.png";
import logoutFav from '/logout.png'
import {useAuth} from "../../auth/AuthContext.tsx";

/**
 * Functional component representing the menu overlay.
 * Sets up state variables using the useState hook:
 * 'isLoggedIn': This state variable tracks whether a user is logged in or not.
 * 'showOverlay': This state variable is managed by the parent component to control the visibility of the menu overlay.
 * Utilizes the useAuth hook to get the current user information and logout functionality.
 * Update the isLoggedIn state whenever the user object changes.
 * @param closeOverlay - Function to close the menu overlay.
 * @returns JSX.Element
 */
const Menu = ({ closeOverlay }: { closeOverlay: () => void }): JSX.Element => {

    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    /**
     * Check if user is logged in.
     */
    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    /**
     * Handles logout functionality.
     * Calls the logOut function provided by the useAuth hook, navigates the user to the home page, and updates the isLoggedIn state to false.
     */
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

    /**
     * Handles link click and closes the menu overlay.
     * Calls the closeOverlay function provided by the parent component to close the menu.
     */
    const handleLinkClick = () => {
        closeOverlay();
    };

    /**
     * Component renders the menu overlay, which includes:
     * An image background.
     * A menu container with menu items represented by icons.
     * Conditional rendering of menu items based on the isLoggedIn state.
     * If the user is logged in, it shows an "Account" icon that links to the account page and a "Logout" button.
     * If not logged in, it shows "Login" and "Signup" icons.
     * A close button to close the menu overlay.
     * Link components from react-router-dom are used to handle navigation within the application. They wrap menu items to navigate to different pages when clicked.
     * 'handleLogout' function initiates the logout process, navigates the user to the home page, and updates the isLoggedIn state accordingly.
     */
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full  bg-blue-400 z-[90] ">
                <div className="fixed top-0 left0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-40 z-[100]">
                    <div className="absolute p-4 m-4  rounded-lg max-w-screen h-screen flex-col justify-center " style={{ top: '15%' }}>
                        <h2 className="mb-4 p-4 col-span-2 flex justify-center">
                            <img src={menuFav} alt="Menu" title='This is the Menu. Use icons below to nav.'/>
                        </h2>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
                            <li className='p-4 flex'>
                                <Link to="/" onClick={handleLinkClick} >
                                    <img src={homeLogo} alt="home" className='w-16 h-16 ml-2' title='Home'/>
                                </Link>
                        </li>
                        <li className='p-4'>
                            <Link to="/filter" onClick={handleLinkClick}>
                            <img src={settingLogo} alt="filter" className='w-16 h-16 ml-2' title='Filter Search'/>
                                </Link>
                            </li>
                            <li className='p-4'>
                                {isLoggedIn ? (
                                    <Link to="/account" onClick={handleLinkClick}>
                                        <img src={accountFav} alt="account" className='w-16 h-16 ml-2' title='Account'/>
                                    </Link>
                                ) : (
                                    <Link to="/login" onClick={handleLinkClick}>
                                        <img src={loginFav} alt="login" className='w-16 h-16 ml-2' title='Log In'/>
                                    </Link>
                                )}
                            </li>
                            <li className='p-4'>
                                {isLoggedIn ? (
                                    <button onClick={handleLogout}>
                                        <img src={logoutFav} alt="logout" className='w-16 h-16 ml-2' title='Log Out'/>
                                    </button>
                                ):(
                                    <Link to="/signup" onClick={handleLinkClick}>
                                    <img src={addUserFav} alt="signup" className='w-16 h-16 ml-2' title='Sign Up'/>
                                    </Link>
                                )}
                            </li>
                        </ul>
                        <div className="col-span-2 flex justify-center">
                            <div className='p-4'>
                                <button className="py-2 px-5" onClick={closeOverlay}>
                                    <img src={closeFav} alt="close" className='w-18 h-18 ml-2' title='Close'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;
