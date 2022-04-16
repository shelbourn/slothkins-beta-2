import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../Landing.js';
import KMeansContainer from '../Containers/KMeansContainer';
import LogRegressionContainer from '../Containers/LogRegressionContainer';
import MainHeader from '../Common/MainHeader';

const Routing = () => {
    return (
        <Router>
            <MainHeader />
            <Routes>
                <Route path="/" exact element={<Landing />} />
                <Route
                    path="/k-means-clustering"
                    exact
                    element={<KMeansContainer />}
                />
                <Route
                    path="/logistic-regression"
                    exact
                    element={<LogRegressionContainer />}
                />
            </Routes>
        </Router>
    );
};

export default Routing;
