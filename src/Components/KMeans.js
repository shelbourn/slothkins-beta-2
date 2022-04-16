import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Backdrop,
    Snackbar,
    Alert,
    Typography
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
                    <h3>Sloths are careful and calculated with their work.</h3>
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
                    size="large"
                >
                    Get All Crypto Names
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
                    Fetch all cryptocurrency tickers from the database
                </Typography>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPrices}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPrices}
                    disabled={!CryptoStore.loaded.cryptoNames}
                    color="secondary"
                    size="large"
                >
                    Get All Crypto Prices
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
                    Fetch all cryptocurrency price data for all currencies from
                    the database
                </Typography>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPercentChange}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPercentChange}
                    disabled={!CryptoStore.loaded.cryptoPrices}
                    color="secondary"
                    size="large"
                >
                    Calculate all percent changes in crypto prices
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
                    Calculate the percent change between opening prices for each
                    day and all currencies (this calculation takes some time)
                </Typography>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculateAnnualMeanReturns}
                    variant="contained"
                    loading={CryptoStore.loading.annualMeanReturns}
                    disabled={!CryptoStore.loaded.cryptoPercentChange}
                    color="secondary"
                    size="large"
                >
                    Calculate annual mean returns for all crypto prices
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
                    Calculate the average annual returns for all
                    cryptocurrencies
                </Typography>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculatePriceVariances}
                    variant="contained"
                    loading={CryptoStore.loading.annualPriceVariances}
                    disabled={!CryptoStore.loaded.annualMeanReturns}
                    color="secondary"
                    size="large"
                >
                    Calculate annual price variances for all crypto prices
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
                    Calculate the average annual price variances for all
                    cryptocurrencies
                </Typography>
                <Button
                    className="kMeansField"
                    onClick={handleCalculateKMeansData}
                    variant="contained"
                    disabled={!CryptoStore.loaded.annualPriceVariances}
                    color="secondary"
                    size="large"
                >
                    Calculate K-Means Data
                </Button>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        textAlign: 'center',
                        maxWidth: 600
                    }}
                >
                    Formats the data into a usable structure for use with the
                    K-means algorithm
                </Typography>
            </div>
        </>
    );
};

export default observer(KMeans);
