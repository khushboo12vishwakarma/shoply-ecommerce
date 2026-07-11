import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { money } from "../utils";

export default function Checkout() {
  const { cart, load } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [payment, setPayment] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const placeOrder = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      // Simulated payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const { data } = await api.post("/orders/checkout/", {
        shipping_address: address,
      });
      await load();
      navigate("/orders", { state: { justOrdered: data.id } });
    } catch (err) {
      setError(err.response?.data?.detail || "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!cart.items.length) {
    return <p className="py-20 text-center text-slate-500">Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={placeOrder} className="card p-6 lg:col-span-2">
        <h1 className="text-2xl font-bold">Checkout</h1>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {/* Shipping Section */}
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">1. Shipping address</h2>
          <textarea
            required
            rows={3}
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city, postal code, country"
          />
        </div>

        <hr className="my-6 border-slate-200" />

        {/* Payment Section */}
        <div>
          <h2 className="text-lg font-bold mb-2 flex items-center">
            2. Payment Method
            <span className="ml-2 text-xs font-normal text-amazon-orange bg-orange-50 px-2 py-1 rounded">Mock Gateway</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Name on card</label>
              <input
                required
                type="text"
                className="input"
                value={payment.name}
                onChange={(e) => setPayment({ ...payment, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Card number</label>
              <input
                required
                type="text"
                className="input"
                value={payment.number}
                onChange={(e) => setPayment({ ...payment, number: e.target.value })}
                placeholder="0000 0000 0000 0000"
                pattern="\d*"
                minLength={16}
                maxLength={16}
                title="Please enter a 16-digit card number"
              />
            </div>
            <div>
              <label className="label">Expiration date</label>
              <input
                required
                type="text"
                className="input"
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                placeholder="MM/YY"
                pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                title="Format: MM/YY"
              />
            </div>
            <div>
              <label className="label">CVV</label>
              <input
                required
                type="password"
                className="input"
                value={payment.cvv}
                onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                placeholder="123"
                pattern="\d{3,4}"
                maxLength={4}
                title="3 or 4 digit CVV"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          This is a demo — no real payment is processed. Entering mock details will simulate a transaction.
        </p>
        <button className="btn-primary mt-4 w-full text-base py-3" disabled={busy}>
          {busy ? "Processing payment..." : `Place your order in USD`}
        </button>
      </form>

      <div className="card h-fit p-6">
        <h2 className="text-lg font-bold">Summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {cart.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span className="text-slate-600">
                {i.product_detail.name} × {i.quantity}
              </span>
              <span>{money(i.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{money(cart.total)}</span>
        </div>
      </div>
    </div>
  );
}
