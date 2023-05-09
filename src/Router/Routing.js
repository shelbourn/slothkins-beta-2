import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../Landing';
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
                <Route path="/" element={<Landing />} />
                <Route
                    path="/k-means-clustering"
                    element={<KMeansContainer />}
                />
                <Route
                    path="/logistic-regression"
                    element={<LogRegressionContainer />}
                />
                <Route
                    path="/next-day-buy-signal-prediction"
                    element={<LogRegProbFields />}
                />
                <Route
                    path="/add-crypto-price-data"
                    element={<AddCryptoPriceData />}
                />
            </Routes>
        </Router>
    );
};

export default Routing;
