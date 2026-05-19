import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion } from 'motion/react';

export default function Home() {
  const { products, loading } = useShop();

  // Pick first 4 for featured
  const featured = products.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-neutral-100 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block py-1 px-3 border border-white/30 text-white/90 text-sm tracking-widest font-medium mb-6 backdrop-blur-sm">
              NEW COLLECTION 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Modern Men's <br/>Fashion Destination
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
              Discover our latest premium collection. Elevate your everyday style with our elegantly crafted pieces.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="bg-[var(--color-primary)] text-white px-8 py-4 font-medium tracking-wide hover:bg-black transition-colors flex items-center gap-2">
                SHOP NOW <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 font-medium tracking-wide hover:bg-white hover:text-black transition-colors">
                EXPLORE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Truck className="w-8 h-8 text-[var(--color-primary)]" />
              <div>
                <h4 className="font-semibold text-black">Fast Delivery</h4>
                <p className="text-sm text-gray-500">Nationwide shipping via Nagad</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[var(--color-primary)]" />
              <div>
                <h4 className="font-semibold text-black">Secure Payment</h4>
                <p className="text-sm text-gray-500">Manual verification</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-[var(--color-primary)]" />
              <div>
                <h4 className="font-semibold text-black">24/7 Support</h4>
                <p className="text-sm text-gray-500">Dedicated customer care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-black mb-2">Featured Products</h2>
              <p className="text-gray-500">Handpicked selections for the modern man</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium border-b border-black pb-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
              VIEW ALL <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="animate-pulse flex flex-col gap-4">
                   <div className="bg-gray-200 h-80 rounded-sm"></div>
                   <div className="h-4 bg-gray-200 w-3/4"></div>
                   <div className="h-4 bg-gray-200 w-1/2"></div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                    <img 
                      src={Array.isArray(product.images) ? product.images[0] : ''} 
                      alt={product.title} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.discountPrice && (
                        <span className="bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-1">SALE</span>
                      )}
                    </div>
                    <div className="absolute bottom-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                       <button className="w-full bg-white text-black py-3 font-medium flex justify-center items-center gap-2 hover:bg-black hover:text-white transition-colors">
                         <ShoppingBag className="w-4 h-4" /> QUICK VIEW
                       </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 tracking-wider mb-1 uppercase">{product.category}</span>
                    <h3 className="text-black font-medium text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors">{product.title}</h3>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative py-32 bg-black flex items-center justify-center overflow-hidden">
         <img 
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=2000" 
            alt="Promo"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
         />
         <div className="relative z-10 text-center px-4 w-full max-w-2xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">The Essential Suit Collection</h2>
           <p className="text-gray-300 mb-8 max-w-lg mx-auto">Tailored fit, premium materials, and unmatched style. Perfect for those who demand excellence in every detail.</p>
           <Link to="/shop?category=Suits" className="inline-block bg-white text-black px-8 py-4 font-medium hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              DISCOVER MORE
           </Link>
         </div>
      </section>

    </div>
  );
}
