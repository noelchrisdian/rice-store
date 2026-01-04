import { privateAPI } from "../utils/axios";

const getCart = async () => {
    const response = await privateAPI.get('/customers/cart');
    return response.data;
}

const addItem = async (data) => {
    const response = await privateAPI.post('/customers/cart', data);
    return response.data;
}

const updateItem = async (data) => {
    const response = await privateAPI.patch('/customers/cart', data);
    return response.data;
}

export {
    addItem,
    getCart,
    updateItem
}