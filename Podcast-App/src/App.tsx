import Navbar from './components/Nav/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
import {AuthContextProvider, useAuth} from "./auth/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import Filters from "./pages/Filters.tsx";
import ProtectedRoute from "./components/Protected Route/ProtectedRoute.tsx";
import AudioPlayer from "./components/audio/AudioPlayer.tsx";
import {AudioPlayerProvider} from "./components/audio/AudioPlayerContext.tsx";
import {useState} from "react";
import PodcastInfo from "./pages/PodcastInfo.tsx";

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App(): JSX.Element {

  return (
      <>
          <AuthContextProvider>
              <AudioPlayerProvider>


          <Navbar />
          < Routes>
              <Route path='/' element={<Home  />} />
              <Route path='/filter' element={<Filters />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/signup' element={<Signup />}/>
              <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>}/>
          </Routes>
              </AudioPlayerProvider>
          </AuthContextProvider>
      </>
  )
}

export default App

