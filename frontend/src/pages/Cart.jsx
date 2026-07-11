import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { money, placeholder } from "../utils";

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-slate-500">Your cart is empty.</p>
        <Link to="/" className="btn-primary mt-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your cart</h1>
          <button onClick={clearCart} className="text-sm text-red-600 hover:underline">
            Clear cart
          </button>
        </div>

        {cart.items.map((item) => (
          <div key={item.id} className="card flex items-center gap-4 p-3">
            <img
              src={item.product_detail.image || placeholder(item.product_detail.name)}
              alt={item.product_detail.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link
                to={`/product/${item.product_detail.slug}`}
                className="font-semibold hover:underline"
              >
                {item.product_detail.name}
              </Link>
              <p className="text-sm text-slate-500">{money(item.product_detail.price)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(item.product, Number(e.target.value))}
              className="input w-20"
            />
            <div className="w-24 text-right font-semibold">{money(item.subtotal)}</div>
            <button
              onClick={() => removeItem(item.product)}
              className="text-slate-400 hover:text-red-600"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card h-fit p-6">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-slate-500">Items</span>
          <span>{cart.item_count}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{money(cart.total)}</span>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
