import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'
import { Container, makeStyles, Grid } from '@material-ui/core';
import Page from './../../components/Page';
import MeteoCard from './../../components/MeteoCard';
import Station from '../../services/api/Station';
import 'leaflet/dist/leaflet.css';
import Temperature from './Temperature';
import PolygonWithText from './PolygonWithText';
import LineChart from './LineChart';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const DashboardView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [stations, setStations] = React.useState([]);
    const [countryData, setCountryData] = React.useState({});

    React.useEffect(() => {
        Station.getAll()
            .then(result => setStations(result.data.data));

        const countryStation = 1;
        Station.getSingle(countryStation)
            .then(result => result.data.data)
            .then(data => setCountryData({
                ...data,
                last_synop_date: new Date(data.last_synop_date).toJSON().slice(0, 7),
                data_months: data.data_months.sort((a, b) => new Date(a.date) - new Date(b.date))
            }));
    }, []);

    const series = [
        {
            data: countryData.data_months !== undefined
                ? countryData.data_months.map(record => {
                    return {
                        y: Math.round(parseFloat(record.tavg) * 100, 2) / 100,
                        x: new Date(record.date)
                    };
                })
                : [],
            name: t('Mean temperature')
        }
    ];

    return (
        <Page className={classes.root} title={t('DashboardView Title')}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item lg={4} md={4} sm={12} xl={12} xs={12}>
                        <Temperature
                            title={t('Average temperature in {{date}}', {date: countryData.last_synop_date})}
                            current={countryData.last_tavg}
                            reference={countryData.yavg}
                            referenceInfo={t('Comparing to long-term average for that month')}
                            icon='/static/icons/thermometer.svg'
                        />
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xl={12} xs={12}>
                        <Temperature
                            title={t('Max temperature in {{date}}', {date: countryData.last_synop_date})}
                            current={countryData.last_tmax}
                            reference={countryData.prev_tmax}
                            referenceInfo={t('Comparing to max temperature in the previous year')}
                            icon='/static/icons/hot.svg'
                        />
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xl={12} xs={12}>
                        <Temperature
                            title={t("Min temperature in {{date}}", {date: countryData.last_synop_date})}
                            current={countryData.last_tmin}
                            reference={countryData.prev_tmin}
                            referenceInfo={t("Comparing to min temperature in the previous year")}
                            icon='/static/icons/cold.svg'
                        />
                    </Grid>


                    <Grid item lg={12} sm={12} xl={3} xs={12}>
                        <MeteoCard
                            title={t('Average temperature in {{date}} in synop stations', {date: countryData.last_synop_date})}
                        >
                            <MapContainer
                                center={[51.9194, 19.1451]} zoom={6}
                                style={{ height: '600px' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {stations
                                    .filter(station => station.latitude !== null && station.longitude !== null && station.last_tavg !== null)
                                    .map(station => (
                                        <PolygonWithText text="MyText" station={station} />
                                    ))
                                }
                            </MapContainer>
                        </MeteoCard>
                    </Grid>

                    <Grid item lg={12} sm={12} xl={3} xs={12}>
                        <MeteoCard
                            title={t('Average temperature in the same month in the previous years')}
                        >
                            <LineChart series={series} height={600} />
                        </MeteoCard>
                    </Grid>

                </Grid>
            </Container>
        </Page>
    );
};

export default DashboardView;