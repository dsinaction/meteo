import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    normal: {
        backgroundColor: 'white',
    },
    hot: {
        backgroundColor: 'white'
    }
}));

const PolygonWithText = ({ station }) => {
    const classes = useStyles();
    const map = useMap();

    const circle = L.circle([station.latitude, station.longitude], { radius: 1 });
    const options = {
        permanent: true, 
        direction: "center", 
        className: (value => {
            if (value < 0) {
                return classes.normal;
            }
            return classes.hot;
        })(station.last_tavg)
    }
    
    circle.bindTooltip(`${parseFloat(station.last_tavg).toFixed(1)} &#176;C`, options);

    circle.addTo(map);
    return null;
}

export default PolygonWithText