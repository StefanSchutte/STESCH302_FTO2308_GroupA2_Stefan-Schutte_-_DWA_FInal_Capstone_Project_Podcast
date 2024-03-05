import { useState} from 'react';
import { Link, } from 'react-router-dom';
import Menu from "./Menu.tsx";
import menuFav from '/menu.png'

function Navbar(): JSX.Element {

    const [showOverlay, setShowOverlay] = useState(false);

    const handleMenuClick = () => {
        setShowOverlay(!showOverlay);
    };

    const closeOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <div className="flex items-center justify-between p-4 z-[80] w-full absolute brightness-30 ">
            <Link to="/">
                <h1 className="text-amber-50 text-6xl font-bold cursor-pointer ">
                    PODCASTED</h1>
            </Link>
            <button onClick={handleMenuClick} className="cursor-pointer flex items-center">
                <img src={menuFav} alt="Menu"/>
            </button>
            {showOverlay && <Menu closeOverlay={closeOverlay}/>}
        </div>
    );
}

export default Navbar;

