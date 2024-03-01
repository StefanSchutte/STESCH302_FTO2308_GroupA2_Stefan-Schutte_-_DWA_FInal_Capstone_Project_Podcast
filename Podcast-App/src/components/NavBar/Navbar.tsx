import React, {useState} from 'react';
import { Link } from 'react-router-dom';



function Navbar() {



    return (
        <div className='flex items-center justify-between p-4 z-[100] w-full absolute'>
            <Link to='/'>
            <h1 className='text-amber-50 text-4xl font-bold cursor-pointer'>PODCASTED</h1>
            </Link>
            <div>
                <Link to='/login'>
                <button className='text-amber-50 pr-4'>Log In</button>
                </Link>
                <Link to='/signup'>
                <button className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Sign Up</button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;