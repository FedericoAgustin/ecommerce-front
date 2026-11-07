import api from "./client";

export const getCart = () => api.get("/cart");
export const addCartItem = (productId, quantity = 1) =>
    api.post("/cart/items", { productId, quantity });
export const updateCartItem = (itemId, quantity) =>
    api.put(`/cart/items/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}`);