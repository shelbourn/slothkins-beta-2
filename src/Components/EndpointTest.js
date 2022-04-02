import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    CircularProgress,
    Backdrop,
    Snackbar,
    Alert
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    Label
} from 'recharts';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/EndpointTest.css';

const EndpointTest = () => {
    const { CryptoStore } = useStore();

    const [loading, setLoading] = useState(false);
    const [infoMessage, setInfoMessage] = useState(false);

    /***
     * Retrieves all crypto names and hydrates the CryptoStore
     */
    const handleCryptoNames = async () => {
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

    /***
     * Retrieves all crypto priceve by ticker and hydrates the CryptoStore
     */
    const handleCryptoPrices = async () => {
        for (const name in CryptoStore.cryptoNames) {
            try {
                const response = await axios.get(
                    `https://slothkins-beta-2.herokuapp.com/all-crypto-prices?currencyName=${CryptoStore.cryptoNames[name]}`
                );
                if (response.data) {
                    const { array } = response.data[0];
                    CryptoStore.setCryptoPrice(
                        CryptoStore.cryptoNames[name],
                        array.filter((el) => el !== 0)
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }
        CryptoStore.setIsLoaded(['cryptoPrices'], true);
    };

    const handleCryptoPercentChange = () => {
        setLoading(true);
        setInfoMessage(true);
        setTimeout(() => {
            CryptoStore.setCryptoPercentChange();
        }, 1000);
        setTimeout(() => {
            setLoading(false);
            setInfoMessage(false);
        }, 16000);
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

    const handleKMeansClusteringIter = (iterations) => () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            {
                maxIter: iterations,
                groups: 5,
                groupNames: [
                    'Conservative',
                    'Conservative-Moderate',
                    'Moderate',
                    'Moderate-Aggressive',
                    'Aggressive'
                ]
            }
        );
        CryptoStore.setKMeansIterData(
            `kMeansClusteringIter${iterations}`,
            JSON.parse(JSON.stringify(clusteringModel))['groups']
        );
    };

    const handleDeleteOutlier = (iterations) => {
        CryptoStore.deleteStoreOutlier(`kMeansClusteringIter${iterations}`);
    };

    const handleRefreshKMeansData = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
        handleDeleteOutlier(iterations);
        CryptoStore.setAnnualMeanReturns();
        CryptoStore.setAnnualPriceVariances();
        CryptoStore.setKMeansData();
        handleKMeansClusteringIter(iterations)();
        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleRefreshKMeansDataClean = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
        handleDeleteOutlier(iterations);
        CryptoStore.setAnnualMeanReturnsClean();
        CryptoStore.setAnnualPriceVariancesClean();
        CryptoStore.setKMeansData();
        handleKMeansClusteringIter(iterations)();
        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleBackdropClick = () => {
        setInfoMessage(true);
    };

    const handleInfoClickaway = () => {
        setInfoMessage(false);
    };

    const TickerName = ({ payload, active }) => {
        if (active) {
            return (
                <div className="tickerNameTooltip">
                    <p className="tooltipLabel">{`${payload[0].name} : ${payload[0].value}%`}</p>
                    <p className="tooltipLabel">{`${payload[1].name} : ${payload[1].value}%`}</p>
                    <p className="tooltipLabel">
                        {payload[0].payload.label
                            .toLowerCase()
                            .includes('centroid')
                            ? `${payload[0].payload.label}`
                            : `Ticker : ${payload[0].payload.label}`}
                    </p>
                    <p className="tooltipLabel">{`Risk Group : ${payload[0].payload.groupName}`}</p>
                </div>
            );
        }
        return null;
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
                    <p>Sloths work a bit slow</p>
                    <p>
                        Please allow the calculations to complete. It'll take
                        about 20 seconds.
                    </p>
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: '9' }}
                open={loading}
                onClick={handleBackdropClick}
            >
                <CircularProgress color="inherit" size={100} />
            </Backdrop>
            <Button
                onClick={handleCryptoNames}
                variant="contained"
                className="endpointTest"
            >
                Get All Crypto Names
            </Button>
            <Button
                onClick={handleCryptoPrices}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.cryptoNames}
            >
                Get All Crypto Prices
            </Button>
            <Button
                onClick={handleCryptoPercentChange}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.cryptoPrices}
            >
                Calculate all percent changes in crypto prices
            </Button>
            <Button
                onClick={handleCalculateAnnualMeanReturns}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.cryptoPercentChange}
            >
                Calculate annual mean returns for all crypto prices
            </Button>
            <Button
                onClick={handleCalculatePriceVariances}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.annualMeanReturns}
            >
                Calculate annual price variances for all crypto prices
            </Button>
            <Button
                onClick={handleCalculateKMeansData}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.annualPriceVariances}
            >
                Calculate K-Means Data
            </Button>
            <Button
                onClick={handleKMeansClusteringIter(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                K-Means Clustering 10,000
            </Button>
            <Button
                onClick={handleRefreshKMeansData(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                Delete Outlier
            </Button>
            <Button
                onClick={handleRefreshKMeansDataClean(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                Clean Data
            </Button>
            <Button
                onClick={handleKMeansClusteringIter(100000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                K-Means Clustering 100,000
            </Button>
            {CryptoStore.loaded.kMeansClusteringData && (
                <div className="kMeansScatter">
                    <ScatterChart
                        width={500}
                        height={500}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20
                        }}
                    >
                        <CartesianGrid />
                        <XAxis
                            unit="%"
                            type="number"
                            dataKey="meanReturn"
                            name="Mean Return"
                            dy={10}
                        >
                            <Label
                                value="Annual Mean Returns"
                                offset={-20}
                                position="insideBottom"
                            />
                        </XAxis>
                        <YAxis
                            unit="%"
                            type="number"
                            dataKey="priceVariance"
                            name="Price Variance"
                            dx={-10}
                        >
                            <Label
                                value="Annual Price Variance"
                                offset={10}
                                angle={-90}
                                position="left"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip
                            content={<TickerName />}
                            cursor={{ strokeDasharray: '3 3' }}
                        />
                        <Scatter
                            name="Test"
                            data={CryptoStore.kMeansClusteringIter10000}
                            fill="#8884d8"
                        >
                            {CryptoStore.kMeansClusteringIter10000.map(
                                (entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.c}
                                    />
                                )
                            )}
                        </Scatter>
                    </ScatterChart>
                </div>
            )}
        </>
    );
};

export default observer(EndpointTest);
