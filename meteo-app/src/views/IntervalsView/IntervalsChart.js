import React from "react";
import ReactApexChart from "react-apexcharts";

const IntervalsChart = ({ className, series, height, ...props }) => {
    const options = {
        chart: {
            height: { height },
            type: 'line',
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            background: '#fff'
        },
        // https://carto.com/carto-colors/
        colors: [
            '#333333', '#333333', '#66C5CC', '#F6CF71', '#F89C74', '#DCB0F2', '#87C55F', '#9EB9F3', '#FE88B1', '#C9DB74', '#8BE0A4', '#B497E7', '#D3B484', '#B3B3B3', '#5F4690', '#1D6996', '#38A6A5', '#0F8554', '#73AF48', '#EDAD08', '#E17C05', '#CC503E', '#94346E', '#6F4070', '#994E95', '#666666',
            '#3b355c', '#613c6e', '#8c4176', '#b64573', '#da4f66', '#f46452', '#ff8236', '#ffa600',
            '#6a3d9a', '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6',
            '#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffffe0', '#ffbcaf', '#f4777f', '#cf3759', '#93003a'
        ],

        dataLabels: {
            enabled: false
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
        stroke: {
            show: true,
            curve: 'straight',
            lineCap: 'square',
            colors: undefined,
            width: 3,
            dashArray: [10, 10, ...Array(100).fill(0)]
        },
        markers: {
            size: [0, 0, ...Array(100).fill(5)],
            colors: undefined,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
                size: undefined,
                sizeOffset: 3
            }
        }


    };

    return (
        <ReactApexChart options={options} series={series} type="line" height={height} />
    );
}

export default IntervalsChart;