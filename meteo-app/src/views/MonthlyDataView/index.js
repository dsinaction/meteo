import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Page from './../../components/Page';
import DataFilterBar from './../../components/DataFilterBar';
import MeteoCard from './../../components/MeteoCard';
import DataTable from './../../components/DataTable';
import SynopData from '../../services/api/SynopData';
import useSemiPersistentState from '../../utils/useSemiPersistentState';
import LineChart from './LineChart';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const MonthlyDataView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [station, setStation] = useSemiPersistentState('meteo-station', { id: '1', name: t('Poland') });
    const [data, setData] = React.useState([]);
    const [field, setField] = React.useState('tavg');
    const [limit, setLimit] = React.useState(2000);

    const handleFetchData = React.useCallback(() => {
        SynopData
            .getMonthlyAggregates(station.id)
            .then(result => setData(result.data.data.map(record => ({
                ...record,
                tmin: parseFloat(record.tmin),
                tmax: parseFloat(record.tmax),
                tavg: parseFloat(record.tavg)
            }))));
    }, [station]);

    React.useEffect(() => handleFetchData(), [handleFetchData]);

    const handleChangeStation = event => {
        setStation({ id: event.value, name: event.label });
    };

    const handleChangeLimit = event => {
        setLimit(event.target.value);
    };

    const handleChangeField = event => {
        setField(event.target.value);
    };

    const seriesName = {
        tmin: t('Min temperature'),
        tmax: t('Max temperature'),
        tavg: t('Mean temperature')
    }

    const limitedData = data.filter(record => record.year >= limit);
    const series = [
        {
            data: limitedData.map(record => {
                return {
                    y: Math.round(Number(record[field]) * 100, 2) / 100,
                    x: new Date(record.date)
                };
            }),
            name: seriesName[field]
        }
    ];

    const chartTitles = {
        tmin: t('Chart with monthly data (tmin)'),
        tmax: t('Chart with monthly data (tmax)'),
        tavg: t('Chart with monthly data (tavg)')
    }
    const columns = [
        {
            id: 'date',
            label: t('Date'),
            minWidth: 170
        },
        {
            id: 'tavg',
            label: t('Mean temperature'),
            minWidth: 170,
            align: 'center',
            format: (value) => value.toFixed(2)
        },
        {
            id: 'tmax',
            label: t('Max temperature'),
            minWidth: 170,
            align: 'center',
            format: (value) => value.toFixed(2)
        },
        {
            id: 'tmin',
            label: t('Min temperature'),
            minWidth: 170,
            align: 'center',
            format: (value) => value.toFixed(2)
        },
    ];

    return (
        <Page
            className={classes.root}
            title={t('MonthlyDataView Title')}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <DataFilterBar
                            onChangeStation={handleChangeStation}
                            defaultValue={{ value: station.id, label: station.name }}
                        >
                            <Grid item xs={2} sm={2} md={2} lg={1}>
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
                            <Grid item xs={11} sm={6} md={5} lg={4}>
                                <Select
                                    value={field}
                                    onChange={handleChangeField}
                                >
                                    <MenuItem value='tavg'>{t('Mean temperature')}</MenuItem>
                                    <MenuItem value='tmin'>{t('Min temperature')}</MenuItem>
                                    <MenuItem value='tmax'>{t('Max temperature')}</MenuItem>
                                </Select>
                            </Grid>
                        </DataFilterBar>
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={chartTitles[field]}
                        >
                            <LineChart series={series} height={600} />
                        </MeteoCard>
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Monthly data table')}
                        >
                            <DataTable rows={limitedData} columns={columns} />
                        </MeteoCard>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default MonthlyDataView;