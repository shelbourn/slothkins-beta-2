import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Backdrop,
    Snackbar,
    Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { observer } from 'mobx-react-lite';

import { useStore } from '../Stores/StoreFunctions';
import {
    getAllCryptoNames,
    getAllCryptoPriceData
} from '../Services/CryptoCollectionService';

import './_styles/KMeans.css';

const KMeans = () => {
    const { CryptoStore } = useStore();

    const [infoMessage, setInfoMessage] = useState(false);

    /***
     * Retrieves all crypto names and hydrates the CryptoStore
     */
    const handleCryptoNames = () => {
        getAllCryptoNames();
    };

    /***
     * Retrieves all crypto prices by ticker and hydrates the CryptoStore
     */
    const handleCryptoPrices = () => {
        getAllCryptoPriceData();
    };

    const handleCryptoPercentChange = () => {
        setInfoMessage(true);
        CryptoStore.setCryptoPercentChange();
    };

    const handleCalculateAnnualMeanReturns = () => {
        CryptoStore.setAnnualMeanReturns();
    };

    const handleCalculatePriceVariances = () => {
        CryptoStore.setAnnualPriceVariances();
    };

    const handleCalculateKMeansData = () => {
        CryptoStore.setKMeansData();
    };

    const handleBackdropClick = () => {
        setInfoMessage(true);
    };

    const handleInfoClickaway = () => {
        setInfoMessage(false);
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={infoMessage}
                autoHideDuration={6000}
                onClose={handleInfoClickaway}
            >
                <Alert
                    severity="info"
                    sx={{ width: '100%' }}
                    onClose={handleInfoClickaway}
                >
                    <h3>Sloths are meticulous but work a bit slow</h3>
                    <h3>
                        Please allow the calculations to complete. It'll take
                        about 20 seconds.
                    </h3>
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: '9' }}
                open={CryptoStore.loading.cryptoPercentChange}
                onClick={handleBackdropClick}
            >
                <CircularProgress color="primary" size={100} />
            </Backdrop>
            <div className="kMeansFieldContainer">
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoNames}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoNames}
                    color="secondary"
                >
                    Get All Crypto Names
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPrices}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPrices}
                    disabled={!CryptoStore.loaded.cryptoNames}
                    color="secondary"
                >
                    Get All Crypto Prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPercentChange}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPercentChange}
                    disabled={!CryptoStore.loaded.cryptoPrices}
                    color="secondary"
                >
                    Calculate all percent changes in crypto prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculateAnnualMeanReturns}
                    variant="contained"
                    loading={CryptoStore.loading.annualMeanReturns}
                    disabled={!CryptoStore.loaded.cryptoPercentChange}
                    color="secondary"
                >
                    Calculate annual mean returns for all crypto prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculatePriceVariances}
                    variant="contained"
                    loading={CryptoStore.loading.annualPriceVariances}
                    disabled={!CryptoStore.loaded.annualMeanReturns}
                    color="secondary"
                >
                    Calculate annual price variances for all crypto prices
                </LoadingButton>
                <Button
                    className="kMeansField"
                    onClick={handleCalculateKMeansData}
                    variant="contained"
                    disabled={!CryptoStore.loaded.annualPriceVariances}
                    color="secondary"
                >
                    Calculate K-Means Data
                </Button>
            </div>
        </>
    );
};

export default observer(KMeans);
