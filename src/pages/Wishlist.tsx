import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useShop();

  const handleAddToCart = (product: any) => {
    addToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '', 1);
    // Optionally remove from wishlist
    // toggleWishlist(product.id);
  };

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-red-200 bg-white mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-black mb-3">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Save items you love and keep track of your most wanted pieces.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-4 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-black mb-12">My Wishlist</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlistedProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={product.id} 
                className="group flex flex-col relative"
              >
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={Array.isArray(product.images) ? product.images[0] : ''} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                  </Link>
                  <div className="absolute bottom-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <button 
                       onClick={() => handleAddToCart(product)}
                       className="w-full bg-black text-white py-3 font-medium flex justify-center items-center gap-2 hover:bg-[var(--color-primary)] transition-colors"
                     >
                       <ShoppingBag className="w-4 h-4" /> ADD TO CART
                     </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-black font-medium text-base mb-1 hover:text-[var(--color-primary)] transition-colors">{product.title}</h3>
                  </Link>
                  <div className="flex gap-3 items-center">
                    {product.discountPrice ? (
                      <>
                        <span className="font-semibold text-black">BDT {product.discountPrice.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 line-through">BDT {product.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-black">BDT {product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
