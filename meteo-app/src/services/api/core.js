import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8090/api/v1'
})

const { get } = apiClient;

export { get };