import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import Contact from "./screens/Contact.jsx"
import About from "./screens/About.jsx"

// Add Leaflet CSS once so the map and markers display correctly.
import "leaflet/dist/leaflet.css";
import './index.css';

// react router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

