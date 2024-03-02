import React, {useEffect, useState} from 'react';
import axios from "axios";


function Hero() {

    const apiUrl = 'https://podcast-api.netlify.app/shows';

    const [podcasts, setPodcasts] = useState([]);

    const podcast = podcasts[Math.floor(Math.random() * podcasts.length)]

    useEffect(() => {
        axios.get(apiUrl)
            .then((response) => {
                // Update component state with the fetched data
                setPodcasts(response.data);
            })
            .catch((error) => {
                // Handle any errors that occur during the fetch request
                console.error('Error fetching data:', error);
            });
    }, []);

    const truncateString = (str, num) => {
        if(str?.length > num){
           return str.slice(0, num) + '...'
        } else {
            return str
        }
    }

    return (
        <div className='w-full h-[550px] text-amber-50'>
            <div className='w-full h-full'>
                <div className='absolute w-full h-[550px] bg-gradient-to-r from-black'></div>
                <img className='w-full h-full object-cover' src={podcast?.image} alt={podcast?.title}/>


                <div className='absolute w-full top-[20%] p-4 md:p-8'>
                    <h1 className='text-3xl md:text-5xl font-bold'>{podcast?.title}</h1>

                    <div className='my-4'>
                        <button className='border bg-green-500 text-amber-50 border-gray-300 py-2 px-5'>Play</button>
                        <button className='border bg-blue-500 text-amber-50 border-gray-300 py-2 px-5 ml-4'>Listen later</button>
                    </div>

                    <p className='text-gray-300 text-sm'>Released: {podcast?.updated}</p>
                    <p className='w-full md:max-w-[60%] lg:max-w-[70%] xl:max-w-[80%] text-gray-100'>{truncateString(podcast?.description, 300)}</p>

                </div>
            </div>
        </div>
    );
}

export default Hero;