import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Page from './../../components/Page';
import DataFilterBar from './../../components/DataFilterBar';
import MeteoCard from '../../components/MeteoCard';
import SynopData from '../../services/api/SynopData';
import useSemiPersistentState from '../../utils/useSemiPersistentState';
import LinearRegression from '../../utils/LinearRegression';
import { sortBy } from 'lodash';
import LineChart from './LineChart';
import BarChart from './BarChart';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const getTrendLine = data => {
    if (data.length === 0) {
        return [];
    }

    const sortedData = sortBy(data, 'x')
        .map(({ y, x }, index) => ({ y: y, x: index, x_prev: x }));

    const x = sortedData.map(({ y, x }) => x);
    const y = sortedData.map(({ y, x }) => y);

    const yhat = new LinearRegression().fit(y, x).predict(x);
    const newData = sortedData
        .map((record, i) => ({
            x: record.x_prev,
            y: yhat[i],
            error: record.y - yhat[i]
        }));

    return newData;
};

const TrendsView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [station, setStation] = useSemiPersistentState('meteo-station', { id: '1', name: t('Poland') });
    const [data, setData] = React.useState([]);

    const handleChangeStation = event => {
        setStation({ id: event.value, name: event.label });
    };

    React.useEffect(() => {
        SynopData
            .getMovingAverage(station.id)
            .then(result => {
                setData(result.data.data);
            });
    }, [station]);

    const chartData = data.map(record => ({
        y: Math.round(Number(record.mtavg) * 100, 2) / 100,
        x: new Date(record.date)
    }));

    const trendLineData = getTrendLine(chartData);
    const lineChartSeries = [
        {
            data: chartData,
            name: t('Mean temperature')
        },
        {
            data: trendLineData.length > 0
                ? [trendLineData[0], trendLineData[trendLineData.length - 1]]
                : [],
            name: t('Trend Line')
        }
    ];
    const barChartSeries = [{
        data: trendLineData.map(record => {
            return {
                y: record.error,
                x: record.x
            };
        }),
        name: t('Trend Deviation')
    }];

    return (
        <Page
            className={classes.root}
            title={t('TrendsView Title')}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <DataFilterBar
                            onChangeStation={handleChangeStation}
                            defaultValue={{ value: station.id, label: station.name }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('12 months moving average and trend')}
                            subheader={t('12 months moving average and trend - Description')}
                        >
                            <LineChart series={lineChartSeries} height={600} />
                        </MeteoCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Deviation from trend')}
                            subheader={t('Deviation from Trend - Description')}
                        >
                            <BarChart series={barChartSeries} height={600} />
                        </MeteoCard>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default TrendsView;