import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App.js';
import KMeans from '../Components/KMeans';
import LogisticRegression from '../Components/LogisticRegression';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/k-means-analysis" exact element={<KMeans />} />
                <Route
                    path="/other-ml-algo"
                    exact
                    element={<LogisticRegression />}
                />
            </Routes>
        </Router>
    );
};

export default Routing;
