import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15_000,
    withCredentials: true
})

const privateAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15_000,
    withCredentials: true
})

privateAPI.interceptors.response.use(
    (response) => response, (error) => {
    return Promise.reject(error);
})

const getSession = async () => {
    try {
        const response = await privateAPI.get('/me');
        return response.data;
    } catch (error) {
        if (error?.response?.status === 401) return null;
        throw error;
    }
}

export {
    api,
    getSession,
    privateAPI
}