import axios from 'axios';

import { stores } from '../Stores/StoreFunctions';

export const getAllCryptoNames = async () => {
    stores.CryptoStore.setIsLoading('cryptoNames', true);

    try {
        const response = await axios.get(
            'https://slothkins-beta-2.herokuapp.com/crypto-names'
        );
        if (response.data) {
            stores.CryptoStore.setCryptoNames(response.data[0]['array']);
        }
    } catch (error) {
        console.log(error);
        stores.CryptoStore.setIsLoading('cryptoNames', false);
    } finally {
        stores.CryptoStore.setIsLoaded(['cryptoNames'], true);
        stores.CryptoStore.setIsLoading('cryptoNames', false);
    }
};

export const getAllCryptoPriceData = async () => {
    stores.CryptoStore.setIsLoading('cryptoPrices', true);

    if (!stores.CryptoStore.loaded.cryptoNames) {
        stores.CryptoStore.setIsLoading('cryptoPrices', false);
        return;
    }

    for (const name in stores.CryptoStore.cryptoNames) {
        try {
            const response = await axios.get(
                `https://slothkins-beta-2.herokuapp.com/all-crypto-prices?currencyName=${stores.CryptoStore.cryptoNames[name]}`
            );
            if (response.data) {
                const { array } = response.data[0];
                stores.CryptoStore.setCryptoPrice(
                    stores.CryptoStore.cryptoNames[name],
                    array.filter((el) => el !== 0)
                );
            }
        } catch (error) {
            console.log(error);
            stores.CryptoStore.setIsLoading('cryptoPrices', false);
        } finally {
            stores.CryptoStore.setIsLoaded(['cryptoPrices'], true);
            stores.CryptoStore.setIsLoading('cryptoPrices', false);
        }
    }
};
