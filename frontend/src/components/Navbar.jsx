import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Search, ShoppingCart, MapPin, Menu, User, X } from "lucide-react";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAllMenu, setShowAllMenu] = useState(false);

  const EMOJI_MAP = {
    books: "📚", electronics: "💻", fashion: "👗",
    "home-kitchen": "🏠", sports: "⚽", toys: "🧸",
    beauty: "💄", grocery: "🛒", music: "🎵", gaming: "🎮",
  };

  useEffect(() => {
    api.get("/categories/").then(({ data }) => setCategories(data.results || data)).catch(() => {});
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(q)}`);
  };

  return (
    <>
    <header className="flex flex-col z-50 w-full font-sans text-sm sticky top-0">
      {/* Top Nav */}
      <div className="bg-amazon text-white flex items-center px-2 sm:px-4 py-2 justify-between sm:justify-start sm:gap-4">
        {/* Left section: Menu (Mobile) + Logo */}
        <div className="flex items-center">
          {/* Mobile Menu Icon */}
          <div className="sm:hidden flex items-center px-2 py-1 mr-1 border border-transparent hover:border-white rounded-sm cursor-pointer">
            <Menu size={24} />
          </div>
          
          <Link to="/" className="flex items-center pt-2 pb-1 px-1 sm:px-2 border border-transparent hover:border-white rounded-sm">
            <span className="text-xl sm:text-2xl font-bold tracking-tighter">Shoply</span>
            <span className="text-amazon-orange text-xl sm:text-2xl font-bold ml-1">.</span>
          </Link>
        </div>

        {/* Location (hidden on small screens) */}
        <div className="hidden md:flex flex-col px-2 border border-transparent hover:border-white rounded-sm cursor-pointer pb-1 pt-1">
          <div className="text-xs text-gray-300 ml-4">Deliver to</div>
          <div className="flex items-center font-bold whitespace-nowrap">
            <MapPin size={16} className="mr-1" />
            Select your address
          </div>
        </div>

        {/* Desktop Search */}
        <form onSubmit={onSearch} className="hidden flex-1 sm:flex h-10 rounded overflow-hidden focus-within:ring-2 focus-within:ring-amazon-orange mx-2">
          <select className="bg-gray-100 text-gray-700 border-r border-gray-300 px-3 outline-none hover:bg-gray-200 cursor-pointer text-xs">
            <option>All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Shoply"
            className="flex-1 px-4 text-black outline-none w-full"
          />
          <button type="submit" className="bg-[#FEBD69] hover:bg-[#F3A847] text-black px-4 flex items-center justify-center transition-colors border-l border-[#C97200]">
            <Search size={20} />
          </button>
        </form>

        {/* Right section: Accounts, Orders, Cart */}
        <div className="flex items-center sm:gap-2">
          {/* Sign In / Account (Mobile & Desktop) */}
          {user ? (
            <div className="group relative flex items-center sm:flex-col px-2 border border-transparent hover:border-white rounded-sm cursor-pointer sm:pb-1 sm:pt-1">
              <span className="sm:hidden flex items-center">
                <span className="text-sm mr-1">{user.username.split(" ")[0]}</span> <User size={20} />
              </span>
              <div className="hidden sm:block text-xs text-gray-300">Hello, {user.username}</div>
              <div className="hidden sm:flex font-bold items-center whitespace-nowrap">Account &amp; Lists</div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-1 hidden w-48 bg-white text-black p-4 shadow-lg rounded-sm border border-gray-200 group-hover:block z-50">
                <Link to="/profile" className="block py-1 hover:text-amazon-orange hover:underline">Your Profile</Link>
                {(user.role === "vendor" || user.role === "admin") && (
                  <Link to="/vendor" className="block py-1 hover:text-amazon-orange hover:underline">Dashboard</Link>
                )}
                <button onClick={logout} className="block py-1 w-full text-left hover:text-amazon-orange hover:underline mt-2 border-t border-gray-200 pt-2">Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center sm:flex-col px-2 border border-transparent hover:border-white rounded-sm cursor-pointer sm:pb-1 sm:pt-1">
              <span className="sm:hidden flex items-center">
                Sign In <User size={20} className="ml-1" />
              </span>
              <div className="hidden sm:block text-xs text-gray-300">Hello, sign in</div>
              <div className="hidden sm:block font-bold whitespace-nowrap">Account &amp; Lists</div>
            </Link>
          )}

          {/* Returns & Orders (Hidden on mobile) */}
          <Link to="/orders" className="hidden lg:flex flex-col px-2 border border-transparent hover:border-white rounded-sm cursor-pointer pb-1 pt-1 whitespace-nowrap">
            <div className="text-xs text-gray-300">Returns</div>
            <div className="font-bold">&amp; Orders</div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end px-2 border border-transparent hover:border-white rounded-sm cursor-pointer pb-1 pt-1">
            <div className="relative flex items-center">
              <ShoppingCart size={32} />
              <span className="absolute -top-1 left-3 text-amazon-orange font-bold text-sm bg-amazon rounded-full px-1 min-w-[20px] text-center">
                {cart.item_count || 0}
              </span>
            </div>
            <span className="font-bold hidden sm:block mt-auto mb-1 ml-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar - 2nd row on small screens */}
      <div className="sm:hidden bg-amazon px-3 pb-3">
        <form onSubmit={onSearch} className="flex h-11 rounded overflow-hidden focus-within:ring-2 focus-within:ring-amazon-orange">
          <select className="bg-gray-100 text-gray-700 border-r border-gray-300 px-2 outline-none text-xs">
            <option>All</option>
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Shoply"
            className="flex-1 px-3 text-black outline-none text-base"
          />
          <button type="submit" className="bg-amazon-orange text-black px-4 flex items-center justify-center">
            <Search size={22} />
          </button>
        </form>
      </div>

      {/* Sub Nav — dynamic categories */}
      <div className="bg-amazon-light text-white flex items-center px-4 py-1.5 text-sm gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setShowAllMenu(true)}
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer font-bold flex-shrink-0"
        >
          <Menu size={20} className="mr-1" /> All
        </button>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/category/${c.slug}`}
            className="px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer flex-shrink-0"
          >
            {c.name}
          </Link>
        ))}
        <Link to="/" className="px-2 py-1 border border-transparent hover:border-white rounded-sm cursor-pointer flex-shrink-0">
          Today's Deals
        </Link>
      </div>
    </header>

    {/* ── "All" Category Drawer — rendered via portal so it escapes sticky header ── */}
    {showAllMenu && createPortal(
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setShowAllMenu(false)}
        />
        {/* Slide-in Drawer */}
        <div className="fixed top-0 left-0 h-full w-[280px] bg-[#1A232F] z-[9999] overflow-y-auto shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="bg-[#232F3E] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={18} className="text-white" />
              <span className="text-white font-bold text-sm">
                {user ? `Hello, ${user.username}` : "Hello, sign in"}
              </span>
            </div>
            <button
              onClick={() => setShowAllMenu(false)}
              className="text-white hover:text-amazon-orange p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Shop by Department */}
          <div className="px-4 pt-4 pb-1">
            <h2 className="text-white font-bold text-sm border-b border-[#3A4553] pb-3">
              Shop by Department
            </h2>
          </div>
          <ul className="flex-1">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => { navigate(`/category/${c.slug}`); setShowAllMenu(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white transition-colors text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">{EMOJI_MAP[c.slug] || "🛍️"}</span>
                    {c.name}
                  </span>
                  <span className="text-[#888C8C]">›</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-[#3A4553] mx-4 my-1" />

          {/* Help & Settings */}
          <div className="px-4 pb-1">
            <h2 className="text-white font-bold text-sm border-b border-[#3A4553] pb-3">
              Help &amp; Settings
            </h2>
          </div>
          <ul className="pb-6">
            {user ? (
              <>
                <li>
                  <button onClick={() => { navigate("/profile"); setShowAllMenu(false); }}
                    className="w-full text-left px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white text-sm">
                    Your Account
                  </button>
                </li>
                <li>
                  <button onClick={() => { navigate("/orders"); setShowAllMenu(false); }}
                    className="w-full text-left px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white text-sm">
                    Your Orders
                  </button>
                </li>
                {(user.role === "vendor" || user.role === "admin") && (
                  <li>
                    <button onClick={() => { navigate("/vendor"); setShowAllMenu(false); }}
                      className="w-full text-left px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white text-sm">
                      Seller Dashboard
                    </button>
                  </li>
                )}
                <li>
                  <button onClick={() => { logout(); setShowAllMenu(false); }}
                    className="w-full text-left px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white text-sm">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => { navigate("/login"); setShowAllMenu(false); }}
                  className="w-full text-left px-4 py-3 text-[#CCCCCC] hover:bg-[#232F3E] hover:text-white text-sm">
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </>,
      document.body
    )}
    </>
  );
}

