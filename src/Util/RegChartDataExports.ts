import React, { useEffect } from 'react';
import { useStore } from '../Stores/StoreFunctions';

const { CryptoStore } = useStore();

export const RegChartDataExports = () => {
    useEffect(() => {
        CryptoStore.ogRegressionModeledData();
    }, []);
};
