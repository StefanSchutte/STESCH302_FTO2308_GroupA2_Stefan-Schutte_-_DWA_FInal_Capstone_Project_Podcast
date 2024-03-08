import { useState, useEffect } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy searching
import getShowsFromAPI from '../API/api.ts';
import Overlay from '../components/Views/Overlay.tsx'
import { useShows } from "../API/ShowsContext.tsx";

interface Podcast {
    id: string;
    title: string;
    image: string;
    seasons: number;
    updated: string;
    genres: string[];
}

/**
 * Filters component to manage searching, filtering, and sorting of podcasts.
 * @returns JSX.Element
 */
const Filters: React.FC = () => {
    const { podcasts } = useShows(); // Use the useShows hook to access pod
    /** State variable to store shows fetched from API */
    //const [shows, setShows] = useState<Podcast[]>([]);
    /** State variable to store filtered shows */
    const [filteredShows, setFilteredShows] = useState<Podcast[]>([]);
    /** State variable to store search term */
    const [searchTerm, setSearchTerm] = useState<string>('');
    /** State variable to track selected podcast */
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);


    /**
     * Fetch shows from API on component mount.
     * Initially set filtered shows to all shows.
     */
    // useEffect(() => {
    //     async function fetchData() {
    //         const data = await getShowsFromAPI();
    //         setShows(data);
    //         setFilteredShows(data);
    //     }
    //     fetchData();
    // }, []);
    useEffect(() => {
        setFilteredShows(podcasts); // Initialize filteredShows with the fetched podcasts
    }, [podcasts]);

    /**
     * Function to handle search input change
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        filterShows(e.target.value);
    };

    /**
     * Function to filter shows based on search term.
     * If search term is empty, show all shows
     */
    const filterShows = (term: string): void => {
        if (term === '') {
            setFilteredShows(/*shows*/ podcasts);
        } else {
            const fuse = new Fuse(/*shows*/podcasts, { keys: ['title'] });
            const result = fuse.search(term);
            setFilteredShows(result.map((item: Fuse.FuseResult<Podcast>) => item.item));
        }
    };

    /**
     * Function to handle podcast item click
     */
    const handlePodcastClick = (podcast: Podcast): void => {
        setSelectedPodcast(podcast);

    };

    /**
     * Function to close overlay.
     */
    const closeOverlay = (): void => {
        setSelectedPodcast(null);
    };

    /**
     * Function to handle sorting.
     */
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value;
        let sortedShows = [...filteredShows];
        if (value === 'az') {
            sortedShows.sort((a, b) => a.title.localeCompare(b.title));
        } else if (value === 'za') {
            sortedShows.sort((a, b) => b.title.localeCompare(a.title));
        } else if (value === 'asc') {
            sortedShows.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
        } else if (value === 'desc') {
            sortedShows.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
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
                            <div className='text-purple-500 mr-2 pr-4'>Search:</div>
                            <div className="mr-4 flex items-center text-yellow-400">
                            <input type="text" value={searchTerm} onChange={handleSearchChange}
                                   placeholder="Search by title"
                                   className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 bg-gray-600"/>
                            </div>
                        </div>
                        {/* Sorting options */}
                        <div>
                            <div className="mr-4 flex items-center mb-4">
                                <div className='text-purple-500 mr-2 pr-4'>Filter:</div>
                                <div className=''>
                                <select onChange={handleSortChange}
                                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500
                                        bg-gray-600 text-yellow-400
                                        ">
                                    <option value="az">Title A-Z</option>
                                    <option value="za">Title Z-A</option>
                                    <option value="asc">Date Ascending</option>
                                    <option value="desc">Date Descending</option>
                                </select>
                                </div>
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
                {selectedPodcast && (
                <Overlay item={selectedPodcast} showOverlay={true} closeOverlay={closeOverlay}/>
                )}
            </div>
        </div>
    );
};

export default Filters;