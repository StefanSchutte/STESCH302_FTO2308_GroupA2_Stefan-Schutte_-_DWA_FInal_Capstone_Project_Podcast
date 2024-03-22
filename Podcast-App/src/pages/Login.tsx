import {useState, FormEvent, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.tsx'
import loginFav from "/log-in.png";

/**
 * Functional component representing the login form.
 * Defies local state variables using the useState hook, including email, password, and error to manage form input and error messages.
 * @returns JSX.Element
 */
function Login(): JSX.Element {

    const signUpLogo = 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    /**
     * Access authentication-related functionality, such as logging in (logIn) and accessing the current user (user).
     */
    const { user, logIn } = useAuth();
    /**
     * Navigate to different routes within the application.
     */
    const navigate = useNavigate();

    /**
     * Redirect the user to the account page if they are already logged in (user is not null).
     */
    useEffect(() => {
        if (user) {
            navigate('/account');

        }
    }, [user, navigate]);

    /**
     * Handles form submission.
     * Prevents the default form submission behavior.
     * Clears any existing error messages.
     * Attempts to log in the user using the logIn function from the useAuth hook.
     * Redirects the user to the home page ('/') upon successful login.
     * If an error occurs during the login process, it sets the error state with the error message.
     * @param {FormEvent<HTMLFormElement>} e - Form event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            await logIn(email, password);
            navigate('/');
            console.log(user)
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
    };

    /**
     * Login form UI.
     * Includes input fields for email and password, a submit button, a link to the signup page (/signup), and a background image.
     * The component conditionally renders an error message if error state is not empty.
     * It also conditionally renders a background image using an img element.
     * Input field changes (onChange event) are handled by updating the email and password states.
     * Form submission (onSubmit event) is handled by the handleSubmit function.
     */
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