import Navbar from './components/Nav/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
import {AuthContextProvider} from "./auth/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import ProtectedRoute from "./components/Protected Route/ProtectedRoute.tsx";
import Filters from "./pages/Filters.tsx";
import PodcastInfo from "./pages/PodcastInfo.tsx";

/**
 * Function to handle saving podcast information.
 * Define the onSave function to be passed to the PodcastInfo component
 * @param {string} episodeId - ID of the episode
 * @param {string | null} seasonId - ID of the season (nullable)
 * @returns {void}
 */
const onSave = (episodeId: string, seasonId: string | null) => {
    // Implement the onSave logic here
    console.log('Save logic executed:', episodeId, seasonId);
};

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App(): JSX.Element {

  return (
      <>
          <AuthContextProvider>
          <Navbar />

          < Routes>
              <Route path='/' element={<Home  />} />
              <Route path='/filter' element={<Filters />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<Signup />}/>

              <Route path='/overlay' element={<PodcastInfo onSave={onSave} />}/>

              <Route path='/account' element={<Account />}/>

              {/*<Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>}/>*/}
          </Routes>
          </AuthContextProvider>
      </>
  )
}

export default App

