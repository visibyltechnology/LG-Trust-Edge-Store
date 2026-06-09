import { Navigate, Outlet, NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { Package, PlusCircle, LogOut, User, Users, ClipboardList, Settings, Menu, X, ShieldAlert, Tag, Briefcase } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { to: "/admin", icon: <Package size={18} />, label: "Manage Products", end: true },
    { to: "/admin/categories", icon: <Tag size={18} />, label: "Manage Categories" },
    { to: "/admin/brands", icon: <Briefcase size={18} />, label: "Manage Brands" },
    { to: "/admin/orders", icon: <ClipboardList size={18} />, label: "Customer Orders" },
    { to: "/admin/users", icon: <Users size={18} />, label: "Registered Users" },
    { to: "/admin/new", icon: <PlusCircle size={18} />, label: "Add Product" },
    { to: "/admin/settings", icon: <Settings size={18} />, label: "Site Settings" },
    { to: "/profile", icon: <User size={18} />, label: "My Profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFF5F5] font-sans selection:bg-lg-dark selection:text-white">
      
      {/* Mobile Header Toggle */}
      <div className="md:hidden bg-lg-red text-white p-4 flex justify-between items-center z-30 shadow-[0_10px_30px_rgba(226,0,26,0.2)]">
        <div className="flex items-center gap-2">
          <ShieldAlert size={20} className="text-white/80" />
          <h2 className="font-display font-black text-lg uppercase tracking-widest text-white">
            Admin <span className="text-white/60">Portal</span>
          </h2>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Floating Pill Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen md:h-screen z-20 md:w-80 p-0 md:p-6 flex-shrink-0
        transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-500 ease-out
      `}>
        <aside className="h-full w-full bg-lg-red md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(226,0,26,0.3)] border border-red-500/30 flex flex-col relative overflow-hidden">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[50px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

          <div className="p-8 hidden md:block border-b border-red-800/30 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white text-lg-red flex items-center justify-center shadow-inner">
                <ShieldAlert size={20} />
              </div>
              <h2 className="font-display font-black text-2xl uppercase tracking-widest text-white leading-none">
                Admin <span className="block text-[10px] text-white/60 mt-1">Control Portal</span>
              </h2>
            </div>
          </div>

          <div className="md:hidden p-8 border-b border-red-800/30 mt-16 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-black/10 px-3 py-1.5 rounded-full inline-block mb-2">Logged in as</p>
            <p className="text-sm font-bold text-white break-all">{user.email}</p>
          </div>

          <div className="hidden md:block px-8 py-4 bg-black/10 relative z-10">
             <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Session Active</p>
             <p className="text-xs font-bold text-white truncate" title={user.email}>{user.email}</p>
          </div>

          <nav className="flex-1 px-6 py-8 flex flex-col gap-3 overflow-y-auto relative z-10 scrollbar-hide">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200/60 mb-2 px-4">Menu</div>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.15em] font-black transition-all duration-300 group overflow-hidden
                  ${isActive 
                    ? 'bg-white text-lg-red shadow-[0_8px_20px_rgba(0,0,0,0.1)] transform scale-[1.02]' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}
                `}
              >
                <div className={`${({isActive}) => isActive ? 'text-lg-red' : 'text-white/60 group-hover:text-white'} transition-colors`}>
                  {link.icon}
                </div>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-red-800/30 relative z-10 mt-auto">
            <button
              onClick={async () => {
                await logout();
                toast.success('Signed out successfully');
              }}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-[11px] uppercase tracking-[0.15em] font-black bg-black/20 text-white hover:bg-black/40 hover:shadow-lg transition-all duration-300 backdrop-blur-md"
            >
              <LogOut size={16} /> Secure Sign Out
            </button>
          </div>
        </aside>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-lg-dark/40 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full md:max-w-[calc(100vw-20rem)] p-4 md:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
