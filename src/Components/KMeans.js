import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Backdrop,
    Snackbar,
    Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { observer } from 'mobx-react-lite';
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
import {
    getAllCryptoNames,
    getAllCryptoPriceData
} from '../Services/CryptoCollectionService';

import './_styles/KMeans.css';

const KMeans = () => {
    const { CryptoStore } = useStore();

    const [infoMessage, setInfoMessage] = useState(false);

    /***
     * Retrieves all crypto names and hydrates the CryptoStore
     */
    const handleCryptoNames = () => {
        getAllCryptoNames();
    };

    /***
     * Retrieves all crypto priceve by ticker and hydrates the CryptoStore
     */
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

    // const handleKMeansClusteringIter = (iterations) => () => {
    //     const clusteringModel = ObjectLearning.runKClustering(
    //         CryptoStore.kMeansData,
    //         ['meanReturn', 'priceVariance'],
    //         {
    //             maxIter: iterations,
    //             groups: 5,
    //             groupNames: [
    //                 'Conservative',
    //                 'Conservative-Moderate',
    //                 'Moderate',
    //                 'Moderate-Aggressive',
    //                 'Aggressive'
    //             ]
    //         }
    //     );
    //     CryptoStore.setKMeansIterData(
    //         `kMeansClusteringIter${iterations}`,
    //         JSON.parse(JSON.stringify(clusteringModel))['groups']
    //     );
    // };

    // const handleDeleteOutlier = (iterations) => {
    //     CryptoStore.deleteStoreOutlier(`kMeansClusteringIter${iterations}`);
    // };

    // const handleRefreshKMeansData = (iterations) => () => {
    //     CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
    //     handleDeleteOutlier(iterations);
    //     CryptoStore.setAnnualMeanReturns();
    //     CryptoStore.setAnnualPriceVariances();
    //     CryptoStore.setKMeansData();
    //     handleKMeansClusteringIter(iterations)();
    //     CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    // };

    // const handleRefreshKMeansDataClean = (iterations) => () => {
    //     CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
    //     handleDeleteOutlier(iterations);
    //     CryptoStore.setAnnualMeanReturnsClean();
    //     CryptoStore.setAnnualPriceVariancesClean();
    //     CryptoStore.setKMeansData();
    //     handleKMeansClusteringIter(iterations)();
    //     CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    // };

    const handleBackdropClick = () => {
        setInfoMessage(true);
    };

    const handleInfoClickaway = () => {
        setInfoMessage(false);
    };

    // const TickerName = ({ payload, active }) => {
    //     if (active) {
    //         return (
    //             <div className="tickerNameTooltip">
    //                 <p className="tooltipLabel">{`${payload[0].name} : ${payload[0].value}%`}</p>
    //                 <p className="tooltipLabel">{`${payload[1].name} : ${payload[1].value}%`}</p>
    //                 <p className="tooltipLabel">
    //                     {payload[0].payload.label
    //                         .toLowerCase()
    //                         .includes('centroid')
    //                         ? `${payload[0].payload.label}`
    //                         : `Ticker : ${payload[0].payload.label}`}
    //                 </p>
    //                 <p className="tooltipLabel">{`Risk Group : ${payload[0].payload.groupName}`}</p>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

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
            <div className="kMeansFieldContainer">
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoNames}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoNames}
                    color="secondary"
                >
                    Get All Crypto Names
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPrices}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPrices}
                    disabled={!CryptoStore.loaded.cryptoNames}
                    color="secondary"
                >
                    Get All Crypto Prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCryptoPercentChange}
                    variant="contained"
                    loading={CryptoStore.loading.cryptoPercentChange}
                    disabled={!CryptoStore.loaded.cryptoPrices}
                    color="secondary"
                >
                    Calculate all percent changes in crypto prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculateAnnualMeanReturns}
                    variant="contained"
                    loading={CryptoStore.loading.annualMeanReturns}
                    disabled={!CryptoStore.loaded.cryptoPercentChange}
                    color="secondary"
                >
                    Calculate annual mean returns for all crypto prices
                </LoadingButton>
                <LoadingButton
                    className="kMeansField"
                    onClick={handleCalculatePriceVariances}
                    variant="contained"
                    loading={CryptoStore.loading.annualPriceVariances}
                    disabled={!CryptoStore.loaded.annualMeanReturns}
                    color="secondary"
                >
                    Calculate annual price variances for all crypto prices
                </LoadingButton>
                <Button
                    className="kMeansField"
                    onClick={handleCalculateKMeansData}
                    variant="contained"
                    disabled={!CryptoStore.loaded.annualPriceVariances}
                    color="secondary"
                >
                    Calculate K-Means Data
                </Button>
                {/* <Button
                    className="kMeansField"
                    onClick={handleKMeansClusteringIter(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    K-Means Clustering 10,000
                </Button>
                <Button
                    className="kMeansField"
                    onClick={handleRefreshKMeansData(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    Delete Outlier
                </Button>
                <Button
                    className="kMeansField"
                    onClick={handleRefreshKMeansDataClean(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    Clean Data
                </Button>
                <Button
                    className="kMeansField"
                    onClick={handleKMeansClusteringIter(100000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    K-Means Clustering 100,000
                </Button> */}
            </div>
            {/* {CryptoStore.loaded.kMeansClusteringData && (
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
            )} */}
        </>
    );
};

export default observer(KMeans);
