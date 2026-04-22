import axios from 'axios';

export const productApi = axios.create({
  baseURL: 'http://localhost:3001'
});

export const orderApi = axios.create({
  baseURL: 'http://localhost:3002'
});