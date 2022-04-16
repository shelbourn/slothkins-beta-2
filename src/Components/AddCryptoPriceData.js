import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import Moment from 'moment';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/AddCryptoPriceData.css';

const AddCryptoPriceData = () => {
    const { CryptoStore } = useStore();

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
    };

    console.log(JSON.parse(JSON.stringify(CryptoStore.logRegressionRawData)));

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

    return (
        <div className="fieldContainer">
            <TextField
                className="field"
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
            <Button
                variant="contained"
                className="field"
                onClick={handleFetchRawCurrencyData}
                disabled={!fieldData.selectedTicker}
                color="secondary"
                size="large"
            >
                Fetch Currency Data for Selected Ticker
            </Button>
            <Button
                variant="contained"
                className="field"
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
            <TextField
                className="field"
                variant="outlined"
                id="add-data-sno"
                value={fieldData.sNo}
                label="SNo"
                placeholder="SNo"
                disabled
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-name"
                value={fieldData.name}
                label="Currency Name"
                placeholder="Currency Name"
                disabled
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-ticker"
                value={fieldData.symbol}
                label="Currency Ticker"
                placeholder="Currency Ticker"
                disabled
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-date"
                value={fieldData.date}
                label="Date"
                placeholder="Date"
                disabled
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-high"
                name="high"
                value={fieldData.high}
                onChange={handleFieldData}
                label="High Price"
                placeholder="High Price"
                helperText="Please enter the currency's trading high price"
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-low"
                name="low"
                value={fieldData.low}
                onChange={handleFieldData}
                label="Low Price"
                placeholder="Low Price"
                helperText="Please enter the currency's trading low price"
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-open"
                name="open"
                value={fieldData.open}
                onChange={handleFieldData}
                label="Open Price"
                placeholder="Open Price"
                helperText="Please enter the currency's opening price"
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-close"
                name="close"
                value={fieldData.close}
                onChange={handleFieldData}
                label="Close Price"
                placeholder="Close Price"
                helperText="Please enter the currency's closing price"
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-volume"
                name="volume"
                value={fieldData.volume}
                onChange={handleFieldData}
                label="Volume"
                placeholder="Volume"
                helperText="Please enter the currency's daily trading volume"
                color="primary"
            />
            <TextField
                className="field"
                variant="outlined"
                id="add-data-marketcap"
                name="marketcap"
                value={fieldData.marketcap}
                onChange={handleFieldData}
                label="Markecap"
                placeholder="Marketcap"
                helperText="Please enter the currency's marketcap"
                color="primary"
            />
            <Button
                variant="contained"
                className="field"
                onClick={handleSubmitData}
                disabled={!fieldData.selectedTicker}
                color="secondary"
                size="large"
            >
                Submit Data
            </Button>
        </div>
    );
};

export default observer(AddCryptoPriceData);