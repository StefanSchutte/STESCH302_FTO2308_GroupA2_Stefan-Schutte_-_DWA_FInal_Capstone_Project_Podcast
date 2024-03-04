import React from 'react';
import { Link } from 'react-router-dom';
import homeLogo from "/home.png";
import settingLogo from '/setting.png'
import loginFav from "/public/log-in.png";
import addUserFav from "/add-user.png";

const Menu = ({ closeOverlay }) => {
    const filterLogo = 'https://images.unsplash.com/photo-1589128995173-e1cd084b3db9?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    const handleLinkClick = () => {
        closeOverlay();
    };

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full   z-[90] "><img
                className='hidden sm:block absolute w-full h-full object-cover ' src={filterLogo}
                alt='filterlogo'/></div>


            <div
                className="text-yellow-400 fixed top-0 left0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-80 z-[100] overflow-auto">


                <div className="p-4 m-4 rounded-lg max-w-screen h-screen flex-col justify-center ">

                    <h2 className="text-xl font-bold mb-4 p-4 underline ">Menu</h2>
                    <ul>
                        <li className='p-4 flex '><Link to="/" className="text-gray-200 hover:text-white " onClick={handleLinkClick}><img src={homeLogo} alt="account" className='w-12 h-12 ml-2'/>Home</Link>
                        </li>

                        <li className='p-4'><Link to="/filter" className="text-gray-200 hover:text-white" onClick={handleLinkClick}><img src={settingLogo} alt="account" className='w-12 h-12 ml-2'/>Filter</Link>
                        </li>

                        <li className='p-4'><Link to="/login" className="text-gray-200 hover:text-white" onClick={handleLinkClick}><img src={loginFav} alt="account" className='w-12 h-12 ml-2'/>Login</Link>
                        </li>
                        <li className='p-4'><Link to="/signup" className="text-gray-200 hover:text-white" onClick={handleLinkClick}><img src={addUserFav} alt="account" className='w-12 h-12 ml-2'/>Sign
                            Up</Link>
                        </li>
                    </ul>
                    <div className='p-4'>
                        <button className="border bg-red-500 text-amber-50 border-gray-300 py-2 px-5"
                                onClick={closeOverlay}>Close
                        </button>
                    </div>
                </div>

            </div>

        </>
        // <div className='w-1/3 h-[550px] bg-black text-amber-50 flex flex-col z-[90] '>
        //     <div className="p-4">
        //         <h2 className="text-xl font-bold mb-4">Menu</h2>
        //         <ul>
        //             <li><Link to="/" className="text-gray-200 hover:text-white">Home</Link></li>
        //             <li><Link to="/about" className="text-gray-200 hover:text-white">About</Link></li>
        //             <li><Link to="/contact" className="text-gray-200 hover:text-white">Contact</Link></li>
        //         </ul>
        //     </div>
        //     {/* Add search functionality here */}
        //     <div className="flex-grow"></div>
        //     {/* This will occupy the remaining space */}
        // </div>
    );
};

export default Menu;