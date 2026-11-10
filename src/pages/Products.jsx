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
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const [p, c] = await Promise.all([getProducts(page, 20), getCategories()]);
                if (cancelled) return;
                const productList = Array.isArray(p.data) ? p.data : (p.data?.content || []);
                const categoryList = Array.isArray(c.data) ? c.data : (c.data?.content || []);
                setProducts(productList);
                setCategories(categoryList);
                if (p.data && !Array.isArray(p.data)) {
                    setTotalPages(p.data.totalPages ?? 1);
                    setTotalElements(p.data.totalElements ?? productList.length);
                } else {
                    setTotalPages(1);
                    setTotalElements(productList.length);
                }
            } catch {
                if (!cancelled) setError("No se pudieron cargar los productos.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [page]);

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
                        <p>
                            {totalElements > 0 ? `${totalElements} productos en catálogo (Página ${page + 1} de ${totalPages})` : `${filtered.length} productos`}
                        </p>
                    )}
                </div>
            </div>

            <div style={{ margin: "20px 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                    type="search"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: "1 1 240px", maxWidth: 360 }}
                />
                <CategoryChips
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>

            {loading && (
                <div className="product-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            )}

            {error && (
                <div className="empty-state">
                    <p>{error}</p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>
                        Debes iniciar sesión para consultar el catálogo o revisar que el backend esté activo.
                    </p>
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="empty-state">
                    <p>No se encontraron productos en esta página.</p>
                </div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="product-grid">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, margin: "40px 0 20px" }}>
                    <button
                        className="btn secondary"
                        disabled={page === 0}
                        onClick={() => {
                            setPage((prev) => Math.max(0, prev - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        style={{ cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.5 : 1 }}
                    >
                        ← Anterior
                    </button>
                    <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 500 }}>
                        Página {page + 1} de {totalPages}
                    </span>
                    <button
                        className="btn secondary"
                        disabled={page >= totalPages - 1}
                        onClick={() => {
                            setPage((prev) => Math.min(totalPages - 1, prev + 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        style={{ cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", opacity: page >= totalPages - 1 ? 0.5 : 1 }}
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
