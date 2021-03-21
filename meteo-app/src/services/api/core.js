import axios from 'axios';

const apiClient = axios.create({
    baseURL:  process.env.METEO_API_URL || 'http://localhost:8090/api/v1'
})

const { get } = apiClient;

export { get };