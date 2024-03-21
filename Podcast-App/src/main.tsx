import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { ShowsProvider } from './api/ShowsContext.tsx';
import {AuthContextProvider} from "./auth/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <AuthContextProvider>
        <ShowsProvider>
            <App />
        </ShowsProvider>
      </AuthContextProvider>
  </BrowserRouter>,
)
