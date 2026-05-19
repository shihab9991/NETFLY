import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for MOCK databases since Firebase is not setup
  const db = {
    products: [
      { id: "1", title: "Premium Men's Suit", price: 15000, discountPrice: 12000, stock: 10, category: "Suits", images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=800"], sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy"], description: "Elegant suit perfect for all occasions. Crafted with the finest wool for a tailored fit.", specs: "100% Wool", rating: 4.5, reviews: [] },
      { id: "2", title: "Classic White T-Shirt", price: 1200, discountPrice: 900, stock: 50, category: "T-Shirts", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"], sizes: ["M", "L", "XL"], colors: ["White"], description: "Soft, breathable cotton tee for everyday wear.", specs: "100% Cotton", rating: 4.8, reviews: [] },
      { id: "3", title: "Leather Biker Jacket", price: 8500, discountPrice: 7500, stock: 15, category: "Jackets", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"], sizes: ["L", "XL", "XXL"], colors: ["Black", "Brown"], description: "Genuine leather jacket with a modern edge.", specs: "100% Leather", rating: 4.9, reviews: [] },
      { id: "4", title: "Oxford Dress Shoes", price: 5500, stock: 20, category: "Shoes", images: ["https://images.unsplash.com/photo-1614252322058-8b9a1a8e104b?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1614252235316-8b9a1a8e104b?auto=format&fit=crop&q=80&w=800"], sizes: ["40", "41", "42", "43", "44"], colors: ["Black", "Brown"], description: "Classic leather Oxford shoes for formal events.", specs: "Genuine Leather", rating: 4.6, reviews: [] },
      { id: "5", title: "Slim Fit Chinos", price: 2500, discountPrice: 2000, stock: 35, category: "Accessories", images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800"], sizes: ["30", "32", "34", "36"], colors: ["Beige", "Navy", "Olive"], description: "Versatile chinos that transition seamlessly from office to weekend.", specs: "98% Cotton, 2% Elastane", rating: 4.4, reviews: [] },
      { id: "6", title: "Minimalist Watch", price: 4500, stock: 8, category: "Accessories", images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"], sizes: ["One Size"], colors: ["Silver", "Black"], description: "A sleek, minimalist timepiece.", specs: "Stainless Steel", rating: 4.7, reviews: [] },
      { id: "7", title: "Denim Trucker Jacket", price: 4200, discountPrice: 3800, stock: 12, category: "Jackets", images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], sizes: ["M", "L", "XL"], colors: ["Blue", "Black"], description: "Classic denim jacket with a comfortable fit.", specs: "100% Cotton Denim", rating: 4.5, reviews: [] },
      { id: "8", title: "Silk Tie Collection", price: 1500, stock: 40, category: "Accessories", images: ["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=800"], sizes: ["One Size"], colors: ["Red", "Navy", "Black"], description: "Premium silk tie for the sharpest looks.", specs: "100% Silk", rating: 4.9, reviews: [] }
    ],
    orders: [],
    users: [],
    blogs: [
      {
        id: "1",
        title: "The Essential Guide to Men's Suits",
        content: "Everything you need to know about choosing the right suit for any occasion, from fabric selection to perfect fit...",
        image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&q=80&w=800",
        createdAt: "2026-10-15T10:00:00.000Z",
        author: "Admin",
        category: "Style Guide"
      },
      {
        id: "2",
        title: "Summer Wardrobe Essentials",
        content: "Beat the heat while staying sharp with these must-have summer clothing items for every modern man...",
        image: "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?auto=format&fit=crop&q=80&w=800",
        createdAt: "2026-09-02T10:00:00.000Z",
        author: "Admin",
        category: "Fashion Tips"
      },
      {
        id: "3",
        title: "How to Care for Leather Jackets",
        content: "A comprehensive guide to extending the life of your favorite leather jacket with proper maintenance...",
        image: "https://images.unsplash.com/photo-1489987707023-afc827ea80f6?auto=format&fit=crop&q=80&w=800",
        createdAt: "2026-08-20T10:00:00.000Z",
        author: "Admin",
        category: "Maintenance"
      }
    ],
    categories: ["Suits", "T-Shirts", "Jackets", "Accessories", "Shoes"]
  };

  // API Routes
  const apiRouter = express.Router();
  
  // Products API
  apiRouter.get("/products", (req, res) => {
    res.json(db.products);
  });

  apiRouter.post("/admin/products", (req, res) => {
    const productData = req.body;
    const newProduct = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
      reviews: []
    };
    db.products.push(newProduct);
    res.json({ success: true, product: newProduct });
  });

  apiRouter.put("/admin/products/:id", (req, res) => {
    const index = db.products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    db.products[index] = { ...db.products[index], ...req.body };
    res.json({ success: true, product: db.products[index] });
  });

  apiRouter.delete("/admin/products/:id", (req, res) => {
    const index = db.products.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    db.products.splice(index, 1);
    res.json({ success: true });
  });

  // Blogs API
  apiRouter.get("/blogs", (req, res) => {
    res.json(db.blogs);
  });

  apiRouter.post("/admin/blogs", (req, res) => {
    const newBlog = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    db.blogs.push(newBlog);
    res.json({ success: true, blog: newBlog });
  });

  apiRouter.put("/admin/blogs/:id", (req, res) => {
    const index = db.blogs.findIndex(b => b.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Blog not found" });
    db.blogs[index] = { ...db.blogs[index], ...req.body };
    res.json({ success: true, blog: db.blogs[index] });
  });

  apiRouter.delete("/admin/blogs/:id", (req, res) => {
    const index = db.blogs.findIndex(b => b.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Blog not found" });
    db.blogs.splice(index, 1);
    res.json({ success: true });
  });

  apiRouter.post("/checkout", (req, res) => {
    const orderData = req.body;
    const newOrder = {
      ...orderData,
      id: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "Payment Reviewing"
    };
    db.orders.push(newOrder);
    res.json({ success: true, order: newOrder });
  });

  apiRouter.get("/admin/stats", (req, res) => {
    const stats = {
      totalSales: db.orders.length,
      revenue: db.orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0),
      pendingOrders: db.orders.filter(o => o.status === "Payment Reviewing").length,
      users: db.users.length
    };
    res.json(stats);
  });
  
  apiRouter.get("/admin/orders", (req, res) => {
    res.json(db.orders);
  });

  apiRouter.patch("/admin/orders/:id", (req, res) => {
    const { status } = req.body;
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({error: "Not found"});
    order.status = status;
    res.json(order);
  });

  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
