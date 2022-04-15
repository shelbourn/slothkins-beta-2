import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../Stores/StoreFunctions';
import KMeans from '../Components/KMeans';
import KMeansChart from '../Components/KMeansChart';

const KMeansContainer = () => {
    const { CryptoStore } = useStore();

    return (
        <>
            {!CryptoStore.loaded.kMeansData && <KMeans />}
            {CryptoStore.loaded.kMeansData && <KMeansChart />}
        </>
    );
};

export default observer(KMeansContainer);
