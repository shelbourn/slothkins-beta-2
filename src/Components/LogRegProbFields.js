import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField, InputAdornment, Button } from '@mui/material';
import Moment from 'moment';

import './_styles/LogRegProbFields.css';

import { useStore } from '../Stores/StoreFunctions.js';

const LogRegProbFields = () => {
    const { CryptoStore } = useStore();

    const [fieldData, setFieldData] = useState({
        rawDate: '',
        formattedDate: '',
        openPrice: '',
        logRegProbPrediction: ''
    });
    const [isSelected, setIsSelected] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        CryptoStore.setIsLoaded(['logRegFields'], true);

        return () => {
            CryptoStore.setIsLoaded(['logRegFields'], false);
        };
    }, []);

    const handleLogRegField = (event) => {
        setFieldData({ ...fieldData, openPrice: event.target.value });
    };

    const logRegAdornment = isSelected
        ? {
              startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
              )
          }
        : {};

    const showLogRegAdornment = () => {
        setIsSelected(true);
    };

    console.log(CryptoStore.logRegressionFormattedData);

    const hideLogRegAdornment = () => {
        setIsSelected(false);
    };

    const handleNextDate = () => {
        setFieldData({
            ...fieldData,
            rawDate: Moment(
                CryptoStore.logRegressionUsableData[
                    CryptoStore.logRegressionUsableData?.length - 1
                ]?.date
            ).add(1, 'days')._i,
            formattedDate: Moment(
                CryptoStore.logRegressionUsableData[
                    CryptoStore.logRegressionUsableData?.length - 1
                ]?.date
            )
                .add(1, 'days')
                .format('l')
        });
    };

    const handleCalculateProbPrediction = () => {
        CryptoStore.setLogRegressionNextDayPrediction(fieldData.openPrice);
        // setFieldData({
        //     ...fieldData,
        //     logRegProbPrediction: CryptoStore.logRegressionNextDatePrediction
        // });
    };

    const test = CryptoStore.logRegressionFormattedData.forEach((el, i) => {
        console.log(el.open);
    });

    console.log('Test', test);

    return (
        <div className="fieldContainer">
            <TextField
                className="field"
                variant="outlined"
                id="log-reg-date"
                value={fieldData.formattedDate}
                label="Date"
                placeholder="Date"
                disabled
                color="primary"
            />
            <Button
                variant="contained"
                className="field"
                onClick={handleNextDate}
                disabled={!CryptoStore.loaded.logRegModeledData}
                color="secondary"
            >
                Set Next Date
            </Button>
            <TextField
                className="field"
                variant="outlined"
                id="log-reg-open-price"
                error={error}
                required
                value={fieldData.openPrice}
                helperText={error && 'Opening Price is Required'}
                label="Opening Price"
                placeholder="Opening Price"
                onChange={handleLogRegField}
                InputProps={logRegAdornment}
                onFocus={showLogRegAdornment}
                onBlur={hideLogRegAdornment}
                color="primary"
            />
            <Button
                variant="contained"
                className="field"
                onClick={handleCalculateProbPrediction}
                disabled={!fieldData.openPrice}
                color="secondary"
            >
                Calculate Predicted Buy Signal Probability
            </Button>
            <TextField
                className="field"
                variant="outlined"
                id="log-reg-prob"
                value={CryptoStore.logRegressionNextDayPrediction}
                label="Logistic Regression Buy Signal Probability"
                placeholder="Logistic Regression Buy Signal Probability"
                color="primary"
                disabled
            />
        </div>
    );
};

export default observer(LogRegProbFields);
