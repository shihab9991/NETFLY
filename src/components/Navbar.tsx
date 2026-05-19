import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react';

export default function Navbar() {
  const { cartCount, wishlist } = useShop();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass no-underline border-b border-black/5 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tighter text-black">
              NETFLIY<span className="text-[var(--color-primary)]">.</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-black/80 hover:text-black transition-colors">HOME</Link>
            <Link to="/shop" className="text-sm font-medium text-black/80 hover:text-black transition-colors">SHOP</Link>
            <Link to="/categories" className="text-sm font-medium text-black/80 hover:text-black transition-colors">CATEGORIES</Link>
            <Link to="/blog" className="text-sm font-medium text-black/80 hover:text-black transition-colors">BLOG</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-black/80 hover:text-black transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/wishlist" className="relative text-black/80 hover:text-black transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-primary)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-black/80 hover:text-black transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-primary)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className="text-black/80 hover:text-black transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button className="md:hidden text-black/80 hover:text-black transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
