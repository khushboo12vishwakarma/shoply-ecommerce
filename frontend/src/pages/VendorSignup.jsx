import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VendorSignup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "vendor",   // always vendor
    phone: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/vendor");   // go straight to vendor dashboard
    } catch (err) {
      const data = err.response?.data;
      setError(
        data ? Object.values(data).flat().join(" ") : "Registration failed."
      );
    } finally {
      setBusy(false);
    }
  };

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="card p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-2xl font-bold">Become a Vendor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create your vendor account and start selling today.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              required
              className="input"
              placeholder="your_store_name"
              value={form.username}
              onChange={update("username")}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              placeholder="vendor@example.com"
              value={form.email}
              onChange={update("email")}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="input"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={update("password")}
            />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input
              className="input"
              placeholder="+91 XXXXXXXXXX"
              value={form.phone}
              onChange={update("phone")}
            />
          </div>

          {/* Role badge — always vendor, just shown for clarity */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
            ✅ You are registering as a <strong>Vendor</strong>. You will get
            access to the seller dashboard.
          </div>

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Creating account…" : "Create Vendor Account"}
          </button>
        </form>

        <div className="mt-4 space-y-2 text-center text-sm text-slate-500">
          <p>
            Already have a vendor account?{" "}
            <Link to="/login" className="font-semibold text-brand-600">
              Log in
            </Link>
          </p>
          <p>
            Looking to shop instead?{" "}
            <Link to="/signup" className="font-semibold text-brand-600">
              Customer signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
