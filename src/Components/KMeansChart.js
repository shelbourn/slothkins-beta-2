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
    Label,
    ResponsiveContainer
} from 'recharts';
import {
    Button,
    MenuItem,
    TextField,
    Snackbar,
    Alert,
    Backdrop,
    Typography
} from '@mui/material';

import { useStore } from '../Stores/StoreFunctions';

import './_styles/KMeansChart.css';

const KMeansChart = () => {
    const { CryptoStore } = useStore();

    const [selectedIterations, setSelectedIterations] = useState('');
    const [deleteFired, setDeleteFired] = useState(false);
    const [cleanFired, setCleanFired] = useState(false);
    const [deleteOrCleanData, setDeleteOrCleanData] = useState('');
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [chartInfoMessage, setChartInfoMessage] = useState(false);

    const iterationOptions = [
        { iterations: 100, storeProp: 'kMeansClusteringIter100' },
        { iterations: 1000, storeProp: 'kMeansClusteringIter1000' },
        { iterations: 10000, storeProp: 'kMeansClusteringIter10000' },
        { iterations: 100000, storeProp: 'kMeansClusteringIter100000' },
        { iterations: 1000000, storeProp: 'kMeansClusteringIter1000000' }
    ];

    const handleKMeansClusteringIter = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);
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
        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
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
        setDeleteFired(true);

        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleRefreshKMeansDataClean = (iterations) => () => {
        CryptoStore.setIsLoaded(['kMeansClusteringData'], false);

        handleDeleteOutlier(iterations);
        CryptoStore.setAnnualMeanReturnsClean();
        CryptoStore.setAnnualPriceVariancesClean();
        CryptoStore.setKMeansData();
        handleKMeansClusteringIter(iterations)();
        setCleanFired(true);

        CryptoStore.setIsLoaded(['kMeansClusteringData'], true);
    };

    const handleSelectedIterations = (event) => {
        setSelectedIterations(event.target.value);
        handleKMeansClusteringIter(event.target.value)();
        setChartInfoMessage(true);
    };

    const handleDeleteOrClean = (event) => {
        setDeleteOrCleanData(event.target.name);
        setConfirmMessage(true);
    };

    const handleConfirmDeleteClean = () => {
        if (deleteOrCleanData === 'delete') {
            handleRefreshKMeansData(selectedIterations)();
        }
        if (deleteOrCleanData === 'clean') {
            handleRefreshKMeansDataClean(selectedIterations)();
        }
        setConfirmMessage(false);
    };

    const handleConfirmClickaway = () => {
        setConfirmMessage(false);
        setChartInfoMessage(false);
    };

    const handleResetData = () => {
        CryptoStore.setIsLoaded(
            [
                'cryptoNames',
                'cryptoPrices',
                'cryptoPercentChange',
                'annualMeanReturns',
                'annualPriceVariances',
                'kMeansData'
            ],
            false
        );
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
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={confirmMessage}
                onClose={handleConfirmClickaway}
            >
                <Alert
                    severity="warning"
                    onClose={handleConfirmClickaway}
                    sx={{
                        width: '100%',
                        minWidth: 400
                    }}
                >
                    <h3>
                        Once you delete the outlier or clean the data you{' '}
                        <em>will not</em> be able to perform any other actions
                        without refreshing the data.
                    </h3>
                    <div className="alertButtons">
                        <Button
                            onClick={handleConfirmDeleteClean}
                            variant="contained"
                            color="primary"
                            sx={{ width: '45%', minWidth: 200 }}
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={handleConfirmClickaway}
                            color="primary"
                            sx={{ width: '45%', minWidth: 200 }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={chartInfoMessage}
                onClose={handleConfirmClickaway}
            >
                <Alert
                    severity="info"
                    onClose={handleConfirmClickaway}
                    sx={{
                        width: '100%',
                        minWidth: 400
                    }}
                >
                    <h3>
                        Hover or tap on a plot point or centroid for more
                        information.
                    </h3>
                    <h3>
                        <em>
                            Centroids are the plot points with bolder colors.
                        </em>
                    </h3>
                </Alert>
            </Snackbar>

            <Backdrop
                sx={{ color: '#fff', zIndex: '9' }}
                open={confirmMessage || chartInfoMessage}
                onClick={handleConfirmClickaway}
            />
            {CryptoStore.loaded.kMeansClusteringData && (
                <>
                    <h3
                        style={{
                            textAlign: 'center',
                            paddingLeft: 10,
                            paddingRight: 10
                        }}
                    >{`Visualized K-means Clustering for All Cryptocurrencies (${selectedIterations.toLocaleString(
                        'en-US'
                    )} iterations)`}</h3>
                    <div className="kMeansScatter">
                        <ResponsiveContainer width="85%" height={500}>
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
                                    data={
                                        CryptoStore[
                                            `kMeansClusteringIter${selectedIterations}`
                                        ]
                                    }
                                    fill="#8884d8"
                                >
                                    {CryptoStore[
                                        `kMeansClusteringIter${selectedIterations}`
                                    ].map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.c}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </>
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
                    disabled={
                        !CryptoStore.loaded.kMeansData ||
                        deleteFired ||
                        cleanFired
                    }
                    sx={{ mb: 2 }}
                >
                    {iterationOptions.map((el, i) => (
                        <MenuItem
                            value={el.iterations}
                            key={`${el.iterations}-${i}`}
                        >
                            {el.iterations.toLocaleString('en-US')}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    className="kMeansChartField"
                    onClick={handleDeleteOrClean}
                    variant="contained"
                    disabled={
                        !CryptoStore.loaded.kMeansData ||
                        deleteFired ||
                        cleanFired ||
                        !selectedIterations
                    }
                    color="secondary"
                    name="delete"
                    size="large"
                >
                    Delete Outlier
                </Button>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        textAlign: 'center',
                        maxWidth: 600
                    }}
                >
                    Outliers are common with ML algorithms. Click this button
                    the delete the outlier (if present)
                </Typography>
                <Button
                    className="kMeansChartField"
                    onClick={handleDeleteOrClean}
                    variant="contained"
                    disabled={
                        !CryptoStore.loaded.kMeansData ||
                        cleanFired ||
                        !selectedIterations
                    }
                    color="secondary"
                    name="clean"
                    size="large"
                >
                    Clean Data
                </Button>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        textAlign: 'center',
                        maxWidth: 600
                    }}
                >
                    Cleans the data to make it more useful
                </Typography>
                <Button
                    className="kMeansChartField"
                    onClick={handleResetData}
                    variant="contained"
                    disabled={!cleanFired && !deleteFired}
                    color="primary"
                    name="clean"
                    size="large"
                >
                    Reset Data
                </Button>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontStyle: 'italic',
                        mb: 2,
                        textAlign: 'center',
                        maxWidth: 600
                    }}
                >
                    Resets the data and navigates you back to the previous page
                </Typography>
            </div>
        </>
    );
};

export default observer(KMeansChart);
