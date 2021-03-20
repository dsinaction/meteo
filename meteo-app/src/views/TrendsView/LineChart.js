import React from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from 'react-i18next';

const LineChart = ({ className, series, height, ...props }) => {
    const { t } = useTranslation();

    const options = {
        chart: {
            height: {height},
            type: 'line',
            toolbar: {
                show: true
            },
            zoom: { enabled: false },
            animations: { enabled: false },
        },
        colors: ['#66C5CC', '#F89C74', '#B3B3B3', '#F6CF71','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#C9DB74','#8BE0A4','#B497E7','#D3B484'],
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'butt',
            width: 2,
            dashArray: 0,
        },
        grid: {
            show: true,
            borderColor: '#AAAAAA',
            strokeDashArray: 5,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
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
        markers: {
            size: 3,
            colors: ['#FFFFFF', '#525454'],
            strokeColors: '#77B6EA',
            strokeWidth: 1,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 0.5,
            discrete: [],
            shape: "circle",
            radius: 1,
            showNullDataPoints: true,
            hover: {
                size: undefined,
                sizeOffset: 3
            }
        },
        xaxis: {
            title: {
                text: t('Date')
            },
            type: 'datetime'
        },
        yaxis: {
            title: {
                text: t('Temperature'),
            },
            type: 'numeric',
            labels: {
                formatter: function (value) {
                    return value.toFixed(2);
                }
            },
        },
        legend: {
            show: false
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
        <ReactApexChart options={options} series={series} type="line" height={height} />
    );
}

export default LineChart;