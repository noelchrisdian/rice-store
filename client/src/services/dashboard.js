import { privateAPI } from "../utils/axios";

const getTodayOrders = async () => {
    const response = await privateAPI.get('/admin/today-orders');
    return response.data;
}

const getRecentOrders = async () => {
    const response = await privateAPI.get('/admin/recent-orders');
    return response.data;
}

const getRecentProducts = async () => {
    const response = await privateAPI.get('/admin/recent-products');
    return response.data;
}

const getRecentUsers = async () => {
    const response = await privateAPI.get('/admin/recent-users');
    return response.data;
}

const getUserStats = async () => {
    const response = await privateAPI.get('/admin/user-stats');
    return response.data;
}

export {
    getRecentOrders,
    getTodayOrders,
    getRecentProducts,
    getRecentUsers,
    getUserStats
}