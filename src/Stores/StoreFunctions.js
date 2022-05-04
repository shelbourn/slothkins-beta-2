import { createContext, useContext } from 'react';

import CryptoStore from './CryptoStore';

/***
 * StoreFunctions - custom hook to use in components to instantiate any store.
 */

class RootStore {
    constructor() {
        this.CryptoStore = new CryptoStore(this);
    }
}

export const stores = new RootStore();

export const storeContext = createContext({
    CryptoStore: stores.CryptoStore
});

const useStore = () => useContext(storeContext);

export { useStore };
