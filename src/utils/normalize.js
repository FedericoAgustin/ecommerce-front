const normalizeItem = (it) => {
    const product = it.product ?? {};
    const price = Number(it.unitPrice ?? it.price ?? product.price ?? 0);
    const quantity = Number(it.quantity ?? 1);
    return {
        id: it.id,
        productId: product.id ?? it.productId,
        name: product.name ?? it.productName ?? it.name ?? "Producto",
        imageUrl: product.imageUrl ?? it.imageUrl ?? null,
        price,
        quantity,
        subtotal: Number(it.subtotal ?? price * quantity),
    };
};

export function normalizeCart(data) {
    const raw = Array.isArray(data) ? data : data?.items ?? [];
    const items = raw.map(normalizeItem);
    const total = Number(data?.total ?? items.reduce((s, i) => s + i.subtotal, 0));
    return { items, total };
}

export function normalizeOrder(o) {
    const raw = o.items ?? o.orderItems ?? [];
    const items = raw.map(normalizeItem);
    return {
        id: o.id,
        status: o.status ?? "CREATED",
        createdAt: o.createdAt ?? o.date ?? o.orderDate,
        total: Number(o.total ?? items.reduce((s, i) => s + i.subtotal, 0)),
        items,
    };
}