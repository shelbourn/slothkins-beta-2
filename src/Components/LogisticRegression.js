import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';
import axios from 'axios';
import { Button } from '@mui/material';

import LogRegChart from './LogRegChart';
import LogRegProbFields from './LogRegProbFields.js';

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

    const handleModelPrediction = () => {
        CryptoStore.setLogRegressionModeledData();
    };

    return (
        <>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionUsableData}
                color="secondary"
            >
                Set Log Regression Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionFormattedData}
                color="secondary"
            >
                Set Log Regression Formatted Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleSetLogRegressionTrainingData}
                color="secondary"
            >
                Set Log Regression Training Data
            </Button>
            <Button
                variant="contained"
                className="endpointTest"
                onClick={handleModelPrediction}
                color="secondary"
            >
                Calculate Model Prediction
            </Button>
            {CryptoStore.loaded.logRegModeledData && <LogRegChart />}
            <LogRegProbFields />
        </>
    );
};

export default observer(LogisticRegression);
