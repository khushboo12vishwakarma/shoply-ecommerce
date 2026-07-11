import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { placeholder } from "../utils";

function Stars({ count = 4, total = 5, size = 4 }) {
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} className={`w-${size} h-${size} ${i < count ? "text-[#FF9900]" : "text-[#D5D9D9]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}/`).then(({ data }) => setProduct(data));
  }, [slug]);

  if (!product) return (
    <div className="py-20 text-center text-slate-500">
      <div className="text-4xl animate-spin inline-block mb-3">⏳</div>
      <p>Loading product…</p>
    </div>
  );

  const add = async () => {
    if (!user) return navigate("/login");
    setBusy(true);
    try {
      await addToCart(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  const price = Number(product.price || 0);
  const whole = Math.floor(price).toLocaleString("en-IN");
  const frac = (price % 1).toFixed(2).slice(1);
  const starCount = product.id ? ((product.id % 3) + 3) : 4;
  const reviewCount = product.id ? (product.id * 137) % 8000 + 200 : 1432;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-amazon-blue flex items-center gap-1 mb-4 flex-wrap">
        <Link to="/" className="hover:underline hover:text-amazon-deal">Home</Link>
        <span className="text-ink">›</span>
        {product.category_name && (
          <>
            <Link to={`/category/${product.category}`} className="hover:underline hover:text-amazon-deal">
              {product.category_name}
            </Link>
            <span className="text-ink">›</span>
          </>
        )}
        <span className="text-ink line-clamp-1">{product.name}</span>
      </nav>

      {/* Main product layout — 3 columns */}
      <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8">

        {/* ── Column 1: Image ── */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="border border-[#D5D9D9] rounded flex items-center justify-center p-4 aspect-square bg-white">
            <img
              src={product.image || placeholder(product.name)}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* ── Column 2: Product Info ── */}
        <div className="min-w-0">
          {/* Category */}
          {product.category_name && (
            <Link
              to={`/category/${product.category}`}
              className="text-xs text-amazon-blue hover:underline hover:text-amazon-deal"
            >
              {product.category_name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-xl font-medium text-ink mt-1 leading-snug">
            {product.name}
          </h1>

          {/* Ratings row */}
          <div className="flex items-center gap-2 mt-2 pb-2 border-b border-[#D5D9D9]">
            <Stars count={starCount} size={4} />
            <span className="text-sm text-amazon-blue hover:text-amazon-deal hover:underline cursor-pointer">
              {reviewCount.toLocaleString()} ratings
            </span>
            <span className="text-[#D5D9D9]">|</span>
            <span className="text-sm text-amazon-blue hover:text-amazon-deal hover:underline cursor-pointer">
              Search similar items
            </span>
          </div>

          {/* Price (visible in center col on mobile) */}
          <div className="mt-3 md:hidden">
            <div className="flex items-start">
              <span className="text-xs align-super mt-1 font-medium">₹</span>
              <span className="text-3xl font-medium">{whole}</span>
              <span className="text-xs align-super mt-1 font-medium">{frac}</span>
            </div>
          </div>

          <div className="amazon-divider" />

          {/* About this item */}
          <div className="mt-2">
            <h2 className="text-base font-bold mb-2">About this item</h2>
            {product.description ? (
              <p className="text-sm text-[#0F1111] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided.</p>
            )}
          </div>

          <div className="amazon-divider" />

          {/* Tech specs table */}
          <table className="w-full text-sm mt-2">
            <tbody>
              <tr className="border-b border-[#F0F2F2]">
                <td className="py-2 pr-4 font-medium text-[#0F1111] w-40">Sold by</td>
                <td className="py-2 text-amazon-blue">{product.vendor_name}</td>
              </tr>
              <tr className="border-b border-[#F0F2F2]">
                <td className="py-2 pr-4 font-medium text-[#0F1111]">Category</td>
                <td className="py-2">{product.category_name || "—"}</td>
              </tr>
              <tr className="border-b border-[#F0F2F2]">
                <td className="py-2 pr-4 font-medium text-[#0F1111]">Availability</td>
                <td className={`py-2 font-semibold ${product.in_stock ? "text-[#007600]" : "text-amazon-deal"}`}>
                  {product.in_stock
                    ? product.stock <= 5
                      ? `Only ${product.stock} left in stock`
                      : "In stock"
                    : "Currently unavailable"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Column 3: Buy Box ── */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="buy-box">
            {/* Price */}
            <div className="flex items-start mb-1">
              <span className="text-xs align-super mt-1 font-medium">₹</span>
              <span className="text-3xl font-medium">{whole}</span>
              <span className="text-xs align-super mt-1 font-medium">{frac}</span>
            </div>

            {/* Prime */}
            <div className="text-xs mb-2">
              <span className="prime-badge text-sm">prime</span>
              <span className="ml-1 text-[#0F1111]">FREE delivery</span>
              <p className="font-bold text-[#0F1111] mt-0.5">
                Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </p>
              <p className="text-amazon-blue">Order within <strong className="text-amazon-deal">6 hrs 42 mins</strong></p>
            </div>

            <div className="amazon-divider" />

            {/* Delivery location */}
            <p className="text-xs text-amazon-blue mb-2 flex items-center gap-1">
              <span>📍</span>
              <span>Deliver to <strong>your location</strong></span>
            </p>

            {/* Stock status */}
            <p className={`text-sm font-semibold mb-3 ${product.in_stock ? "text-[#007600]" : "text-amazon-deal"}`}>
              {product.in_stock ? "In stock" : "Currently unavailable"}
            </p>

            {/* Qty selector */}
            {product.in_stock && (
              <div className="mb-3">
                <label className="text-xs font-medium mb-1 block">Quantity:</label>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input py-1.5 text-sm"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={add}
              disabled={busy || !product.in_stock}
              className={`w-full py-2 text-sm rounded-full border mb-2 font-medium transition-colors ${
                product.in_stock
                  ? "bg-[#FFD814] border-[#FCD200] hover:bg-[#F7CA00] text-ink"
                  : "bg-[#D5D9D9] border-[#D5D9D9] text-[#888C8C] cursor-not-allowed"
              }`}
            >
              {added ? "✓ Added to cart" : busy ? "Adding…" : "Add to cart"}
            </button>

            {/* Buy Now */}
            {product.in_stock && (
              <button
                onClick={() => { if (!user) return navigate("/login"); navigate("/checkout"); }}
                className="w-full py-2 text-sm rounded-full border font-medium bg-[#FFA41C] border-[#FF8F00] hover:bg-[#FF8F00] text-ink transition-colors"
              >
                Buy now
              </button>
            )}

            <div className="amazon-divider" />

            {/* Seller info */}
            <div className="text-xs text-[#0F1111] space-y-1">
              <p><span className="font-medium">Ships from</span> Shoply Warehouse</p>
              <p><span className="font-medium">Sold by</span>{" "}
                <span className="text-amazon-blue">{product.vendor_name}</span>
              </p>
              <p><span className="font-medium">Returns</span> 30-day easy returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
