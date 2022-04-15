import axios from 'axios';

import { stores } from '../Stores/StoreFunctions';

export const getDetailedCryptoData = async (ticker) => {
    try {
        const response = await axios.get(
            `https://slothkins-beta-2.herokuapp.com/detailed-crypto-data?ticker=${ticker}`
        );
        if (response.data) {
            stores.CryptoStore.setLogRegressionRawData(response.data);
        }
    } catch (error) {
        console.log(error);
    }
};
