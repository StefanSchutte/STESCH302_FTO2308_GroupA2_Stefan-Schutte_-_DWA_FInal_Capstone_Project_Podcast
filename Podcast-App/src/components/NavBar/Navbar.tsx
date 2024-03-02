// import React, {useEffect, useState} from 'react';
// import {Link, useNavigate} from 'react-router-dom';
// import {useAuth} from "../../context/AuthContext.tsx";
//
//
// function Navbar() {
//
//     const {user, logOut} = useAuth()
//     const navigate = useNavigate()
//
//
//     console.log(user)
//     //
//     // const [isLoggedIn, setIsLoggedIn] = useState(false);
//     //
//     // useEffect(() => {
//     //     // Check if user is logged in
//     //     setIsLoggedIn(!!user);
//     // }, [user]);
//
//     const handleLogout = async () => {
//         try{
//             await logOut()
//             navigate('/')
//             console.log('loged in')
//
//         } catch(error) {
//             console.log(error)
//         }
//
//     }
//
//     return (
//         <div className='flex items-center justify-between p-4 z-[100] w-full absolute'>
//             <Link to='/'>
//                 <h1 className='text-amber-50 text-6xl font-bold cursor-pointer'>PODCASTED</h1>
//             </Link>
//             {user?.email ? (
//                 <div>
//                     <Link to='/account'>
//                         <button className='text-amber-50 pr-4'>Account</button>
//                     </Link>
//
//                         <button onClick={handleLogout} className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Log Out</button>
//
//                 </div> )
//                 :
//                 ( <div>
//                     <Link to='/login' className='pr-4'>
//                         <button className='text-amber-50 pr-4 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Log In</button>
//                     </Link>
//                     <Link to='/signup'>
//                         <button className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Sign Up</button>
//                     </Link>
//                 </div>
//                 )}
//         </div>
//     );
// }
//
// export default Navbar;
//
// // <div>
// //     <Link to='/login'>
// //         <button className='text-amber-50 pr-4'>Log In</button>
// //     </Link>
// //     <Link to='/signup'>
// //         <button className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Sign Up</button>
// //     </Link>
// // </div>
//
// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { useAuth } from "../../context/AuthContext.tsx";
// //
// // function Navbar() {
// //     const { user, logOut } = useAuth();
// //     const [isLoggedIn, setIsLoggedIn] = useState(false);
// //
// //     useEffect(() => {
// //         // Check if user is logged in
// //         setIsLoggedIn(!!user);
// //     }, [user]);
// //
// //     const handleLogout = async () => {
// //         try {
// //             await logOut();
// //         } catch (error) {
// //             console.log(error);
// //         }
// //     };
// //
// //     return (
// //         <div className='flex items-center justify-between p-4 z-[100] w-full absolute'>
// //             <Link to='/'>
// //                 <h1 className='text-amber-50 text-4xl font-bold cursor-pointer'>PODCASTED</h1>
// //             </Link>
// //             {isLoggedIn ? (
// //                 <div>
// //                     <Link to='/account'>
// //                         <button className='text-amber-50 pr-4'>Account</button>
// //                     </Link>
// //                     <button onClick={handleLogout} className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Log Out</button>
// //                 </div>
// //             ) : (
// //                 <div>
// //                     <Link to='/login'>
// //                         <button className='text-amber-50 pr-4'>Log In</button>
// //                     </Link>
// //                     <Link to='/signup'>
// //                         <button className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Sign Up</button>
// //                     </Link>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }
// //
// // export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface User {
    email: string;
    // Add any other properties you have in your user object
}

function Navbar(): JSX.Element {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
            console.log('logged out');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 z-[100] w-full absolute">
            <Link to="/">
                <h1 className="text-amber-50 text-6xl font-bold cursor-pointer">PODCASTED</h1>
            </Link>
            {user?.email ? (
                <div>
                    <Link to="/account">
                        <button className="text-amber-50 pr-4">Account</button>
                    </Link>
                    <button onClick={handleLogout} className="text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer">
                        Log Out
                    </button>
                </div>
            ) : (
                <div>
                    <Link to="/login" className="pr-4">
                        <button className="text-amber-50 pr-4 bg-blue-600 px-6 py-4 rounded cursor-pointer">Log In</button>
                    </Link>
                    <Link to="/signup">
                        <button className="text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer">Sign Up</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Navbar;