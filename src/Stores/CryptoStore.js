import { makeAutoObservable } from 'mobx';
import { std, sqrt } from 'mathjs';

class CryptoStore {
    loaded = {
        cryptoNames: false,
        cryptoPrices: false,
        cryptoPercentChange: false,
        annualMeanReturns: false,
        annualPriceVariances: false,
        kMeansData: false,
        kMeansClusteringData: false
    };
    loading = {
        cryptoPercentChange: false
    };
    cryptoTest = '12345';
    cryptoNames = [];
    cryptoPrices = {};
    cryptoPercentChange = {};
    annualMeanReturns = {};
    annualPriceVariances = {};
    kMeansData = [];
    kMeansClusteringIter100 = [];
    kMeansClusteringIter1000 = [];
    kMeansClusteringIter10000 = [];
    kMeansClusteringIter100000 = [];
    kMeansCentroidColors = [
        '#EF5350',
        '#AB47BC',
        '#29B6F6',
        '#66BB6A',
        '#FFA726'
    ];
    kMeansClusterColors = [
        '#EF9A9A',
        '#CE93D8',
        '#81D4FA',
        '#A5D6A7',
        '#FFCC80'
    ];

    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    setIsLoaded(arrayOfKeys, bool) {
        arrayOfKeys.forEach((key) => {
            this.loaded[key] = bool;
        });
    }

    setIsLoading(key, bool) {
        this[key] = bool;
    }

    setCryptoNames(names) {
        this.cryptoNames = names;
    }

    setCryptoPrice(ticker, priceArray) {
        this.cryptoPrices[ticker] = priceArray;
    }

    setCryptoPercentChange() {
        this.cryptoPercentChange = {};
        Object.entries(this.cryptoPrices).forEach(([ticker, priceArray]) => {
            // for (const index in priceArray) {
            let percent;
            priceArray.forEach((price, i) => {
                if (priceArray?.length - 1 === i) {
                    return;
                }
                if (priceArray[i + 1] !== 0) {
                    if (price !== 0) {
                        percent = (priceArray[i + 1] - price) / price;
                    } else {
                        percent = priceArray[i + 1];
                    }
                } else {
                    percent = -price;
                }
                if (this.cryptoPercentChange[ticker]?.length > 0) {
                    this.cryptoPercentChange[ticker] = [
                        ...this.cryptoPercentChange[ticker],
                        percent
                    ];
                } else {
                    this.cryptoPercentChange[ticker] = [percent];
                }
            });
            // let percent;

            // if (!priceArray[index + 1]) {
            //     return;
            // }

            // if (index === 0) {
            //     percent = priceArray[index];
            // } else {
            //     percent =
            //         (priceArray[index + 1] - priceArray[index]) /
            //         priceArray[index];
            // }

            // if (
            //     (priceArray[index] === 0 && priceArray[index + 1] === 0) ||
            //     isNaN(priceArray[index]) ||
            //     isNaN(priceArray[index + 1])
            // ) {
            //     break;
            // }

            // if (priceArray[index + 1] && priceArray[index + 1] !== 0) {
            //     if (priceArray[index] !== 0) {
            //         percent =
            //             (priceArray[index + 1] - priceArray[index]) /
            //             priceArray[index];
            //     } else {
            //         percent = priceArray[index + 1];
            //     }
            // } else {
            //     percent = -priceArray[index];
            // }
            // if (this.cryptoPercentChange[ticker]?.length > 0) {
            //     this.cryptoPercentChange[ticker] = [
            //         ...this.cryptoPercentChange[ticker],
            //         percent
            //     ];
            // } else {
            //     this.cryptoPercentChange[ticker] = [percent];
            // }
        });
        this.removePercentChangeBadData();
        this.setIsLoaded(['cryptoPercentChange'], true);
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
        this.annualMeanReturns = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualMeanReturns[ticker] =
                    (priceChangeArray.reduce((a, b) => {
                        a + b;
                        return b;
                    }, 0) /
                        this.cryptoPrices[ticker]?.length) *
                    365;
            }
        );
        this.setIsLoaded(['annualMeanReturns'], true);
    }

    setAnnualMeanReturnsClean() {
        this.annualMeanReturns = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualMeanReturns[ticker] =
                    (priceChangeArray
                        .filter((el) => el <= 1)
                        .reduce((a, b) => {
                            a + b;
                            return b;
                        }, 0) /
                        this.cryptoPrices[ticker]?.length) *
                    365;
            }
        );
        this.setIsLoaded(['annualMeanReturns'], true);
    }

    setAnnualPriceVariances() {
        this.annualPriceVariances = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualPriceVariances[ticker] =
                    std(priceChangeArray) * sqrt(365);
            }
        );
        this.setIsLoaded(['annualPriceVariances'], true);
    }

    setAnnualPriceVariancesClean() {
        this.annualPriceVariances = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualPriceVariances[ticker] =
                    std(priceChangeArray.filter((el) => el <= 1)) * sqrt(365);
            }
        );
        this.setIsLoaded(['annualPriceVariances'], true);
    }

    setKMeansData() {
        this.kMeansData = [];
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
        this.setIsLoaded(['kMeansData'], true);
    }

    setKMeansIterData(key, data) {
        data.forEach((group, i) => {
            this[key] = [
                ...this[key],
                {
                    ...group['groupAvgs'],
                    c: this.kMeansCentroidColors[i],
                    groupName: group['groupName'],
                    label: `${group['groupName']} Centroid`
                }
            ];
            group['objects'].forEach((obj) => {
                const labelKey = Object.entries(this.annualMeanReturns).filter(
                    ([key, val]) => {
                        if (val === obj['meanReturn']) {
                            return key;
                        }
                    }
                );

                this[key] = [
                    ...this[key],
                    {
                        ...obj,
                        c: this.kMeansClusterColors[i],
                        groupName: group['groupName'],
                        label: labelKey[0][0]
                    }
                ];
            });
        });
        this.setIsLoaded(['kMeansClusteringData'], true);
    }

    deleteStoreOutlier(key) {
        this[key] = [];

        const keyToDelete = Object.entries(this.annualPriceVariances).sort(
            (a, b) => b[1] - a[1]
        )[0][0];

        delete this.cryptoPercentChange[keyToDelete];

        this.setIsLoaded(
            [
                'annualMeanReturns',
                'annualPriceVariances',
                'kMeansData',
                'kMeansClusteringData'
            ],
            false
        );
    }
}

export default CryptoStore;
