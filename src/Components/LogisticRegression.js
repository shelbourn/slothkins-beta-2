import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useStore } from '../Stores/StoreFunctions';
import { getAllCryptoNames } from '../Services/CryptoCollectionService';
import { getDetailedCryptoData } from '../Services/CryptoService';

import './_styles/LogisticRegression.css';

const LogisticRegression = () => {
    const { CryptoStore } = useStore();

    const [selectedTicker, setSelectedTicker] = useState('');
    const [loading, setLoading] = useState({
        modeledData: false
    });

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
        </div>
    );
};

export default observer(LogisticRegression);
