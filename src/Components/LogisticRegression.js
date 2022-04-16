import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField, MenuItem, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useStore } from '../Stores/StoreFunctions';
import { getAllCryptoNames } from '../Services/CryptoCollectionService';
import { getDetailedCryptoData } from '../Services/CryptoService';

import './_styles/LogisticRegression.css';

const LogisticRegression = () => {
    const { CryptoStore } = useStore();

    const [selectedTicker, setSelectedTicker] = useState('');

    useEffect(() => {
        getAllCryptoNames();
    }, []);

    const handleSelectedTicker = (event) => {
        setSelectedTicker(event.target.value);
        getDetailedCryptoData(event.target.value);
    };

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

    // console.log(JSON.parse(JSON.stringify(CryptoStore.logRegressionRawData)));

    return (
        <div className="logRegFieldContainer">
            <TextField
                className="logRegField"
                variant="outlined"
                select
                id="log-reg-currency-select"
                name="selectedTicker"
                value={selectedTicker}
                onChange={handleSelectedTicker}
                label="Currency Ticker"
                helperText="Please select a currency ticker"
                color="primary"
                defaultValue=""
                disabled={!CryptoStore.loaded.cryptoNames}
                sx={{ mb: 2 }}
            >
                {CryptoStore.cryptoNames.map((ticker, i) => (
                    <MenuItem value={ticker} key={`${ticker}-${i}`}>
                        {ticker}
                    </MenuItem>
                ))}
            </TextField>
            <LoadingButton
                variant="contained"
                className="logRegField"
                onClick={handleSetLogRegressionUsableData}
                color="secondary"
                loading={CryptoStore.loading.logRegressionUsableData}
                disabled={
                    !CryptoStore.loaded.cryptoNames ||
                    !selectedTicker ||
                    !CryptoStore.loaded.logRegRawData
                }
            >
                Set Log Regression Data
            </LoadingButton>
            <Typography
                variant="subtitle2"
                sx={{
                    fontStyle: 'italic',
                    mb: 2,
                    textAlign: 'center',
                    maxWidth: 600
                }}
            >
                Sets the raw data for use with the Logistic Regression Algorithm
            </Typography>
            <LoadingButton
                variant="contained"
                className="logRegField"
                onClick={handleSetLogRegressionFormattedData}
                color="secondary"
                loading={CryptoStore.loading.logRegressionFormattedData}
                disabled={!CryptoStore.loaded.logRegUsableData}
            >
                Set Log Regression Formatted Data
            </LoadingButton>
            <Typography
                variant="subtitle2"
                sx={{
                    fontStyle: 'italic',
                    mb: 2,
                    textAlign: 'center',
                    maxWidth: 600
                }}
            >
                Formats the raw data to make it usable with the Logistic
                Regression algorithm
            </Typography>
            <LoadingButton
                variant="contained"
                className="logRegField"
                onClick={handleSetLogRegressionTrainingData}
                color="secondary"
                loading={CryptoStore.loading.logRegressionTrainingData}
                disabled={!CryptoStore.loaded.logRegFormattedData}
            >
                Set Log Regression Training Data
            </LoadingButton>
            <Typography
                variant="subtitle2"
                sx={{
                    fontStyle: 'italic',
                    mb: 2,
                    textAlign: 'center',
                    maxWidth: 600
                }}
            >
                Further formats the data to make it usable for training the
                Logistic Regression model
            </Typography>
            <LoadingButton
                variant="contained"
                className="logRegField"
                onClick={handleModelPrediction}
                color="secondary"
                loading={CryptoStore.loading.logRegressionModeledData}
                disabled={!CryptoStore.loaded.logRegTrainingData}
            >
                Calculate Model Prediction
            </LoadingButton>
            <Typography
                variant="subtitle2"
                sx={{
                    fontStyle: 'italic',
                    mb: 2,
                    textAlign: 'center',
                    maxWidth: 600
                }}
            >
                Initiates the Logistic Regression training process and returns
                the model
            </Typography>
        </div>
    );
};

export default observer(LogisticRegression);
