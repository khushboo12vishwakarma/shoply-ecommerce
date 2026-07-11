import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeholder } from "../utils";

// Star component
function Stars({ count = 4, total = 5 }) {
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < count ? "text-[#FF9900]" : "text-[#D5D9D9]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate("/login");
    setBusy(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setBusy(false);
    }
  };

  // Format price Amazon-style
  const price = Number(product.price || 0);
  const whole = Math.floor(price).toLocaleString("en-IN");
  const frac = (price % 1).toFixed(2).slice(1); // ".99"

  // Fake rating (stable per product id)
  const starCount = product.id ? ((product.id % 3) + 3) : 4; // 3-5 stars
  const reviewCount = product.id ? (product.id * 137) % 8000 + 200 : 1432;

  return (
    <div className="bg-white flex flex-col h-full group hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-200">
      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="block relative bg-white flex items-center justify-center p-4 overflow-hidden"
        style={{ height: "220px" }}
      >
        <img
          src={product.image || placeholder(product.name)}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        {/* Deal badge */}
        {product.stock > 0 && product.stock < 10 && (
          <span className="absolute top-2 left-2 deal-badge">Limited deal</span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 px-3 pb-3">
        {/* Title */}
        <Link
          to={`/product/${product.slug}`}
          className="text-[#0F1111] hover:text-amazon-deal hover:underline text-sm leading-snug line-clamp-2 mb-1 min-h-[2.6rem]"
        >
          {product.name}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-1">
          <Stars count={starCount} />
          <span className="text-xs text-amazon-blue hover:text-amazon-deal hover:underline cursor-pointer">
            {reviewCount.toLocaleString()}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-start mt-0.5">
          <span className="text-xs font-medium align-super mt-1">₹</span>
          <span className="text-2xl font-medium leading-none">{whole}</span>
          <span className="text-xs font-medium align-super mt-1">{frac}</span>
        </div>

        {/* Prime + delivery */}
        <div className="text-xs text-[#0F1111] mt-0.5">
          <span className="prime-badge">prime</span>
          <span className="ml-1">FREE delivery <strong>Tomorrow</strong></span>
        </div>

        {/* Stock status */}
        {!product.in_stock && (
          <p className="text-xs text-amazon-deal font-semibold mt-1">Currently unavailable</p>
        )}
        {product.in_stock && product.stock <= 5 && (
          <p className="text-xs text-amazon-deal font-semibold mt-1">Only {product.stock} left in stock</p>
        )}

        {/* Add to cart */}
        <div className="mt-auto pt-2">
          <button
            onClick={add}
            disabled={busy || !product.in_stock}
            className={`w-full py-1.5 text-sm rounded-full border transition-colors ${
              product.in_stock
                ? "bg-[#FFD814] border-[#FCD200] hover:bg-[#F7CA00] text-ink"
                : "bg-[#D5D9D9] border-[#D5D9D9] text-[#888C8C] cursor-not-allowed"
            }`}
          >
            {added ? "✓ Added" : busy ? "Adding…" : product.in_stock ? "Add to cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
}
