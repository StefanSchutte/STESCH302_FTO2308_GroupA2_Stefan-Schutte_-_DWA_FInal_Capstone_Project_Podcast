// import React, { useState, useEffect } from 'react';
// import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy searching
// import getShowsFromAPI from '/src/api.ts';
// import Navbar from "../components/NavBar/Navbar.tsx";
//
// const Filters = () => {
//     const [shows, setShows] = useState([]); // State variable to store shows fetched from API
//     const [filteredShows, setFilteredShows] = useState([]); // State variable to store filtered shows
//     const [searchTerm, setSearchTerm] = useState(''); // State variable to store search term
//
//     // Fetch shows from API on component mount
//     useEffect(() => {
//         async function fetchData() {
//             const data = await getShowsFromAPI();
//             setShows(data);
//             setFilteredShows(data); // Initially set filtered shows to all shows
//         }
//         fetchData();
//     }, []);
//
//     // Function to handle search input change
//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//         filterShows(e.target.value);
//     };
//
//     // Function to filter shows based on search term
//     const filterShows = (term) => {
//         if (term === '') {
//             setFilteredShows(shows); // If search term is empty, show all shows
//         } else {
//             const fuse = new Fuse(shows, { keys: ['title'] });
//             const result = fuse.search(term);
//             setFilteredShows(result.map((item) => item.item));
//         }
//     };
//
//     // Function to handle sorting
//     const handleSortChange = (e) => {
//         const value = e.target.value;
//         let sortedShows = [...filteredShows];
//         if (value === 'az') {
//             sortedShows.sort((a, b) => a.title.localeCompare(b.title));
//         } else if (value === 'za') {
//             sortedShows.sort((a, b) => b.title.localeCompare(a.title));
//         } else if (value === 'asc') {
//             sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
//         } else if (value === 'desc') {
//             sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
//         }
//         setFilteredShows(sortedShows);
//     };
//
//     return (
//         <div>
//             <Navbar />
//
//             <div className='flex items-center'>
//                 <div>
//                 {/* Search input */}
//
//                 <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search by title"/>
//                 </div>
//                 {/* Sorting options */}
//
//                 <select onChange={handleSortChange}>
//                     <option value="az">Title A-Z</option>
//                     <option value="za">Title Z-A</option>
//                     <option value="asc">Date Ascending</option>
//                     <option value="desc">Date Descending</option>
//                 </select>
//                 {/* Show list */}
//                 <div className='font-bold'>Results:</div>
//                 <ul>
//                     {filteredShows.map((show) => (
//                         <li key={show.id}>
//                             {show.title}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };
//
// export default Filters;
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy searching
import getShowsFromAPI from '/src/api.ts';
import Navbar from "../components/NavBar/Navbar.tsx";
import Overlay from '../components/Views/Overlay.tsx'
import Row from "../components/Views/Row.tsx";

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
        <div className='w-full h-screen'>

            <div className='w-full  px-4 py-24 flex items-center'>
                <div>
                    <div className='flex items-center mt-4'>
                        {/* Search input */}
                        <div>Search:</div>
                        <div className="mr-4 flex items-center">
                            <input type="text" value={searchTerm} onChange={handleSearchChange}
                                   placeholder="Search by title"
                                   className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"/>
                        </div>
                        {/* Sorting options */}
                        <div className="mr-4 flex items-center">
                            <div>Filter:</div>
                            <select onChange={handleSortChange}
                                    className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500">
                                <option value="az">Title A-Z</option>
                                <option value="za">Title Z-A</option>
                                <option value="asc">Date Ascending</option>
                                <option value="desc">Date Descending</option>
                            </select>
                        </div>
                    </div>
                    {/* Show list */}
                    <div className='font-bold mt-4'>Results:</div>
                    <ul className="mt-2">
                        {filteredShows.map((show) => (
                            <li key={show.id} className="border-b border-gray-300 py-2"
                                onClick={() => handlePodcastClick(show)}>{show.title}</li>
                        ))}
                    </ul>

                    {/*<Row className="mt-2">*/}
                    {/*    {filteredShows.map((show) => (*/}
                    {/*        <div key={show.id} className="border-b border-gray-300 py-2 cursor-pointer" onClick={() => handlePodcastClick(show)}>*/}
                    {/*            {show.title}*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</Row>*/}

                </div>
                {/* Render Overlay component */}
                <Overlay item={selectedPodcast} showOverlay={selectedPodcast !== null} closeOverlay={closeOverlay}/>

            </div>

        </div>
    );
};

export default Filters;