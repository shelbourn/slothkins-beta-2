import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField, MenuItem, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';

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
        CryptoStore.setIsLoaded(
            [
                'logRegUsableData',
                'logRegFormattedData',
                'logRegTrainingData',
                'logRegModeledData'
            ],
            false
        );
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

    return (
        <div className="logRegFieldContainer">
            <motion.div
                className="logRegField"
                key={'selectCrypto'}
                initial={{ x: -1000 }}
                animate={{ x: 0, opacity: [0, 0.5, 1] }}
                transition={{
                    ease: 'easeIn',
                    duration: 1,
                    type: 'spring'
                }}
            >
                <TextField
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
                    sx={{ mb: 4 }}
                >
                    {CryptoStore.cryptoNames.map((ticker, i) => (
                        <MenuItem value={ticker} key={`${ticker}-${i}`}>
                            {ticker}
                        </MenuItem>
                    ))}
                </TextField>
            </motion.div>
            {selectedTicker && !CryptoStore.loaded.logRegUsableData && (
                <motion.div
                    className="logRegField"
                    key={'usableData'}
                    initial={selectedTicker && { x: -1000 }}
                    animate={
                        selectedTicker
                            ? { x: 0, opacity: [0, 0.5, 1] }
                            : { x: 1000, opacity: [1, 0.5, 0] }
                    }
                    transition={
                        selectedTicker
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
                        variant="contained"
                        onClick={handleSetLogRegressionUsableData}
                        color="secondary"
                        loading={CryptoStore.loading.logRegressionUsableData}
                        disabled={
                            !CryptoStore.loaded.cryptoNames ||
                            !selectedTicker ||
                            !CryptoStore.loaded.logRegRawData
                        }
                        size="large"
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
                        Sets the raw data for use with the Logistic Regression
                        Algorithm
                    </Typography>
                </motion.div>
            )}
            {selectedTicker &&
                CryptoStore.loaded.logRegUsableData &&
                !CryptoStore.loaded.logRegFormattedData && (
                    <motion.div
                        className="logRegField"
                        key={'formattedData'}
                        initial={
                            !CryptoStore.loaded.logRegFormattedData && {
                                x: -1000
                            }
                        }
                        animate={
                            !CryptoStore.loaded.logRegFormattedData
                                ? { x: 0, opacity: [0, 0.5, 1] }
                                : { x: 1000, opacity: [1, 0.5, 0] }
                        }
                        transition={
                            !CryptoStore.loaded.logRegFormattedData
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
                            variant="contained"
                            className="logRegField"
                            onClick={handleSetLogRegressionFormattedData}
                            color="secondary"
                            loading={
                                CryptoStore.loading.logRegressionFormattedData
                            }
                            disabled={!CryptoStore.loaded.logRegUsableData}
                            size="large"
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
                            Formats the raw data to make it usable with the
                            Logistic Regression algorithm
                        </Typography>
                    </motion.div>
                )}
            {selectedTicker &&
                CryptoStore.loaded.logRegUsableData &&
                CryptoStore.loaded.logRegFormattedData &&
                !CryptoStore.loaded.logRegTrainingData && (
                    <motion.div
                        className="logRegField"
                        key={'trainingData'}
                        initial={
                            !CryptoStore.loaded.logRegTrainingData && {
                                x: -1000
                            }
                        }
                        animate={
                            !CryptoStore.loaded.logRegTrainingData
                                ? { x: 0, opacity: [0, 0.5, 1] }
                                : { x: 1000, opacity: [1, 0.5, 0] }
                        }
                        transition={
                            !CryptoStore.loaded.logRegTrainingData
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
                            variant="contained"
                            onClick={handleSetLogRegressionTrainingData}
                            color="secondary"
                            loading={
                                CryptoStore.loading.logRegressionTrainingData
                            }
                            disabled={!CryptoStore.loaded.logRegFormattedData}
                            size="large"
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
                            Further formats the data to make it usable for
                            training the Logistic Regression model
                        </Typography>
                    </motion.div>
                )}
            {selectedTicker &&
                CryptoStore.loaded.logRegUsableData &&
                CryptoStore.loaded.logRegFormattedData &&
                CryptoStore.loaded.logRegTrainingData &&
                !CryptoStore.loaded.logRegModeledData && (
                    <motion.div
                        className="logRegField"
                        key={'modeledData'}
                        initial={
                            !CryptoStore.loaded.logRegModeledData && {
                                x: -1000
                            }
                        }
                        animate={
                            !CryptoStore.loaded.logRegModeledData
                                ? { x: 0, opacity: [0, 0.5, 1] }
                                : { x: 1000, opacity: [1, 0.5, 0] }
                        }
                        transition={
                            !CryptoStore.loaded.logRegModeledData
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
                            variant="contained"
                            onClick={handleModelPrediction}
                            color="secondary"
                            loading={
                                CryptoStore.loading.logRegressionModeledData
                            }
                            disabled={!CryptoStore.loaded.logRegTrainingData}
                            size="large"
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
                            Initiates the Logistic Regression training process
                            and returns the model
                        </Typography>
                    </motion.div>
                )}
            <motion.div
                className="helperTextLogReg"
                key={'helperTextLogReg'}
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
                <Typography variant="h6" color="tertiary">
                    On this page you will follow the process flow for retrieving
                    data for a single cryptocurrency from the database,
                    performing operations on the data to make it usable,
                    training the Logistic Regression algorithm, and applying the
                    Logistic Regression algorithm to the dataset.
                    <br />
                    <br />
                    Each button includes a description to provide information
                    about the operation it is performing. Once the algorithm has
                    been applied to the data then you will be navigated to a
                    page which displays the output in graphical form.
                </Typography>
            </motion.div>
        </div>
    );
};

export default observer(LogisticRegression);
