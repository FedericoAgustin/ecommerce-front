import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { checkout } from "../api/orderService";
import { money } from "../utils/format";

export default function Cart() {
    const { cart, loading, updateItem, removeItem, refresh } = useCart();
    const navigate = useNavigate();
    const [busyId, setBusyId] = useState(null);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    const run = async (id, fn) => {
        setBusyId(id);
        setError("");
        try {
            await fn();
        } catch (err) {
            setError(err.response?.data?.message || "No se pudo actualizar el carrito.");
        } finally {
            setBusyId(null);
        }
    };

    const handleCheckout = async () => {
        setPaying(true);
        setError("");
        try {
            const { data } = await checkout();
            await refresh();
            navigate(data?.id ? `/orders/${data.id}` : "/orders", { state: { justOrdered: true } });
        } catch (err) {
            setError(err.response?.data?.message || "No se pudo completar la compra.");
        } finally {
            setPaying(false);
        }
    };

    if (loading && cart.items.length === 0) return <p style={{ color: "var(--muted)" }}>Cargando carrito...</p>;

    if (cart.items.length === 0) {
        return (
            <div className="empty">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para empezar.</p>
                <Link to="/products" className="btn">Ver productos</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1>Carrito</h1>
            </div>

            <div className="two-col">
                <div className="card" style={{ paddingTop: 4, paddingBottom: 4 }}>
                    {cart.items.map((item) => (
                        <div className="cart-row" key={item.id}>
                            <div className="thumb">
                                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : "Sin imagen"}
                            </div>

                            <div>
                                <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{item.name}</p>
                                <p style={{ margin: "2px 0 8px", fontSize: 13, color: "var(--muted)" }}>
                                    {money(item.price)} c/u
                                </p>
                                <button
                                    className="icon-btn danger"
                                    style={{ fontSize: 13, padding: 0 }}
                                    disabled={busyId === item.id}
                                    onClick={() => run(item.id, () => removeItem(item.id))}
                                >
                                    Quitar
                                </button>
                            </div>

                            <div className="qty">
                                <button
                                    aria-label="Restar"
                                    disabled={busyId === item.id || item.quantity <= 1}
                                    onClick={() => run(item.id, () => updateItem(item.id, item.quantity - 1))}
                                >−</button>
                                <span>{item.quantity}</span>
                                <button
                                    aria-label="Sumar"
                                    disabled={busyId === item.id}
                                    onClick={() => run(item.id, () => updateItem(item.id, item.quantity + 1))}
                                >+</button>
                            </div>

                            <strong style={{ fontSize: 15, minWidth: 90, textAlign: "right" }}>
                                {money(item.subtotal)}
                            </strong>
                        </div>
                    ))}
                </div>

                <aside className="card">
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Resumen</h3>
                    <div className="summary-line">
                        <span style={{ color: "var(--muted)" }}>Productos</span>
                        <span>{cart.items.reduce((s, i) => s + i.quantity, 0)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>{money(cart.total)}</span>
                    </div>

                    {error && <p style={{ color: "var(--danger)", fontSize: 13, margin: "14px 0 0" }}>{error}</p>}

                    <button className="btn" style={{ width: "100%", marginTop: 18 }} onClick={handleCheckout} disabled={paying}>
                        {paying ? "Procesando..." : "Finalizar compra"}
                    </button>
                    <Link to="/products" className="btn secondary" style={{ display: "block", textAlign: "center", marginTop: 8 }}>
                        Seguir comprando
                    </Link>
                </aside>
            </div>
        </div>
    );
}