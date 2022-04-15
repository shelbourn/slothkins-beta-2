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
            stores.CryptoStore.setIsLoaded(['cryptoNames'], true);
            stores.CryptoStore.setIsLoading('cryptoNames', false);
        }
    } catch (error) {
        console.log(error);
    }
};
