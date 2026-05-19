import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  
  const deliveryCharge = 80;
  const total = cartTotal + (cart.length > 0 ? deliveryCharge : 0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    division: '',
    district: '',
    transactionId: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/checkout', {
        ...formData,
        totalAmount: total,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor
        }))
      });
      
      const data = response.data;
      
      if (data.success) {
        setSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Order failed", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
        <h1 className="text-4xl font-serif font-bold text-black mb-4">Order Received!</h1>
        <p className="text-gray-500 mb-2 max-w-md text-center text-lg">Thank you for your purchase.</p>
        <p className="text-gray-500 mb-8 max-w-md text-center">Once your order is confirmed, you will receive your product within 4 days. Thank you!</p>
        <Link to="/shop" className="bg-black text-white px-8 py-4 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return <div className="p-24 text-center text-xl">Your cart is empty.</div>;
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 shadow-sm border border-neutral-100">
              <h2 className="text-2xl font-serif font-bold text-black mb-8 pb-4 border-b">Shipping & Payment Details</h2>
              {errorMsg && <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-sm text-sm text-center">{errorMsg}</div>}
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50" placeholder="+880 1..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50" placeholder="House/Flat No, Street Name, Area..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Division *</label>
                    <select required name="division" value={formData.division} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50">
                      <option value="">Select Division</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50" placeholder="Dhaka" />
                  </div>
                </div>

                <div className="mt-12 bg-red-50 border border-red-200 p-6 rounded-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-8 object-contain" />
                    <h3 className="text-lg font-bold text-[#e60000]">Nagad Manual Payment</h3>
                  </div>
                  <p className="text-black font-medium leading-relaxed mb-6">
                    To confirm your order, please send <span className="text-[#e60000] font-bold">80 BDT</span> delivery charge via NAGAD Send Money to:<br/>
                    <span className="text-2xl font-bold tracking-wider mt-2 block">01788331881</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-6 italic">
                    After payment, submit your transaction ID below. Your order will be reviewed by admin and confirmed after payment verification.
                  </p>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Nagad Transaction ID *</label>
                    <input required type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="w-full border-2 border-[#e60000]/30 px-4 py-3 focus:outline-none focus:border-[#e60000] transition-all font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal bg-white" placeholder="e.g. 7A9B8C6D" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-neutral-50" placeholder="Notes about your order, e.g. special notes for delivery." />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 shadow-sm border border-neutral-100 sticky top-24">
              <h3 className="text-xl font-serif font-bold text-black mb-6 pb-4 border-b">Your Order</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0 relative">
                      <img src={Array.isArray(item.images) ? item.images[0] : ''} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-black line-clamp-2 mb-1">{item.title}</h4>
                      <div className="text-xs text-gray-500 mb-1">
                        {item.selectedSize} / {item.selectedColor}
                      </div>
                      <div className="text-sm font-medium text-black">
                        BDT {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t py-4 space-y-3 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">BDT {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-medium text-[#e60000]">BDT {deliveryCharge.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center bg-neutral-50 px-4 py-3 rounded-sm border border-neutral-200">
                  <span className="font-bold text-black text-lg">Total</span>
                  <span className="text-2xl font-bold text-[#e60000]">BDT {total.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                form="checkout-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white h-14 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
              
              <div className="mt-6 flex items-start gap-3 mt-6 text-xs text-gray-500 bg-gray-50 p-4 border border-gray-100 rounded-sm">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600" />
                <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
