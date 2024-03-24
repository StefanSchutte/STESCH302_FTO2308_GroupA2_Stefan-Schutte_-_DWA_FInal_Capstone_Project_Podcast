import Navbar from './components/Nav/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
import {AuthContextProvider} from "./services/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import Filters from "./pages/Filters.tsx";
import ProtectedRoute from "./components/Protected Route/ProtectedRoute.tsx";
import {AudioPlayerProvider, useAudioPlayer} from "./components/audio/AudioPlayerContext.tsx";
import SharedPodcast from "./components/Saved Shows/SharedPodcast.tsx";
import AudioPlayer from "./components/audio/AudioPlayer.tsx";
import React, { useEffect } from 'react';

/**
 * Main application component.
 * @returns {JSX.Element}
 */
function App(): JSX.Element {
    // const { setAudioUrl } = useAudioPlayer();
    // useEffect(() => {
    //     const lastListenedUrl = localStorage.getItem('last_listened_url');
    //     if (lastListenedUrl) {
    //         setAudioUrl(lastListenedUrl);
    //     }
    // }, [setAudioUrl]);

        return (
      <>
          <AuthContextProvider>
              <AudioPlayerProvider>
                  <Navbar />
                  <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/filter' element={<Filters />} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/signup' element={<Signup />} />
                      <Route path='/account' element={<ProtectedRoute>{() => <Account />}</ProtectedRoute>} />
                      <Route path="/shared-favorites/:userId/:episodeId" element={<SharedPodcast />} />
                  </Routes>
                  <AudioPlayerComponent />
              </AudioPlayerProvider>
          </AuthContextProvider>
      </>
  )
}


const AudioPlayerComponent = () => {
    const { showAudioPlayer, setShowAudioPlayer, audioUrl } = useAudioPlayer();

    return showAudioPlayer ? (
        <AudioPlayer
            audioUrl={audioUrl}
            onClose={() => setShowAudioPlayer(false)}
        />
    ) : null;
};


export default App

