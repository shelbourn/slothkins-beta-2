import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { TextField, InputAdornment, Button, Typography } from '@mui/material';
import Moment from 'moment';
import { motion } from 'framer-motion';

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

    const navigate = useNavigate();

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
        if (!fieldData.openPrice || isNaN(fieldData.openPrice)) {
            setError(true);
            return;
        }

        CryptoStore.setLogRegressionNextDayPrediction(fieldData.openPrice);
    };

    const handleGoBack = () => {
        navigate('/logistic-regression');
    };

    return (
        <div className="regProbFieldContainer">
            <motion.div
                className="regProbField"
                key={'logRegSetDate'}
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
                    id="log-reg-date"
                    value={fieldData.formattedDate}
                    label="Date"
                    placeholder="Date"
                    disabled
                    color="primary"
                />
                <Button
                    variant="contained"
                    onClick={handleNextDate}
                    disabled={!CryptoStore.loaded.logRegModeledData}
                    color="secondary"
                    size="large"
                >
                    Set Next Date
                </Button>
            </motion.div>
            {fieldData.formattedDate && (
                <motion.div
                    className="regProbField"
                    key={'logRegSetOpenPrice'}
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
                        id="log-reg-open-price"
                        error={error}
                        required
                        value={fieldData.openPrice}
                        helperText={
                            error &&
                            'Opening Price is Required & Must be a Number'
                        }
                        label="Opening Price"
                        placeholder="Opening Price"
                        onChange={handleLogRegField}
                        InputProps={logRegAdornment}
                        onFocus={showLogRegAdornment}
                        onBlur={hideLogRegAdornment}
                        color="primary"
                    />
                </motion.div>
            )}
            {fieldData.formattedDate && fieldData.openPrice && (
                <motion.div
                    className="regProbField"
                    key={'logRegCalcBuySignal'}
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
                        onClick={handleCalculateProbPrediction}
                        disabled={
                            !CryptoStore.loaded.logRegModeledData ||
                            !fieldData.openPrice
                        }
                        color="secondary"
                        size="large"
                    >
                        Calculate Predicted Buy Signal Probability
                    </Button>
                </motion.div>
            )}
            {fieldData.formattedDate &&
                fieldData.openPrice &&
                CryptoStore.loaded.logRegNextDayPrediction && (
                    <motion.div
                        className="regProbField"
                        key={'logRegBuySignal'}
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
                            id="log-reg-prob"
                            value={CryptoStore.logRegressionNextDayPrediction}
                            label="Logistic Regression Buy Signal Probability"
                            placeholder="Logistic Regression Buy Signal Probability"
                            color="primary"
                            disabled
                        />
                    </motion.div>
                )}
            <Button
                variant="contained"
                className="goBackButton"
                onClick={handleGoBack}
                color="primary"
                size="large"
            >
                Go Back
            </Button>
            <motion.div
                className="helperTextLogRegProbFields"
                key={'helperTextLogRegProbFields'}
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
                    Use this form to calculate the probability of a "buy" or
                    "sell" signal for the following trading day, which is based
                    on the output of the logistic regression algorithm.
                    <br />
                    <br /> After you enter data into all fields (fictional or
                    real), the logistic regression probability will be
                    displayed. To interpret this output, values closer to 1
                    indicate a strong "buy" signal for the following trading
                    day. Values closer to 0 indicate strong "sell" signal for
                    the following trading day.
                </Typography>
            </motion.div>
        </div>
    );
};

export default observer(LogRegProbFields);
