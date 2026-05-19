import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop, Product } from '../context/ShopContext';
import { Heart, ChevronRight, Share2, Shield, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useShop();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const p = products.find(p => p.id === id);
    if (p) {
      setProduct(p);
      setMainImage(Array.isArray(p.images) ? p.images[0] : '');
      if (p.sizes && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
      if (p.colors && p.colors.length > 0) setSelectedColor(p.colors[0]);
    }
  }, [id, products]);

  if (!product) {
    return <div className="min-h-screen pt-32 pb-24 text-center">Loading or Product not found...</div>;
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    // show toast ideally
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-black">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-black">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 overflow-x-auto md:w-24 flex-shrink-0">
              {Array.isArray(product.images) && product.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 border-2 overflow-hidden ${mainImage === img ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'} transition-all`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <motion.div 
              key={mainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-neutral-100 aspect-[3/4] relative overflow-hidden"
            >
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover object-center" />
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-white font-bold px-3 py-1 text-sm">
                  SALE
                </div>
              )}
            </motion.div>
          </div>

          {/* Details */}
          <div className="flex flex-col pt-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-black">{product.title}</h1>
              <button className="text-gray-400 hover:text-black mt-2">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
               <div className="flex text-yellow-400 text-sm">
                 {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
               </div>
               <span className="text-sm text-gray-500">(12 Reviews)</span>
            </div>

            <div className="flex gap-4 items-end mb-8 pb-8 border-b">
               {product.discountPrice ? (
                 <>
                   <span className="text-3xl font-semibold text-black">BDT {product.discountPrice.toLocaleString()}</span>
                   <span className="text-xl text-gray-400 line-through mb-1">BDT {product.price.toLocaleString()}</span>
                 </>
               ) : (
                 <span className="text-3xl font-semibold text-black">BDT {product.price.toLocaleString()}</span>
               )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-sm tracking-wide uppercase">Size</span>
                  <button className="text-sm text-gray-500 underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex gap-3">
                  {product.sizes.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 border flex items-center justify-center font-medium transition-colors ${selectedSize === s ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-gray-700'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                 <span className="font-medium text-sm tracking-wide uppercase block mb-3">Color: <span className="text-gray-500 ml-1">{selectedColor}</span></span>
                 <div className="flex gap-3">
                   {product.colors.map(c => (
                     <button
                       key={c}
                       onClick={() => setSelectedColor(c)}
                       className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor === c ? 'border-black' : 'border-transparent'}`}
                     >
                       <span 
                         className="w-8 h-8 rounded-full border border-gray-200" 
                         style={{ backgroundColor: c.toLowerCase() === 'navy' ? '#000080' : c.toLowerCase() }} 
                       />
                     </button>
                   ))}
                 </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex border border-gray-300 h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-500 hover:bg-gray-50 hover:text-black">-</button>
                <div className="w-12 flex items-center justify-center font-medium border-x border-gray-300">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-gray-500 hover:bg-gray-50 hover:text-black">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black border border-black font-medium h-14 hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${isWishlisted ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-red-50' : 'border-gray-300 text-gray-400 hover:text-black hover:border-black'}`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow}
              className="w-full bg-black text-white h-14 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors mb-12 shadow-lg hover:shadow-xl"
            >
              Buy It Now
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-gray-200 mb-8">
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Truck className="w-5 h-5 text-black" /> Nationwide Delivery
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <Shield className="w-5 h-5 text-black" /> Secure Payments
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-600">
                 <RefreshCw className="w-5 h-5 text-black" /> 30-Day Returns
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
