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
import {useAuth} from "../../context/AuthContext.tsx";

const Menu = ({ closeOverlay }) => {

    const filterLogo = 'https://images.unsplash.com/photo-1589128995173-e1cd084b3db9?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const handleLinkClick = () => {
        closeOverlay();
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full   z-[90] ">
                <img className='absolute w-full h-full object-cover ' src={filterLogo}
                alt='filterlogo'/>

                <div className="fixed top-0 left0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-[100]">
                    <div className="absolute p-4 m-4  rounded-lg max-w-screen h-screen flex-col justify-center " style={{ top: '15%' }}>
                        <h2 className="mb-4 p-4 col-span-2 flex justify-center">
                            <img src={menuFav} alt="Menu"/>
                        </h2>
                        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
                            <li className='p-4 flex'>
                                <Link to="/" onClick={handleLinkClick}>
                                    <img src={homeLogo} alt="account" className='w-16 h-16 ml-2'/>
                                </Link>
                            </li>
                            <li className='p-4'>
                                <Link to="/filter" onClick={handleLinkClick}>
                                    <img src={settingLogo} alt="account" className='w-16 h-16 ml-2'/>
                                </Link>
                            </li>
                            <li className='p-4'>
                                {isLoggedIn ? (
                                    <Link to="/account" onClick={handleLinkClick}>
                                        <img src={accountFav} alt="account" className='w-16 h-16 ml-2'/>
                                    </Link>
                                ) : (
                                    <Link to="/login" onClick={handleLinkClick}>
                                        <img src={loginFav} alt="account" className='w-16 h-16 ml-2'/>
                                    </Link>
                                )}
                            </li>
                            <li className='p-4'>
                                {isLoggedIn ? (
                                    <button onClick={handleLogout}>
                                        <img src={logoutFav} alt="logout" className='w-16 h-16 ml-2'/>
                                    </button>
                                ):(
                                    <Link to="/signup" onClick={handleLinkClick}>
                                    <img src={addUserFav} alt="account" className='w-16 h-16 ml-2'/>
                                    </Link>
                                )}
                            </li>
                        </ul>
                        <div className="col-span-2 flex justify-center">
                            <div className='p-4'>
                                <button className="py-2 px-5" onClick={closeOverlay}>
                                    <img src={closeFav} alt="close" className='w-18 h-18 ml-2'/>
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

// etValue(newVlasue)
// setValue((oldValue) => newValue)

// func () {
//     value === 3
//     setValue(5)
//     value === 3
//     setValue((oldValue) => 7)
//     value === 7
// }