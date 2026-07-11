import { useEffect, useState } from "react";
import api from "../api/axios";
import { money } from "../utils";

const BLANK = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image_url: "",
  is_active: true,
};

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadProducts = () =>
    api.get("/products/", { params: { mine: 1 } }).then(({ data }) =>
      setProducts(data.results || data)
    );

  useEffect(() => {
    loadProducts();
    api.get("/categories/").then(({ data }) => setCategories(data.results || data));
  }, []);

  const update = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category || null,
    };
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}/`, payload);
      } else {
        await api.post("/products/", payload);
      }
      setForm(BLANK);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : "Could not save product.");
    }
  };

  const edit = (p) => {
    setEditingId(p.slug);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category || "",
      image_url: p.image_url || "",
      is_active: p.is_active,
    });
  };

  const remove = async (slug) => {
    await api.delete(`/products/${slug}/`);
    loadProducts();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <form onSubmit={submit} className="card h-fit p-6 lg:col-span-1">
        <h2 className="text-lg font-bold">
          {editingId ? "Edit product" : "Add a product"}
        </h2>
        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="mt-4 space-y-3">
          <div>
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={update("name")} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={update("category")}>
              <option value="">— none —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price</label>
              <input type="number" step="0.01" required className="input" value={form.price} onChange={update("price")} />
            </div>
            <div>
              <label className="label">Stock</label>
              <input type="number" required className="input" value={form.stock} onChange={update("stock")} />
            </div>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input
              className="input"
              placeholder="https://…/photo.jpg"
              value={form.image_url}
              onChange={update("image_url")}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} className="input" value={form.description} onChange={update("description")} />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1">
              {editingId ? "Update" : "Add product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(BLANK);
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Product list */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold">Your products</h1>
        <div className="mt-4 space-y-3">
          {products.length === 0 && (
            <p className="text-slate-500">No products yet — add your first one.</p>
          )}
          {products.map((p) => (
            <div key={p.id} className="card flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">
                  {p.category_name || "Uncategorized"} · {money(p.price)} · stock {p.stock}
                  {!p.is_active && " · hidden"}
                </p>
              </div>
              <button onClick={() => edit(p)} className="btn-ghost">Edit</button>
              <button
                onClick={() => remove(p.slug)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
