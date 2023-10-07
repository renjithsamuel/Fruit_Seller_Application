import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter  basename={import.meta.env.PUBLIC_URL}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
)
