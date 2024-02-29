import Navbar from './components/NavBar/Navbar.tsx'
import Home from './pages/Home.tsx'
import {Route, Routes} from "react-router-dom";
function App() {

  return (
      <>
          <Navbar />
          < Routes>
              <Route path='/' element={<Home  />} />

          </Routes>

      </>
  )
}

export default App

