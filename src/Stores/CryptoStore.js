import { makeAutoObservable } from 'mobx';
import { std, sqrt } from 'mathjs';
import ObjectLearning from 'object-learning';
import Moment from 'moment';

/***
 * CryptoStore - manages global app state. houses properties, methods, loading state,
 * etc.
 */

class CryptoStore {
    /***
     * loaded - stores all state for the loaded properties
     */

    loaded = {
        cryptoNames: false,
        cryptoPrices: false,
        cryptoPercentChange: false,
        annualMeanReturns: false,
        annualPriceVariances: false,
        kMeansData: false,
        kMeansClusteringData: false,
        logRegRawData: false,
        logRegUsableData: false,
        logRegFormattedData: false,
        logRegTrainingData: false,
        logRegModeledData: false,
        logRegNextDayPrediction: false
    };

    /***
     * loading - stores all state for the loading properties
     */

    loading = {
        annualMeanReturns: false,
        annualPriceVariances: false,
        cryptoNames: false,
        cryptoPrices: false,
        cryptoPercentChange: false,
        logRegressionRawData: false,
        logRegressionUsableData: false,
        logRegressionFormattedData: false,
        logRegressionTrainingData: false,
        logRegressionModeledData: false
    };

    /***
     * Other miscellaneous store properties (I used verbose and descriptive names, so it
     * is rather self-explanatory what they store)
     */

    cryptoNames = [];
    cryptoPrices = {};
    cryptoPercentChange = {};
    annualMeanReturns = {};
    annualPriceVariances = {};
    kMeansData = [];
    kMeansClusteringIter100 = [];
    kMeansClusteringIter1000 = [];
    kMeansClusteringIter10000 = [];
    kMeansClusteringIter50000 = [];
    kMeansClusteringIter100000 = [];
    kMeansClusteringIter200000 = [];
    kMeansClusteringIter500000 = [];
    kMeansClusteringIter1000000 = [];
    logRegressionRawData = [];
    logRegressionUsableData = [];
    logRegressionFormattedData = [];
    logRegressionTrainingData = [];
    logRegressionModeledData = [];
    logRegressionNextDayPrediction = '';
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
    logRegressionChartColors = {
        blue: {
            solid: 'rgb(38, 198, 218)',
            transparency: 'rgba(38, 198, 218, 0.6)'
        },
        pink: {
            solid: 'rgb(236, 64, 122)',
            transparency: 'rgba(236, 64, 122, 0.6)'
        },
        orange: {
            solid: 'rgb(255, 112, 67)',
            transparency: 'rgba(255, 112, 67, 0.6)'
        },
        brown: {
            solid: 'rgb(141, 110, 99)',
            transparency: 'rgba(141, 110, 99, 0.6)'
        }
    };

    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }

    /***
     * Store methods
     */

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
        this.setIsLoading('annualMeanReturns', true);

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
        this.setIsLoading('annualMeanReturns', false);
    }

    setAnnualMeanReturnsClean() {
        this.annualMeanReturns = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualMeanReturns[ticker] =
                    (priceChangeArray
                        .filter((el) => el <= 5)
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
        this.setIsLoading('annualPriceVariances', true);

        this.annualPriceVariances = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualPriceVariances[ticker] =
                    std(priceChangeArray) * sqrt(365);
            }
        );
        this.setIsLoaded(['annualPriceVariances'], true);
        this.setIsLoading('annualPriceVariances', false);
    }

    setAnnualPriceVariancesClean() {
        this.annualPriceVariances = {};
        Object.entries(this.cryptoPercentChange).forEach(
            ([ticker, priceChangeArray]) => {
                this.annualPriceVariances[ticker] =
                    std(priceChangeArray.filter((el) => el <= 5)) * sqrt(365);
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
        this.kMeansClusteringIter1000000 = [];

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
        this.setIsLoaded(['logRegRawData'], true);
    }

    setLogRegressionNextDate(date) {
        this.logRegressionNextDate = date;
    }

    setLogRegressionUsableData() {
        this.setIsLoading('logRegressionUsableData', true);
        this.logRegressionUsableData = [];
        this.logRegressionRawData.forEach((el, i) => {
            this.logRegressionUsableData = [
                ...this.logRegressionUsableData,
                {
                    date: Moment(el['Date']).format('YYYY-MM-DD'),
                    name: el['Name'],
                    ticker: el['Symbol'],
                    close: +el['Close'],
                    open: +el['Open'],
                    openOpen: this.logRegressionRawData[i - 1]
                        ? this.logRegressionRawData[i].Open -
                          this.logRegressionRawData[i - 1].Open
                        : 0,
                    mav: this.logRegressionRawData[i - 9]
                        ? this.logRegressionRawData
                              .slice(i - 9, i + 1)
                              .reduce((a, b) => a + +b.Open, 0) / 10
                        : this.logRegressionRawData
                              .slice(0, i + 1)
                              .reduce((a, b) => a + +b.Open, 0) /
                          (i + 1)
                }
            ];
        });

        this.setIsLoaded(['logRegUsableData'], true);
        this.setIsLoading('logRegressionUsableData', false);
    }

    setLogRegressionFormattedData() {
        this.setIsLoading('logRegressionFormattedData', true);
        this.logRegressionFormattedData = [];
        this.logRegressionUsableData.forEach((el, i) => {
            const buy =
                (this.logRegressionUsableData[i - 1] &&
                    this.logRegressionUsableData[i].mav -
                        this.logRegressionUsableData[i - 1].mav) > 0 &&
                this.logRegressionUsableData[i].openOpen > 0 &&
                (this.logRegressionUsableData[i - 1] &&
                    this.logRegressionUsableData[i].open -
                        this.logRegressionUsableData[i - 1].close) > 0;

            this.logRegressionFormattedData[i] = { ...el, buy: buy };
        });
        this.setIsLoaded(['logRegFormattedData'], true);
        this.setIsLoading('logRegressionFormattedData', false);
    }

    setLogRegressionTrainingData() {
        this.setIsLoading('logRegressionTrainingData', true);
        this.logRegressionTrainingData = [];

        this.logRegressionFormattedData.forEach((el, i) => {
            this.logRegressionTrainingData[i] = {
                open: el['open'],
                openOpen: el['openOpen'],
                mav: el['mav'],
                buy: el['buy']
            };
        });
        this.setIsLoaded(['logRegTrainingData'], true);
        this.setIsLoading('logRegressionTrainingData', false);
    }

    setLogRegressionModeledData() {
        this.setIsLoading('logRegressionModeledData', true);
        this.logRegressionModeledData = [];

        this.setLogRegressionTrainingData();

        const model = ObjectLearning.runLogisticReg(
            JSON.parse(JSON.stringify(this.logRegressionTrainingData)),
            ['open', 'openOpen', 'mav'],
            'buy'
        );

        this.logRegressionTrainingData.forEach((el, i) => {
            this.logRegressionModeledData[i] = {
                open: el.open,
                openOpen: el.openOpen,
                mav: el.mav,
                buy: el.buy,
                logRegProb: model.evalObject({
                    open: el.open,
                    openOpen: el.openOpen,
                    mav: el.mav
                })
            };
        });

        this.logRegressionFormattedData.forEach((el, i) => {
            this.logRegressionModeledData[i] = {
                ...this.logRegressionModeledData[i],
                date: el.date,
                name: el.name,
                ticker: el.ticker,
                close: el.close
            };
        });

        this.setIsLoaded(['logRegModeledData'], true);
        this.setIsLoading('logRegressionModeledData', false);
    }

    setLogRegressionNextDayPrediction(openPrice) {
        this.setLogRegressionTrainingData();

        const tempOpenArray = [];

        this.logRegressionFormattedData.forEach((el) => {
            [...tempOpenArray, el.open];
        });

        tempOpenArray.push(+openPrice);

        const model = ObjectLearning.runLogisticReg(
            JSON.parse(JSON.stringify(this.logRegressionTrainingData)),
            ['open', 'openOpen', 'mav'],
            'buy'
        );

        this.logRegressionNextDayPrediction = model.evalObject({
            open: +openPrice,
            openOpen:
                +openPrice -
                this.logRegressionFormattedData[
                    this.logRegressionFormattedData?.length - 1
                ].open,
            mav: tempOpenArray.slice(-10).reduce((a, b) => a + b, 0) / 10
        });

        this.setIsLoaded(['logRegNextDayPrediction'], true);
    }

    resetStore() {
        this.setIsLoaded(
            [
                'cryptoNames',
                'cryptoPrices',
                'cryptoPercentChange',
                'annualMeanReturns',
                'annualPriceVariances',
                'kMeansData',
                'kMeansClusteringData',
                'logRegRawData',
                'logRegUsableData',
                'logRegFormattedData',
                'logRegTrainingData',
                'logRegModeledData'
            ],
            false
        );

        this.cryptoNames = [];
        this.cryptoPrices = {};
        this.cryptoPercentChange = {};
        this.annualMeanReturns = {};
        this.annualPriceVariances = {};
        this.kMeansData = [];
        this.kMeansClusteringIter100 = [];
        this.kMeansClusteringIter1000 = [];
        this.kMeansClusteringIter10000 = [];
        this.kMeansClusteringIter100000 = [];
        this.kMeansClusteringIter1000000 = [];
        this.logRegressionRawData = [];
        this.logRegressionUsableData = [];
        this.logRegressionFormattedData = [];
        this.logRegressionTrainingData = [];
        this.logRegressionModeledData = [];
        this.logRegressionNextDayPrediction = '';
    }
}

export default CryptoStore;
