import { get } from './core';

const Station = {

    getAll: () =>
        get(`/stations`),

    getSingle: (stationId) =>
        get(`/stations/${stationId}`)

};

export default Station;