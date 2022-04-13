import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    CircularProgress,
    Backdrop,
    Snackbar,
    Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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

import './_styles/KMeans.css';

const KMeans = () => {
    const { CryptoStore } = useStore();

    const [loading, setLoading] = useState({
        cryptoNames: false,
        cryptoPrices: false,
        meanReturns: false,
        priceVariances: false
    });
    const [infoMessage, setInfoMessage] = useState(false);

    /***
     * Retrieves all crypto names and hydrates the CryptoStore
     */
    const handleCryptoNames = async () => {
        setLoading({ ...loading, cryptoNames: true });
        try {
            const response = await axios.get(
                'https://slothkins-beta-2.herokuapp.com/crypto-names'
            );
            if (response.data) {
                CryptoStore.setCryptoNames(response.data[0]['array']);
                CryptoStore.setIsLoaded(['cryptoNames'], true);
                setLoading({ ...loading, cryptoNames: false });
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log(CryptoStore.cryptoNames);

    /***
     * Retrieves all crypto priceve by ticker and hydrates the CryptoStore
     */
    const handleCryptoPrices = async () => {
        setLoading({ ...loading, cryptoPrices: true });
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
        setLoading({ ...loading, cryptoPrices: false });
    };

    const handleCryptoPercentChange = () => {
        setInfoMessage(true);
        CryptoStore.setCryptoPercentChange();
    };

    const handleCalculateAnnualMeanReturns = () => {
        setLoading({ ...loading, meanReturns: true });
        CryptoStore.setAnnualMeanReturns();
        setLoading({ ...loading, meanReturns: false });
    };

    const handleCalculatePriceVariances = () => {
        setLoading({ ...loading, priceVariances: true });
        CryptoStore.setAnnualPriceVariances();
        setLoading({ ...loading, priceVariances: false });
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
                    <p>Sloths are meticulous but work a bit slow</p>
                    <p>
                        Please allow the calculations to complete. It'll take
                        about 20 seconds.
                    </p>
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: '9' }}
                open={CryptoStore.loading.cryptoPercentChange}
                onClick={handleBackdropClick}
            >
                <CircularProgress color="inherit" size={100} />
            </Backdrop>
            <LoadingButton
                onClick={handleCryptoNames}
                variant="contained"
                className="endpointTest"
                loading={loading.cryptoNames}
                color="secondary"
            >
                Get All Crypto Names
            </LoadingButton>
            <LoadingButton
                onClick={handleCryptoPrices}
                variant="contained"
                className="endpointTest"
                loading={loading.cryptoPrices}
                disabled={!CryptoStore.loaded.cryptoNames}
                color="secondary"
            >
                Get All Crypto Prices
            </LoadingButton>
            <LoadingButton
                onClick={handleCryptoPercentChange}
                variant="contained"
                className="endpointTest"
                loading={loading.percentChange}
                disabled={!CryptoStore.loaded.cryptoPrices}
                color="secondary"
            >
                Calculate all percent changes in crypto prices
            </LoadingButton>
            <LoadingButton
                onClick={handleCalculateAnnualMeanReturns}
                variant="contained"
                className="endpointTest"
                loading={loading.meanReturns}
                disabled={!CryptoStore.loaded.cryptoPercentChange}
                color="secondary"
            >
                Calculate annual mean returns for all crypto prices
            </LoadingButton>
            <LoadingButton
                onClick={handleCalculatePriceVariances}
                variant="contained"
                className="endpointTest"
                loading={loading.priceVariances}
                disabled={!CryptoStore.loaded.annualMeanReturns}
                color="secondary"
            >
                Calculate annual price variances for all crypto prices
            </LoadingButton>
            <Button
                onClick={handleCalculateKMeansData}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.annualPriceVariances}
                color="secondary"
            >
                Calculate K-Means Data
            </Button>
            <Button
                onClick={handleKMeansClusteringIter(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
                color="secondary"
            >
                K-Means Clustering 10,000
            </Button>
            <Button
                onClick={handleRefreshKMeansData(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
                color="secondary"
            >
                Delete Outlier
            </Button>
            <Button
                onClick={handleRefreshKMeansDataClean(10000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
                color="secondary"
            >
                Clean Data
            </Button>
            <Button
                onClick={handleKMeansClusteringIter(100000)}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
                color="secondary"
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

export default observer(KMeans);
