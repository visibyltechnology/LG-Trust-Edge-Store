import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ChevronDown, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Footer from '../components/Footer';
import useCartStore from '../store/useCartStore';
import { isProductInStock, INVENTORY_STATUS, getStockDisplayText } from '../utils/inventoryService';
import SEO from '../components/SEO';

// Monthly interest rates; weekly = half of monthly (reward for shorter per-period commitment)
const MONTHLY_INTEREST = { 2: 5, 3: 10, 4: 10, 5: 20, 6: 20 };

function fmt(n) {
  return '₦' + Math.ceil(n).toLocaleString('en-NG');
}



export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showInstallment, setShowInstallment] = useState(false);
  const [installments, setInstallments] = useState(2);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const productWithInventory = {
              id: docSnap.id,
              ...data,
              inventory_status: data.inventory_status || 'in_stock',
              items_left: data.items_left !== undefined ? data.items_left : 5,
              unlimited_stock: data.unlimited_stock || false,
              is_hidden: data.is_hidden || false
          };
          setProduct(productWithInventory);
        } else {
          setError("Product Not Found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
          <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-lg-dark"></i>
          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-gray-500">Loading Product...</h2>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl font-display font-black text-gray-900 mb-4">{error || 'Product Not Found'}</h2>
          <Link to="/products" className="text-lg-dark font-bold flex items-center gap-2 hover:text-lg-red transition-colors">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Installment calculations
  const price = Number(product.price);
  const monthlyRate = MONTHLY_INTEREST[installments] / 100;
  const rate        = monthlyRate * (paymentFrequency === 'weekly' ? 0.5 : 1);
  const displayRate = MONTHLY_INTEREST[installments] * (paymentFrequency === 'weekly' ? 0.5 : 1); // shown as percent
  const total       = price * (1 + rate);
  
  const totalPeriods = installments;
  const periodPayment = total / totalPeriods;
  const interestAmt = total - price;

  const handleBuyOnce = () => {
    addToCart(product, 1, 'full', 1, price);
    navigate('/cart');
  };

  const handleInstallment = () => {
    addToCart(product, 1, 'installment', installments, periodPayment, paymentFrequency);
    navigate('/cart');
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8FAFC] selection:bg-lg-red selection:text-white">
      <SEO 
        title={`${product.name} - Buy Online | LG Trust Edge`}
        description={`Buy ${product.name} at the best price in Nigeria. ${product.description ? product.description.substring(0, 100).replace(/\n/g, ' ') + '...' : 'Shop authentic electronics at LG Trust Edge.'}`}
        image={product.img}
        type="product"
      />
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-lg-red/5 blur-[120px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 w-full flex-grow relative z-10">
        
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/60 backdrop-blur-md border border-white px-4 py-2 rounded-full w-fit shadow-sm">
          <Link to="/" className="hover:text-lg-red transition-colors flex items-center gap-1.5">
             <i className="fas fa-home"></i> Home
          </Link>
          <span className="mx-3 text-slate-300">/</span>
          <Link to={`/products?cat=${product.category}`} className="hover:text-lg-red transition-colors">
             {product.category}
          </Link>
          <span className="mx-3 text-slate-300">/</span>
          <span className="text-slate-800 line-clamp-1 max-w-[150px] sm:max-w-xs" title={product.name}>
             {product.name}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Immersive Image Presentation */}
          <div className="w-full lg:w-[55%] flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-[2.5rem] p-8 lg:p-12 flex items-center justify-center min-h-[400px] lg:min-h-[600px] shadow-[0_20px_60px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
              {/* Image Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <img src={product.img} alt={product.name} loading="lazy" decoding="async" className="relative z-10 max-w-full max-h-[450px] lg:max-h-[550px] object-contain mix-blend-multiply drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out" />
              
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none">
                {product.featured && (
                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <i className="fas fa-bolt"></i> Premium Selection
                  </span>
                )}
                {product.tag && (
                  <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {product.tag}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Floating Buy Box & Info */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            
            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-lg-red"></span>
                {product.brand || 'OFFICIAL PARTNER'}
              </p>
              <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {product.name}
              </h1>
              
              {/* Status Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {product.length && (
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">
                    <i className="fas fa-ruler-combined mr-1.5"></i> {product.length}
                  </span>
                )}
                {isProductInStock(product) ? (
                  <>
                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {getStockDisplayText(product)} ({product.items_left || 0} Left)
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
                      <ShieldCheck size={14} /> Official Warranty
                    </span>
                  </>
                ) : product.inventory_status === INVENTORY_STATUS.OUT_OF_STOCK ? (
                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-500 bg-slate-100 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    <AlertCircle size={14} /> Unavailable
                  </span>
                )}
              </div>

              {/* Price Block */}
              <div className="flex items-end gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="flex flex-col">
                  {Number(product.oldPrice) > price && (
                    <span className="text-sm text-slate-400 line-through font-bold mb-1">
                      ₦{Number(product.oldPrice).toLocaleString('en-NG')}
                    </span>
                  )}
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {fmt(price)}
                  </span>
                </div>
                {Number(product.oldPrice) > price && (
                  <div className="bg-gradient-to-r from-lg-red to-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-md mb-2">
                    {Math.round(100 - (price / Number(product.oldPrice)) * 100)}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Action Cards */}
            <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              
              {/* Buy Once Button */}
              <button 
                onClick={handleBuyOnce}
                disabled={!isProductInStock(product)}
                className={`w-full relative overflow-hidden ${isProductInStock(product) ? 'bg-slate-900 hover:bg-lg-red text-white shadow-xl hover:shadow-[0_10px_30px_rgba(226,0,26,0.3)]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all duration-300 group`}
              >
                {isProductInStock(product) && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
                <span className="relative flex items-center justify-center gap-3">
                  <ShoppingBag size={18} /> {isProductInStock(product) ? 'Buy Outright Now' : 'Out of Stock'}
                </span>
              </button>

              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">OR CHOOSE A PLAN</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Installment Payment Section */}
              <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white transition-all duration-500">
                <button
                  disabled={!isProductInStock(product)}
                  className={`w-full px-6 py-5 flex justify-between items-center ${isProductInStock(product) ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 cursor-not-allowed'} transition-colors`}
                  onClick={() => setShowInstallment(v => !v)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${isProductInStock(product) ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'} flex items-center justify-center shadow-inner`}>
                      <i className="fas fa-calendar-alt text-sm"></i>
                    </div>
                    <div className="text-left">
                      <div className={`text-[11px] font-black uppercase tracking-widest ${isProductInStock(product) ? 'text-slate-900' : 'text-slate-400'}`}>
                        {isProductInStock(product) ? 'Flexible Installments' : 'Installments Unavailable'}
                      </div>
                      {isProductInStock(product) && <div className="text-[10px] font-bold text-slate-400 mt-0.5">Pay over time</div>}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isProductInStock(product) ? (showInstallment ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-400') : 'border-slate-100 text-slate-300'}`}>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${showInstallment ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {showInstallment && isProductInStock(product) && (
                  <div className="p-6 border-t border-slate-100 bg-slate-50/50 animate-fade-in">
                    
                    {/* Frequency Toggle */}
                    <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6 w-full max-w-sm mx-auto border border-slate-200/50">
                      <button
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${paymentFrequency === 'monthly' ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        onClick={() => setPaymentFrequency('monthly')}
                      >
                        Monthly
                      </button>
                      <button
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${paymentFrequency === 'weekly' ? 'bg-white text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        onClick={() => setPaymentFrequency('weekly')}
                      >
                        Weekly
                      </button>
                    </div>

                    {/* Duration Selector */}
                    <div className="mb-8">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Select Duration ({paymentFrequency === 'weekly' ? 'Weeks' : 'Months'})</label>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[2, 3, 4, 5, 6].map(n => (
                          <button
                            key={n}
                            className={`w-12 h-12 rounded-2xl font-black text-lg transition-all duration-300 ${installments === n ? 'bg-lg-red text-white shadow-[0_4px_15px_rgba(226,0,26,0.3)] transform -translate-y-1' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:shadow-md'}`}
                            onClick={() => setInstallments(n)}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interest rate</span>
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${displayRate > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {displayRate}% {displayRate === 0 && '🎉'}
                          {paymentFrequency === 'weekly' && MONTHLY_INTEREST[installments] > 0 && (
                            <span className="ml-1 text-emerald-600 font-bold">(½ of monthly)</span>
                          )}
                        </span>
                      </div>
                      {interestAmt > 0 && (
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interest added</span>
                          <span className="text-sm font-black text-slate-900">{fmt(interestAmt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total to pay</span>
                        <span className="text-sm font-black text-slate-900">{fmt(total)}</span>
                      </div>
                      <div className="flex justify-between items-end pt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{paymentFrequency === 'monthly' ? 'Monthly payment' : 'Weekly payment'}</span>
                        <span className="text-2xl font-black text-lg-red">{fmt(periodPayment)} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">/{paymentFrequency === 'weekly' ? 'wk' : 'mo'}</span></span>
                      </div>
                    </div>

                    <button 
                      className="w-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.15em] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group" 
                      onClick={handleInstallment}
                    >
                      Start {paymentFrequency === 'weekly' ? 'Weekly' : 'Monthly'} Plan <i className="fas fa-arrow-right opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Description / Features */}
            {product.description && (
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <i className="fas fa-sliders-h text-lg-red"></i> Specifications
                </h3>
                <ul className="space-y-4">
                  {product.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => {
                    const [key, ...rest] = line.split(':');
                    const value = rest.join(':').trim();
                    return (
                      <li key={idx} className="flex flex-col sm:flex-row sm:items-start text-sm border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                        {value ? (
                          <>
                            <span className="font-black text-slate-900 w-full sm:w-1/3 shrink-0 mb-1 sm:mb-0">{key.trim()}</span>
                            <span className="text-slate-500 font-medium flex-1">{value}</span>
                          </>
                        ) : (
                          <span className="text-slate-600 font-medium flex-1 flex items-start gap-2">
                            <i className="fas fa-check text-emerald-500 mt-1 text-[10px]"></i> {line.trim()}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
