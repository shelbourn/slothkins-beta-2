import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../Stores/StoreFunctions';
import LogisticRegression from '../Components/LogisticRegression';
import LogRegChart from '../Components/LogRegChart';
import LogRegProbFields from '../Components/LogRegProbFields';
import AddCryptoPriceData from '../Components/AddCryptoPriceData';

const LogRegressionContainer = () => {
    const { CryptoStore } = useStore();

    return (
        <>
            {!CryptoStore.loaded.logRegModeledData && <LogisticRegression />}
            {CryptoStore.loaded.logRegModeledData && <LogRegChart />}
            {/* <LogRegProbFields />
            <AddCryptoPriceData /> */}
        </>
    );
};

export default observer(LogRegressionContainer);
