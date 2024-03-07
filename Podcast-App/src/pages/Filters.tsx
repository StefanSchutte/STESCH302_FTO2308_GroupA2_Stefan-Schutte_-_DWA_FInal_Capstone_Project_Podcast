import { useState, useEffect } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy searching
import getShowsFromAPI from '../components/api.ts';
import Overlay from '../components/Views/Overlay.tsx'


const Filters = () => {



    const [shows, setShows] = useState([]); // State variable to store shows fetched from API
    const [filteredShows, setFilteredShows] = useState([]); // State variable to store filtered shows
    const [searchTerm, setSearchTerm] = useState(''); // State variable to store search term

    const [selectedPodcast, setSelectedPodcast] = useState(null); // State variable to track selected podcast


    // Fetch shows from API on component mount
    useEffect(() => {
        async function fetchData() {
            const data = await getShowsFromAPI();
            setShows(data);
            setFilteredShows(data); // Initially set filtered shows to all shows
        }
        fetchData();
    }, []);

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterShows(e.target.value);
    };

    // Function to filter shows based on search term
    const filterShows = (term) => {
        if (term === '') {
            setFilteredShows(shows); // If search term is empty, show all shows
        } else {
            const fuse = new Fuse(shows, { keys: ['title'] });
            const result = fuse.search(term);
            setFilteredShows(result.map((item) => item.item));
        }
    };

    // Function to handle podcast item click
    const handlePodcastClick = (podcast) => {
        setSelectedPodcast(podcast);

    };

    // Function to close overlay
    const closeOverlay = () => {
        setSelectedPodcast(null);
    };

    // Function to handle sorting
    const handleSortChange = (e) => {
        const value = e.target.value;
        let sortedShows = [...filteredShows];
        if (value === 'az') {
            sortedShows.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === 'za') {
            sortedShows.sort((a, b) => b.title.localeCompare(a.title));
        } else if (value === 'asc') {
            sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        } else if (value === 'desc') {
            sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        }
        setFilteredShows(sortedShows);
    };

    return (
        <div className='w-full h-full' >
            <div className='w-full  px-4 py-24 '>
                <div>
                    <div className='flex flex-col mt-4'>
                        <div className='flex items-center mt-4 mb-4'>
                        {/* Search input */}
                            <div className='text-yellow-400 mr-2'>Search:</div>
                            <div className="mr-4 flex items-center">
                            <input type="text" value={searchTerm} onChange={handleSearchChange}
                                   placeholder="Search by title"
                                   className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"/>
                            </div>
                        </div>
                        {/* Sorting options */}
                        <div>
                            <div className="mr-4 flex items-center mb-4">
                                <div className='text-yellow-400 mr-2'>Filter:</div>
                                <select onChange={handleSortChange}
                                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500">
                                    <option value="az">Title A-Z</option>
                                    <option value="za">Title Z-A</option>
                                    <option value="asc">Date Ascending</option>
                                    <option value="desc">Date Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Show list */}
                    <div className='font-bold text-4xl mt-4 text-yellow-400'>Results:</div>
                    {/* change m to 2 */}
                    <ul className="w-full mt-2 cursor-pointer grid grid-cols-1 sm:grid-cols-2 gap-x-2 ">
                        {filteredShows.map((show) => (
                            <li onClick={() => handlePodcastClick(show)} key={show.id}
                                className="border border-gray-300 rounded-md bg-black my-1 p-4 py-3 text-yellow-400 flex items-center ">

                                <div className="flex flex-col  w-full">
                                    <div className="grid grid-cols-3 gap-1">
                                    <div className=" col-span-1 aspect-w-1 aspect-h-1 mb-2">
                                        <img src={show.image} alt={show.title}
                                             className=" object-cover w-40 h-40"
                                        />
                                    </div>
                                        <div className="col-span-2 flex flex-col justify-between">
                                        <div className='text-base sm:text-lg md:text-xl xs:text-xs '>
                                            <div className="flex items-center font-bold">
                                                <h1 className='text-amber-50 pr-4'>Title:</h1>
                                                <div >{show.title}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Seasons:</p>
                                                <div className='text-gray-400'>{show.seasons}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Last
                                                    updated:</p>
                                                <div className='text-gray-400'>{new Date(show.updated).toLocaleDateString()}</div>
                                            </div>

                                            <div className="flex items-center ">
                                                <p className='text-amber-50 pr-4'>Genres:</p>
                                                <div className='text-gray-400'>{show.genres.join(', ')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <Overlay item={selectedPodcast} showOverlay={selectedPodcast !== null} closeOverlay={closeOverlay}/>
            </div>
        </div>
    );
};

export default Filters;