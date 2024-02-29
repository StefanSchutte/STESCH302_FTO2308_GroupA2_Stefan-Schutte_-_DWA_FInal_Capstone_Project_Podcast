import React from 'react';

function Navbar() {
    return (
        <div className='flex items-center justify-between p-4 z-[100] w-full absolute'>
            <h1 className='text-amber-50 text-4xl font-bold cursor-pointer'>PODCASTED</h1>
            <div>
                <button className='text-amber-50 pr-4'>Log In</button>
                <button className='text-amber-50 bg-blue-600 px-6 py-4 rounded cursor-pointer'>Sign Up</button>
            </div>
        </div>
    );
}

export default Navbar;