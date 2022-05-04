import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem, Typography, Link } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import Moment from 'moment';
import { motion } from 'framer-motion';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/AddCryptoPriceData.css';

const AddCryptoPriceData = () => {
    const { CryptoStore } = useStore();

    /***
     * Local state to manage form fields
     */

    const [fieldData, setFieldData] = useState({
        selectedTicker: '',
        sNo: '',
        name: '',
        symbol: '',
        rawDate: '',
        date: '',
        high: '',
        low: '',
        open: '',
        close: '',
        volume: '',
        marketcap: ''
    });

    /***
     * Local state to manage section loading
     */

    const [loaded, setLoaded] = useState({
        hydrateFields: false,
        hydratedFields: false
    });

    /***
     * Pre-loads all cryto names so they can be mapped to select list
     */

    useEffect(() => {
        const getCryptoNames = async () => {
            try {
                const response = await axios.get(
                    'https://slothkins-beta-2.herokuapp.com/crypto-names'
                );
                if (response.data) {
                    CryptoStore.setCryptoNames(response.data[0]['array']);
                    CryptoStore.setIsLoaded(['cryptoNames'], true);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getCryptoNames();
    }, []);

    /***
     * Component handlers
     */

    const handleFetchRawCurrencyData = async () => {
        try {
            const response = await axios.get(
                `https://slothkins-beta-2.herokuapp.com/detailed-crypto-data?ticker=${fieldData.selectedTicker}`
            );
            if (response.data) {
                CryptoStore.setLogRegressionRawData(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFieldData = (event) => {
        const { name, value } = event.target;

        setFieldData({ ...fieldData, [name]: value });
    };

    const handleHydrateFields = () => {
        setFieldData({
            ...fieldData,
            rawDate: Moment(
                CryptoStore.logRegressionRawData[
                    CryptoStore.logRegressionRawData?.length - 1
                ]?.Date
            )
                .add(2, 'days')
                .format('YYYY-MM-DD'),
            date: Moment(
                CryptoStore.logRegressionRawData[
                    CryptoStore.logRegressionRawData?.length - 1
                ]?.Date
            )
                .add(2, 'days')
                .format('l'),
            sNo:
                +CryptoStore.logRegressionRawData[
                    CryptoStore.logRegressionRawData?.length - 1
                ]?.SNo + 1,
            name: CryptoStore.logRegressionRawData[0].Name,
            symbol: CryptoStore.logRegressionRawData[0].Symbol
        });

        setLoaded({ ...loaded, hydrateFields: true, hydratedFields: true });
    };

    const handleSubmitData = async () => {
        try {
            const response = await axios.post(
                `https://slothkins-beta-2.herokuapp.com/add-crypto-price-data`,
                {
                    SNo: fieldData.sNo,
                    Name: fieldData.name,
                    Symbol: fieldData.symbol,
                    Date: fieldData.rawDate,
                    High: fieldData.high,
                    Low: fieldData.low,
                    Open: fieldData.open,
                    Close: fieldData.close,
                    Volume: fieldData.volume,
                    Marketcap: fieldData.marketcap
                }
            );
            if (response) {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleResetData = () => {
        setFieldData({
            selectedTicker: '',
            sNo: '',
            name: '',
            symbol: '',
            rawDate: '',
            date: '',
            high: '',
            low: '',
            open: '',
            close: '',
            volume: '',
            marketcap: ''
        });

        setLoaded({ hydrateFields: false, hydratedFields: false });
    };

    return (
        <div className="componentContainer">
            <div className="fieldContainer">
                <motion.div
                    className="field"
                    key={'selectCurrenyTicker'}
                    initial={{
                        x: -1000
                    }}
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
                        id="add-data-currency-select"
                        name="selectedTicker"
                        value={fieldData.selectedTicker}
                        onChange={handleFieldData}
                        label="Currency Ticker"
                        helperText="Please select a currency ticker"
                        color="primary"
                        defaultValue=""
                    >
                        {CryptoStore.cryptoNames.map((ticker, i) => (
                            <MenuItem key={`${ticker} ${i}`} value={ticker}>
                                {ticker}
                            </MenuItem>
                        ))}
                    </TextField>
                </motion.div>
                {fieldData.selectedTicker && !CryptoStore.loaded.logRegRawData && (
                    <motion.div
                        className="field"
                        key={'fetchData'}
                        initial={{
                            x: -1000
                        }}
                        animate={{ x: 0, opacity: [0, 0.5, 1] }}
                        transition={{
                            ease: 'easeIn',
                            duration: 1,
                            type: 'spring'
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleFetchRawCurrencyData}
                            disabled={!fieldData.selectedTicker}
                            color="secondary"
                            size="large"
                        >
                            Fetch Currency Data for Selected Ticker
                        </Button>
                    </motion.div>
                )}
                {fieldData.selectedTicker &&
                    CryptoStore.loaded.logRegRawData &&
                    !loaded.hydrateFields && (
                        <motion.div
                            className="field"
                            key={'hydrateFields'}
                            initial={{
                                x: -1000
                            }}
                            animate={{ x: 0, opacity: [0, 0.5, 1] }}
                            transition={{
                                ease: 'easeIn',
                                duration: 1,
                                type: 'spring'
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleHydrateFields}
                                disabled={
                                    !fieldData.selectedTicker ||
                                    !CryptoStore.loaded.logRegRawData
                                }
                                color="secondary"
                                size="large"
                            >
                                Hydrate Fields with Data
                            </Button>
                        </motion.div>
                    )}
                {fieldData.selectedTicker &&
                    CryptoStore.loaded.logRegRawData &&
                    loaded.hydrateFields &&
                    loaded.hydratedFields && (
                        <motion.div
                            className="field"
                            key={'hydratedFields'}
                            initial={{
                                x: -1000
                            }}
                            animate={{ x: 0, opacity: [0, 0.5, 1] }}
                            transition={{
                                ease: 'easeIn',
                                duration: 1,
                                type: 'spring'
                            }}
                        >
                            <TextField
                                variant="outlined"
                                id="add-data-sno"
                                value={fieldData.sNo}
                                label="SNo"
                                placeholder="SNo"
                                disabled
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-name"
                                value={fieldData.name}
                                label="Currency Name"
                                placeholder="Currency Name"
                                disabled
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-ticker"
                                value={fieldData.symbol}
                                label="Currency Ticker"
                                placeholder="Currency Ticker"
                                disabled
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-date"
                                value={fieldData.date}
                                label="Date"
                                placeholder="Date"
                                disabled
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-high"
                                name="high"
                                value={fieldData.high}
                                onChange={handleFieldData}
                                label="High Price"
                                placeholder="High Price"
                                required
                                helperText="Please enter the currency's trading high price"
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-low"
                                name="low"
                                value={fieldData.low}
                                onChange={handleFieldData}
                                label="Low Price"
                                placeholder="Low Price"
                                required
                                helperText="Please enter the currency's trading low price"
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-open"
                                name="open"
                                value={fieldData.open}
                                onChange={handleFieldData}
                                label="Open Price"
                                placeholder="Open Price"
                                required
                                helperText="Please enter the currency's opening price"
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-close"
                                name="close"
                                value={fieldData.close}
                                onChange={handleFieldData}
                                label="Close Price"
                                placeholder="Close Price"
                                required
                                helperText="Please enter the currency's closing price"
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-volume"
                                name="volume"
                                value={fieldData.volume}
                                onChange={handleFieldData}
                                label="Volume"
                                placeholder="Volume"
                                required
                                helperText="Please enter the currency's daily trading volume"
                                color="primary"
                            />
                            <TextField
                                variant="outlined"
                                id="add-data-marketcap"
                                name="marketcap"
                                value={fieldData.marketcap}
                                onChange={handleFieldData}
                                label="Markecap"
                                placeholder="Marketcap"
                                required
                                helperText="Please enter the currency's marketcap"
                                color="primary"
                            />
                        </motion.div>
                    )}
            </div>
            <div className="actionButtonContainer">
                {!Object.values(fieldData).some((val) => val === '') && (
                    <>
                        <motion.div
                            className="actionButton"
                            key={'submitButton'}
                            initial={{
                                x: -1000
                            }}
                            animate={{ x: 0, opacity: [0, 0.5, 1] }}
                            transition={{
                                ease: 'easeIn',
                                duration: 1,
                                type: 'spring'
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleSubmitData}
                                disabled={!fieldData.selectedTicker}
                                color="secondary"
                                size="large"
                            >
                                Submit Data
                            </Button>
                        </motion.div>
                        <motion.div
                            className="actionButton"
                            key={'resetButton'}
                            initial={{
                                x: 1000
                            }}
                            animate={{ x: 0, opacity: [0, 0.5, 1] }}
                            transition={{
                                ease: 'easeIn',
                                duration: 1,
                                type: 'spring'
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleResetData}
                                disabled={!fieldData.selectedTicker}
                                color="primary"
                                size="large"
                            >
                                Reset Data
                            </Button>
                        </motion.div>
                    </>
                )}
            </div>
            <motion.div
                className="helperText"
                key={'helperText'}
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
                    Use this form to add new price data to the database. Once
                    you have added the data, it will factor into the
                    application's calculations. A good site to obtain historical
                    cryptocurrency price data is{' '}
                    <Link
                        color="primary"
                        href="https://coinmarketcap.com/currencies/"
                        underline="hover"
                        target="blank"
                    >
                        CoinMarketCap
                    </Link>
                    .
                </Typography>
            </motion.div>
        </div>
    );
};

export default observer(AddCryptoPriceData);
