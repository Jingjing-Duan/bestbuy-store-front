import axios from 'axios';

export const productApi = axios.create({
  baseURL: '/api/products'
});

export const orderApi = axios.create({
  baseURL: '/api/orders'
});