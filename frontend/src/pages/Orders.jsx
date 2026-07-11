import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { fmtDate, money, placeholder } from "../utils";
import { useCart } from "../context/CartContext";
import {
  CheckCircle, Package, Truck, Star, X, FileText,
  RotateCcw, MessageSquare, AlertCircle, ExternalLink, Search
} from "lucide-react";

const STATUS_TEXT = {
  pending: "Pending",
  paid: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Orders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs & Search
  const [activeTab, setActiveTab] = useState("orders"); // orders, buy_again, not_shipped, cancelled
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // track | return | feedback | review | details | invoice
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Modal form inputs
  const [returnReason, setReturnReason] = useState("damaged");
  const [returnAction, setReturnAction] = useState("refund");
  const [rating, setRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState("");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    api.get("/orders/")
      .then((o) => setOrders(o.data.results || o.data))
      .finally(() => setLoading(false));
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleBuyAgain = async (item) => {
    try {
      const productId = item.product || item.product_detail?.id;
      if (!productId) {
        showToastMsg("Cannot add this item right now.");
        return;
      }
      await addToCart(productId, 1);
      showToastMsg(`Added "${item.product_name}" to your Cart!`);
    } catch (err) {
      showToastMsg("Error adding item to cart.");
    }
  };

  const handleOpenModal = (type, order, item = null) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setActiveModal(type);
    // reset form fields
    setRating(5);
    setReviewHeadline("");
    setReviewText("");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setSelectedOrder(null);
  };

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by tab
    if (activeTab === "not_shipped") {
      result = result.filter(o => o.status === "pending" || o.status === "paid");
    } else if (activeTab === "cancelled") {
      result = result.filter(o => o.status === "cancelled");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o => {
        const idMatch = String(o.id).toLowerCase().includes(q) || `order #${o.id}`.includes(q);
        const itemMatch = (o.items || []).some(it => (it.product_name || "").toLowerCase().includes(q));
        return idMatch || itemMatch;
      });
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // Extract all items across orders for "Buy Again" tab
  const buyAgainItems = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      (o.items || []).forEach(it => {
        if (!map.has(it.product)) {
          map.set(it.product, { ...it, orderDate: o.created_at });
        }
      });
    });
    return Array.from(map.values());
  }, [orders]);

  if (loading) return <p className="py-20 text-center text-slate-500">Loading your orders…</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-800 text-white px-5 py-3 rounded shadow-2xl flex items-center gap-3 animate-fade-in border border-green-600">
          <CheckCircle size={20} className="text-amazon-yellow" />
          <span className="font-semibold text-sm">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header and Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500">
        <Link to="/profile" className="hover:underline hover:text-amazon-orange">Your Account</Link> › <span className="text-amazon-orange font-semibold">Your Orders</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-normal">Your Orders</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all orders"
              className="py-1.5 pl-3 pr-8 text-sm border border-gray-400 rounded w-64 sm:w-72 focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-2 text-gray-400 hover:text-black">✕</button>
            )}
          </div>
          <button
            onClick={() => setActiveTab("orders")}
            className="bg-slate-800 text-white px-4 py-1.5 text-sm rounded hover:bg-slate-700 font-medium shadow-sm flex items-center gap-1.5"
          >
            <Search size={16} /> Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 mb-6 overflow-x-auto">
        <ul className="flex space-x-8 text-sm font-semibold whitespace-nowrap">
          <li
            onClick={() => setActiveTab("orders")}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === "orders"
                ? "border-b-2 border-amazon-orange text-black font-bold"
                : "text-amazon-blue hover:text-amazon-orange hover:underline font-normal"
            }`}
          >
            Orders
          </li>
          <li
            onClick={() => setActiveTab("buy_again")}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === "buy_again"
                ? "border-b-2 border-amazon-orange text-black font-bold"
                : "text-amazon-blue hover:text-amazon-orange hover:underline font-normal"
            }`}
          >
            Buy Again
          </li>
          <li
            onClick={() => setActiveTab("not_shipped")}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === "not_shipped"
                ? "border-b-2 border-amazon-orange text-black font-bold"
                : "text-amazon-blue hover:text-amazon-orange hover:underline font-normal"
            }`}
          >
            Not Yet Shipped
          </li>
          <li
            onClick={() => setActiveTab("cancelled")}
            className={`pb-2.5 cursor-pointer transition-colors ${
              activeTab === "cancelled"
                ? "border-b-2 border-amazon-orange text-black font-bold"
                : "text-amazon-blue hover:text-amazon-orange hover:underline font-normal"
            }`}
          >
            Cancelled Orders
          </li>
        </ul>
      </div>

      {/* ── Tab Content: Buy Again ── */}
      {activeTab === "buy_again" ? (
        buyAgainItems.length === 0 ? (
          <div className="py-16 text-center border border-gray-200 rounded bg-white p-8">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-slate-500 mb-4">No items available to buy again right now.</p>
            <Link to="/" className="bg-amazon-yellow text-black px-4 py-2 rounded shadow-sm border border-yellow-500 hover:bg-yellow-500 text-sm font-medium">Start shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {buyAgainItems.map((it, idx) => (
              <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="w-32 h-32 mx-auto mb-3 flex items-center justify-center bg-slate-50 rounded p-2">
                    <img
                      src={it.product_detail?.image || placeholder(it.product_name)}
                      alt={it.product_name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <Link
                    to={it.product_detail?.slug ? `/product/${it.product_detail.slug}` : "#"}
                    className="text-amazon-blue hover:underline hover:text-amazon-orange font-semibold text-sm line-clamp-2 mb-1"
                  >
                    {it.product_name}
                  </Link>
                  <div className="text-xs text-slate-500 mb-2">Last purchased on {fmtDate(it.orderDate)}</div>
                  <div className="font-bold text-base text-black mb-4">{money(it.price)}</div>
                </div>
                <button
                  onClick={() => handleBuyAgain(it)}
                  className="w-full bg-amazon-yellow hover:bg-yellow-500 text-black font-medium text-xs py-2 rounded-full shadow-sm border border-yellow-500 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        /* ── Tab Content: Orders / Not Shipped / Cancelled ── */
        filteredOrders.length === 0 ? (
          <div className="py-16 text-center border border-gray-200 rounded bg-white p-8">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-slate-500 mb-4">
              {searchQuery ? `No orders found matching "${searchQuery}".` : "You don't have any orders in this tab."}
            </p>
            {searchQuery ? (
              <button onClick={() => setSearchQuery("")} className="text-amazon-blue hover:underline text-sm font-medium">Clear search results</button>
            ) : (
              <Link to="/" className="bg-amazon-yellow text-black px-4 py-2 rounded shadow-sm border border-yellow-500 hover:bg-yellow-500 text-sm font-medium">Start shopping</Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Card Header */}
                <div className="bg-[#f0f2f2] text-[#565959] p-3.5 text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-300">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-10 mb-2 sm:mb-0">
                    <div>
                      <div className="uppercase text-xs font-semibold text-gray-600">Order Placed</div>
                      <div className="text-gray-800">{fmtDate(order.created_at)}</div>
                    </div>
                    <div>
                      <div className="uppercase text-xs font-semibold text-gray-600">Total</div>
                      <div className="text-gray-800 font-bold">{money(order.total)}</div>
                    </div>
                    <div className="hidden md:block group relative cursor-pointer">
                      <div className="uppercase text-xs font-semibold text-gray-600">Ship To</div>
                      <div className="text-amazon-blue hover:underline hover:text-amazon-orange flex items-center">
                        {(order.shipping_address || "").split(",")[0] || "Your Address"} ▾
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <div className="uppercase text-xs font-semibold text-gray-600">Order # {String(order.id).toUpperCase()}-8943210</div>
                    <div className="flex sm:justify-end gap-3 mt-1 text-xs">
                      <button
                        onClick={() => handleOpenModal("details", order)}
                        className="text-amazon-blue hover:underline hover:text-amazon-orange font-medium"
                      >
                        View order details
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleOpenModal("invoice", order)}
                        className="text-amazon-blue hover:underline hover:text-amazon-orange font-medium"
                      >
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    {order.status === 'delivered' && <CheckCircle size={20} className="text-green-600" />}
                    {order.status === 'shipped' && <Truck size={20} className="text-blue-600" />}
                    {order.status === 'cancelled' && <AlertCircle size={20} className="text-red-600" />}
                    <span className={`text-lg font-bold ${
                      order.status === 'delivered' ? 'text-green-700' :
                      order.status === 'cancelled' ? 'text-red-700' : 'text-black'
                    }`}>
                      {order.status === 'delivered' ? "Delivered yesterday" :
                       order.status === 'shipped' ? "On the way — Arriving by Thursday" :
                       STATUS_TEXT[order.status] || order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                        {/* Product Image */}
                        <div
                          className="w-24 h-24 flex-shrink-0 bg-slate-50 p-2 rounded border border-gray-100 cursor-pointer"
                          onClick={() => it.product_detail?.slug && navigate(`/product/${it.product_detail.slug}`)}
                        >
                          <img 
                            src={it.product_detail?.image || placeholder(it.product_name)} 
                            alt={it.product_name}
                            className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <Link
                            to={it.product_detail?.slug ? `/product/${it.product_detail.slug}` : "#"}
                            className="text-amazon-blue hover:underline hover:text-amazon-orange font-semibold text-sm line-clamp-2"
                          >
                            {it.product_name}
                          </Link>
                          {it.product_detail?.vendor_name && (
                            <div className="text-xs text-slate-500 mt-1">Sold by: {it.product_detail.vendor_name}</div>
                          )}
                          <div className="text-sm mt-1.5 font-medium text-slate-700">
                            <span>Qty: {it.quantity}</span>
                            <span className="ml-3 text-black font-bold">{money(it.price)} each</span>
                          </div>
                          
                          <div className="mt-3.5 flex flex-wrap gap-2.5">
                            <button
                              onClick={() => handleBuyAgain(it)}
                              className="bg-amazon-yellow hover:bg-yellow-500 text-black text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm border border-yellow-500 transition-colors"
                            >
                              Buy it again
                            </button>
                            <button
                              onClick={() => it.product_detail?.slug && navigate(`/product/${it.product_detail.slug}`)}
                              className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-3.5 py-1.5 rounded-full shadow-sm border border-gray-300 transition-colors"
                            >
                              View your item
                            </button>
                          </div>
                        </div>
                        
                        {/* Action Buttons (Right side on desktop) */}
                        <div className="sm:w-52 flex flex-col gap-2 mt-4 sm:mt-0">
                          <button
                            onClick={() => handleOpenModal("track", order, it)}
                            className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-3 py-2 rounded-full shadow-sm border border-gray-300 text-center w-full flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Truck size={14} className="text-amazon-orange" /> Track package
                          </button>
                          <button
                            onClick={() => handleOpenModal("return", order, it)}
                            className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-3 py-2 rounded-full shadow-sm border border-gray-300 text-center w-full flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <RotateCcw size={14} /> Return or replace items
                          </button>
                          <button
                            onClick={() => handleOpenModal("feedback", order, it)}
                            className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-3 py-2 rounded-full shadow-sm border border-gray-300 text-center w-full flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <MessageSquare size={14} /> Leave seller feedback
                          </button>
                          <button
                            onClick={() => handleOpenModal("review", order, it)}
                            className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-3 py-2 rounded-full shadow-sm border border-gray-300 text-center w-full flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Star size={14} className="text-yellow-500 fill-yellow-500" /> Write a product review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ────────────────── MODALS ────────────────── */}

      {/* 1. Track Package Modal */}
      {activeModal === "track" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden animate-fade-in">
            <div className="bg-[#f0f2f2] px-5 py-4 border-b border-gray-300 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Truck className="text-amazon-orange" /> Package Tracking Details
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="font-bold text-green-800 text-lg">
                  {selectedOrder?.status === "delivered" ? "Delivered" : "In Transit — On schedule"}
                </div>
                <div className="text-xs text-green-700 mt-1">
                  Tracking ID: TBA{String(selectedOrder?.id).padStart(12, "894300000")}
                </div>
              </div>

              {/* Progress Steps */}
              <div className="py-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 relative">
                  <div className="flex flex-col items-center z-10 bg-white px-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center mb-1">✓</div>
                    <span>Ordered</span>
                  </div>
                  <div className="flex flex-col items-center z-10 bg-white px-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center mb-1">✓</div>
                    <span>Shipped</span>
                  </div>
                  <div className="flex flex-col items-center z-10 bg-white px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                      selectedOrder?.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-amazon-orange text-white'
                    }`}>
                      {selectedOrder?.status === 'delivered' ? '✓' : '●'}
                    </div>
                    <span>Out for Delivery</span>
                  </div>
                  <div className="flex flex-col items-center z-10 bg-white px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                      selectedOrder?.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {selectedOrder?.status === 'delivered' ? '✓' : '○'}
                    </div>
                    <span>Delivered</span>
                  </div>
                  {/* Progress Line */}
                  <div className="absolute top-3 left-6 right-6 h-1 bg-green-500 -z-0" />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 text-sm space-y-2">
                <div><span className="font-semibold text-gray-600">Shipping Address:</span> {selectedOrder?.shipping_address || "Standard Address"}</div>
                <div><span className="font-semibold text-gray-600">Carrier:</span> Shoply Express Logistics</div>
              </div>

              <div className="flex justify-end">
                <button onClick={closeModal} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded text-sm font-medium">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Return or Replace Modal */}
      {activeModal === "return" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="bg-[#f0f2f2] px-5 py-4 border-b border-gray-300 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <RotateCcw className="text-amazon-orange" /> Return or Replace Item
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-gray-200">
                <img src={selectedItem?.product_detail?.image || placeholder(selectedItem?.product_name)} alt="" className="w-12 h-12 object-contain mix-blend-multiply" />
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">{selectedItem?.product_name}</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Why are you returning this item?</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                >
                  <option value="damaged">Item arrived damaged or defective</option>
                  <option value="wrong">Received wrong item or color</option>
                  <option value="quality">Quality not as expected</option>
                  <option value="no_longer_needed">No longer needed / Bought by mistake</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select your resolution:</label>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="res" checked={returnAction === "refund"} onChange={() => setReturnAction("refund")} className="text-amazon-orange focus:ring-amazon-orange" />
                    <span>Refund to original payment method (Fastest)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="res" checked={returnAction === "replace"} onChange={() => setReturnAction("replace")} className="text-amazon-orange focus:ring-amazon-orange" />
                    <span>Replace with exact same item (Free exchange)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">Cancel</button>
                <button
                  onClick={() => {
                    closeModal();
                    showToastMsg("Return request submitted successfully! Prepaid return label sent to your email.");
                  }}
                  className="bg-amazon-yellow hover:bg-yellow-500 text-black px-5 py-2 rounded text-sm font-bold border border-yellow-500 shadow-sm"
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Seller Feedback Modal */}
      {activeModal === "feedback" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="bg-[#f0f2f2] px-5 py-4 border-b border-gray-300 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MessageSquare className="text-amazon-orange" /> Leave Seller Feedback
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="text-sm">
                <span className="text-gray-600">Seller: </span>
                <span className="font-bold text-black">{selectedItem?.product_detail?.vendor_name || "Official Shoply Seller"}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rate your delivery and packaging experience:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star size={28} className={s <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700">{rating} out of 5 stars</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Comments for the seller (Optional):</label>
                <textarea
                  rows={3}
                  placeholder="How was the item packaged? Did it arrive on time?"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">Cancel</button>
                <button
                  onClick={() => {
                    closeModal();
                    showToastMsg("Thank you! Your seller feedback has been submitted.");
                  }}
                  className="bg-amazon-yellow hover:bg-yellow-500 text-black px-5 py-2 rounded text-sm font-bold border border-yellow-500 shadow-sm"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Product Review Modal */}
      {activeModal === "review" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
            <div className="bg-[#f0f2f2] px-5 py-4 border-b border-gray-300 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" /> Write a Product Review
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-gray-200">
                <img src={selectedItem?.product_detail?.image || placeholder(selectedItem?.product_name)} alt="" className="w-12 h-12 object-contain mix-blend-multiply" />
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">{selectedItem?.product_name}</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Overall rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star size={28} className={s <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700">{rating} out of 5 stars</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Add a headline</label>
                <input
                  type="text"
                  value={reviewHeadline}
                  onChange={(e) => setReviewHeadline(e.target.value)}
                  placeholder="What's most important to know?"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Add a written review</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                <button onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 font-medium">Cancel</button>
                <button
                  onClick={() => {
                    closeModal();
                    showToastMsg("Thank you! Your product review has been submitted and is now public.");
                  }}
                  className="bg-amazon-yellow hover:bg-yellow-500 text-black px-5 py-2 rounded text-sm font-bold border border-yellow-500 shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Order Details Modal */}
      {activeModal === "details" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="bg-[#f0f2f2] px-5 py-4 border-b border-gray-300 flex items-center justify-between sticky top-0">
              <div>
                <h3 className="font-bold text-lg">Order Details</h3>
                <div className="text-xs text-gray-600">Order # {String(selectedOrder?.id).toUpperCase()}-8943210</div>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-black font-bold text-lg">✕</button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded border border-gray-200">
                <div>
                  <div className="font-bold text-gray-700 mb-1">Shipping Address</div>
                  <div className="text-gray-600 leading-relaxed">{selectedOrder?.shipping_address || "Standard Address, India"}</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700 mb-1">Payment Method</div>
                  <div className="text-gray-600">Credit Card ending in 4321</div>
                  <div className="text-xs text-green-700 mt-1 font-semibold">Verified Paid</div>
                </div>
                <div>
                  <div className="font-bold text-gray-700 mb-1">Order Summary</div>
                  <div className="flex justify-between text-xs text-gray-600"><span>Item(s) Subtotal:</span> <span>{money(selectedOrder?.total)}</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span>Shipping & Handling:</span> <span>₹0.00</span></div>
                  <div className="flex justify-between text-xs text-gray-600"><span>Total Tax:</span> <span>₹0.00</span></div>
                  <div className="flex justify-between font-bold text-black border-t border-gray-300 pt-1 mt-1"><span>Grand Total:</span> <span>{money(selectedOrder?.total)}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-base mb-3 border-b border-gray-200 pb-2">Items in this Order ({selectedOrder?.items?.length || 0})</h4>
                <div className="space-y-4">
                  {(selectedOrder?.items || []).map((it) => (
                    <div key={it.id} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={it.product_detail?.image || placeholder(it.product_name)} alt="" className="w-14 h-14 object-contain mix-blend-multiply bg-slate-50 p-1 rounded border border-gray-200" />
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">{it.product_name}</div>
                          <div className="text-xs text-slate-500">Qty: {it.quantity} × {money(it.price)}</div>
                        </div>
                      </div>
                      <div className="font-bold text-black">{money(it.price * it.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={closeModal} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded font-medium">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Invoice Modal */}
      {activeModal === "invoice" && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in p-8 border-4 border-gray-800">
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
              <div>
                <div className="text-2xl font-bold tracking-tight">Shoply.com <span className="text-amazon-orange">Invoice</span></div>
                <div className="text-xs text-gray-600 mt-1">Tax Invoice / Receipt for Order #{String(selectedOrder?.id).toUpperCase()}-8943210</div>
              </div>
              <div className="text-right text-xs text-gray-600">
                <div>Order Date: {fmtDate(selectedOrder?.created_at)}</div>
                <div className="font-bold text-black mt-1">Status: {STATUS_TEXT[selectedOrder?.status] || selectedOrder?.status}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-6 text-xs border-b border-gray-300 pb-6">
              <div>
                <div className="font-bold text-gray-800 mb-1 uppercase">Sold By:</div>
                <div>Shoply Retail Services Pvt Ltd.</div>
                <div>Amazon E-commerce Tower, Bangalore, India</div>
              </div>
              <div>
                <div className="font-bold text-gray-800 mb-1 uppercase">Billed To:</div>
                <div>{selectedOrder?.shipping_address || "Customer Shipping Address"}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs mb-6 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-400 font-bold bg-gray-100">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Unit Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(selectedOrder?.items || []).map((it) => (
                  <tr key={it.id} className="border-b border-gray-200">
                    <td className="py-2.5 px-3 font-medium">{it.product_name}</td>
                    <td className="py-2.5 px-3 text-center">{it.quantity}</td>
                    <td className="py-2.5 px-3 text-right">{money(it.price)}</td>
                    <td className="py-2.5 px-3 text-right font-bold">{money(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end border-t-2 border-black pt-4 mb-8 text-sm">
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-xs text-gray-600"><span>Subtotal:</span> <span>{money(selectedOrder?.total)}</span></div>
                <div className="flex justify-between text-xs text-gray-600"><span>Shipping & Handling:</span> <span>₹0.00</span></div>
                <div className="flex justify-between font-bold text-base text-black border-t border-gray-400 pt-2 mt-1"><span>Invoice Total:</span> <span>{money(selectedOrder?.total)}</span></div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-100 p-3 rounded text-xs text-gray-600">
              <div>Thank you for shopping on Shoply!</div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-amazon-yellow hover:bg-yellow-500 text-black px-4 py-1.5 rounded font-bold border border-yellow-500 shadow-sm flex items-center gap-1">
                  <FileText size={14} /> Print Invoice
                </button>
                <button onClick={closeModal} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded font-medium">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
