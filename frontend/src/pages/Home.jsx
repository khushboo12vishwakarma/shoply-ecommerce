import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  { src: "/banner1.png", alt: "Great Indian Festival — Up to 80% off", link: "/category/electronics" },
  { src: "/banner2.png", alt: "Fashion Week Sale — Min 50% off",        link: "/category/fashion" },
  { src: "/banner3.png", alt: "Home & Kitchen Essentials",              link: "/category/home-kitchen" },
];

const EMOJI_MAP = {
  books: "📚", electronics: "💻", fashion: "👗",
  "home-kitchen": "🏠", sports: "⚽", toys: "🧸",
  beauty: "💄", grocery: "🛒", music: "🎵", gaming: "🎮",
};

export default function Home() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  const search = params.get("search") || "";

  const prevSlide = useCallback(() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length), []);
  const nextSlide = useCallback(() => setSlide((s) => (s + 1) % BANNERS.length), []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (search) return;
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [search, nextSlide]);

  useEffect(() => {
    api.get("/categories/").then(({ data }) => setCategories(data.results || data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = { ordering: "-created_at" };
    if (search) query.search = search;
    api
      .get("/products/", { params: query })
      .then(({ data }) => setProducts(data.results || data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="relative">
      {/* ── Hero Carousel — hide when searching ── */}
      {!search && (
        <div className="relative w-full h-[360px] sm:h-[500px] md:h-[600px] lg:h-[640px] overflow-hidden">
          {/* Slides */}
          {BANNERS.map((b, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === slide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={b.src}
                alt={b.alt}
                className="w-full h-full object-cover object-top cursor-pointer"
                onClick={() => navigate(b.link)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop";
                }}
              />
            </div>
          ))}

          {/* Gradient fade to page background at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-transparent to-amazon-background z-20 pointer-events-none" />

          {/* Left Arrow — transparent background, Amazon-style outline on hover */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-[110px] sm:top-[140px] md:top-[160px] lg:top-[160px] -translate-y-1/2 z-30 bg-transparent hover:border-2 hover:border-white text-slate-800 rounded-sm w-10 sm:w-12 h-16 sm:h-20 flex items-center justify-center transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Right Arrow — transparent background, Amazon-style outline on hover */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-[110px] sm:top-[140px] md:top-[160px] lg:top-[160px] -translate-y-1/2 z-30 bg-transparent hover:border-2 hover:border-white text-slate-800 rounded-sm w-10 sm:w-12 h-16 sm:h-20 flex items-center justify-center transition-all"
            aria-label="Next banner"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dot indicators — positioned right above the category cards */}
          <div className="absolute top-[200px] sm:top-[260px] md:top-[300px] lg:top-[300px] left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`rounded-full transition-all duration-300 shadow-sm ${
                  i === slide
                    ? "bg-white w-7 h-2.5"
                    : "bg-white/60 w-2.5 h-2.5 hover:bg-white/90"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className={`mx-auto max-w-[1500px] px-4 sm:px-6 z-20 relative ${
        !search ? "-mt-[140px] sm:-mt-[220px] md:-mt-[280px] lg:-mt-[320px]" : "pt-6"
      }`}>

        {/* ── Search results header ── */}
        {search && (
          <div className="bg-white border border-slate-200 shadow-sm p-4 mb-6">
            <p className="text-lg">
              Showing results for{" "}
              <span className="font-bold text-ink">"{search}"</span>
            </p>
            <button
              onClick={() => setParams({})}
              className="text-amazon-blue hover:underline text-sm mt-1"
            >
              ← Clear search &amp; go back
            </button>
          </div>
        )}

        {/* ── Top 4 Category Cards — hide when searching ── */}
        {!search && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {categories.slice(0, 4).map((c) => {
              const emoji = EMOJI_MAP[c.slug] || "🛍️";
              return (
                <div key={c.id} className="bg-white p-5 shadow flex flex-col h-full z-20">
                  <h2 className="text-xl font-bold mb-3 truncate">{c.name}</h2>
                  <div
                    className="flex-1 min-h-[200px] cursor-pointer overflow-hidden bg-slate-100"
                    onClick={() => navigate(`/category/${c.slug}`)}
                  >
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-6xl">${emoji}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {emoji}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/category/${c.slug}`)}
                    className="text-amazon-blue hover:text-amazon-orange hover:underline text-sm font-semibold mt-4 text-left"
                  >
                    Shop now
                  </button>
                </div>
              );
            })}
            {categories.length === 0 && (
              <div className="bg-white p-5 shadow flex flex-col z-20">
                <h2 className="text-xl font-bold mb-3">Shop by Category</h2>
                <p className="text-sm text-slate-500">Loading categories...</p>
              </div>
            )}
          </div>
        )}

        {/* ── Products Grid ── */}
        <div className="mb-8">
          {!search && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">All Products</h2>
              <Link to="/category/electronics" className="text-sm text-amazon-blue hover:text-amazon-orange hover:underline">
                See all deals →
              </Link>
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-slate-400">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-slate-500 text-lg">No results found for "{search}"</p>
              <button onClick={() => setParams({})} className="mt-3 text-amazon-blue hover:underline text-sm">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
