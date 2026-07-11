import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import VendorSignup from "./pages/VendorSignup";
import CategoryPage from "./pages/CategoryPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-amazon-background">
      <Navbar />
      <main className="flex-1 w-full pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<div className="mx-auto max-w-6xl px-4 py-6"><Login /></div>} />
          <Route path="/signup" element={<div className="mx-auto max-w-6xl px-4 py-6"><Signup /></div>} />
          <Route path="/vendor-signup" element={<div className="mx-auto max-w-6xl px-4 py-6"><VendorSignup /></div>} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <div className="mx-auto max-w-6xl px-4 py-6"><Cart /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <div className="mx-auto max-w-6xl px-4 py-6"><Checkout /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <div className="mx-auto max-w-6xl px-4 py-6"><Orders /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="mx-auto max-w-6xl px-4 py-6"><Profile /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={["vendor", "admin"]}>
                <div className="mx-auto max-w-6xl px-4 py-6"><VendorDashboard /></div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p className="py-20 text-center">Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
