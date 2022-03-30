import { makeAutoObservable } from 'mobx';

class CryptoStore {
    loaded = {
        cryptoNames: false,
        cryptoPrices: false,
        cryptoPercentChange: false,
        annualMeanReturns: false
    };
    cryptoTest = '12345';
    cryptoNames = [];
    cryptoPrices = {};
    cryptoPercentChange = {};
    annualMeanReturns = {};

    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    setIsLoaded(key, bool) {
        this.loaded[key] = bool;
    }

    setCryptoNames(names) {
        this.cryptoNames = names;
    }

    setCryptoPrice(ticker, priceArray) {
        this.cryptoPrices[ticker] = priceArray;
    }

    setCryptoPercentChange() {
        Object.entries(this.cryptoPrices).forEach(([ticker, priceArray]) => {
            for (const index in priceArray) {
                let percent;
                console.log(priceArray[index]);
                if (
                    (priceArray[index] === 0 && priceArray[index + 1] === 0) ||
                    isNaN(priceArray[index]) ||
                    isNaN(priceArray[index + 1])
                ) {
                    break;
                }

                if (priceArray[index + 1] !== 0) {
                    if (priceArray[index] !== 0) {
                        percent =
                            ((priceArray[index + 1] - priceArray[index]) /
                                priceArray[index]) *
                            100;
                    } else {
                        percent = priceArray[index + 1] * 100;
                    }
                } else {
                    percent = -priceArray[index] * 100;
                }
                if (this.cryptoPercentChange[ticker]) {
                    this.cryptoPercentChange[ticker] = [
                        ...this.cryptoPercentChange[ticker],
                        percent
                    ];
                } else {
                    this.cryptoPercentChange[ticker] = [percent];
                }
            }
        });
        this.removePercentChangeBadData();
        this.setIsLoaded('cryptoPercentChange', true);
    }

    removePercentChangeBadData() {
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, percentChangeArray]) => {
                this.cryptoPercentChange[ticker] = percentChangeArray.filter(
                    (_, i) => i !== percentChangeArray.length - 1
                );
            }
        );
    }

    setAnnualMeanReturns() {
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualMeanReturns[ticker] =
                    (priceChangeArray.reduce((a, b) => a + b, 0) /
                        priceChangeArray.length) *
                    365;
            }
        );
        this.setIsLoaded('annualMeanReturns', true);
    }
}

export default CryptoStore;
