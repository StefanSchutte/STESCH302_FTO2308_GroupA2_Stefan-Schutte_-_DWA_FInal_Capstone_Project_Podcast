import React from 'react';

/**
 * Props interface for the Genres component.
 */
interface GenresProps {
    genres: string[];

}

/**
 * Component to render genres based on their IDs.
 * Mapping genre IDs to genre titles
 * @param genres - Array of genre IDs.
 * @returns JSX element representing the rendered genres.
 */
const Genres: React.FC<GenresProps> = ({ genres }) => {

    if (!genres) {
        return null; // or any fallback UI you prefer
    }

    const genreMapping: Record<string, string> = {
        '1': 'Personal Growth',
        '2': 'True Crime and Investigative Journalism',
        '3': 'History',
        '4': 'Comedy',
        '5': 'Entertainment',
        '6': 'Business',
        '7': 'Fiction',
        '8': 'News',
        '9': 'Kids and Family'
    };

    return (
        <div className='text-gray-400'>
            {genres.map((genreId, index) => (
                <span key={index}>
                    {genreMapping[genreId]}
                    {index < genres.length - 2 && ', '}
                    {index === genres.length - 2 && ' and '}
                    {index === genres.length - 1 && ''}
                </span>
            ))}
        </div>
    );
};

export default Genres;