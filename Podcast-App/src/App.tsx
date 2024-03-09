import Navbar from './components/NavBar/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
import {AuthContextProvider} from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import ProtectedRoute from "./components/Protected Route/ProtectedRoute.tsx";
import Filters from "./pages/Filters.tsx";
import List from './pages/List.tsx'
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
              <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>}/>

              <Route path="/episodeList" element={<List/>} />
          </Routes>
          </AuthContextProvider>
      </>
  )
}

export default App

