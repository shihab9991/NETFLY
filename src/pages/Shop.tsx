import { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const { products, loading } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState('newest');

  const categories = ["All", "Suits", "T-Shirts", "Jackets", "Accessories", "Shoes"];

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (categoryParam && categoryParam !== 'All') {
      result = result.filter(p => p.category === categoryParam);
    }

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    }
    
    return result;
  }, [products, categoryParam, sort]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-100 py-16 text-center">
        <h1 className="text-4xl font-serif font-bold text-black mb-4">Shop Collection</h1>
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black">{categoryParam || 'All Products'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2 border-b pb-4">
                <Filter className="w-5 h-5" /> Filters
              </h3>
              
              <div className="mb-8">
                <h4 className="font-medium mb-4 text-sm tracking-wider uppercase text-gray-500">Categories</h4>
                <ul className="space-y-3 font-medium">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button 
                        onClick={() => handleCategoryChange(cat)}
                        className={`text-left w-full hover:text-[var(--color-primary)] transition-colors ${(categoryParam === cat || (!categoryParam && cat === 'All')) ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <p className="text-sm text-gray-500">Showing {filteredProducts.length} results</p>
              
              <div className="flex items-center gap-4">
                <button 
                  className="md:hidden flex items-center gap-2 text-sm font-medium border px-3 py-1.5"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filter
                </button>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium border px-4 py-2 hover:bg-neutral-50 transition-colors">
                    Sort: {sort === 'price-asc' ? 'Price Low to High' : sort === 'price-desc' ? 'Price High to Low' : 'Newest'}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                     <button onClick={() => setSort('newest')} className="block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50">Newest</button>
                     <button onClick={() => setSort('price-asc')} className="block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50">Price: Low to High</button>
                     <button onClick={() => setSort('price-desc')} className="block w-full text-left px-4 py-3 text-sm hover:bg-neutral-50">Price: High to Low</button>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-64">
                 <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
               </div>
            ) : filteredProducts.length === 0 ? (
               <div className="text-center py-24">
                 <h2 className="text-2xl font-medium text-gray-500 mb-4">No products found in this category.</h2>
                 <button onClick={() => handleCategoryChange('All')} className="text-[var(--color-primary)] underline underline-offset-4">Clear filters</button>
               </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={product.id} 
                      className="group flex flex-col"
                    >
                      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100 block">
                        <img 
                          src={Array.isArray(product.images) ? product.images[0] : ''} 
                          alt={product.title} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                        />
                        {product.discountPrice && (
                          <div className="absolute top-3 left-3 bg-[#e60000] text-white text-xs font-bold px-2 py-1">SALE</div>
                        )}
                      </Link>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 tracking-wider mb-1 uppercase">{product.category}</span>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-black font-medium text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{product.title}</h3>
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
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
