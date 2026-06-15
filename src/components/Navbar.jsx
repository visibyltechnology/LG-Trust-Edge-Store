import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { label: 'All Categories', icon: 'fa-th-large', link: '/products' },
    { label: 'Air Conditioners', icon: 'fa-wind', link: '/products?cat=Air%20Conditioners' },
    { label: 'Televisions', icon: 'fa-tv', link: '/products?cat=Televisions' },
    { label: 'Refrigerators', icon: 'fa-temperature-low', link: '/products?cat=Refrigerators' },
    { label: 'Generators', icon: 'fa-bolt', link: '/products?cat=Generators' },
    { label: 'Washing Machines', icon: 'fa-soap', link: '/products?cat=Washing%20Machines' },
    { label: 'Phones & Tablets', icon: 'fa-mobile-screen-button', link: '/products?cat=Phones' },
];

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [tickerText, setTickerText] = useState(
        '🌟 Welcome to LG Trust Edge — Experience the Future of Home Appliances!   🛒 Enjoy 10% Off Your First Purchase — Use Code: TRUST10   🚀 Fast & Reliable Nationwide Delivery Guaranteed!'
    );
    const { user, isAdmin, logout } = useAuthStore();
    const { getTotalItems } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Automatically close the mobile menu drawer on route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    // Handle background shifts smoothly during window scrolling
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Fetch site alert text data arrays dynamically from Cloud Firestore
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'site_settings'));
                if (docSnap.exists() && docSnap.data().tickerMessages) {
                    setTickerText(docSnap.data().tickerMessages.join('     |     '));
                }
            } catch (e) { /* silent catch fallback to default text state */ }
        };
        fetchSettings();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            setMobileOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Signed out successfully');
        setMobileOpen(false);
    };

    const cartCount = getTotalItems();

    return (
        <>
            {/* ── Modern Floating Glassmorphic Header ── */}
            <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'pt-2 pb-2 backdrop-blur-md bg-white/50' : 'pt-4 pb-4'}`}>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                    
                    {/* Ticker Pill */}
                    <div className={`hidden md:flex mx-auto w-full max-w-2xl lg:max-w-4xl items-center gap-3 bg-lg-dark/95 text-white px-5 rounded-full shadow-lg border border-white/10 overflow-hidden transition-all duration-300 animate-fade-in-up ${scrolled ? 'h-0 opacity-0 py-0 mb-0 pointer-events-none border-transparent' : 'h-[28px] opacity-100 py-1.5 mb-3'}`}>
                        <i className="fas fa-bolt text-lg-red animate-pulse flex-shrink-0"></i>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] animate-marquee whitespace-nowrap overflow-hidden">
                            {tickerText}
                        </div>
                    </div>

                    {/* Main Navbar Pill */}
                    <header className="w-full bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full flex items-center justify-between px-5 md:px-8 py-3.5 transition-all duration-300 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <img src="/logo.png" alt="LG Trust Edge - Electronics Store Ikorodu" className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105" />
                        </Link>

                        {/* Desktop Middle Links (Scrollable on smaller screens) */}
                        <div className="hidden lg:flex items-center justify-center flex-1 px-2 xl:px-8 overflow-hidden min-w-0">
                            <div className="flex items-center gap-1 bg-slate-50/80 p-1 rounded-full border border-slate-100 overflow-x-auto hide-scrollbar max-w-full">
                                {CATEGORIES.slice(0, 5).map((cat) => (
                                    <Link
                                        key={cat.label}
                                        to={cat.link}
                                        className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full text-[9px] xl:text-[10px] font-black text-slate-500 hover:text-lg-red hover:bg-white uppercase tracking-[0.1em] transition-all hover:shadow-sm"
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 sm:gap-5">
                            {/* Compact Search */}
                            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-100/80 hover:bg-slate-200/80 rounded-full px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-lg-red/30 focus-within:bg-white w-48 xl:w-64">
                                <i className="fas fa-search text-slate-400 text-xs"></i>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-bold px-3 text-slate-700 placeholder-slate-400"
                                    placeholder="Search products..."
                                />
                            </form>

                            {/* Icons */}
                            <div className="flex items-center gap-2 sm:gap-3 pl-0 sm:pl-2 sm:border-l sm:border-slate-200">
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <div className="hidden sm:block">
                                            <NotificationBell userId={user.uid} />
                                        </div>
                                        <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-lg-red hover:text-white transition-colors text-slate-600 shadow-sm btn-press">
                                            <i className="fas fa-user text-sm"></i>
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/admin" className="hidden sm:flex w-10 h-10 rounded-full bg-slate-900 text-white items-center justify-center hover:bg-lg-red transition-colors shadow-sm btn-press">
                                                <i className="fas fa-shield-alt text-sm"></i>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Sign In Pill */}
                                        <Link to="/login" className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-lg-red text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md btn-press">
                                            Sign In
                                        </Link>
                                        {/* Mobile Sign In Icon */}
                                        <Link to="/login" className="sm:hidden w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-lg-red hover:text-white transition-colors text-slate-600 shadow-sm btn-press">
                                            <i className="fas fa-user text-sm"></i>
                                        </Link>
                                    </>
                                )}

                                {!isAdmin && (
                                    <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-slate-800 hover:bg-lg-red hover:text-white hover:border-lg-red transition-all shadow-sm btn-press">
                                        <i className="fas fa-shopping-bag text-sm"></i>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-lg-dark text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Hamburger */}
                                <button
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-800 hover:bg-slate-200 transition-colors btn-press"
                                >
                                    <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars-staggered'} text-sm`}></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Mobile Search */}
                    <div className="md:hidden w-full px-1 animate-fade-in">
                        <form onSubmit={handleSearch} className="flex bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden px-4 py-3.5 focus-within:border-lg-red focus-within:ring-2 focus-within:ring-red-50">
                            <i className="fas fa-search text-slate-400 text-sm mt-0.5"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm font-bold px-3 text-slate-800 placeholder-slate-400"
                                placeholder="Search products..."
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Responsive Screen Full Drawer Sidebar Menu Portal ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setMobileOpen(false)}>
                    <div
                        className="bg-white w-[290px] h-full shadow-2xl flex flex-col animate-slide-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header (Fixed) */}
                        <div className="p-5 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                            <div className="font-sans font-black tracking-tighter leading-none select-none flex items-center">
                                <img src="/logo.png" alt="LG Trust Edge" className="h-8 w-auto" />
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-lg-red transition-colors btn-press">
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>

                        {/* Drawer Main Content (Scrollable) */}
                        <div className="p-5 space-y-6 flex-1 overflow-y-auto scrollbar-none">
                            {/* Section Authentication */}
                            <div>
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <i className="fas fa-user text-lg-red text-sm"></i>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</div>
                                                <div className="text-xs font-bold text-slate-800 truncate">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-xs active:bg-slate-200 transition-colors">
                                                <i className="fas fa-user-circle text-sm"></i> My Profile
                                            </Link>
                                            {isAdmin ? (
                                                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-xs active:bg-slate-800 transition-colors">
                                                    <i className="fas fa-shield-alt text-sm"></i> Admin Dashboard
                                                </Link>
                                            ) : (
                                                <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-50 text-lg-red py-2.5 rounded-xl font-semibold text-xs transition-colors active:bg-red-100">
                                                    <i className="fas fa-sign-out-alt text-sm"></i> Sign Out
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center border border-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold text-xs bg-white shadow-sm" >
                                            Login
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center bg-lg-red text-white py-2.5 rounded-xl font-semibold text-xs shadow-sm" >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Section Categories */}
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 px-1">Browse Categories</div>
                                <div className="flex flex-col gap-1.5 pb-4">
                                    {CATEGORIES.map((cat) => (
                                        <Link
                                            key={cat.label}
                                            to={cat.link}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all text-sm font-semibold text-slate-700 group"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-red-50 flex items-center justify-center shadow-sm transition-colors flex-shrink-0">
                                                <i className={`fas ${cat.icon} text-slate-400 group-hover:text-lg-red text-xs`}></i>
                                            </div>
                                            <span className="text-xs text-slate-700 font-semibold group-hover:text-lg-red transition-colors">{cat.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer (Fixed) */}
                        <div className="p-4 border-t border-gray-100 bg-slate-50 flex-shrink-0">
                            <Link to="/products" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md active:scale-[0.98] transition-transform">
                                <i className="fas fa-fire text-xs animate-bounce"></i> Hot Deals 🔥
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}