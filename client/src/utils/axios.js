import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const getSession = () => {
    const session = secureLocalStorage.getItem('SESSION_KEY');

    return session ? session : null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000
})

const privateAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 3000
})

privateAPI.interceptors.request.use((config) => {
    const session = getSession();
    config.headers.Authorization = `Bearer ${session?.token}`
})

export {
    api,
    getSession,
    privateAPI
}