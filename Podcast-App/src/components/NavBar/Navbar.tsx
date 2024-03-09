import { useState} from 'react';
import { Link, } from 'react-router-dom';
import Menu from "./Menu.tsx";
import menuFav from '/menu.png'

/**
 * Functional component representing the navigation bar.
 * @returns JSX.Element
 */
function Navbar(): JSX.Element {

    const [showOverlay, setShowOverlay] = useState(false);

    /**
     * Toggles the menu overlay visibility.
     */
    const handleMenuClick = () => {
        setShowOverlay(!showOverlay);
    };

    /**
     * Closes the menu overlay.
     */
    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <div className="flex items-center justify-between p-4 z-[80] w-full absolute brightness-30 ">
            <Link to="/">
                <h1 className="text-amber-50 text-4xl sm:text-5xl md:text-6xl font-bold cursor-pointer ">
                    PODCASTED</h1>
            </Link>
            <button onClick={handleMenuClick} className="cursor-pointer flex items-center ">
                <img src={menuFav} alt="Menu" />
            </button>
            {showOverlay && <Menu closeOverlay={closeOverlay}/>}
        </div>
    );
}

export default Navbar;

