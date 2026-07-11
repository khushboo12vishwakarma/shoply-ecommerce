import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const EMOJI_MAP = {
  books: "📚", electronics: "💻", fashion: "👗",
  "home-kitchen": "🏠", sports: "⚽", toys: "🧸",
  beauty: "💄", grocery: "🛒", music: "🎵", gaming: "🎮",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState("");
  const [search, setSearch] = useState("");

  // Load all categories for sidebar
  useEffect(() => {
    api.get("/categories/").then(({ data }) => setCategories(data.results || data));
  }, []);

  // Load current category info
  useEffect(() => {
    api.get(`/categories/${slug}/`).then(({ data }) => setCategory(data)).catch(() => setCategory(null));
  }, [slug]);

  // Load products for this category
  useEffect(() => {
    setLoading(true);
    const query = { "category__slug": slug };
    if (ordering) query.ordering = ordering;
    if (search) query.search = search;
    api
      .get("/products/", { params: query })
      .then(({ data }) => setProducts(data.results || data))
      .finally(() => setLoading(false));
  }, [slug, ordering, search]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 sm:px-6 py-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500 mb-4">
        <Link to="/" className="hover:text-amazon-orange hover:underline">Home</Link>
        <span className="mx-1">›</span>
        <span className="font-semibold text-black">{category?.name || slug}</span>
      </nav>

      <div className="flex gap-6">

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="bg-amazon text-white px-4 py-3 font-bold text-sm">
              Shop by Department
            </div>
            <ul className="py-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate(`/category/${c.slug}`)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 hover:text-amazon-orange transition-colors ${
                      c.slug === slug
                        ? "font-bold text-amazon-orange border-l-4 border-amazon-orange bg-orange-50"
                        : "text-slate-700"
                    }`}
                  >
                    <span className="mr-2">{EMOJI_MAP[c.slug] || "🛍️"}</span>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Category header */}
          <div className="bg-white border border-slate-200 shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">
                {EMOJI_MAP[slug] || "🛍️"} {category?.name || slug}
              </h1>
              {category?.description && (
                <p className="text-sm text-slate-500 mt-1">{category.description}</p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {loading ? "Loading…" : `${products.length} result${products.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Search within category */}
              <input
                type="text"
                placeholder={`Search in ${category?.name || "category"}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input w-56 text-sm"
              />
              {/* Sort */}
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="input w-auto text-sm"
              >
                <option value="">Sort: Featured</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
                <option value="-created_at">Newest First</option>
              </select>
            </div>
          </div>

          {/* Mobile category selector */}
          <div className="lg:hidden mb-4">
            <select
              value={slug}
              onChange={(e) => navigate(`/category/${e.target.value}`)}
              className="input text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="text-4xl mb-3 animate-bounce">🔍</div>
              <p>Loading products…</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-slate-400 bg-white border border-slate-200 shadow-sm">
              <div className="text-5xl mb-3">{EMOJI_MAP[slug] || "🛍️"}</div>
              <p className="font-semibold text-lg text-slate-600">No products found</p>
              <p className="text-sm mt-1">Be the first to add products in this category.</p>
              <Link to="/" className="inline-block mt-4 text-amazon-blue hover:underline text-sm">
                ← Back to all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
