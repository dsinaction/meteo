import React from 'react';
import { Container, makeStyles, Grid, Select, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Page from './../../components/Page';
import DataFilterBar from './../../components/DataFilterBar';
import MeteoCard from '../../components/MeteoCard';
import HeatmapChart from './HeatmapChart';
import BarChart from './BarChart';
import SynopData from '../../services/api/SynopData';
import useSemiPersistentState from '../../utils/useSemiPersistentState';
import groupBy from '../../utils/groupBy';
import getMonthName from '../../utils/getMonthName';
import DataTable from './../../components/DataTable';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const DeviationsView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [station, setStation] = useSemiPersistentState('meteo-station', { id: '1', name: t('Poland') });
    const [data, setData] = React.useState([]);
    const [limit, setLimit] = React.useState(1960);

    React.useEffect(() => {
        SynopData
            .getDeviationFromLongTermAverage(station.id)
            .then(result => {
                setData(result.data.data.map(record => ({
                    ...record,
                    tavg_dev: parseFloat(record.tavg_dev),
                    date: new Date(record.date)
                })));
            });
    }, [station]);

    const handleChangeStation = event => {
        setStation({ id: event.value, name: event.label });
    };

    const handleChangeLimit = event => {
        setLimit(event.target.value);
    };

    const limitedData = data.filter(record => record.year >= limit);
    const groupByData = groupBy(limitedData, 'year');
    const series = [
        {
            data: limitedData
                .filter(record => record.date !== null).map(record => ({
                    y: Math.round(record.tavg_dev * 100, 2) / 100,
                    x: record.date
                })),
            name: t('Average Deviation')
        }
    ];

    const df = Object.keys(groupByData).map(year => {
        const record = { year: year }
        groupByData[year].forEach(row => {
            record[row.month] = row.tavg_dev;
        });
        return record;
    });

    const columns = [
        {
            id: 'year',
            label: t('Year'),
            maxWidth: 25,
            align: 'center',
            format: (value) => <strong>{value}</strong>
        },
        ...Array.from({ length: 12 }, (_, i) => i + 1).map(month => ({
            id: month,
            label: t(getMonthName(month)),
            maxWidth: 25,
            align: 'center',
            format: (value) => value ? value.toFixed(2) : value
        }))
    ];

    return (
        <Page
            className={classes.root}
            title={t('DeviationsView Title')}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <DataFilterBar
                            onChangeStation={handleChangeStation}
                            defaultValue={{ value: station.id, label: station.name }}
                        >
                            <Grid item xs={11} sm={6} md={5} lg={4}>
                                <Select
                                    value={limit}
                                    onChange={handleChangeLimit}
                                >
                                    <MenuItem value={2010}>Od 2010</MenuItem>
                                    <MenuItem value={2000}>Od 2000</MenuItem>
                                    <MenuItem value={1990}>Od 1990</MenuItem>
                                    <MenuItem value={1980}>Od 1980</MenuItem>
                                    <MenuItem value={1970}>Od 1970</MenuItem>
                                    <MenuItem value={1960}>Od 1960</MenuItem>
                                </Select>
                            </Grid>
                        </DataFilterBar>
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Deviations from long-term averages')}
                            subheader={t('Deviations from long-term averages - Description')}
                        >
                            <BarChart series={series} height={600} />
                        </MeteoCard>
                    </Grid>

                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Deviations from long-term averages (Heatmap)')}
                            subheader={t('Deviations from long-term averages (Heatmap) - Description')}
                        >
                            <HeatmapChart data={limitedData} height={600} />
                        </MeteoCard>
                    </Grid>

                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Deviations from long-term averages (Table)')}
                        >
                            <DataTable rows={df} columns={columns} />
                        </MeteoCard>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default DeviationsView;