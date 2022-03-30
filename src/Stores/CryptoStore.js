import { makeAutoObservable } from 'mobx';
import { std, sqrt } from 'mathjs';

class CryptoStore {
    loaded = {
        cryptoNames: false,
        cryptoPrices: false,
        cryptoPercentChange: false,
        annualMeanReturns: false,
        annualPriceVariances: false,
        kMeansData: false
    };
    cryptoTest = '12345';
    cryptoNames = [];
    cryptoPrices = {};
    cryptoPercentChange = {};
    annualMeanReturns = {};
    annualPriceVariances = {};
    kMeansData = [];

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
                            (priceArray[index + 1] - priceArray[index]) /
                            priceArray[index];
                    } else {
                        percent = priceArray[index + 1];
                    }
                } else {
                    percent = -priceArray[index];
                }
                if (this.cryptoPercentChange[ticker]?.length) {
                    this.cryptoPercentChange[ticker] = [
                        ...this.cryptoPercentChange[ticker],
                        percent
                    ];
                } else {
                    this.cryptoPercentChange[ticker] = [percent];
                }
            }
        });
        // this.removePercentChangeBadData();
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
                        this.cryptoPrices[ticker]?.length) *
                    365;
            }
        );
        this.setIsLoaded('annualMeanReturns', true);
    }

    setAnnualPriceVariances() {
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualPriceVariances[ticker] =
                    std(priceChangeArray) * sqrt(365);
            }
        );
        this.setIsLoaded('annualPriceVariances', true);
    }

    setKMeansData() {
        Object.values(this.annualMeanReturns).forEach((meanReturn, i) => {
            this.kMeansData[i] = {
                ...this.kMeansData[i],
                meanReturn: meanReturn
            };
        });

        Object.values(this.annualPriceVariances).forEach((priceVariance, i) => {
            this.kMeansData[i] = {
                ...this.kMeansData[i],
                priceVariance: priceVariance
            };
        });
        this.setIsLoaded('kMeansData', true);
    }
}

export default CryptoStore;
