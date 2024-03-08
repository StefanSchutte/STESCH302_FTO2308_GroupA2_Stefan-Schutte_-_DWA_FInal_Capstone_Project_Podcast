import {useState, FormEvent, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx'
import loginFav from "/log-in.png";

/**
 * Functional component representing the login form.
 * @returns JSX.Element
 */
function Login(): JSX.Element {

    const signUpLogo = 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { user, logIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/account');
        }
    }, [user, navigate]);

    /**
     * Handles form submission.
     * @param {FormEvent<HTMLFormElement>} e - Form event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            await logIn(email, password);
            navigate('/');
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
    };

    return (
        <div className='w-full h-screen'>
            <img className='hidden sm:block absolute w-full h-full object-cover ' src={signUpLogo} alt='signuplogo' />
                <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
                    <div className='fixed w-full px-4 py-24 z-50'>
                        <div className='max-w-[450px] h-[500px] mx-auto bg-black/75 text-yellow-400'>
                            <div className='max-w-[320px] mx-auto py-16'>
                                <h1 className='text-5xl mb-6 font-bold'>Log In</h1>

                                {error ? <p className='p3 bg-red-400 my-2 text-amber-50'>{error}</p> : null}

                                <form onSubmit={handleSubmit} className='w-full flex flex-col py-4'>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='p-3 my-2 bg-gray-600 rounded'
                                        type='email'
                                        placeholder='Email'
                                        autoComplete='email'
                                    />
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='p-3 my-2 bg-gray-600 rounded'
                                        type='password'
                                        placeholder='Password'
                                        autoComplete='current-password'
                                    />
                                    <button className='bg-green-500 py-3 my-6 rounded font-bold text-amber-50 flex justify-center items-center'>
                                        <img src={loginFav} className='w-10 h-10' alt='Log In!'/>
                                    </button>

                                    <p className='py-8 text-amber-50'>
                                        <span className='text-sm text-yellow-400'>Not Subscribed?</span>{' '}
                                        <Link to='/signup'>
                                            Sign Up!
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                </div>
        </div>
    );
}

export default Login;





