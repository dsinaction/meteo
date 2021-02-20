import React from 'react';
import ReactApexChart from "react-apexcharts";
import groupBy from '../../utils/groupBy';
import getMonthName from '../../utils/getMonthName';
import { useTranslation } from 'react-i18next';

const HeatmapChart = ({ data, height }) => {
    const { t } = useTranslation();

    const groupByData = groupBy(data, 'month');
    const series = Object.keys(groupByData).map(month => ({
        name: t(getMonthName(month)),
        data: groupByData[month].map(record => {
            return {
                y: Math.round(record.tavg_dev * 100, 2) / 100,
                x: record.year
            };
        })
    }));
    const options = {
        chart: {
            height: { height },
            type: 'heatmap',
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            foreColor: '#000'
        },
        dataLabels: {
            enabled: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'normal',
                colors: ['#000']
            }
        },
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [
                        {
                            from: -999.00,
                            to: -2.99,
                            color: '#66c5cc',
                        },
                        {
                            from: -3.00,
                            to: -0.51,
                            color: '#b8e2e5',
                        },

                        {
                            from: -0.50,
                            to: 0.50,
                            color: '#ffffff'
                        },

                        {
                            from: 0.51,
                            to: 3.00,
                            color: '#ffb0a8'
                        },
                        {
                            from: 3.01,
                            to: 999.00,
                            color: '#f85959'
                        }
                    ]
                },
                useFillColorAsStroke: false
            }
        },
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'square',
            colors: [ '#000' ],
            width: 1,
            dashArray: 0,      
        },        
        grid: { show: false },
        legend: { show: false },
        xaxis: {
            tickPlacement: 'between',
            title: {
                text: t('Year')
            }
        },
        yaxis: {
            title: {
                text: t('Month'),
            }
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
            },
            y: {
                show: true,
                title: {
                    formatter: (seriesName) => seriesName + ': ',
                },
            }
        }
    };

    return (
        <ReactApexChart options={options} series={series} type="heatmap" height={height} />
    );
};

export default HeatmapChart;