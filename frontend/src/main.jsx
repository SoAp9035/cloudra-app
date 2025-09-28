import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
// Add Leaflet CSS once so the map and markers display correctly.
import "leaflet/dist/leaflet.css";
import './index.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
