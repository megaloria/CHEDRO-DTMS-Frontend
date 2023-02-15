import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
        'Content-type': 'application/json'
    },
    withCredentials: true
});

apiClient.interceptors.response.use(response => response, error => {
    let message = 'Unknown error';
    if (error.response?.data?.message) {
        message = error.response.data.message;
    } else if (error?.message) {
        message = error.message;
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log(error)
    }

    return Promise.reject(message);
});

export default apiClient;