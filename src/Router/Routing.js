import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App.js';
import KMeans from '../Components/KMeans';
import LogRegressionContainer from '../Containers/LogRegressionContainer';

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<App />} />
                <Route path="/k-means-analysis" exact element={<KMeans />} />
                <Route
                    path="/logistic-regression-analysis"
                    exact
                    element={<LogRegressionContainer />}
                />
            </Routes>
        </Router>
    );
};

export default Routing;
