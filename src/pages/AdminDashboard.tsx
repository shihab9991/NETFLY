import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Menu, FileText, X, Eye, Plus, Edit2, Trash2, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'shihab admin' && password === '#Dot+999') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
        <div className="bg-white p-8 max-w-md w-full shadow-lg border border-neutral-200 rounded-sm">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-serif font-bold text-black mb-2">Admin Login</h1>
             <p className="text-sm text-gray-500">Enter your credentials to access the dashboard</p>
          </div>
          {errorMsg && <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-sm text-sm text-center">{errorMsg}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-black transition-all" />
            </div>
            <button type="submit" className="w-full bg-black text-white h-12 font-medium uppercase tracking-widest text-sm hover:bg-[var(--color-primary)] transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 absolute inset-0 z-[100]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-black text-white flex flex-col fixed h-full shadow-xl z-50 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
           <span className="text-2xl font-serif font-bold tracking-tighter">
              NETFLIY<span className="text-[var(--color-primary)]">.</span>
           </span>
           <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-white" />
           </button>
        </div>
        <div className="flex-1 py-8 flex flex-col gap-2 px-4 overflow-y-auto">
          {menu.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${active ? 'bg-[var(--color-primary)] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-5 h-5" /> {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 w-full rounded-sm transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col w-full min-h-screen">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 border-b">
           <div className="flex items-center gap-4">
             <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
               <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-xl font-medium text-black">Admin Panel</h2>
           </div>
           <div className="flex items-center gap-4">
             <span className="text-sm font-medium bg-neutral-100 px-3 py-1 rounded-full text-gray-600">Admin</span>
           </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardReview />} />
            <Route path="/orders" element={<OrdersReview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/blogs" element={<BlogManagement />} />
            <Route path="/customers" element={<div className="bg-white p-6 rounded-sm shadow-sm">Customer Management Coming Soon</div>} />
            <Route path="/settings" element={<div className="bg-white p-6 rounded-sm shadow-sm">Settings Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DashboardReview() {
  const [stats, setStats] = useState({ totalSales: 0, revenue: 0, pendingOrders: 0, users: 0 });

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 bg-white lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100">
           <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Revenue</div>
           <div className="text-2xl md:text-3xl font-bold text-black">BDT {stats.revenue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100">
           <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Orders</div>
           <div className="text-2xl md:text-3xl font-bold text-black">{stats.totalSales}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100">
           <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Pending Orders</div>
           <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{stats.pendingOrders}</div>
        </div>
        <div className="bg-white p-6 rounded-sm shadow-sm border border-neutral-100">
           <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wider">Total Users</div>
           <div className="text-2xl md:text-3xl font-bold text-black">{stats.users}</div>
        </div>
      </div>
    </div>
  );
}

function OrdersReview() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = () => {
    axios.get('/api/admin/orders').then(res => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await axios.patch(`/api/admin/orders/${id}`, { status });
    fetchOrders();
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border border-neutral-100 rounded-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-black">Order Management</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-neutral-50 text-gray-500 text-sm uppercase tracking-wider font-medium border-y">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Trx ID</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="py-4 px-4 font-medium text-black">{order.id}</td>
                <td className="py-4 px-4 text-gray-600">
                  {order.fullName}<br/>
                  <span className="text-xs text-gray-400">{order.phone}</span>
                </td>
                <td className="py-4 px-4 font-mono text-gray-600 uppercase tracking-widest">{order.transactionId}</td>
                <td className="py-4 px-4 font-medium">BDT {order.totalAmount?.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    order.status === 'Payment Reviewing' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 flex gap-2 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-gray-300 px-2 py-1 text-sm bg-white"
                  >
                    <option value="Payment Reviewing">Reviewing</option>
                    <option value="Confirmed">Confirm</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Rejected">Reject</option>
                  </select>
                  <button onClick={() => setSelectedOrder(order)} className="p-1 text-gray-500 hover:text-black">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-gray-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Order Details - {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)}><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Info</p>
                <p className="font-medium">{selectedOrder.fullName}</p>
                <p>{selectedOrder.email}</p>
                <p>{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                <p className="font-medium">{selectedOrder.address}</p>
                <p>{selectedOrder.city}, {selectedOrder.zipCode}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Order Items</p>
              <div className="border border-gray-200 rounded-sm divide-y">
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                      </div>
                    </div>
                    <p className="font-medium">BDT {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-sm">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-bold text-[var(--color-primary)]">BDT {selectedOrder.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="mt-6 flex justify-end">
              <select 
                value={selectedOrder.status}
                onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                className="border border-gray-300 px-4 py-2 font-medium bg-white"
              >
                <option value="Payment Reviewing">Payment Reviewing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', price: '', discountPrice: '', stock: '', category: '', images: '', description: '', sizes: '', colors: ''
  });

  const fetchProducts = () => {
    axios.get('/api/products').then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (isEditing) {
      await axios.put(`/api/admin/products/${isEditing.id}`, payload);
    } else {
      await axios.post('/api/admin/products', payload);
    }
    setShowForm(false);
    setIsEditing(null);
    setFormData({ title: '', price: '', discountPrice: '', stock: '', category: '', images: '', description: '', sizes: '', colors: '' });
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setIsEditing(p);
    setFormData({
      title: p.title || '',
      price: p.price ? p.price.toString() : '',
      discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
      stock: p.stock ? p.stock.toString() : '',
      category: p.category || '',
      images: Array.isArray(p.images) ? p.images.join(', ') : '',
      description: p.description || '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    // iframe constraint: window.confirm may be blocked
    await axios.delete(`/api/admin/products/${id}`);
    fetchProducts();
  };

  return (
     <div className="bg-white p-4 md:p-6 shadow-sm border border-neutral-100 rounded-sm relative">
       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
         <h3 className="text-xl font-bold text-black">Product Management</h3>
         <button onClick={() => { setIsEditing(null); setShowForm(true); }} className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium rounded-sm">
           <Plus className="w-4 h-4"/> Add Product
         </button>
       </div>

       {showForm && (
         <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Product</h3>
              <button type="button" onClick={() => setShowForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full border px-3 py-2"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input required type="number" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} className="w-full border px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Discount Price</label>
                  <input type="number" value={formData.discountPrice} onChange={e=>setFormData({...formData, discountPrice: e.target.value})} className="w-full border px-3 py-2"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} className="w-full border px-3 py-2"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className="w-full border px-3 py-2"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Sizes (comma separated)</label>
                  <input type="text" value={formData.sizes} onChange={e=>setFormData({...formData, sizes: e.target.value})} className="w-full border px-3 py-2" placeholder="S, M, L"/>
                </div>
                <div>
                  <label className="block text-sm mb-1">Colors (comma separated)</label>
                  <input type="text" value={formData.colors} onChange={e=>setFormData({...formData, colors: e.target.value})} className="w-full border px-3 py-2" placeholder="Black, White"/>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Images (comma separated URLs)</label>
                <input required type="text" value={formData.images} onChange={e=>setFormData({...formData, images: e.target.value})} className="w-full border px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full border px-3 py-2"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white py-3 mt-4">Save Product</button>
            </form>
          </div>
         </div>
       )}

       <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[700px]">
           <thead>
             <tr className="bg-neutral-50 text-gray-500 text-sm border-y">
               <th className="py-3 px-4">Product</th>
               <th className="py-3 px-4">Price</th>
               <th className="py-3 px-4">Stock</th>
               <th className="py-3 px-4">Category</th>
               <th className="py-3 px-4">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y">
             {products.map(p => (
               <tr key={p.id}>
                 <td className="py-3 px-4 flex items-center gap-3">
                   <img src={Array.isArray(p.images) ? p.images[0] : ''} alt={p.title} className="w-10 h-10 object-cover rounded-sm bg-gray-100"/>
                   <span className="font-medium text-sm">{p.title}</span>
                 </td>
                 <td className="py-3 px-4 text-sm">BDT {p.price}</td>
                 <td className="py-3 px-4 text-sm">{p.stock}</td>
                 <td className="py-3 px-4 text-sm">{p.category}</td>
                 <td className="py-3 px-4">
                   <div className="flex items-center gap-2">
                     <button onClick={() => handleEdit(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                     <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
  );
}

function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', image: '', author: '' });

  const fetchBlogs = () => {
    axios.get('/api/blogs').then(res => setBlogs(res.data));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`/api/admin/blogs/${isEditing.id}`, formData);
    } else {
      await axios.post('/api/admin/blogs', formData);
    }
    setShowForm(false);
    setIsEditing(null);
    setFormData({ title: '', content: '', image: '', author: ''});
    fetchBlogs();
  };

  const handleEdit = (b: any) => {
    setIsEditing(b);
    setFormData({
      title: b.title,
      content: b.content,
      image: b.image,
      author: b.author
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    // iframe constraint: window.confirm may be blocked
    await axios.delete(`/api/admin/blogs/${id}`);
    fetchBlogs();
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border border-neutral-100 rounded-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
         <h3 className="text-xl font-bold text-black">Blog Management</h3>
         <button onClick={() => { setIsEditing(null); setFormData({ title: '', content: '', image: '', author: ''}); setShowForm(true); }} className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium rounded-sm">
           <Plus className="w-4 h-4"/> Add Blog Post
         </button>
      </div>

      {showForm && (
         <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit' : 'Add'} Blog Post</h3>
              <button type="button" onClick={() => setShowForm(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full border px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Image URL</label>
                <input required type="text" value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} className="w-full border px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Author</label>
                <input required type="text" value={formData.author} onChange={e=>setFormData({...formData, author: e.target.value})} className="w-full border px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <textarea required rows={5} value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} className="w-full border px-3 py-2"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white py-3 mt-4">Save Post</button>
            </form>
          </div>
         </div>
      )}

      <div className="overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[700px]">
           <thead>
             <tr className="bg-neutral-50 text-gray-500 text-sm border-y">
               <th className="py-3 px-4">Post</th>
               <th className="py-3 px-4">Author</th>
               <th className="py-3 px-4">Date</th>
               <th className="py-3 px-4">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y">
             {blogs.map(b => (
               <tr key={b.id}>
                 <td className="py-3 px-4 flex items-center gap-3">
                   <img src={b.image} alt="" className="w-12 h-10 object-cover rounded-sm"/>
                   <span className="font-medium text-sm line-clamp-1">{b.title}</span>
                 </td>
                 <td className="py-3 px-4 text-sm">{b.author}</td>
                 <td className="py-3 px-4 text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                 <td className="py-3 px-4">
                   <div className="flex items-center gap-2">
                     <button onClick={() => handleEdit(b)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                     <button onClick={() => handleDelete(b.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                   </div>
                 </td>
               </tr>
             ))}
             {blogs.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-gray-500">No blog posts found</td></tr>}
           </tbody>
         </table>
      </div>
    </div>
  );
}
