import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import ObjectLearning from 'object-learning';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    Label
} from 'recharts';
import { Button, MenuItem, TextField } from '@mui/material';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/KMeansChart.css';

const KMeansChart = () => {
    const { CryptoStore } = useStore();

    const [selectedIterations, setSelectedIterations] = useState('');

    const iterationOptions = [
        { iterations: '100', storeProp: 'kMeansClusteringIter100' },
        { iterations: '1,000', storeProp: 'kMeansClusteringIter1000' },
        { iterations: '10,000', storeProp: 'kMeansClusteringIter10000' },
        { iterations: '100,000', storeProp: 'kMeansClusteringIter100000' },
        { iterations: '1,000,000', storeProp: 'kMeansClusteringIter1000000' }
    ];

    const handleKMeansClusteringIter = (iterations) => () => {
        const clusteringModel = ObjectLearning.runKClustering(
            CryptoStore.kMeansData,
            ['meanReturn', 'priceVariance'],
            {
                maxIter: iterations,
                groups: 5,
                groupNames: [
                    'Conservative',
                    'Conservative-Moderate',
                    'Moderate',
                    'Moderate-Aggressive',
                    'Aggressive'
                ]
            }
        );
        CryptoStore.setKMeansIterData(
            `kMeansClusteringIter${iterations}`,
            JSON.parse(JSON.stringify(clusteringModel))['groups']
        );
    };

    const handleDeleteOutlier = (iterations) => {
        CryptoStore.deleteStoreOutlier(`kMeansClusteringIter${iterations}`);
    };

    const handleRefreshKMeansData = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
        handleDeleteOutlier(iterations);
        CryptoStore.setAnnualMeanReturns();
        CryptoStore.setAnnualPriceVariances();
        CryptoStore.setKMeansData();
        handleKMeansClusteringIter(iterations)();
        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleRefreshKMeansDataClean = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
        handleDeleteOutlier(iterations);
        CryptoStore.setAnnualMeanReturnsClean();
        CryptoStore.setAnnualPriceVariancesClean();
        CryptoStore.setKMeansData();
        handleKMeansClusteringIter(iterations)();
        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleSelectedIterations = (event) => {
        setSelectedIterations(event.target.value);
    };

    const TickerName = ({ payload, active }) => {
        if (active) {
            return (
                <div className="tickerNameTooltip">
                    <p className="tooltipLabel">{`${payload[0].name} : ${payload[0].value}%`}</p>
                    <p className="tooltipLabel">{`${payload[1].name} : ${payload[1].value}%`}</p>
                    <p className="tooltipLabel">
                        {payload[0].payload.label
                            .toLowerCase()
                            .includes('centroid')
                            ? `${payload[0].payload.label}`
                            : `Ticker : ${payload[0].payload.label}`}
                    </p>
                    <p className="tooltipLabel">{`Risk Group : ${payload[0].payload.groupName}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {CryptoStore.loaded.kMeansClusteringData && (
                <div className="kMeansScatter">
                    <ScatterChart
                        width={500}
                        height={500}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20
                        }}
                    >
                        <CartesianGrid />
                        <XAxis
                            unit="%"
                            type="number"
                            dataKey="meanReturn"
                            name="Mean Return"
                            dy={10}
                        >
                            <Label
                                value="Annual Mean Returns"
                                offset={-20}
                                position="insideBottom"
                            />
                        </XAxis>
                        <YAxis
                            unit="%"
                            type="number"
                            dataKey="priceVariance"
                            name="Price Variance"
                            dx={-10}
                        >
                            <Label
                                value="Annual Price Variance"
                                offset={10}
                                angle={-90}
                                position="left"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <Tooltip
                            content={<TickerName />}
                            cursor={{ strokeDasharray: '3 3' }}
                        />
                        <Scatter
                            name="Test"
                            data={CryptoStore.kMeansClusteringIter10000}
                            fill="#8884d8"
                        >
                            {CryptoStore.kMeansClusteringIter10000.map(
                                (entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.c}
                                    />
                                )
                            )}
                        </Scatter>
                    </ScatterChart>
                </div>
            )}
            <div className="kMeansChartFieldContainer">
                <TextField
                    className="kMeansChartField"
                    variant="outlined"
                    select
                    id="k-means-select"
                    name="kMeansIterations"
                    value={selectedIterations}
                    onChange={handleSelectedIterations}
                    label="Number of Iterations"
                    helperText="Please select the number of iterations to run"
                    color="primary"
                    defaultValue=""
                    disabled={!CryptoStore.loaded.kMeansData}
                >
                    {iterationOptions.map((el, i) => (
                        <MenuItem
                            value={el.storeProp}
                            key={`${el.iterations}-${i}`}
                        >
                            {el.iterations}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    className="kMeansChartField"
                    onClick={handleKMeansClusteringIter(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    K-Means Clustering 10,000
                </Button>
                <Button
                    className="kMeansChartField"
                    onClick={handleRefreshKMeansData(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    Delete Outlier
                </Button>
                <Button
                    className="kMeansChartField"
                    onClick={handleRefreshKMeansDataClean(10000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    Clean Data
                </Button>
                <Button
                    className="kMeansChartField"
                    onClick={handleKMeansClusteringIter(100000)}
                    variant="contained"
                    disabled={!CryptoStore.loaded.kMeansData}
                    color="secondary"
                >
                    K-Means Clustering 100,000
                </Button>
            </div>
        </>
    );
};

export default observer(KMeansChart);
