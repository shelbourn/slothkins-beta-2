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
import { motion } from 'framer-motion';

import { useStore } from '../Stores/StoreFunctions';
import {
    getAllCryptoNames,
    getAllCryptoPriceData
} from '../Services/CryptoCollectionService';

import './_styles/KMeans.css';

const KMeans = () => {
    const { CryptoStore } = useStore();

    /***
     * Local state to handle display of info alert modal
     */

    const [infoMessage, setInfoMessage] = useState(false);

    /***
     * Component handlers
     */

    const handleCryptoNames = () => {
        getAllCryptoNames();
    };

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
                    <h3>Sloths are careful and meticulous with their work.</h3>
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
            <div className="kMeansComponentContainer">
                <div className="kMeansFieldContainer">
                    {!CryptoStore.loaded.cryptoNames && (
                        <motion.div
                            className="kMeansField"
                            key={'getCryptoNames'}
                            initial={{ x: -1000 }}
                            animate={
                                !CryptoStore.loaded.cryptoNames
                                    ? { x: 0, opacity: [0, 0.5, 1] }
                                    : { x: 1000, opacity: [1, 0.5, 0] }
                            }
                            transition={
                                !CryptoStore.loaded.cryptoNames
                                    ? {
                                          ease: 'easeIn',
                                          duration: 1,
                                          type: 'spring'
                                      }
                                    : {
                                          ease: 'easeOut',
                                          duration: 1,
                                          type: 'spring'
                                      }
                            }
                        >
                            <LoadingButton
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
                                Fetch all cryptocurrency tickers from the
                                database
                            </Typography>
                        </motion.div>
                    )}
                    {CryptoStore.loaded.cryptoNames &&
                        !CryptoStore.loaded.cryptoPrices && (
                            <motion.div
                                className="kMeansField"
                                key={'getCryptoPrices'}
                                initial={
                                    !CryptoStore.loaded.cryptoPrices && {
                                        x: -1000
                                    }
                                }
                                animate={
                                    !CryptoStore.loaded.cryptoPrices
                                        ? { x: 0, opacity: [0, 0.5, 1] }
                                        : { x: 1000, opacity: [1, 0.5, 0] }
                                }
                                transition={
                                    !CryptoStore.loaded.cryptoPrices
                                        ? {
                                              ease: 'easeIn',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                        : {
                                              ease: 'easeOut',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                }
                            >
                                <LoadingButton
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
                                    Fetch all cryptocurrency price data for all
                                    currencies from the database
                                </Typography>
                            </motion.div>
                        )}
                    {CryptoStore.loaded.cryptoNames &&
                        CryptoStore.loaded.cryptoPrices &&
                        !CryptoStore.loaded.cryptoPercentChange && (
                            <motion.div
                                className="kMeansField"
                                key={'calcPercentChange'}
                                initial={
                                    !CryptoStore.loaded.cryptoPercentChange && {
                                        x: -1000
                                    }
                                }
                                animate={
                                    !CryptoStore.loaded.cryptoPercentChange
                                        ? { x: 0, opacity: [0, 0.5, 1] }
                                        : { x: 1000, opacity: [1, 0.5, 0] }
                                }
                                transition={
                                    !CryptoStore.loaded.cryptoPercentChange
                                        ? {
                                              ease: 'easeIn',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                        : {
                                              ease: 'easeOut',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                }
                            >
                                <LoadingButton
                                    onClick={handleCryptoPercentChange}
                                    variant="contained"
                                    loading={
                                        CryptoStore.loading.cryptoPercentChange
                                    }
                                    disabled={!CryptoStore.loaded.cryptoPrices}
                                    color="secondary"
                                    size="large"
                                >
                                    Calculate all percent changes in crypto
                                    prices
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
                                    Calculate the percent change between opening
                                    prices for each day and all currencies (this
                                    calculation takes some time)
                                </Typography>
                            </motion.div>
                        )}
                    {CryptoStore.loaded.cryptoNames &&
                        CryptoStore.loaded.cryptoPrices &&
                        CryptoStore.loaded.cryptoPercentChange &&
                        !CryptoStore.loaded.annualMeanReturns && (
                            <motion.div
                                className="kMeansField"
                                key={'calcMeanReturns'}
                                initial={
                                    !CryptoStore.loaded.annualMeanReturns && {
                                        x: -1000
                                    }
                                }
                                animate={
                                    !CryptoStore.loaded.annualMeanReturns
                                        ? { x: 0, opacity: [0, 0.5, 1] }
                                        : { x: 1000, opacity: [1, 0.5, 0] }
                                }
                                transition={
                                    !CryptoStore.loaded.annualMeanReturns
                                        ? {
                                              ease: 'easeIn',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                        : {
                                              ease: 'easeOut',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                }
                            >
                                <LoadingButton
                                    onClick={handleCalculateAnnualMeanReturns}
                                    variant="contained"
                                    loading={
                                        CryptoStore.loading.annualMeanReturns
                                    }
                                    disabled={
                                        !CryptoStore.loaded.cryptoPercentChange
                                    }
                                    color="secondary"
                                    size="large"
                                >
                                    Calculate annual mean returns for all crypto
                                    prices
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
                            </motion.div>
                        )}
                    {CryptoStore.loaded.cryptoNames &&
                        CryptoStore.loaded.cryptoPrices &&
                        CryptoStore.loaded.cryptoPercentChange &&
                        CryptoStore.loaded.annualMeanReturns &&
                        !CryptoStore.loaded.annualPriceVariances && (
                            <motion.div
                                className="kMeansField"
                                key={'calcPriceVariances'}
                                initial={
                                    !CryptoStore.loaded
                                        .annualPriceVariances && {
                                        x: -1000
                                    }
                                }
                                animate={
                                    !CryptoStore.loaded.annualPriceVariances
                                        ? { x: 0, opacity: [0, 0.5, 1] }
                                        : { x: 1000, opacity: [1, 0.5, 0] }
                                }
                                transition={
                                    !CryptoStore.loaded.annualPriceVariances
                                        ? {
                                              ease: 'easeIn',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                        : {
                                              ease: 'easeOut',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                }
                            >
                                <LoadingButton
                                    onClick={handleCalculatePriceVariances}
                                    variant="contained"
                                    loading={
                                        CryptoStore.loading.annualPriceVariances
                                    }
                                    disabled={
                                        !CryptoStore.loaded.annualMeanReturns
                                    }
                                    color="secondary"
                                    size="large"
                                >
                                    Calculate annual price variances for all
                                    crypto prices
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
                                    Calculate the average annual price variances
                                    for all cryptocurrencies
                                </Typography>
                            </motion.div>
                        )}
                    {CryptoStore.loaded.cryptoNames &&
                        CryptoStore.loaded.cryptoPrices &&
                        CryptoStore.loaded.cryptoPercentChange &&
                        CryptoStore.loaded.annualMeanReturns &&
                        CryptoStore.loaded.annualPriceVariances &&
                        !CryptoStore.loaded.kMeansData && (
                            <motion.div
                                className="kMeansField"
                                key={'calcKMeansData'}
                                initial={
                                    !CryptoStore.loaded.kMeansData && {
                                        x: -1000
                                    }
                                }
                                animate={
                                    !CryptoStore.loaded.kMeansData
                                        ? { x: 0, opacity: [0, 0.5, 1] }
                                        : { x: 1000, opacity: [1, 0.5, 0] }
                                }
                                transition={
                                    !CryptoStore.loaded.kMeansData
                                        ? {
                                              ease: 'easeIn',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                        : {
                                              ease: 'easeOut',
                                              duration: 1,
                                              type: 'spring'
                                          }
                                }
                            >
                                <Button
                                    onClick={handleCalculateKMeansData}
                                    variant="contained"
                                    disabled={
                                        !CryptoStore.loaded.annualPriceVariances
                                    }
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
                                    Formats the data into a usable structure for
                                    use with the K-means algorithm
                                </Typography>
                            </motion.div>
                        )}
                </div>
                <motion.div
                    className="helperTextKMeans"
                    key={'helperTextKMeans'}
                    initial={{
                        y: 1000
                    }}
                    animate={{ y: 0, opacity: [0, 0.5, 1] }}
                    transition={{
                        ease: 'easeIn',
                        duration: 1.5,
                        type: 'spring',
                        delay: 2
                    }}
                >
                    <Typography variant="h6" color="info">
                        On this page you will follow the process flow for
                        retrieving cryptocurrency data from the database,
                        performing operations on the data to make it usable,
                        training the K-means algorithm, and applying the K-means
                        algorithm to the dataset.
                        <br />
                        <br />
                        Each button includes a description to provide
                        information about the operation it is performing. Once
                        the algorithm has been applied to the data then you will
                        be navigated to a page which displays the output in
                        graphical form.
                    </Typography>
                </motion.div>
            </div>
        </>
    );
};

export default observer(KMeans);
