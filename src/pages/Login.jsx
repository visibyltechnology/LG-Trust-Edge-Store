import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        if (userData.role === 'admin') {
          toast.success('Welcome back, Admin!');
          navigate('/admin');
          return;
        }

        if (userData.isEmailVerified === false) {
          await auth.signOut();
          setError('Please verify your email before logging in.');
          toast.error('Please verify your email.');
          setLoading(false);
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
          return;
        }
      }

      toast.success('Successfully logged in!');
      navigate('/shop');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
        toast.error('Invalid email or password.');
      } else if (err.message && err.message.toLowerCase().includes('offline')) {
        setError('Please check your internet connection and try again.');
        toast.error('Check your internet connection.');
      } else {
        setError('Failed to sign in. Please try again later.');
        toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-lg-red selection:text-white bg-white">
      <main className="flex-1 flex">
        {/* LEFT SIDE: Immersive Brand Hero (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 relative bg-lg-dark overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-lg-red/20 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>
        
        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-baseline group">
            <span className="text-lg-red text-4xl font-black tracking-tighter transition-transform group-hover:scale-105">LG</span>
            <span className="text-white text-3xl ml-1 font-extrabold tracking-tight">TRUST</span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Elevate Your<br/>Home Experience.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Sign in to access exclusive deals, track your nationwide deliveries, and manage your premium appliances all in one place.
          </p>
          
          <div className="mt-10 flex gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-12 h-12 rounded-full border-2 border-lg-dark object-cover shadow-sm" alt="User" />
              ))}
            </div>
            <div className="flex flex-col justify-center pl-2">
              <div className="flex text-amber-400 text-[10px] gap-0.5">
                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
              </div>
              <span className="text-slate-300 text-xs font-bold mt-1">Trusted by 50,000+ Nigerians</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile Logo (Only shows on small screens) */}
        <div className="lg:hidden p-6 absolute top-0 w-full flex justify-center z-10">
            <Link to="/" className="inline-flex items-baseline">
              <span className="text-lg-red text-3xl font-black tracking-tighter">LG</span>
              <span className="text-slate-900 text-2xl ml-1 font-extrabold tracking-tight">TRUST</span>
            </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mt-16 lg:mt-0 relative z-20">
          <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
              <p className="text-sm font-bold text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-lg-red hover:text-red-700 transition-colors underline decoration-2 underline-offset-4">
                  Create one now
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl mb-8 flex items-center gap-3 animate-slide-down">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="fas fa-exclamation-circle text-lg-red text-sm"></i>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                  </div>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1 pr-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-lg-red">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-[10px] font-bold text-slate-500 hover:text-lg-red transition-colors uppercase tracking-wider">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-slate-900 hover:bg-lg-red disabled:bg-slate-300 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(226,0,26,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:shadow-none group mt-8"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In Securely <i className="fas fa-arrow-right text-white/50 group-hover:translate-x-1 transition-transform"></i>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Trust Badges */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fas fa-shield-alt text-green-500 text-sm"></i> 256-bit SSL
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fas fa-lock text-blue-500 text-sm"></i> Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Footer />
    </div>
  );
}
