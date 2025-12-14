import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const getSession = () => {
    const session = secureLocalStorage.getItem('SESSION_KEY');

    return session ? session : null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15_000
})

const privateAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15_000
})

privateAPI.interceptors.request.use((config) => {
    const session = getSession();
    config.headers.Authorization = `Bearer ${session?.token}`;
    return config;
})

privateAPI.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error?.response?.data?.message === 'jwt expired') {
        secureLocalStorage.removeItem('SESSION_KEY');
        window.location.href = '/sign-in';
    }

    return Promise.reject(error);
})

export {
    api,
    getSession,
    privateAPI
}