import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(form);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                setError("Email o contraseña incorrectos.");
            } else if (!err.response) {
                setError("No se pudo conectar con el servidor.");
            } else {
                setError(err.response?.data?.message || "Ocurrió un error. Intenta de nuevo.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: 380, margin: "80px auto" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>Iniciar sesión</h2>
            <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--muted)" }}>
                Accede a tu cuenta
            </p>

            <form onSubmit={handleSubmit}>
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="nombre@correo.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <p style={{ color: "var(--danger)", fontSize: 13, margin: "0 0 14px" }}>
                        {error}
                    </p>
                )}

                <button className="btn" style={{ width: "100%" }} disabled={submitting}>
                    {submitting ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", margin: "16px 0 0" }}>
                ¿No tienes cuenta? <Link to="/register" style={{ color: "var(--text)", textDecoration: "underline" }}>Regístrate</Link>
            </p>
        </div>
    );
}