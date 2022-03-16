import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App.js';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<App />} />
            </Routes>
        </Router>
    );
};

export default Routing;
