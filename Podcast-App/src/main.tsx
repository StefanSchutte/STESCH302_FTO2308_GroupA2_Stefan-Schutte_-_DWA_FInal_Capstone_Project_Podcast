import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { ShowsProvider } from '../src/API/ShowsContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <ShowsProvider>
    <App />
      </ShowsProvider>
  </BrowserRouter>,
)
