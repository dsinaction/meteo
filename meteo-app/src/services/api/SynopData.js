import { get } from './core';

const SynopData = {

    getMonthlyAggregates: (stationId) =>
        get(`/synop/monthly/${stationId}`),

    getMovingAverage: (stationId) =>
        get(`/synop/monthly/moving/${stationId}`),

    getDeviationFromLongTermAverage: (stationId) =>
        get(`/synop/monthly/deviance/${stationId}`),

    getConfidenceIntervals: (stationId) =>
        get(`/synop/monthly/ci/${stationId}`),

};

export default SynopData;