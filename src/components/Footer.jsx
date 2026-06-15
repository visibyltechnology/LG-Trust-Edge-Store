import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const year = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('lagos');

    // Interactive Hub data tailored to key Nigerian commerce zones
    const hubDetails = {
        lagos: {
            address: '14 Electronics Avenue, Alaba Int\'l Market Link Rd, Victoria Island, Lagos',
            phone: '+234 708 044 1764',
            whatsapp: 'https://wa.me/2347080441764?text=Hi%20LG%20Trust%20Edge%20Lagos%2C%20I%20want%20to%20place%20a%20bulk%20order.',
            hours: 'Mon–Sat: 8am – 7pm'
        },
        abuja: {
            address: 'Suite G12, Capital Plaza, Central Business District, Abuja, FCT',
            phone: '+234 708 044 1764',
            whatsapp: 'https://wa.me/2347080441764?text=Hi%20LG%20Trust%20Edge%20Abuja%2C%20I%20need%20wholesale%20appliances.',
            hours: 'Mon–Sat: 9am – 6pm'
        },
        ph: {
            address: 'Plot 45, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State',
            phone: '+234 708 044 1764',
            whatsapp: 'https://wa.me/2347080441764?text=Hi%20LG%20Trust%20Edge%20PH%2C%20checking%20for%20stock%20availability.',
            hours: 'Mon–Fri: 8am – 6pm'
        }
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubscribed(true);
            setTimeout(() => {
                setIsSubscribed(false);
                setEmail('');
            }, 4000);
        }
    };

    return (
        <footer className="bg-[#0b0f19] text-gray-400 mt-auto border-t-4 border-[#E2001A] font-sans antialiased">

            {/* ── Interactive Newsletter Strip ── */}
            <div className="bg-gradient-to-r from-[#b00014] via-[#E2001A] to-[#ff2a43] py-12 relative overflow-hidden shadow-inner">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#fff_20%,transparent_20%)] [background-size:16px_16px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <span className="bg-black/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3 backdrop-blur-sm">
                            🔥 Ajele / Flash Sales Alerts
                        </span>
                        <h3 className="text-white font-black text-2xl sm:text-3xl uppercase tracking-tight leading-none">
                            No Stories. Just Original Gadgets.
                        </h3>
                        <p className="text-red-100 text-sm mt-2 font-medium max-w-xl">
                            Drop your email to get premium access to pricing drops, slashed custom duties clearouts, and nationwide shipping bonuses.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubscribe}
                        className="flex w-full lg:w-auto rounded-2xl overflow-hidden shadow-2xl min-w-full sm:min-w-[420px] transition-all duration-300 focus-within:ring-4 focus-within:ring-white/20"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address..."
                            className="w-full lg:w-80 py-4 px-5 outline-none text-sm text-gray-900 bg-white placeholder-gray-400 transition-colors duration-200"
                        />
                        <button
                            type="submit"
                            className={`px-8 font-black text-xs uppercase tracking-widest transition-all duration-300 flex-shrink-0 flex items-center justify-center min-w-[130px] ${isSubscribed
                                    ? 'bg-green-600 text-white'
                                    : 'bg-[#0b0f19] hover:bg-black text-white hover:px-10'
                                }`}
                        >
                            {isSubscribed ? (
                                <span className="flex items-center gap-2 animate-fade-in">
                                    <i className="fas fa-check-circle text-sm"></i> Done!
                                </span>
                            ) : (
                                'Subscribe'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Main Footer Layout ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

                    {/* Brand Meta Column */}
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-block group mb-6">
                            <div className="font-black tracking-tighter leading-none transition-transform duration-300 group-hover:scale-[1.02]">
                                <span className="text-[#E2001A] text-4xl font-extrabold drop-shadow-[0_2px_10px_rgba(226,0,26,0.3)]">LG</span>
                                <span className="text-white text-3xl ml-1.5 font-bold">TRUST</span>
                                <span className="text-gray-500 text-3xl ml-1 font-light">EDGE</span>
                            </div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-[0.25em] font-bold mt-2 pl-0.5">
                                Explore More. Trust Always. Save Smart.
                            </div>
                        </Link>
                        <p className="text-sm mb-6 leading-relaxed text-gray-400 font-medium max-w-sm">
                            Nigeria's premium partner for authentic electronics and genuine home infrastructure. 100% verified distributor warranty coverage nationwide.
                        </p>

                        {/* Interactive Dynamic Region Switcher */}
                        <div className="bg-[#121826] p-1 rounded-xl flex border border-gray-800 max-w-xs mb-6">
                            {['lagos', 'abuja', 'ph'].map((region) => (
                                <button
                                    key={region}
                                    type="button"
                                    onClick={() => setSelectedRegion(region)}
                                    className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 ${selectedRegion === region
                                            ? 'bg-[#E2001A] text-white shadow-md shadow-[#E2001A]/30'
                                            : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {region === 'ph' ? 'Port Harcourt' : region}
                                </button>
                            ))}
                        </div>

                        {/* Social Interaction Bar */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: 'fa-twitter', href: '#' },
                                { icon: 'fa-facebook-f', href: '#' },
                                { icon: 'fa-instagram', href: '#' },
                                { icon: 'fa-youtube', href: '#' }
                            ].map((s, idx) => (
                                <a
                                    key={idx}
                                    href={s.href}
                                    className="w-10 h-10 bg-[#161f32] hover:bg-[#E2001A] flex items-center justify-center rounded-xl text-white text-sm transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_5px_15px_rgba(226,0,26,0.4)]"
                                >
                                    <i className={`fab ${s.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Cluster: Quick Links */}
                    <div className="lg:col-span-2 md:pl-4">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 pb-3 border-b border-gray-800/60 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-[#E2001A] rounded-full"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3.5">
                            {[
                                { label: 'Shop All Products', to: '/products' },
                                { label: 'Deal of the Day', to: '/products' },
                                { label: 'New Arrivals', to: '/products' },
                                { label: 'My Account', to: '/profile' },
                                { label: 'Wishlist', to: '/profile' },
                            ].map((l, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={l.to}
                                        className="text-sm text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium group"
                                    >
                                        <i className="fas fa-angle-right text-[#E2001A] text-xs transition-transform duration-200 group-hover:translate-x-1"></i>
                                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{l.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation Cluster: Customer Support */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 pb-3 border-b border-gray-800/60 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-[#E2001A] rounded-full"></span>
                            Customer Service
                        </h4>
                        <ul className="space-y-3.5">
                            {[
                                { label: 'Contact Us / Support', to: '#' },
                                { label: 'Nationwide Delivery Zones', to: '/delivery' },
                                { label: 'Anti-Fake LG Guide', to: '/anti-fake-guide' },
                            ].map((l, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={l.to}
                                        className="text-sm text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium group"
                                    >
                                        <i className="fas fa-angle-right text-[#E2001A] text-xs transition-transform duration-200 group-hover:translate-x-1"></i>
                                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{l.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Interactive Location Desk */}
                    <div className="lg:col-span-4 bg-[#111724]/60 p-6 rounded-2xl border border-gray-800/70 backdrop-blur-sm self-start">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-3.5 bg-[#E2001A] rounded-full"></span>
                                Office Desk ({selectedRegion})
                            </span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </h4>

                        <div className="space-y-4 min-h-[160px] flex flex-col justify-between">
                            <div className="space-y-3.5">
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 bg-[#182032] group-hover:bg-[#E2001A]/10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                                        <i className="fas fa-map-marker-alt text-[#E2001A] text-xs"></i>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-semibold transition-all duration-300">
                                        {hubDetails[selectedRegion].address}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#182032] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-phone text-[#E2001A] text-xs"></i>
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold tracking-wide">{hubDetails[selectedRegion].phone}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#182032] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-clock text-[#E2001A] text-xs"></i>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{hubDetails[selectedRegion].hours}</span>
                                </div>
                            </div>

                            {/* Contextual WhatsApp Bulk Trigger */}
                            <a
                                href={hubDetails[selectedRegion].whatsapp}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl shadow-lg shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <i className="fab fa-whatsapp text-base"></i>
                                Chat Bulk Orders ({selectedRegion})
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Visual Categories Component ── */}
                <div className="border-t border-gray-800/80 pt-10 pb-8">
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em] mb-4">
                        Popular Wholesale Categories
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {[
                            'Air Conditioners', 'Televisions', 'Deep Freezers', 'Inverter Generators',
                            'Washing Machines', 'Smartphones', 'Laptops & Computing', 'Gas Cookers'
                        ].map((cat, idx) => (
                            <Link
                                key={idx}
                                to={`/products?cat=${encodeURIComponent(cat)}`}
                                className="text-[11px] font-bold text-gray-400 hover:text-white bg-[#121826] hover:bg-[#E2001A] px-4 py-2.5 rounded-xl border border-gray-800/40 hover:border-transparent transition-all duration-200 hover:shadow-md hover:shadow-[#E2001A]/10"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Bottom Infrastructure Segment ── */}
                <div className="border-t border-gray-800/80 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="text-xs text-gray-500 font-semibold text-center lg:text-left order-2 lg:order-1">
                        © {year} <span className="text-gray-300 font-bold">LG Trust Edge Limited</span>. All Rights Reserved.
                        <span className="mx-2.5 text-gray-700">|</span>
                        <Link to="#" className="hover:text-white transition-colors">Privacy Shield</Link>
                        <span className="mx-2.5 text-gray-700">|</span>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Operations</Link>
                    </div>

                    {/* Payment gateway section removed per request */}
                </div>

                {/* Regional Branding Anchor */}
                <div className="text-center mt-10 text-[9px] font-black uppercase tracking-[0.4em] text-gray-600/80 selection:bg-transparent">
                    ESTABLISHED IN NIGERIA <span className="text-[#E2001A] font-light">|</span> NATIONWIDE DISTRIBUTION ASSURANCE
                </div>
            </div>
        </footer>
    );
}