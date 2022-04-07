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
        '#FFCDD2',
        '#E1BEE7',
        '#B3E5FC',
        '#C8E6C9',
        '#FFE0B2'
    ];
    logRegressionRawData = [];
    logRegressionUsableData = [];
    logRegressionFormattedData = [];
    logRegressionTrainingData = [];
    logRegressionModeledData = [];
    logRegressionChartColors = ['#26C6DA', '#EC407A', '#FF7043', '#8D6E63'];

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
        this.loading[key] = bool;
    }

    setCryptoNames(names) {
        this.cryptoNames = names;
    }

    setCryptoPrice(ticker, priceArray) {
        this.cryptoPrices[ticker] = priceArray;
    }

    setCryptoPercentChange() {
        this.setIsLoading('cryptoPercentChange', true);
        this.cryptoPercentChange = {};
        Object.entries(this.cryptoPrices).forEach(([ticker, priceArray]) => {
            let percent;
            let chunk = 200;
            let i = 0;

            const executeChunk = () => {
                let count = chunk;
                while (count-- && i < priceArray.length) {
                    if (priceArray?.length - 1 === i) {
                        return;
                    }
                    if (priceArray[i + 1] !== 0) {
                        if (priceArray[i] !== 0) {
                            percent =
                                (priceArray[i + 1] - priceArray[i]) /
                                priceArray[i];
                        } else {
                            percent = priceArray[i + 1];
                        }
                    } else {
                        percent = -priceArray[i];
                    }
                    if (this.cryptoPercentChange[ticker]?.length > 0) {
                        this.cryptoPercentChange[ticker] = [
                            ...this.cryptoPercentChange[ticker],
                            percent
                        ];
                    } else {
                        this.cryptoPercentChange[ticker] = [percent];
                    }
                    ++i;
                }
                if (i < priceArray.length) {
                    setTimeout(executeChunk, 1);
                }
            };
            executeChunk();
        });

        setTimeout(() => {
            this.removePercentChangeBadData();
            this.setIsLoaded(['cryptoPercentChange'], true);
            this.setIsLoading('cryptoPercentChange', false);
        }, 20000);
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
        this.kMeansClusteringIter100 = [];
        this.kMeansClusteringIter1000 = [];
        this.kMeansClusteringIter10000 = [];
        this.kMeansClusteringIter100000 = [];

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

    setLogRegressionRawData(data) {
        this.logRegressionRawData = data;
    }

    setLogRegressionUsableData() {
        this.logRegressionRawData.forEach((el, i) => {
            // if (i === 0) {
            //     return;
            // }
            this.logRegressionUsableData = [
                ...this.logRegressionUsableData,
                {
                    date: el['Date'],
                    name: el['Name'],
                    ticker: el['Symbol'],
                    open: +el['Open'],
                    openOpen:
                        el['Open'] -
                        (this.logRegressionRawData[i - 1]
                            ? this.logRegressionRawData[i - 1]['Open']
                            : 0),
                    mav: !!this.logRegressionRawData[i - 9]
                        ? this.logRegressionRawData
                              .slice(i - 9, i + 1)
                              .reduce((a, b) => a + +b['Open'], 0) / 10
                        : this.logRegressionRawData
                              .slice(0, i + 1)
                              .reduce((a, b) => a + +b['Open'], 0) /
                          (i + 1)
                }
            ];
        });
    }

    setLogRegressionFormattedData() {
        this.logRegressionUsableData.forEach((el, i) => {
            const buy =
                el['mav'] - (el[i - 1] ? el[i - 1]['mav'] : 0) > 0 &&
                el['openOpen'] > 0;

            this.logRegressionFormattedData[i] = { ...el, buy: buy };
        });
    }

    setLogRegressionTrainingData() {
        this.logRegressionFormattedData.forEach((el, i) => {
            this.logRegressionTrainingData[i] = {
                open: el.open,
                openOpen: el.openOpen,
                mav: el.mav,
                buy: el.buy
            };
        });
    }

    setLogRegressionModeledData(data) {
        this.logRegressionModeledData = [
            ...this.logRegressionModeledData,
            data
        ];
    }
}

export default CryptoStore;
