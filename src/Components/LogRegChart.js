import React from 'react';
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

import Moment from 'moment';

import './_styles/LogRegChart.css';

import { useStore } from '../Stores/StoreFunctions';

const LogRegChart = () => {
    const { CryptoStore } = useStore();

    const data = CryptoStore.logRegressionModeledData.slice();

    const TooltipContent = ({ payload, active }) => {
        if (active) {
            // console.log(payload);

            const handleActive = (payload) => {
                const dataKeys = {
                    date: 'Date',
                    close: 'Closing Price',
                    open: 'Opening Price',
                    openOpen: "Previous Day's Open - Today's Open",
                    mav: '10-Day Moving Average (Open - Open)',
                    logRegProb: 'Logistic Regression Probability (Buy Signal)',
                    buy: 'Buy Signal'
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
        <div style={{ width: '100%' }}>
            <h4>A demo of synchronized AreaCharts</h4>

            <ResponsiveContainer width="100%" height={200}>
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
                    <XAxis dataKey={'date'} name="Date" />
                    <YAxis />
                    <Tooltip content={<TooltipContent />} />
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#8884d8"
                        fill="#8884d8"
                    />
                </LineChart>
            </ResponsiveContainer>
            <h4>Maybe some other content</h4>

            <ResponsiveContainer width="100%" height={200}>
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
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="logRegProb"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                    />
                    <Brush />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={200}>
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
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="logRegProb"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LogRegChart;
