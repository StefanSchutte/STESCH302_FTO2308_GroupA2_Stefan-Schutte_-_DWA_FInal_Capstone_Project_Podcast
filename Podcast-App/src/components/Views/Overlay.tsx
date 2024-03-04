import React from 'react';

interface OverlayProps {
    item: {
        image: string;
        title: string;
        updated: string; // Add other necessary properties
        description: string;
        genres: string;
        seasons: number;
    };
    showOverlay: boolean;
    closeOverlay: () => void;
    podcast: any;
}

const Overlay: React.FC<OverlayProps> = ({ item, showOverlay, closeOverlay, podcast }) => {
    if (!showOverlay) return null;
    return (

                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 "></div>

                    <div className="text-yellow-400 fixed top-0 left0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-80 z-50 overflow-auto">

                        <div className="bg-black p-4 rounded-lg max-w-screen h-screen ">

                            <div className="w-full h-full bg-cover bg-center rounded-t-lg" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${item.image})`}}>
                                <div><img src={item.image} className='w-40 h-40 '/></div>
                                <div className='font-bold text-yellow-400 flex items-center'><h2 className='text-amber-50'>Title: </h2> {item.title}</div>
                                <div className='text-gray-500 flex items-center'><p className='text-amber-50'>Release Date: </p>{item.updated}</div>
                                <div className="whitespace-pre-wrap flex items-center">
                                    <p className='text-amber-50'>Description: </p> {item.description}
                                </div>
                                <div className='text-yellow-400 flex items-center'><p className='text-amber-50'>Genre: </p>{item.genres}</div>
                                <div className='text-yellow-400 flex items-center'><p className='text-amber-50'>Seasons: </p>{item.seasons}</div>
                                {/* Add more details here */}
                                <button onClick={closeOverlay}>Close</button>
                            </div>
                        </div>
                    </div>
                </>

    );
};

export default Overlay;

