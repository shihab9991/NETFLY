import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();

  const deliveryCharge = 80;
  const total = cartTotal + (cart.length > 0 ? deliveryCharge : 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-black mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-black text-white px-8 py-4 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-black mb-12">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="hidden md:grid grid-cols-5 text-sm font-medium tracking-wide uppercase text-gray-500 border-b pb-4 mb-6">
               <div className="col-span-2">Product</div>
               <div className="text-center">Price</div>
               <div className="text-center">Quantity</div>
               <div className="text-right">Total</div>
            </div>
            
            <div className="space-y-6 md:space-y-0">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={item.cartId} 
                    className="grid grid-cols-1 md:grid-cols-5 items-center gap-6 md:border-b md:py-6 overflow-hidden bg-neutral-50 p-4 md:p-0 md:bg-transparent rounded-sm md:rounded-none"
                  >
                    <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                      <Link to={`/product/${item.id}`} className="w-24 h-32 bg-gray-100 flex-shrink-0">
                        <img src={Array.isArray(item.images) ? item.images[0] : ''} alt={item.title} className="w-full h-full object-cover" />
                      </Link>
                      <div>
                        <Link to={`/product/${item.id}`} className="font-medium text-black hover:text-[var(--color-primary)] mb-1 block line-clamp-1">{item.title}</Link>
                        <div className="text-sm text-gray-500 mb-2">
                          <span className="mr-3">Size: {item.selectedSize}</span>
                          <span>Color: {item.selectedColor}</span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-xs text-red-500 font-medium flex items-center gap-1 hover:text-red-700 transition-colors uppercase"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="hidden md:block text-center font-medium text-black">
                      BDT {(item.discountPrice || item.price).toLocaleString()}
                    </div>
                    
                    <div className="flex md:justify-center items-center justify-between">
                      <span className="md:hidden text-sm text-gray-500 font-medium uppercase tracking-wide">Quantity</span>
                      <div className="flex border border-gray-300 h-10 w-32 bg-white">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="px-3 text-gray-500 hover:bg-gray-50 hover:text-black">-</button>
                        <div className="flex-1 flex items-center justify-center font-medium border-x border-gray-300 text-sm">{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="px-3 text-gray-500 hover:bg-gray-50 hover:text-black">+</button>
                      </div>
                    </div>
                    
                    <div className="flex md:block justify-between items-center text-right font-medium text-black text-lg">
                      <span className="md:hidden text-sm text-gray-500 font-medium uppercase tracking-wide">Subtotal</span>
                      BDT {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-8 flex justify-between items-center bg-neutral-50 px-6 py-4 border border-neutral-100">
               <div className="flex items-center gap-2">
                 <input type="text" placeholder="Coupon Code" className="border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors" />
                 <button className="bg-black text-white px-4 py-2 text-sm font-medium uppercase tracking-wide">Apply</button>
               </div>
               <button className="text-sm border-b border-black font-medium text-black hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">Update Cart</button>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-neutral-50 p-8 pt-0 sticky top-24 border border-neutral-100">
               <h3 className="text-lg font-serif font-bold text-black border-b py-6 mb-6">Order Summary</h3>
               
               <div className="space-y-4 mb-6 text-sm">
                 <div className="flex justify-between text-gray-600">
                   <span>Subtotal</span>
                   <span className="font-medium text-black">BDT {cartTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-gray-600">
                   <span>Delivery Charge</span>
                   <span className="font-medium text-black">BDT {deliveryCharge.toLocaleString()}</span>
                 </div>
               </div>
               
               <div className="border-t pt-6 mb-8">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-medium text-black">Total</span>
                   <span className="text-2xl font-bold text-black">BDT {total.toLocaleString()}</span>
                 </div>
                 <p className="text-xs text-gray-500 text-right">Including all taxes</p>
               </div>
               
               <Link to="/checkout" className="w-full bg-[var(--color-primary)] text-white h-14 flex items-center justify-center gap-2 font-medium uppercase tracking-widest text-sm hover:bg-black transition-colors shadow-lg hover:shadow-xl group">
                 Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <div className="mt-6 text-center text-xs text-gray-500">
                 Secure checkout powered by manual verification.
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
