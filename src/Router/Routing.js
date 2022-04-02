import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App.js';
import EndpointTest from '../Components/EndpointTest';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/endpoint-test" exact element={<EndpointTest />} />
            </Routes>
        </Router>
    );
};

export default Routing;
