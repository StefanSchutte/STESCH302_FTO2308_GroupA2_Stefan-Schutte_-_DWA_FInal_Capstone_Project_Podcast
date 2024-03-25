import Navbar from './components/Nav/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
import {AuthContextProvider} from "./services/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import Filters from "./pages/Filters.tsx";
import ProtectedRoute from "./components/Protected Route/ProtectedRoute.tsx";
import {AudioPlayerProvider, useAudioPlayer} from "./services/AudioPlayerContext.tsx";
import SharedPodcast from "./components/Saved Shows/SharedPodcast.tsx";
import AudioPlayer from "./components/audio/AudioPlayer.tsx";

/**
 * Main application component.
 * wraps the entire application with context providers (AuthContextProvider and AudioPlayerProvider).
 * Make authentication and audio player functionality available throughout the component tree.
 * Routes component from React Router is used to define the routes of the application, mapping each route path to a corresponding component.
 * ProtectedRoute component is used for the '/account' route, ensuring that the Account component is only accessible to authenticated users.
 */
function App(): JSX.Element {

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

/**
 * Rendering the AudioPlayer component based on the showAudioPlayer state.
 * Utilizes the 'useAudioPlayer' hook to access the 'showAudioPlayer', 'setShowAudioPlayer', and 'audioUrl' variables.
 * If showAudioPlayer is true, audio player displayed.
 * It renders the AudioPlayer component with the provided audioUrl and an onClose callback to toggle the showAudioPlayer state to false.
 */
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

