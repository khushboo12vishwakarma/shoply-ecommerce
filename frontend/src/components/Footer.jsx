import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8 font-sans text-sm">
      {/* Main footer links */}
      <div className="bg-[#232F3E] text-white py-10 px-4">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-base mb-3">Get to Know Us</h3>
            <ul className="space-y-2 text-[#CCCCCC] text-sm">
              <li><Link to="/" className="hover:text-white hover:underline">Careers</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Blog</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">About Shoply</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Investor Relations</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3">Make Money with Us</h3>
            <ul className="space-y-2 text-[#CCCCCC] text-sm">
              <li><Link to="/vendor-signup" className="hover:text-white hover:underline">Sell on Shoply</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Become an Affiliate</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Advertise Your Products</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Self-Publish with Us</Link></li>
              <li><Link to="/vendor" className="hover:text-white hover:underline">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3">Shoply Payment Products</h3>
            <ul className="space-y-2 text-[#CCCCCC] text-sm">
              <li><Link to="/" className="hover:text-white hover:underline">Shoply Business Card</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Shop with Points</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Reload Your Balance</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Shoply Currency Converter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-[#CCCCCC] text-sm">
              <li><Link to="/profile" className="hover:text-white hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:text-white hover:underline">Your Orders</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Returns & Replacements</Link></li>
              <li><Link to="/" className="hover:text-white hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#131921] text-[#999999] py-6 px-4 text-center text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Link to="/" className="text-white text-xl font-bold tracking-tighter hover:opacity-80">
            Shoply<span className="text-[#FF9900]">.</span>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <Link to="/" className="hover:text-white hover:underline">Conditions of Use</Link>
          <Link to="/" className="hover:text-white hover:underline">Privacy Notice</Link>
          <Link to="/" className="hover:text-white hover:underline">Cookie Notice</Link>
          <Link to="/" className="hover:text-white hover:underline">Interest-Based Ads Notice</Link>
          <Link to="/" className="hover:text-white hover:underline">Help</Link>
        </div>
        <p>© {new Date().getFullYear()}, Shoply.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}
