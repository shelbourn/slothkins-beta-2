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

    const handleKMeansClustering = () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            { maxIter: 1000, groups: 3, groupNames: ['low', 'med', 'high'] }
        );
        console.log(clusteringModel);
    };

    console.log(CryptoStore.annualMeanReturns);

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
                onClick={handleKMeansClustering}
                variant="contained"
                className="endpointTest"
                disabled={!CryptoStore.loaded.kMeansData}
            >
                K-Means Clustering
            </Button>
        </>
    );
};

export default observer(EndpointTest);
