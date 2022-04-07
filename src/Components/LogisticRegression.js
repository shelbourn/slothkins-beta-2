import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';
import axios from 'axios';
import { Button } from '@mui/material';

import { useStore } from '../Stores/StoreFunctions';

const LogisticRegression = () => {
    const { CryptoStore } = useStore();

    useEffect(() => {
        const test = async () => {
            try {
                const response = await axios.get(
                    'https://slothkins-beta-2.herokuapp.com/detailed-crypto-data?ticker=AAVE'
                );
                if (response.data) {
                    CryptoStore.setLogRegressionRawData(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        test();
    }, []);

    const handleSetLogRegressionUsableData = () => {
        CryptoStore.setLogRegressionUsableData();
    };

    const handleSetLogRegressionFormattedData = () => {
        CryptoStore.setLogRegressionFormattedData();
    };

    const handleSetLogRegressionTrainingData = () => {
        CryptoStore.setLogRegressionTrainingData();
    };

    // console.log(JSON.parse(JSON.stringify(CryptoStore.logRegressionRawData)));
    // console.log(
    //     JSON.parse(JSON.stringify(CryptoStore.logRegressionUsableData))
    // );

    // console.log(
    //     JSON.parse(JSON.stringify(CryptoStore.logRegressionFormattedData))
    // );

    // TODO: Use Previous day close, current day open, Open 10 day MAV close-close = buy/sell

    const testData = [
        { A: 122323, B: 462, C: 2.4, D: 0.38, buy: true },
        { A: 12332, B: 2355, C: 2.1, D: 0.28, buy: false },
        { A: 414, B: 2356, C: 1.8, D: 0.18, buy: true },
        { A: 234325, B: 77435, C: 0.8, D: 0.68, buy: false },
        { A: 5453, B: 5462, C: 3.2, D: 0.88, buy: true },
        { A: 34634, B: 4634, C: 2.5, D: 0.78, buy: false },
        { A: 2346, B: 3478, C: 2.8, D: 0.98, buy: true },
        { A: 23623, B: 3462, C: 2.9, D: 0.32, buy: false },
        { A: 3462345, B: 24362, C: 1.9, D: 0.22, buy: true },
        { A: 23534, B: 24634, C: 2, D: 0.23, buy: false },
        { A: 2362, B: 3464, C: 3.5, D: 0.57, buy: true },
        { A: 236234, B: 34621, C: 4.1, D: 0.32, buy: false },
        { A: 2353, B: 774442, C: 1.1, D: 0.72, buy: true },
        { A: 235626, B: 34637, C: 1.2, D: 0.85, buy: false },
        { A: 23342, B: 346773, C: 3.1, D: 0.73, buy: true },
        { A: 236526, B: 21135, C: 3.5, D: 0.31, buy: false },
        { A: 2342, B: 34262, C: 2.9, D: 0.73, buy: true },
        { A: 23677, B: 2462, C: 1.9, D: 0.86, buy: false }
    ];

    const handleLogRegressionModel = () => {
        ObjectLearning.runLogisticReg(
            JSON.parse(JSON.stringify(CryptoStore.logRegressionTrainingData)),
            ['open', 'openOpen', 'mav'],
            'buy'
        );
    };

    const handleModelPrediction = () => {
        const model = ObjectLearning.runLogisticReg(
            JSON.parse(JSON.stringify(CryptoStore.logRegressionTrainingData)),
            ['open', 'openOpen', 'mav'],
            'buy'
        );
        const prediction = model.evalObject({
            open: 423,
            openOpen: -10,
            mav: 396
        });
        console.log(prediction);
    };

    return (
        <>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionUsableData}
            >
                Set Log Regression Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionFormattedData}
            >
                Set Log Regression Formatted Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionTrainingData}
            >
                Set Log Regression Training Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleLogRegressionModel}
            >
                Train Logistic Regression Model
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleModelPrediction}
            >
                Calculate Model Prediction
            </Button>
        </>
    );
};

export default observer(LogisticRegression);
