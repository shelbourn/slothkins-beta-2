import React, { useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    Label
} from 'recharts';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/EndpointTest.css';

const EndpointTest = () => {
    const { CryptoStore } = useStore();

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

    // TODO: Find a way to label data points (find group based on annualMeanReturns and annualPriceVariance)

    const centroidColors = [
        '#EF5350',
        '#AB47BC',
        '#29B6F6',
        '#66BB6A',
        '#FFA726'
    ];

    const dataPointColors = [
        '#EF9A9A',
        '#CE93D8',
        '#81D4FA',
        '#A5D6A7',
        '#FFCC80'
    ];

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
        // console.log(JSON.parse(JSON.stringify(clusteringModel)));
        // console.log(JSON.parse(JSON.stringify(clusteringModel))['groups']);
        CryptoStore.setKMeansIterData(
            `kMeansClusteringIter${iterations}`,
            JSON.parse(JSON.stringify(clusteringModel))['groups']
        );
    };

    console.log(
        JSON.parse(JSON.stringify(CryptoStore.kMeansClusteringIter10000))
    );

    const handleDeleteOutlier = () => {
        CryptoStore.deleteStoreOutlier('kMeansClusteringIter10000');
    };

    const TickerName = ({ payload, label, active }) => {
        console.log(payload);
        if (active) {
            return (
                <div className="tickerNameTooltip">
                    <p className="tooltipLabel">{`${payload[0].name} : $ ${payload[0].value}`}</p>
                    <p className="tooltipLabel">{`${payload[1].name} :$ ${payload[1].value}`}</p>
                    <p className="tooltipLabel">{`Ticker : ${payload[0].payload.label}`}</p>
                    <p className="tooltipLabel">{`Risk Group : ${payload[0].payload.groupName}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
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
                onClick={handleDeleteOutlier}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                Delete Outlier
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
                            unit="$"
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
                            unit="$"
                            type="number"
                            dataKey="priceVariance"
                            name="Price Variance"
                            dx={-10}
                        >
                            <Label
                                value="Annual Price Variance"
                                offset={80}
                                angle={-90}
                                position="insideLeft"
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
