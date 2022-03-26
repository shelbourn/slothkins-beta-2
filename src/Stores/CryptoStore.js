import { makeAutoObservable } from 'mobx';

class CryptoStore {
    cryptoTest = '12345';
    cryptoNames = [];
    cryptoPrices = {};
    loaded = { cryptoNames: false, cryptoPrices: false };

    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    setCryptoNames(names) {
        this.cryptoNames = names;
    }

    setIsLoaded(key, bool) {
        this.loaded[key] = bool;
    }

    setCryptoPrice(ticker, priceArray) {
        this.cryptoPrices[ticker] = priceArray;
    }
}

export default CryptoStore;
