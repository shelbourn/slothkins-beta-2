import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField, InputAdornment } from '@mui/material';
import Moment from 'moment';

import './_styles/LogRegProbFields.css';

import { useStore } from '../Stores/StoreFunctions.js';

const LogRegProbFields = () => {
    const { CryptoStore } = useStore();

    const [fieldData, setFieldData] = useState({
        date: Moment(
            CryptoStore.logRegressionUsableData[
                CryptoStore.logRegressionUsableData?.length - 1
            ]?.date
        )
            .add(1, 'days')
            .format('l'),
        openPrice: ''
    });
    const [isSelected, setIsSelected] = useState(false);
    const [error, setError] = useState(false);

    //TODO: NEED TO FIX THIS!!

    // let nextDate = '';

    // useEffect(() => {
    //     if (CryptoStore.loaded.logRegUsableData) {
    //         nextDate = Moment(
    //             CryptoStore.logRegressionUsableData[
    //                 CryptoStore.logRegressionUsableData?.length - 1
    //             ]?.date
    //         )
    //             .add(1, 'days')
    //             .format('l');
    //     }
    // }, []);

    console.log(
        CryptoStore.logRegressionUsableData[
            CryptoStore.logRegressionUsableData?.length - 1
        ]?.date
    );

    console.log(
        Moment(
            CryptoStore.logRegressionUsableData[
                CryptoStore.logRegressionUsableData?.length - 1
            ]?.date
        )
            .add(1, 'days')
            .format('l')
    );

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

    const hideLogRegAdornment = () => {
        setIsSelected(false);
    };

    console.log('State', fieldData.date);

    return (
        <div className="fieldContainer">
            <TextField
                className="field"
                variant="outlined"
                id="log-reg-date"
                value={
                    CryptoStore.loaded.logRegUsableData ? fieldData.date : ''
                }
                label="Date"
                placeholder="Date"
                onChange={handleLogRegField}
                // disabled
            />
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
            />
        </div>
    );
};

export default observer(LogRegProbFields);
