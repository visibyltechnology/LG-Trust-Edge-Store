import { useState, useEffect } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { isProductInStock, getStockDisplayText } from '../utils/inventoryService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

import { listenToBrands, DEFAULT_BRANDS } from '../utils/brandService';
import { listenToCategories, DEFAULT_CATEGORIES } from '../utils/categoryService';

function pathToCategory(pathname) {
    if (pathname.includes('phones')) return 'Phones';
    if (pathname.includes('laptops')) return 'Laptops';
    if (pathname.includes('gaming')) return 'Gaming';
    return null;
}

export default function Shop() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const urlCat = searchParams.get('cat') || searchParams.get('search') ? null : pathToCategory(location.pathname);
    
    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    
    // We can't synchronously know the initial category match until fetched, but we can set it anyway
    const [selectedCategories, setSelectedCategories] = useState(urlCat && urlCat !== 'All' ? [urlCat] : []);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ensure product has inventory fields
    const ensureInventoryFields = (product) => ({
        ...product,
        inventory_status: product.inventory_status || 'in_stock',
        items_left: product.items_left !== undefined ? product.items_left : 5,
        unlimited_stock: product.unlimited_stock || false,
        is_hidden: product.is_hidden || false
    });

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

    useEffect(() => {
        const unsubscribe = listenToBrands((brandList) => {
            if (brandList.length === 0) {
                setBrandsList(DEFAULT_BRANDS.map(b => b.name));
            } else {
                const fetchedBrands = brandList.map(b => b.name);
                const allBrands = new Set([...DEFAULT_BRANDS.map(b => b.name), ...fetchedBrands]);
                setBrandsList(Array.from(allBrands).sort());
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'products'), where('is_hidden', '!=', true));
                const querySnapshot = await getDocs(q);
                let items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() });
                });
                
                // Fallback to fetch all if where clause causes index issues before index is built
                if (items.length === 0 && !querySnapshot.empty) {
                     items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(item => !item.is_hidden);
                }

                setProducts(items.map(ensureInventoryFields));
            } catch (error) {
                console.error("Error fetching products:", error);
                try {
                     // Fallback without query if where clause fails
                     const snap = await getDocs(collection(db, 'products'));
                     let items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter(item => !item.is_hidden);
                     setProducts(items.map(ensureInventoryFields));
                } catch(fallbackError) {
                     console.error("Fallback fetch failed", fallbackError);
                     setProducts([]);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const cat = searchParams.get('cat') || pathToCategory(location.pathname);
        if (cat) {
            if (cat !== 'All') {
                setSelectedCategories([cat]);
            }
            setSearch('');
        }
        
        const searchQ = searchParams.get('search');
        if (searchQ) {
            setSearch(searchQ);
            setSelectedCategories([]);
        }
    }, [location.search, location.pathname, searchParams]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedCategories, selectedBrands]);

    const filtered = products.filter(p => {
        const matchCat = selectedCategories.length === 0 || selectedCategories.includes(p.category);
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
        const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
        const searchableText = `${p.name || ''} ${p.brand || ''} ${p.category || ''} ${p.description || ''} ${p.tag || ''}`.toLowerCase();
        const matchSearch = searchTerms.length === 0 || searchTerms.every(term => searchableText.includes(term));
        return matchCat && matchBrand && matchSearch;
    });

    const itemsPerPage = 120;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
        <main className="bg-[#F8FAFC] flex-grow min-h-screen selection:bg-lg-red selection:text-white flex flex-col">
            {/* Stunning Page Header */}
            <div className="relative bg-slate-900 pt-16 pb-24 overflow-hidden border-b border-white/10">
                {/* Abstract Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lg-red/20 blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="w-full md:w-2/3 animate-fade-in-up">
                            <span className="text-lg-red text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                <i className="fas fa-bolt"></i> Premium Selection
                            </span>
                            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-[1.1]">
                                {search ? `Search: ${search}` : selectedCategories.length === 1 ? selectedCategories[0] : 'Discover Excellence'}
                            </h1>
                            <p className="text-sm md:text-base text-slate-400 mt-4 font-medium max-w-xl leading-relaxed">
                                Curated home appliances and electronics designed to elevate your living experience. 100% genuine guaranteed.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 relative group animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-lg-red to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search the collection..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 focus:border-white/40 focus:bg-white/20 rounded-3xl py-4 pl-12 pr-5 outline-none transition-all font-bold text-sm text-white placeholder-slate-300 shadow-2xl"
                                />
                                <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 flex flex-col lg:flex-row gap-8 pb-20 w-full flex-1">
                {/* Floating Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-5 sticky top-24">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-4 px-2">
                            Categories
                        </div>
                        <div className="space-y-3 mb-8 px-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {categoriesList.filter(c => c !== 'All').map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 group-hover:border-lg-red transition-colors bg-white">
                                        <input 
                                            type="checkbox" 
                                            className="opacity-0 absolute inset-0 cursor-pointer"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedCategories(prev => [...prev, cat]);
                                                } else {
                                                    setSelectedCategories(prev => prev.filter(c => c !== cat));
                                                }
                                            }}
                                        />
                                        {selectedCategories.includes(cat) && <i className="fas fa-check text-[10px] text-lg-red"></i>}
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-lg-dark transition-colors">{cat}</span>
                                </label>
                            ))}
                        </div>

                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-4 px-2">
                            Brands
                        </div>
                        <div className="space-y-3 px-2 max-h-60 overflow-y-auto custom-scrollbar">
                            {brandsList.map(brand => (
                                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-300 group-hover:border-lg-red transition-colors bg-white">
                                        <input 
                                            type="checkbox" 
                                            className="opacity-0 absolute inset-0 cursor-pointer"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedBrands(prev => [...prev, brand]);
                                                } else {
                                                    setSelectedBrands(prev => prev.filter(b => b !== brand));
                                                }
                                            }}
                                        />
                                        {selectedBrands.includes(brand) && <i className="fas fa-check text-[10px] text-lg-red"></i>}
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-lg-dark transition-colors">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Product Grid */}
                <div className="flex-1">
                    <div className="bg-white/60 backdrop-blur-md border border-white p-2 pl-5 pr-2 rounded-2xl mb-8 flex justify-between items-center shadow-sm animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{filtered.length}</span> results
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider hidden sm:block">Sort by</span>
                            <select className="bg-white border border-slate-100 text-slate-700 py-2.5 px-4 outline-none text-xs font-bold rounded-xl shadow-sm focus:border-lg-red focus:ring-2 focus:ring-lg-red/10 transition-all cursor-pointer">
                                <option>Popularity</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 h-96 animate-pulse shadow-sm">
                                    <div className="w-full h-48 bg-slate-50 rounded-2xl mb-4"></div>
                                    <div className="h-3 bg-slate-100 w-1/4 rounded-full mb-3"></div>
                                    <div className="h-4 bg-slate-200 w-3/4 rounded-full mb-2"></div>
                                    <div className="h-4 bg-slate-100 w-1/2 rounded-full mb-6"></div>
                                    <div className="h-12 bg-slate-50 rounded-2xl w-full mt-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center shadow-sm flex flex-col items-center animate-fade-in">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <i className="fas fa-box-open text-4xl text-slate-300"></i>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Nothing found here</h3>
                            <p className="text-slate-500 mb-8 font-medium max-w-sm">We couldn't find any products matching your current filters or search terms.</p>
                            <button 
                                onClick={() => { setSearch(''); setSelectedCategories([]); setSelectedBrands([]); }}
                                className="bg-slate-900 hover:bg-lg-red text-white font-black py-4 px-8 rounded-2xl uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {currentItems.map((p, idx) => (
                                <div 
                                    key={p.id} 
                                    onClick={() => navigate(`/products/${p.id}`)}
                                    className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100 overflow-hidden relative animate-fade-in-up"
                                    style={{ animationDelay: `${0.05 * (idx % 6)}s` }}
                                >
                                    {/* Product Badges */}
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start pointer-events-none">
                                        {p.featured && (
                                            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                                                <i className="fas fa-bolt"></i> Hot
                                            </span>
                                        )}
                                        {p.tag && (
                                            <span className="bg-slate-900/90 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-md">
                                                {p.tag}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Image Container */}
                                    <div className="relative p-6 h-64 flex items-center justify-center bg-slate-50/50 group-hover:bg-slate-50 transition-colors duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-multiply filter group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-700 ease-out" />
                                    </div>
                                    
                                    {/* Content Container */}
                                    <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white z-10 relative">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-lg-red transition-colors">
                                            {p.brand || 'Official Partner'}
                                        </p>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight line-clamp-2 mb-4">
                                            {p.name}
                                        </h3>
                                        
                                        <div className="mt-auto">
                                            {/* Inventory Status */}
                                            <div className="mb-4">
                                                {isProductInStock(p) ? (
                                                    <span className="inline-flex items-center gap-1.5 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {getStockDisplayText(p)}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-red-500 text-[9px] font-black uppercase tracking-widest">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {getStockDisplayText(p)}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Price & Action */}
                                            <div className="flex items-end justify-between gap-2">
                                                <div className="flex flex-col">
                                                    {Number(p.oldPrice) > 0 && (
                                                        <span className="text-[10px] text-slate-400 line-through font-bold mb-0.5">
                                                            ₦{Number(p.oldPrice).toLocaleString()}
                                                        </span>
                                                    )}
                                                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                                        ₦{Number(p.price).toLocaleString()}
                                                    </span>
                                                </div>
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/products/${p.id}`); }}
                                                    disabled={!isProductInStock(p)}
                                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                                                        isProductInStock(p) 
                                                        ? 'bg-lg-dark text-white hover:bg-lg-red group-hover:scale-110 group-hover:shadow-lg' 
                                                        : 'bg-slate-50 text-slate-300 cursor-not-allowed shadow-none'
                                                    }`}
                                                >
                                                    <i className={`fas fa-shopping-cart text-sm ${!isProductInStock(p) && 'opacity-50'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-12 mb-8">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 hover:border-slate-900 text-slate-600 hover:text-slate-900 rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-100"
                            >
                                <i className="fas fa-chevron-left text-xs"></i>
                            </button>
                            <div className="flex gap-1.5">
                                {Array.from({length: totalPages}).map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className={`w-10 h-10 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 hover:border-slate-900 text-slate-600 hover:text-slate-900 rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-100"
                            >
                                <i className="fas fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
