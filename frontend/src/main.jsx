// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from './App.jsx';
import Contact from './screens/Contact.jsx';
import About from './screens/About.jsx';

// Add Leaflet CSS once so the map and markers display correctly.
import 'leaflet/dist/leaflet.css';
import './index.css';

//

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  </StrictMode>
);
