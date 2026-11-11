import api from "./client";

export const checkout = () => api.post("/orders/checkout");
export const getOrders = () => api.get("/orders/my-orders");
export const getMyOrders = () => api.get("/orders/my-orders");
export const getAllOrdersAdmin = () => api.get("/orders/admin/all");
export const updateOrderStatus = (orderId, status) =>
    api.put(`/orders/${orderId}/status?status=${status}`);
