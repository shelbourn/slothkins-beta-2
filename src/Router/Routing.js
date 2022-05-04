import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../Landing.js';
import KMeansContainer from '../Containers/KMeansContainer';
import LogRegressionContainer from '../Containers/LogRegressionContainer';
import LogRegProbFields from '../Components/LogRegProbFields';
import AddCryptoPriceData from '../Components/AddCryptoPriceData';

import MainHeader from '../Common/MainHeader';

/***
 * Declares all app routes and handles routing
 */

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
                <Route
                    path="/next-day-buy-signal-prediction"
                    exact
                    element={<LogRegProbFields />}
                />
                <Route
                    path="/add-crypto-price-data"
                    exact
                    element={<AddCryptoPriceData />}
                />
            </Routes>
        </Router>
    );
};

export default Routing;
