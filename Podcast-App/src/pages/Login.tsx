import React from 'react';
import {Link} from "react-router-dom";

function Login(props) {

    const signUpLogo = 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

    return (
        <div className='w-full h-screen'>
            <img className='hidden sm:block absolute w-full h-full object-cover ' src={signUpLogo} alt='signuplogo'/>
            <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
            <div className='fixed w-full px-4 py-24 z-50'>
                <div className='max-w-[450px] h-[600px] mx-auto bg-black/75 text-yellow-400'>
                    <div className='max-w-[320px] mx-auto py-16'>
                        <h1 className='text-3xl font-bold'>Log In</h1>
                        <form className='w-full flex flex-col py-4'>
                            <input className='p-3 my-2 bg-gray-600 rounded' type='email' placeholder='Email'
                                   autoComplete='email'/>
                            <input className='p-3 my-2 bg-gray-600 rounded' type='password' placeholder='Password'
                                   autoComplete='current-password'/>
                            <button className='bg-green-500 py-3 my-6 rounded font-bold text-amber-50'>Log In!</button>
                            <div className='flex justify-between items-center text-sm '>
                                <p><input className='mr-2' type='checkbox'/>Remember Me</p>
                                <p>Need Help?</p>
                            </div>
                            <p className='py-8 text-amber-50'>
                                <span className='text-sm text-yellow-400'>Not Subscribed?</span>{' '}
                                <Link to='/signup'>
                                    Sign Up!
                                </Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;