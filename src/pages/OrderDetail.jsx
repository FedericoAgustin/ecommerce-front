import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getOrder } from "../api/orderService";
import { normalizeOrder } from "../utils/normalize";
import { money, dateTime } from "../utils/format";

export default function OrderDetail() {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getOrder(id)
            .then(({ data }) => setOrder(normalizeOrder(data)))
            .catch(() => setError("No se encontró el pedido."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p style={{ color: "var(--muted)" }}>Cargando...</p>;
    if (error) return <div className="empty"><h3>{error}</h3><Link to="/orders" className="btn secondary">Volver</Link></div>;

    return (
        <div>
            <Link to="/orders" style={{ fontSize: 13, color: "var(--muted)" }}>← Mis pedidos</Link>

            <div className="page-header" style={{ marginTop: 12 }}>
                <div>
                    <h1>Pedido #{order.id}</h1>
                    <p>{dateTime(order.createdAt)}</p>
                </div>
                <span className={`status ${String(order.status).toLowerCase()}`}>{order.status}</span>
            </div>

            {location.state?.justOrdered && <div className="notice">Compra realizada correctamente.</div>}

            <div className="card" style={{ paddingTop: 4, paddingBottom: 4 }}>
                {order.items.map((item, i) => (
                    <div key={item.id ?? i} style={{
                        display: "flex", justifyContent: "space-between", padding: "14px 0",
                        borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none"
                    }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{item.name}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--muted)" }}>
                                {item.quantity} × {money(item.price)}
                            </p>
                        </div>
                        <strong style={{ fontSize: 15 }}>{money(item.subtotal)}</strong>
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: 320, marginLeft: "auto", marginTop: 16 }}>
                <div className="summary-total" style={{ borderTop: "none" }}>
                    <span>Total</span><span>{money(order.total)}</span>
                </div>
            </div>
        </div>
    );
}