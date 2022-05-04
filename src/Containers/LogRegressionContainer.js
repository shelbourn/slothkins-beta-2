import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../Stores/StoreFunctions';
import LogisticRegression from '../Components/LogisticRegression';
import LogRegChart from '../Components/LogRegChart';

const LogRegressionContainer = () => {
    const { CryptoStore } = useStore();

    return (
        <>
            {!CryptoStore.loaded.logRegModeledData && <LogisticRegression />}
            {CryptoStore.loaded.logRegModeledData && <LogRegChart />}
        </>
    );
};

export default observer(LogRegressionContainer);
