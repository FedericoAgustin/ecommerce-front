import api from "./client";

export const getProducts = (page = 0, size = 20) => api.get(`/products?page=${page}&size=${size}`);
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
