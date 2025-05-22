import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api-diamondock.nkouadio.com/api',
    timeout: 5000,
    headers: {
        'X-App-Key': '019523f4-174a-7005-a126-366e48e46dcc',
    },
});

export const getRequest = async (endpoint, params = {}, additonalHeaders = {}) =>{
    try {
        const response = await apiClient.get(endpoint ,{
            params,
            headers: {
                ...apiClient.defaults.headers,
                ...additonalHeaders
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data');
    }
}

export const postRequest = async (endpoint, data = {},  additonnalHeaders = {}) =>{
    try {
        const response = await apiClient.post(endpoint,data,{
            headers: {
               ...apiClient.defaults.headers,
               ...additonnalHeaders
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data');
    }
}