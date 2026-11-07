import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, isAdmin, onLogout }) {
    const { count } = useCart();

    return (
        <header className="navbar">
            <nav>
                <Link to="/" className="brand">Tienda</Link>
                <Link to="/products">Productos</Link>
                {user && <Link to="/orders">Mis pedidos</Link>}
                {isAdmin && <Link to="/admin">Admin</Link>}
            </nav>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {user ? (
                    <>
                        <Link to="/cart" className="cart-link" aria-label="Carrito">
                            Carrito
                            {count > 0 && <span className="cart-badge">{count}</span>}
                        </Link>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</span>
                        <button className="btn secondary" onClick={onLogout}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn secondary">Ingresar</Link>
                        <Link to="/register" className="btn">Registrarse</Link>
                    </>
                )}
            </div>
        </header>
    );
}