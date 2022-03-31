import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';

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
                CryptoStore.setIsLoaded('cryptoNames', true);
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
                        array
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }
        CryptoStore.setIsLoaded('cryptoPrices', true);
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

    const handleKMeansClusteringIter100 = () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            {
                maxIter: 100,
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
        CryptoStore.setKMeansIter100Data(
            'kMeansClusteringIter100',
            JSON.parse(JSON.stringify(clusteringModel))['groups']
        );
    };

    console.log(CryptoStore.kMeansClusteringIter100);

    const handleKMeansClusteringIter1000 = () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            {
                maxIter: 1000,
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
        console.log(JSON.parse(JSON.stringify(clusteringModel)));
    };

    const handleKMeansClusteringIter10000 = () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            {
                maxIter: 10000,
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
        console.log(JSON.parse(JSON.stringify(clusteringModel)));
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
                onClick={handleKMeansClusteringIter100}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                K-Means Clustering
            </Button>
            <Button
                onClick={handleKMeansClusteringIter100}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansClusteringData}
            >
                K-Means Clustering
            </Button>
        </>
    );
};

export default observer(EndpointTest);
