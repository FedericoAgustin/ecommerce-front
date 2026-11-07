import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/productService";
import { getCategories } from "../api/categoryService";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import CategoryChips from "../components/CategoryChips";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const [p, c] = await Promise.all([getProducts(), getCategories()]);
                if (cancelled) return;
                setProducts(p.data);
                setCategories(c.data);
            } catch {
                if (!cancelled) setError("No se pudieron cargar los productos.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return products.filter((p) => {
            const matchesText = !term || p.name.toLowerCase().includes(term);
            const matchesCategory = !selectedCategory || p.category?.id === selectedCategory;
            return matchesText && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Productos</h1>
                    {!loading && !error && (
                        <p>{filtered.length} {filtered.length === 1 ? "producto" : "productos"}</p>
                    )}
                </div>
                <input
                    className="input"
                    style={{ maxWidth: 280 }}
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="toolbar">
                <CategoryChips
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>

            {error && <div className="empty"><h3>{error}</h3><p>Revisa que el backend esté activo.</p></div>}

            {loading && (
                <div className="grid">
                    {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="empty">
                    <h3>Sin resultados</h3>
                    <p>Prueba con otra búsqueda o categoría.</p>
                </div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="grid">
                    {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            )}
        </div>
    );
}