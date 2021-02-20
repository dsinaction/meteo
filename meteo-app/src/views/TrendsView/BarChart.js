import React from 'react';
import ReactApexChart from "react-apexcharts";
import { useTranslation } from 'react-i18next';

const BarChart = ({ className, series, height, ...props }) => {
    const { t } = useTranslation();

    const options = {
        chart: {
            type: 'bar',
            height: { height },
            animations: {
                enabled: false
            },
            zoom: {
                enabled: false,
            }
        },
        grid: {
            show: true,
            borderColor: '#AAAAAA',
            strokeDashArray: 5,
            position: 'back',
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: { show: true }
            },
            row: {
                colors: undefined,
                opacity: 0.5
            },
            column: {
                colors: undefined,
                opacity: 0.5
            },
            padding: {
                top: 0,
                right: 10,
                bottom: 0,
                left: 10
            },
        },
        plotOptions: {
            bar: {
                colors: {
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
                            color: '#aaaaaa'
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
                columnWidth: '80%',
            }
        },
        dataLabels: {
            enabled: false,
        },
        yaxis: {
            title: {
                text: t('Trend Deviation'),
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2);
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                rotate: -90
            },
            title: {
                text: t('Date')
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: 'yyyy-MM',
            }
        }
    };

    return (
        <ReactApexChart options={options} series={series} type="bar" height={height} />
    );
}

export default BarChart;