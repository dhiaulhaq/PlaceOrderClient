import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:8080/api';

export const api = {
    //Products
    getProducts: (page = 1, size = 10) =>
        axios.get(`${BASE_URL}/products?page=${page}&size=${size}`),
    getProduct: (id) =>
        axios.get(`${BASE_URL}/products/${id}`),
    createProduct: (data) =>
        axios.post(`${BASE_URL}/products`, data),
    updateProduct: (id, data) =>
        axios.put(`${BASE_URL}/products/${id}`, data),
    deleteProduct: (id) =>
        axios.delete(`${BASE_URL}/products/${id}`),

    //Cart
    addToCart: (customerId, productId, quantity) =>
        axios.post(`${BASE_URL}/carts/${customerId}?productId=${productId}&quantity=${quantity}`),
    getCart: (customerId) =>
        axios.get(`${BASE_URL}/carts/${customerId}`),

    //Orders
    placeOrder: (customerId) =>
        axios.post(`${BASE_URL}/orders/${customerId}/place-order`),
    getOrders: (page = 1, size = 10) =>
        axios.get(`${BASE_URL}/orders?page=${page}&size=${size}`),

    //Customer
    createCustomer: (data) =>
        axios.post(`${BASE_URL}/customers`, data),
    getCustomers: (page = 1, size = 10) =>
        axios.get(`${BASE_URL}/customers?page=${page}&size=${size}`),
};