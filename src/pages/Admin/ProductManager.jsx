import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { listenToCategories, DEFAULT_CATEGORIES } from '../../utils/categoryService';
import {
  Edit, Trash2, PlusCircle, Package, Star, Search,
  SlidersHorizontal, Ruler, BadgePercent, ArrowUpDown, Eye, EyeOff, LayoutGrid, List
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_STYLES = {
  'Air Conditioners':  { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-600' },
  'Televisions':     { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-600' },
  'Washing Machines': { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', dot: 'bg-pink-600' },
  'Refrigerators': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-600' },
  'Generators': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-600' },
  'Phones': { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', dot: 'bg-cyan-600' },
  'Laptops': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-200', dot: 'bg-fuchsia-600' },
  'Audio': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-600' },
  'Gaming': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-600' },
};

const defaultCat = { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };

function CategoryBadge({ category }) {
  const s = CATEGORY_STYLES[category] || defaultCat;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.08em]`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
      {category}
    </span>
  );
}

function ProductCard({ product, onDelete, onFeaturedToggle, onHiddenToggle }) {
  const hasSale = product.pss && Number(product.pss) > 0 && Number(product.pss) < Number(product.price);
  const discount = hasSale
    ? Math.round(100 - (Number(product.pss) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-lg-red/5 hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 flex flex-col relative overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1.5">
          {product.featured && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              <Star size={9} className="fill-amber-950" /> FEATURED {product.featuredPosition ? `#${product.featuredPosition}` : ''}
            </div>
          )}
          {product.is_hidden && (
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
              <EyeOff size={10} /> HIDDEN
            </div>
          )}
        </div>
        
        {hasSale && (
          <div className="bg-gradient-to-r from-lg-red to-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
            -{discount}%
          </div>
        )}
      </div>

      {/* Image */}
      <div className="h-48 bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-slate-100 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {product.img ? (
          <img
            src={product.img} alt={product.name} loading="lazy" decoding="async"
            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Package size={40} className="text-slate-300" />
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-3 relative z-10 bg-white">
        <CategoryBadge category={product.category} />

        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        <div className="flex flex-wrap gap-2 mt-1">
          {product.length && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-lg">
              <Ruler size={10} /> {product.length}
            </span>
          )}
          {product.inventory_status === 'out_of_stock' && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> OOS
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-2">
          {hasSale ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-lg-red">₦{Number(product.pss).toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400 line-through">₦{Number(product.price).toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-lg font-black text-slate-900">₦{Number(product.price).toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-2 bg-slate-50 border-t border-slate-100 grid grid-cols-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link
          to={`/admin/edit/${product.id}`}
          className="col-span-2 flex items-center justify-center gap-2 py-2 bg-white hover:bg-slate-900 text-slate-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-slate-900 transition-all shadow-sm hover:shadow-md"
        >
          <Edit size={12} /> Edit
        </Link>
        <button
          onClick={() => onFeaturedToggle(product.id)}
          title={product.featured ? "Unfeature" : "Feature"}
          className={`col-span-1 flex items-center justify-center py-2 rounded-xl border transition-all shadow-sm ${product.featured ? 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200' : 'bg-white border-slate-200 text-slate-400 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-200'}`}
        >
          <Star size={14} className={product.featured ? "fill-amber-500" : ""} />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          title="Delete"
          className="col-span-1 flex items-center justify-center py-2 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl border border-red-100 hover:border-red-200 transition-all shadow-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToCategories((catList) => {
      if (catList.length === 0) {
        setCategoriesList(DEFAULT_CATEGORIES.map(c => c.name));
      } else {
        const fetchedCats = catList.map(c => c.name);
        const allCats = new Set([...DEFAULT_CATEGORIES.map(c => c.name), ...fetchedCats]);
        setCategoriesList(Array.from(allCats));
      }
    });
    return () => unsubscribe();
  }, []);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let message = `⚠️ Delete "${product.name}"?\n\n`;
    if (product.featured) message += '🌟 This is a FEATURED product\n';
    message += `Price: ₦${Number(product.price).toLocaleString()}\n\nThis action cannot be undone.`;

    if (window.confirm(message)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleHiddenToggle = async (productId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'products', productId), { is_hidden: !currentStatus });
      setProducts(prev => prev.map(p => p.id === productId ? {...p, is_hidden: !currentStatus} : p));
      toast.success(`Product ${!currentStatus ? 'hidden' : 'visible'}`);
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleFeaturedToggle = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.featured) {
      if (window.confirm(`Remove "${product.name}" from featured products?`)) {
        try {
          await updateDoc(doc(db, 'products', productId), { featured: false, featuredPosition: null });
          setProducts(prev => prev.map(p => p.id === productId ? {...p, featured: false, featuredPosition: null} : p));
          toast.success('Removed from featured');
        } catch (error) {
          toast.error('Failed to update product');
        }
      }
    } else {
      const posInput = window.prompt(`Enter position for "${product.name}" (1 is highest).\nLeave blank to auto-add to the end.`);
      if (posInput === null) return;
      
      let pos = posInput.trim() === '' ? products.filter(p => p.featured).length + 1 : parseInt(posInput, 10);
      if (isNaN(pos) || pos < 1) return alert('Invalid position');

      try {
        await updateDoc(doc(db, 'products', productId), { featured: true, featuredPosition: pos });
        setProducts(prev => prev.map(p => p.id === productId ? {...p, featured: true, featuredPosition: pos} : p));
        toast.success('Added to featured');
      } catch (error) {
        toast.error('Failed to feature product');
      }
    }
  };

  const filtered = products
    .filter(p => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'All' ? true : (filterCat === 'Featured' ? p.featured : p.category === filterCat);
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (filterCat === 'Featured') return (a.featuredPosition ?? Infinity) - (b.featuredPosition ?? Infinity);
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });

  const stats = {
    total: products.length,
    featured: products.filter(p => p.featured).length,
    onSale: products.filter(p => p.pss && Number(p.pss) > 0 && Number(p.pss) < Number(p.price)).length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
      <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-lg-red"></i>
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Loading Catalog...</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
            Inventory <span className="text-lg-red">Manager</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Managing {products.length} products across your catalogue
          </p>
        </div>
        <Link
          to="/admin/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-lg-red text-white text-xs font-black px-6 py-3.5 rounded-2xl uppercase tracking-[0.15em] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
        >
          <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> Add New Product
        </Link>
      </div>

      {/* SaaS Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {[
          { label: 'Total Catalog', value: stats.total, icon: <Package size={24} />, bg: 'bg-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Featured Items', value: stats.featured, icon: <Star size={24} />, bg: 'bg-amber-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
          { label: 'Active Sales', value: stats.onSale, icon: <BadgePercent size={24} />, bg: 'bg-emerald-500', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:border-slate-200 transition-colors">
            <div className={`w-14 h-14 rounded-2xl ${s.iconBg} ${s.iconColor} flex items-center justify-center shrink-0`}>
              {s.icon}
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 leading-none mb-1">{s.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lg-red/20 focus:border-lg-red transition-all"
          />
        </div>

        {/* Categories (Scrollable) */}
        <div className="flex-1 w-full overflow-x-auto scrollbar-hide py-1 flex items-center gap-2 border-l border-r border-slate-100 px-4">
          <SlidersHorizontal size={14} className="text-slate-400 shrink-0 mr-2" />
          {['All', 'Featured', ...categoriesList.filter(c => c !== 'All')].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`shrink-0 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                filterCat === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative w-full lg:w-48 shrink-0">
          <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low - High</option>
            <option value="price-desc">Price: High - Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Package size={40} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No products found</h3>
          <p className="text-slate-500 mb-8 font-medium">
            {search || filterCat !== 'All' ? 'Try adjusting your search or filters.' : 'Your catalogue is empty. Add your first product to get started.'}
          </p>
          {!search && filterCat === 'All' && (
            <Link
              to="/admin/new"
              className="inline-flex items-center gap-2 bg-lg-red hover:bg-red-700 text-white text-xs font-black px-8 py-4 rounded-2xl uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PlusCircle size={16} /> Create Product
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDelete} 
              onFeaturedToggle={handleFeaturedToggle} 
              onHiddenToggle={handleHiddenToggle} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
