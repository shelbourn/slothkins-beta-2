import React, { useState } from 'react';
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
        openPrice: ''
    });
    const [isSelected, setIsSelected] = useState(false);
    const [error, setError] = useState(false);

    const handleLogRegField = (event) => {
        setError(false);
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
            )
                .add(2, 'days')
                .format('YYYY-MM-DD'),
            formattedDate: Moment(
                CryptoStore.logRegressionUsableData[
                    CryptoStore.logRegressionUsableData?.length - 1
                ]?.date
            )
                .add(2, 'days')
                .format('l')
        });
    };

    const handleCalculateProbPrediction = () => {
        //Validate Fields
        if (!fieldData.openPrice || isNaN(fieldData.openPrice)) {
            setError(true);
            return;
        }

        CryptoStore.setLogRegressionNextDayPrediction(fieldData.openPrice);
    };

    return (
        <div className="regProbFieldContainer">
            <TextField
                className="regProbfield"
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
                className="regProbField"
                onClick={handleNextDate}
                disabled={!CryptoStore.loaded.logRegModeledData}
                color="secondary"
                size="large"
            >
                Set Next Date
            </Button>
            <TextField
                className="regProbField"
                variant="outlined"
                id="log-reg-open-price"
                error={error}
                required
                value={fieldData.openPrice}
                helperText={
                    error && 'Opening Price is Required & Must be a Number'
                }
                label="Opening Price"
                placeholder="Opening Price"
                onChange={handleLogRegField}
                InputProps={logRegAdornment}
                onFocus={showLogRegAdornment}
                onBlur={hideLogRegAdornment}
                color="primary"
            />
            <Button
                className="regProbField"
                variant="contained"
                onClick={handleCalculateProbPrediction}
                disabled={!CryptoStore.loaded.logRegModeledData}
                color="secondary"
                size="large"
            >
                Calculate Predicted Buy Signal Probability
            </Button>
            <TextField
                className="regProbField"
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
