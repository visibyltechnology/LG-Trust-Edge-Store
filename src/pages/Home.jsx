import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PopularSearches from '../components/PopularSearches';

/* ─────────────────────────────────────────────────
   DEFAULT DATA
───────────────────────────────────────────────── */
const DEFAULT_SLIDES = [
    {
        id: 1,
        title: "Upgrade Your Living Space",
        subtitle: "Premium Air Conditioners, Televisions & Home Appliances from world-class brands.",
        buttonText: "Shop Appliances",
        link: "/products",
        image: "https://images.pexels.com/photos/3587620/pexels-photo-3587620.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "New Arrivals",
    },
    {
        id: 2,
        title: "Massive TV Clearance",
        subtitle: "Get up to 30% off on Smart 4K UHD Televisions — Limited Stock Available.",
        buttonText: "View TV Deals",
        link: "/products?cat=Televisions",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Hot Sale 🔥",
    },
    {
        id: 3,
        title: "Beat the Heat",
        subtitle: "Inverter ACs built for maximum cooling and low energy consumption.",
        buttonText: "Shop Air Conditioners",
        link: "/products?cat=Air%20Conditioners",
        image: "https://images.pexels.com/photos/2581274/pexels-photo-2581274.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Authorized Dealer",
    },
    {
        id: 4,
        title: "Power Your Home",
        subtitle: "Reliable generators and solar solutions for uninterrupted power supply.",
        buttonText: "Explore Generators",
        link: "/products?cat=Generators",
        image: "https://images.pexels.com/photos/159358/electric-pole-sunset-lamp-159358.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Fast Moving",
    },
    {
        id: 5,
        title: "Modern Kitchen Essentials",
        subtitle: "Double door refrigerators and chest freezers for every home.",
        buttonText: "Shop Refrigerators",
        link: "/products?cat=Refrigerators",
        image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Best Deal",
    },
    {
        id: 6,
        title: "Laundry Made Easy",
        subtitle: "Top load and front load washing machines — fast, efficient & affordable.",
        buttonText: "Shop Washing Machines",
        link: "/products?cat=Washing%20Machines",
        image: "https://images.pexels.com/photos/6194131/pexels-photo-6194131.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Top Seller",
    },
    {
        id: 7,
        title: "Next-Gen Gaming & Audio",
        subtitle: "Consoles, soundbars, and home theater systems for the ultimate experience.",
        buttonText: "Discover Gaming",
        link: "/products?cat=Gaming",
        image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=format&fit=crop&w=1920&q=80",
        badge: "Premium",
    },
];



const CATEGORIES = [
    { label: 'Laptops',        icon: 'fa-laptop',                 link: '/products?cat=Laptops',          color: 'from-blue-500 to-blue-700' },
    { label: 'Smartphones',    icon: 'fa-mobile-screen-button',   link: '/products?cat=Phones',           color: 'from-purple-500 to-purple-700' },
    { label: 'Televisions',    icon: 'fa-tv',                     link: '/products?cat=Televisions',      color: 'from-lg-red to-red-700' },
    { label: 'Headphones',     icon: 'fa-headphones',             link: '/products?cat=Audio',            color: 'from-gray-700 to-gray-900' },
    { label: 'Gaming',         icon: 'fa-gamepad',                link: '/products?cat=Gaming',           color: 'from-green-500 to-green-700' },
    { label: 'Cameras',        icon: 'fa-camera',                 link: '/products?cat=Cameras',          color: 'from-amber-500 to-amber-700' },
    { label: 'Air Conditioners', icon: 'fa-wind',                link: '/products?cat=Air%20Conditioners', color: 'from-cyan-500 to-cyan-700' },
    { label: 'Refrigerators',  icon: 'fa-temperature-low',        link: '/products?cat=Refrigerators',    color: 'from-teal-500 to-teal-700' },
    { label: 'Generators',     icon: 'fa-bolt',                   link: '/products?cat=Generators',       color: 'from-yellow-500 to-yellow-700' },
    { label: 'Washing Machines', icon: 'fa-soap',                link: '/products?cat=Washing%20Machines', color: 'from-indigo-500 to-indigo-700' },
];

const BRANDS = ['Samsung', 'LG', 'Sony', 'Panasonic', 'Hisense', 'TCL', 'Midea', 'Royal', 'Scanfrost', 'Thermocool'];



/* ─────────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────────── */
function useCountdown(hours = 5, mins = 59, secs = 59) {
    const total = useRef(hours * 3600 + mins * 60 + secs);
    const [time, setTime] = useState({ h: hours, m: mins, s: secs });

    useEffect(() => {
        const id = setInterval(() => {
            if (total.current <= 0) { clearInterval(id); return; }
            total.current -= 1;
            const t = total.current;
            setTime({ h: Math.floor(t / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return time;
}

const pad = (n) => String(n).padStart(2, '0');

/* ─────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────── */
function ProductCard({ p, onClick }) {
    const discount = p.oldPrice && p.oldPrice > p.price
        ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
        : 0;

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {discount > 0 && (
                    <span className="bg-lg-red text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        -{discount}% OFF
                    </span>
                )}
                {p.tag && (
                    <span className="bg-gray-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {p.tag}
                    </span>
                )}
            </div>

            {/* Wishlist */}
            <button
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-lg-red hover:bg-white hover:shadow-md transition-all duration-200"
            >
                <i className="far fa-heart text-sm"></i>
            </button>

            {/* Image */}
            <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center p-6">
                <img
                    src={p.img}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain img-zoom mix-blend-multiply"
                    style={{ maxHeight: '180px' }}
                    loading="lazy"
                />
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-grow bg-white">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {p.brand || p.category}
                    </p>
                    <div className="flex items-center gap-0.5">
                        <i className="fas fa-star text-[9px] text-yellow-400"></i>
                        <span className="text-[10px] text-gray-500 font-bold ml-0.5">4.8</span>
                    </div>
                </div>
                <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-4 group-hover:text-lg-red transition-colors duration-200">
                    {p.name}
                </h3>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            {discount > 0 && (
                                <span className="text-[11px] text-gray-400 line-through font-medium mb-0.5">
                                    ₦{Number(p.oldPrice).toLocaleString()}
                                </span>
                            )}
                            <span className="text-lg font-display font-black text-gray-900">
                                ₦{Number(p.price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="w-full bg-lg-dark hover:bg-lg-red text-white font-bold py-3 rounded-xl text-xs transition-all duration-300 flex justify-center items-center gap-2 uppercase tracking-wide btn-press group-hover:shadow-lg shadow-md"
                    >
                        <i className="fas fa-shopping-cart text-xs"></i>
                        View Product
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────────── */
export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [featLoading, setFeatLoading] = useState(false);
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    /* Auto-advance hero */
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(id);
    }, [slides.length]);

    /* Firebase fetch */
    useEffect(() => {
        const fetchData = async () => {
            setFeatLoading(true);
            try {
                const settingsSnap = await getDoc(doc(db, 'settings', 'site_settings'));
                if (settingsSnap.exists() && settingsSnap.data().heroSlides?.length > 0) {
                    setSlides(settingsSnap.data().heroSlides);
                }

                const q = query(collection(db, 'products'), where('featured', '==', true), limit(12));
                const snap = await getDocs(q);
                let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                if (items.length > 0) {
                    items.sort((a, b) => (a.featuredPosition ?? Infinity) - (b.featuredPosition ?? Infinity));
                }
                setFeatured(items);
            } catch (err) {
                console.error("Error fetching homepage data:", err);
                setFeatured([]);
                setSlides(DEFAULT_SLIDES);
            } finally {
                setFeatLoading(false);
            }
        };
        fetchData();
    }, []);

    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

    return (
        <main className="bg-gray-50 flex-grow">
            <SEO 
                title="LG TRUST EDGE | Best Electronics Store in Ikorodu, Lagos Nigeria" 
                description="Shop premium home appliances, TVs, ACs, and electronics at LG Trust Edge in Ikorodu. Nationwide delivery and wholesale deals available!" 
            />

            {/* ══════════════════════════════
                WHATSAPP FLOATING BUTTON
            ══════════════════════════════ */}
            <a
                href="https://wa.me/2347080441764?text=Hi%20LG%20Trust%20Edge%20Ikorodu%20Showroom%2C%20I%20want%20to%20inquire%20about%20an%20original%20LG%20product."
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
                style={{ boxShadow: '0 4px 20px rgba(37,211,102,0.5)' }}
                title="Chat with an agent live in our Ikorodu showroom"
            >
                {/* Tooltip for Desktop */}
                <div className="absolute right-16 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 text-xs font-bold py-2 px-3 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                    Chat with an agent live in our Ikorodu showroom
                    <div className="absolute top-1/2 right-[-4px] transform -translate-y-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
                <i className="fab fa-whatsapp text-3xl"></i>
            </a>

            {/* ══════════════════════════════
                HYPER-LOCAL DELIVERY BANNER
            ══════════════════════════════ */}
            <div className="bg-lg-red text-white text-center py-2 px-4 text-xs font-bold uppercase tracking-widest shadow-md sticky top-0 z-40">
                <i className="fas fa-truck-fast mr-2"></i>
                Fast Same-Day Delivery to Ikorodu, Ketu, Odogunyan, and Shagamu Road
            </div>

            {/* ══════════════════════════════
                MODERN HERO ISLAND
            ══════════════════════════════ */}
            <h1 className="sr-only">LG Trust Edge: #1 Online Electronics Store in Nigeria - Buy TVs, ACs, and Appliances</h1>
            <section className="px-4 py-6 md:px-8 max-w-[1440px] mx-auto relative z-10">
                <div className="relative bg-lg-dark text-white overflow-hidden h-[480px] md:h-[600px] group rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] md:rounded-[3rem]">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            {/* Bg image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ${
                                    index === currentSlide ? 'scale-110' : 'scale-100'
                                }`}
                            />
                            {/* Sophisticated Gradient overlay (More subtle than Zealmart) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-lg-dark/95 via-lg-dark/70 to-transparent"></div>
                            
                            {/* Content */}
                            <div className="h-full relative z-20 flex flex-col justify-center px-8 md:px-16 w-full md:w-3/4 lg:w-2/3">
                                {slide.badge && (
                                    <span className="inline-block bg-white text-lg-red text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 mb-6 rounded-full animate-fade-in-up shadow-lg">
                                        {slide.badge}
                                    </span>
                                )}
                                <h1
                                    className="text-4xl md:text-5xl lg:text-7xl font-sans font-black leading-[1.1] mb-6 text-white tracking-tight drop-shadow-xl animate-fade-in-up"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    {slide.title}
                                </h1>
                                <p
                                    className="text-base md:text-xl text-gray-200 mb-10 font-medium leading-relaxed max-w-lg animate-fade-in-up"
                                    style={{ animationDelay: '200ms' }}
                                >
                                    {slide.subtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                    <Link
                                        to={slide.link}
                                        className="inline-flex items-center justify-center gap-3 bg-lg-red text-white font-black py-4 px-10 rounded-full transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(226,0,26,0.4)] hover:shadow-[0_10px_40px_rgba(226,0,26,0.6)] transform hover:-translate-y-1 btn-press"
                                    >
                                        {slide.buttonText}
                                        <i className="fas fa-arrow-right text-xs"></i>
                                    </Link>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white text-white hover:text-lg-dark font-bold py-4 px-8 rounded-full transition-all duration-300 text-sm backdrop-blur-md btn-press border border-white/20 hover:border-white"
                                    >
                                        View All Catalog
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Controls */}
                    <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10 z-30 hidden sm:flex gap-3">
                        <button
                            onClick={prevSlide}
                            className="w-14 h-14 rounded-full bg-black/40 hover:bg-lg-red text-white flex items-center justify-center transition-all duration-300 border border-white/20 backdrop-blur-md hover:scale-105"
                        >
                            <i className="fas fa-chevron-left text-sm"></i>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-14 h-14 rounded-full bg-black/40 hover:bg-lg-red text-white flex items-center justify-center transition-all duration-300 border border-white/20 backdrop-blur-md hover:scale-105"
                        >
                            <i className="fas fa-chevron-right text-sm"></i>
                        </button>
                    </div>

                    {/* Indicators Line */}
                    <div className="absolute top-10 right-10 z-30 flex flex-col gap-2 hidden lg:flex">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 rounded-full transition-all duration-500 ${
                                    idx === currentSlide ? 'h-10 bg-lg-red' : 'h-2 bg-white/40 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                OVERLAPPING FLASH SALE CARD (RED THEME)
            ══════════════════════════════ */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 mt-4 sm:-mt-20 mb-16">
                <div className="bg-gradient-to-r from-lg-red to-red-800 rounded-[2.5rem] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(226,0,26,0.3)] relative overflow-hidden">
                    
                    {/* Background abstract shapes */}
                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-white rounded-full"></div>
                        <div className="absolute bottom-10 left-20 w-64 h-64 border-[30px] border-white rounded-full opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-20 bg-white rotate-45 opacity-20"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-2 w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-2 border border-white/30">
                            <i className="fas fa-star text-white text-sm"></i>
                            <span className="text-xs text-white font-black uppercase tracking-[0.2em]">Premium Selection</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">Buy Electronics Online in Nigeria</h2>
                        <p className="text-red-100 text-sm font-medium mt-1">Discover the latest in home appliances and smart devices.</p>
                    </div>
                    
                    <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0 flex justify-center">
                        <Link
                            to="/products"
                            className="group flex justify-center items-center gap-3 bg-slate-900 text-white hover:bg-black font-black text-sm uppercase tracking-widest px-8 py-5 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                        >
                            Shop Now <i className="fas fa-chevron-right group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════
                BRAND PARTNERS
            ══════════════════════════════ */}
            <div className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.25em] mb-5">
                        Official Partners & Authorized Distributors
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
                        {BRANDS.map((b) => (
                            <div
                                key={b}
                                className="text-gray-400 hover:text-lg-dark font-display font-black text-base md:text-lg cursor-default select-none transition-colors duration-200 tracking-tight"
                            >
                                {b}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════
                CATEGORY ICON HUB
            ══════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-end justify-between mb-7 group">
                    <div>
                        <div className="text-[10px] text-lg-red font-black uppercase tracking-widest mb-1 animate-fade-in">Browse By Category</div>
                        <h2 className="text-2xl font-display font-black text-lg-dark uppercase tracking-tight section-heading">
                            Top Electronics & Appliances Categories
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-lg-red hover:text-red-800 uppercase tracking-wider transition-colors btn-press"
                    >
                        View All <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-2"></i>
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.label}
                            to={cat.link}
                            className="cat-card bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center group shadow-sm"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <i className={`fas ${cat.icon} text-white text-lg`}></i>
                            </div>
                            <span className="text-[11px] font-black text-gray-700 leading-tight text-center">{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>



            {/* ══════════════════════════════
                BEST SELLING PRODUCTS
            ══════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex items-end justify-between border-b-2 border-lg-dark pb-4 mb-8 group">
                    <div>
                        <div className="text-[10px] text-lg-red font-black uppercase tracking-widest mb-1 animate-fade-in">
                            <i className="fas fa-star mr-1"></i> Featured
                        </div>
                        <h2 className="text-2xl font-display font-black text-lg-dark uppercase tracking-tight section-heading">
                            Best Selling Appliances
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-lg-red hover:text-red-800 uppercase tracking-wider transition-colors btn-press"
                    >
                        View All <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-2"></i>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {featLoading
                        ? [1,2,3,4,5,6,7,8].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-80 flex flex-col">
                                <div className="skeleton h-48 w-full"></div>
                                <div className="p-4 space-y-2 flex-1">
                                    <div className="skeleton h-3 w-1/3 rounded"></div>
                                    <div className="skeleton h-4 w-full rounded"></div>
                                    <div className="skeleton h-4 w-4/5 rounded"></div>
                                    <div className="skeleton h-8 w-full rounded mt-auto"></div>
                                </div>
                            </div>
                        ))
                        : featured.length > 0 ? featured.map((p, idx) => (
                            <div
                                key={p.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
                            >
                                <ProductCard
                                    p={p}
                                    onClick={() => navigate(`/products/${p.id}`)}
                                />
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100">
                                <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Check back soon!</h3>
                                <p className="text-gray-500 font-medium">We're updating our featured collection.</p>
                            </div>
                        )
                    }
                </div>

                {/* View all mobile CTA */}
                <div className="mt-8 flex justify-center sm:hidden">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-lg-dark text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-2xl hover:bg-lg-red transition-all duration-300"
                    >
                        View All Products <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
            </section>

            {/* ══════════════════════════════
                ASYMMETRIC PROMO BENTO GRID
            ══════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Large Promo (2 cols) */}
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-[320px] flex items-center group shadow-md bg-lg-dark">
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 group-hover:opacity-50 transition-opacity">
                            <img src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800&q=80" alt="Smart TVs" className="w-full h-full object-cover mix-blend-overlay" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-lg-dark via-lg-dark/90 to-transparent"></div>
                        <div className="relative z-10 p-8 md:p-12 max-w-lg">
                            <div className="bg-white/10 text-yellow-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full inline-block mb-5 backdrop-blur-md border border-white/10 shadow-sm">Premium Experience</div>
                            <h3 className="text-white font-sans font-black text-3xl md:text-5xl uppercase leading-[1.1] mb-4 drop-shadow-md">
                                Cinematic<br />Smart TVs
                            </h3>
                            <p className="text-gray-300 text-sm font-medium mb-8 max-w-sm">Upgrade your living room with our 4K & 8K displays featuring immersive sound.</p>
                            <Link to="/products?cat=Televisions" className="inline-flex items-center gap-3 text-lg-dark font-black text-xs uppercase tracking-widest bg-white px-8 py-3.5 rounded-full hover:bg-yellow-400 transition-all shadow-xl btn-press">
                                Explore Collection <i className="fas fa-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                    {/* Small Promo (1 col) */}
                    <div className="relative rounded-3xl overflow-hidden h-[320px] flex items-end p-8 group shadow-md bg-lg-red">
                        <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
                            <img src="https://images.pexels.com/photos/2581274/pexels-photo-2581274.jpeg?w=400&q=70" alt="ACs" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-900/40 to-transparent"></div>
                        <div className="relative z-10 w-full text-center">
                            <h3 className="text-white font-sans font-black text-3xl uppercase leading-tight mb-2 drop-shadow-md">
                                Stay Cool
                            </h3>
                            <p className="text-red-100 text-sm font-medium mb-6">Inverter ACs up to 30% Off</p>
                            <Link to="/products?cat=Air%20Conditioners" className="inline-flex justify-center w-full items-center gap-2 text-white font-black text-xs uppercase tracking-widest bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl hover:bg-white hover:text-lg-red transition-all border border-white/30 btn-press shadow-lg">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════
                FLOATING TRUST BADGES
            ══════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
                        {[
                            { icon: 'fa-shield-alt',    color: 'bg-blue-50 text-blue-600',   title: 'Secure Payment',         desc: 'Encrypted checkout protocols' },
                            { icon: 'fa-truck-fast',    color: 'bg-green-50 text-green-600', title: 'Swift Delivery',         desc: 'Nationwide logistics network' },
                            { icon: 'fa-certificate',   color: 'bg-red-50 text-lg-red',      title: '100% Authentic',         desc: 'Direct distributor warranty' },
                            { icon: 'fa-headset',       color: 'bg-purple-50 text-purple-600', title: 'Dedicated Support',      desc: '24/7 client assistance' },
                        ].map((b) => (
                            <div key={b.title} className="flex flex-col items-center text-center p-4 group">
                                <div className={`w-16 h-16 rounded-3xl ${b.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm mb-4`}>
                                    <i className={`fas ${b.icon} text-2xl`}></i>
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-2">{b.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[200px] mx-auto">{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <PopularSearches />
            <Footer />
        </main>
    );
}
