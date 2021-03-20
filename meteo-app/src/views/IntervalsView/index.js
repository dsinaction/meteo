import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Page from './../../components/Page';
import DataFilterBar from './../../components/DataFilterBar';
import MeteoCard from '../../components/MeteoCard';
import SynopData from '../../services/api/SynopData';
import useSemiPersistentState from '../../utils/useSemiPersistentState';
import Select from 'react-select';
import IntervalsChart from './IntervalsChart';
import getMonthName from '../../utils/getMonthName';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const IntervalsView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [station, setStation] = useSemiPersistentState('meteo-station', { id: '1', name: 'POLSKA' });
    const [dataCI, setDataCI] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [years, setYears] = React.useState([new Date().getFullYear()]);

    React.useEffect(() => {
        SynopData
            .getConfidenceIntervals(station.id)
            .then(result => {
                setDataCI(result.data.data);
            });

        SynopData
            .getMonthlyAggregates(station.id)
            .then(result => setData(result.data.data.map(record => ({
                ...record,
                year: parseInt(record['year']),
                date: new Date(record['date']),
                tmin: parseFloat(record['tmin']),
                tmax: parseFloat(record['tmax']),
                tavg: parseFloat(record['tavg'])
            }))));
    }, [station]);

    const yearOptions = [...new Set(data.map(record => record.year))]
        .sort().reverse()
        .map(year => ({ value: year, label: year }));

    const handleChangeStation = event => {
        setStation({ id: event.value, name: event.label });
    };

    const handleChangeYears = selected => {
        setYears(selected.map(option => option.value));
    };

    const series = [
        {
            data: dataCI.map(record => ({
                y: Math.round(Number(record.ci_lower) * 100, 2) / 100,
                x: t(getMonthName(record.month))
            })),
            name: t('CI - lower'),
        },
        {
            data: dataCI.map(record => ({
                y: Math.round(Number(record.ci_upper) * 100, 2) / 100,
                x: t(getMonthName(record.month))
            })),
            name: t('CI - upper'),
        },
        ...years.map(year => ({
            data: data.filter(record => record.year === year).map(record => {
                return {
                    y: Math.round(record.tavg * 100, 2) / 100,
                    x: t(getMonthName(record.month))
                };
            }),
            name: year
        }))
    ];

    return (
        <Page
            className={classes.root}
            title={t('IntervalsView Title')}
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
                                    defaultValue={yearOptions.length > 0 ? [yearOptions[0]] : []}
                                    isMulti
                                    name="years"
                                    options={yearOptions}
                                    value={years.map(year => ({value: year, label: year}))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleChangeYears}
                                    placeholder={t('Select...')}
                                />
                            </Grid>
                        </DataFilterBar>
                    </Grid>
                    <Grid item xs={12}>
                        <MeteoCard
                            title={t('Temperature confidence intervals')}
                            subheader={t('Temperature confidence intervals - Description')}
                        >
                            <IntervalsChart series={series} height={600} />
                        </MeteoCard>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default IntervalsView;