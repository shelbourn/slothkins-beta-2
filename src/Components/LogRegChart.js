import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Brush,
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts';
import { TextField, MenuItem, Button } from '@mui/material';

import './_styles/LogRegChart.css';

import { useStore } from '../Stores/StoreFunctions';

const LogRegChart = () => {
    const { CryptoStore } = useStore();

    const [fieldData, setFieldData] = useState({
        lineChart1Value: '',
        lineChart2Value: '',
        areaChartValue: ''
    });

    const data = CryptoStore.logRegressionModeledData.slice();

    const dataKeysForSelect = [
        { dataKey: 'close', description: 'Closing Price' },
        { dataKey: 'open', description: 'Opening Price' },
        {
            dataKey: 'openOpen',
            description: "Previous Day's Open - Today's Open"
        },
        {
            dataKey: 'mav',
            description: '10-Day Moving Average (Open - Open)'
        },
        {
            dataKey: 'logRegProb',
            description: 'Logistic Regression Probability (Buy Signal)'
        }
    ];

    const handleSelect = (event) => {
        const { name, value } = event.target;

        setFieldData({ ...fieldData, [name]: value });
    };

    const handleCurrencyButton = () => {
        CryptoStore.setIsLoaded(
            [
                'logRegRawData',
                'logRegUsableData',
                'logRegFormattedData',
                'logRegTrainingData',
                'logRegModeledData'
            ],
            false
        );
    };

    const TooltipContent = ({ payload, active }) => {
        if (active) {
            const handleActive = (payload) => {
                const dataKeys = {
                    date: 'Date',
                    close: 'Closing Price',
                    open: 'Opening Price',
                    openOpen: "Previous Day's Open - Today's Open",
                    mav: '10-Day Moving Average (Open - Open)',
                    logRegProb: 'Logistic Regression Probability (Buy Signal)'
                };

                return dataKeys[payload[0].name];
            };

            const chartColors = {
                blue: {
                    '--color': `${CryptoStore.logRegressionChartColors.blue.transparency.slice()}`,
                    '--border': `${CryptoStore.logRegressionChartColors.blue.solid.slice()}`
                },
                pink: {
                    '--color': `${CryptoStore.logRegressionChartColors.pink.transparency.slice()}`,
                    '--border': `${CryptoStore.logRegressionChartColors.pink.solid.slice()}`
                },
                orange: {
                    '--color': `${CryptoStore.logRegressionChartColors.orange.transparency.slice()}`,
                    '--border': `${CryptoStore.logRegressionChartColors.orange.solid.slice()}`
                },
                brown: {
                    '--color': `${CryptoStore.logRegressionChartColors.brown.transparency.slice()}`,
                    '--border': `${CryptoStore.logRegressionChartColors.brown.solid.slice()}`
                }
            };

            const randomChartColor = Math.floor(
                Math.random() * Object.keys(chartColors).length
            );

            const selectedChartColor =
                chartColors[Object.keys(chartColors)[randomChartColor]];

            return (
                <div className="tooltipBackground" style={selectedChartColor}>
                    <div className="tooltip" style={selectedChartColor}>
                        <p className="tooltipLabel">{`Date: ${payload[0].payload.date}`}</p>
                        <p className="tooltipLabel">{`${handleActive(
                            payload
                        )}: ${payload[0].payload[payload[0].name]}`}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="chartContainer">
                <h3>{`Visualized Logistic Regression Analysis for ${CryptoStore.logRegressionRawData[0].Name} (${CryptoStore.logRegressionRawData[0].Symbol})`}</h3>
                <ResponsiveContainer width="95%" height={200}>
                    <LineChart
                        width={500}
                        height={200}
                        data={data}
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" name="Date" />
                        <YAxis />
                        <Tooltip content={<TooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey={fieldData.lineChart1Value || 'close'}
                            stroke="#7e57c2"
                            fill="#7e57c2"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="95%" height={200}>
                    <LineChart
                        width={500}
                        height={200}
                        data={data}
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" name="Date" />
                        <YAxis />
                        <Tooltip content={<TooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey={fieldData.lineChart2Value || 'logRegProb'}
                            stroke="#5C6BC0"
                            fill="#5C6BC0"
                        />
                        <Brush stroke="#7e57c2" gap={10} travellerWidth={10} />
                    </LineChart>
                </ResponsiveContainer>
                <p>
                    <em>Move the slider handles to adjust the date range</em>
                </p>
                <ResponsiveContainer width="95%" height={200}>
                    <AreaChart
                        width={500}
                        height={200}
                        data={data}
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" name="Date"></XAxis>
                        <YAxis />
                        <Tooltip content={<TooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey={fieldData.areaChartValue || 'logRegProb'}
                            stroke="#5C6BC0"
                            fill="#5C6BC0"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="chartFieldContainer">
                <TextField
                    className="chartField"
                    variant="outlined"
                    select
                    id="log-reg-line-chart-1"
                    name="lineChart1Value"
                    value={fieldData.lineChart1Value}
                    onChange={handleSelect}
                    label="Line Chart 1 Value"
                    helperText="Please select a value for the first line chart"
                    color="primary"
                    defaultValue=""
                    disabled={!CryptoStore.loaded.logRegModeledData}
                >
                    {dataKeysForSelect.map((el, i) => (
                        <MenuItem value={el.dataKey} key={`${el.dataKey}-${i}`}>
                            {el.description}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    className="chartField"
                    variant="outlined"
                    select
                    id="log-reg-line-chart-2"
                    name="lineChart2Value"
                    value={fieldData.lineChart2Value}
                    onChange={handleSelect}
                    label="Line Chart 1 Value"
                    helperText="Please select a value for the first line chart"
                    color="primary"
                    defaultValue=""
                    disabled={!CryptoStore.loaded.logRegModeledData}
                >
                    {dataKeysForSelect.map((el, i) => (
                        <MenuItem value={el.dataKey} key={`${el.dataKey}-${i}`}>
                            {el.description}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    className="chartField"
                    variant="outlined"
                    select
                    id="log-reg-area-chart"
                    name="areaChartValue"
                    value={fieldData.areaChartValue}
                    onChange={handleSelect}
                    label="Area Chart Value"
                    helperText="Select a value for the area chart"
                    color="primary"
                    defaultValue=""
                    disabled={!CryptoStore.loaded.logRegModeledData}
                >
                    {dataKeysForSelect.map((el, i) => (
                        <MenuItem value={el.dataKey} key={`${el.dataKey}-${i}`}>
                            {el.description}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    onClick={handleCurrencyButton}
                    color="secondary"
                    variant="contained"
                    className="chartFieldButton"
                >
                    Select a Different Currency
                </Button>
            </div>
        </>
    );
};

export default LogRegChart;
