import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Footer from '../components/Footer';
import LegalModal from '../components/LegalModal';
import { Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { sendRegistrationOTPEmail } from '../utils/email';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Legal terms state
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [activeLegal, setActiveLegal] = useState(null); // 'terms' | 'privacy' | null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      setError('You must read and accept both the Terms of Service and Privacy Policy to continue.');
      toast.error('Please accept all terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await auth.signOut();

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        isEmailVerified: false,
        otpCode: otpCode,
        otpExpiresAt: otpExpiresAt,
        createdAt: new Date()
      });

      try {
        await sendRegistrationOTPEmail(formData.email, formData.firstName, otpCode);
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
      }

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error("Registration error full details:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
        toast.error('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
        toast.error('Password is too weak.');
      } else if (err.message && err.message.toLowerCase().includes('offline')) {
        setError('Please check your internet connection and try again.');
        toast.error('Check your internet connection.');
      } else {
        setError(`Failed to register: ${err.message}`);
        toast.error(`Error: ${err.message}`);
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
          <div className="absolute top-[20%] right-[10%] w-[80%] h-[80%] rounded-full bg-lg-red/20 blur-[130px] animate-pulse-glow"></div>
          <div className="absolute -bottom-[10%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        </div>
        
        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center group">
            <img src="/logo.png" alt="LG Trust Edge" className="h-10 w-auto transition-transform group-hover:scale-105" />
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Join the<br/>Premium Network.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Create an account to unlock wholesale pricing, priority nationwide shipping, and dedicated 24/7 customer support.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                <i className="fas fa-truck-fast text-lg-red text-xl"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Express Delivery</h3>
                <p className="text-slate-400 text-xs mt-0.5">Nationwide shipping on all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                <i className="fas fa-certificate text-lg-red text-xl"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Authentic Guarantee</h3>
                <p className="text-slate-400 text-xs mt-0.5">100% official brand distributor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
        {/* Mobile Logo (Only shows on small screens) */}
        <div className="lg:hidden p-6 absolute top-0 w-full flex justify-center z-10">
            <Link to="/" className="inline-flex items-center">
              <img src="/logo.png" alt="LG Trust Edge" className="h-8 w-auto" />
            </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 mt-16 lg:mt-0 relative z-20">
          <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">Create Account</h2>
              <p className="text-sm font-bold text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-lg-red hover:text-red-700 transition-colors underline decoration-2 underline-offset-4">
                  Sign in here
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

            {successMessage ? (
              <div className="text-center py-6 animate-scale-in">
                <div className="flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-8 shadow-sm">
                  <CheckCircle size={52} className="text-emerald-500" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-emerald-900 font-black text-xl uppercase mb-2 tracking-wide">Account Created!</h3>
                    <p className="text-emerald-700 text-sm font-bold mb-1">{successMessage}</p>
                    <p className="text-emerald-600 text-xs font-medium mt-2">A verification OTP has been sent to your email.<br />Please check your inbox and spam folder.</p>
                  </div>
                </div>
                <Link to="/login" className="inline-block mt-8 bg-slate-900 text-white font-black py-4 px-10 uppercase tracking-widest text-xs rounded-2xl hover:bg-lg-red transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Proceed to Login <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                      </div>
                      <input
                        type="text" name="firstName" value={formData.firstName}
                        placeholder="John" required onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                      </div>
                      <input
                        type="text" name="lastName" value={formData.lastName}
                        placeholder="Doe" required onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-phone text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                    </div>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      placeholder="+234 708 044 1764" required onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                    </div>
                    <input
                      type="email" name="email" value={formData.email}
                      placeholder="hello@example.com" required onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={formData.password}
                      placeholder="Create a strong password" minLength="6" required onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-lg-red">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-slate-400 group-focus-within:text-lg-red transition-colors text-sm"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword" value={formData.confirmPassword}
                      placeholder="Repeat your password" minLength="6" required onChange={handleChange}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-100 focus:border-lg-red/30 focus:bg-white outline-none text-sm font-bold text-slate-800 transition-all rounded-2xl placeholder-slate-300 focus:ring-4 focus:ring-lg-red/10"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-1 animate-fade-in">
                      <i className="fas fa-times-circle"></i> Passwords do not match
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && (
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1 flex items-center gap-1 animate-fade-in">
                      <i className="fas fa-check-circle"></i> Passwords match
                    </p>
                  )}
                </div>

                {/* Terms Checkboxes */}
                <div className="space-y-3 pt-2">
                    {/* Terms checkbox */}
                    <div 
                      onClick={() => !agreedToTerms && setActiveLegal('terms')}
                      className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        agreedToTerms 
                          ? 'border-emerald-200 bg-emerald-50' 
                          : 'border-slate-100 bg-slate-50 hover:border-lg-red/30'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          agreedToTerms ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                        }`}>
                          {agreedToTerms && <i className="fas fa-check text-white text-[10px]"></i>}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-bold ${agreedToTerms ? 'text-emerald-800' : 'text-slate-600'}`}>
                          I have read and agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setActiveLegal('terms'); }} className="text-lg-red hover:underline underline-offset-2">Terms of Service</button>
                        </p>
                        {!agreedToTerms && (
                          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-black"><i className="fas fa-lock mr-1"></i>Click to read & accept</p>
                        )}
                        {agreedToTerms && (
                          <p className="text-[9px] text-emerald-600 mt-1 uppercase tracking-widest font-black"><i className="fas fa-check-circle mr-1"></i>Accepted</p>
                        )}
                      </div>
                    </div>

                    {/* Privacy checkbox */}
                    <div 
                      onClick={() => !agreedToPrivacy && setActiveLegal('privacy')}
                      className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        agreedToPrivacy 
                          ? 'border-emerald-200 bg-emerald-50' 
                          : 'border-slate-100 bg-slate-50 hover:border-lg-red/30'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          agreedToPrivacy ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                        }`}>
                          {agreedToPrivacy && <i className="fas fa-check text-white text-[10px]"></i>}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] font-bold ${agreedToPrivacy ? 'text-emerald-800' : 'text-slate-600'}`}>
                          I have read and agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setActiveLegal('privacy'); }} className="text-lg-red hover:underline underline-offset-2">Privacy Policy</button>
                        </p>
                        {!agreedToPrivacy && (
                          <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-black"><i className="fas fa-lock mr-1"></i>Click to read & accept</p>
                        )}
                        {agreedToPrivacy && (
                          <p className="text-[9px] text-emerald-600 mt-1 uppercase tracking-widest font-black"><i className="fas fa-check-circle mr-1"></i>Accepted</p>
                        )}
                      </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-slate-900 hover:bg-lg-red disabled:bg-slate-300 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all duration-300 shadow-lg hover:shadow-[0_10px_30px_rgba(226,0,26,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:shadow-none group mt-6"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create My Account <i className="fas fa-arrow-right text-white/50 group-hover:translate-x-1 transition-transform"></i>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fas fa-shield-alt text-emerald-500 text-sm"></i> Secure Registry
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200"></div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fas fa-lock text-blue-500 text-sm"></i> 100% Safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Footer />

      {/* Legal Modal */}
      {activeLegal && (
        <LegalModal
          type={activeLegal}
          onClose={() => setActiveLegal(null)}
          onAccept={(type) => {
            if (type === 'terms') setAgreedToTerms(true);
            if (type === 'privacy') setAgreedToPrivacy(true);
          }}
        />
      )}
    </div>
  );
}
