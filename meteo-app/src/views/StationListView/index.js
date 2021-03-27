import React from 'react';
import { Container, makeStyles, Grid } from '@material-ui/core';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import Page from './../../components/Page';
import Station from '../../services/api/Station';
import StationsTable from './StationsTable';
import StationsFilterBox from './StationsFilterBox';
import MeteoCard from '../../components/MeteoCard';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const StationListView = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = React.useState('');
    const [stations, setStations] = React.useState([]);

    React.useEffect(() => {
        Station.getAll()
            .then(result => setStations(result.data.data));
    }, []);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const searchedStations = stations.filter(station =>
        station.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <Page
            className={classes.root}
            title={t('StationListView Title')}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <MeteoCard>
                            <StationsFilterBox searchTerm={searchTerm} onSearch={handleSearch} />
                        </MeteoCard>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                        <MeteoCard>
                            <MapContainer center={[51.9194, 19.1451]} zoom={6} scrollWheelZoom={true} style={{ height: '600px' }}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {searchedStations
                                    .filter(station => station.latitude !== null && station.longitude !== null)
                                    .map(station => (<Marker position={[station.latitude, station.longitude]}>
                                        <Popup>
                                            <strong>{station.name}</strong>
                                        </Popup>
                                    </Marker>))}
                            </MapContainer>
                        </MeteoCard>
                    </Grid>
                    <Grid item lg={6} md={6} xs={12}>
                        <MeteoCard>
                            <StationsTable stations={searchedStations} />
                        </MeteoCard>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export default StationListView;