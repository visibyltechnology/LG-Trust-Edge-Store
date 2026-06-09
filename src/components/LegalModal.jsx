import { useState, useRef, useEffect, useCallback } from 'react';

const TERMS_CONTENT = (
  <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 shadow-sm">
      <p className="text-amber-800 font-medium text-xs">
        <strong className="font-black">Disclaimer:</strong> This document is tailored to Nigerian consumer and cyber laws for informational purposes and does not constitute formal legal advice. E-commerce in Nigeria is governed by agencies like the <strong>FCCPC</strong> and <strong>NITDA</strong>.
      </p>
    </div>

    <p>Welcome to <strong className="text-slate-900">LG Trust Edge!</strong> These Terms and Conditions ("Terms") govern your use of our platform and the purchase of any electronics or products from us. By accessing the site or purchasing a product, you agree to be bound by these Terms.</p>

    {[
      {
        n: '1', title: 'Eligibility & Account Security',
        body: 'By using this Site, you represent that you are at least 18 years of age or accessing the Site under the supervision of a parent or legal guardian. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.'
      },
      {
        n: '2', title: 'Product Information and Pricing',
        body: 'We strive to be as accurate as possible with product descriptions, technical specifications, and images. However, LG Trust Edge does not warrant that product descriptions are 100% accurate. In the event of a pricing error, LG Trust Edge reserves the right to refuse or cancel orders, and if payment has been processed, a full refund will be issued.'
      },
      {
        n: '3', title: 'Payments and Billing',
        body: 'All payments are securely processed. We accept Naira debit cards (Visa, MasterCard, Verve), bank transfers, and pay-with-bank options. By submitting an order, you authorize LG Trust Edge to charge your designated payment method for the full order amount.'
      },
      {
        n: '4', title: 'Shipping, Delivery, and Risk of Loss',
        body: 'Delivery dates given at checkout are estimates only and cannot be guaranteed. LG Trust Edge is not liable for delays caused by local dispatch services or factors beyond our control. Risk of loss and title for items pass to you upon our delivery to the courier/logistics partner.'
      },
    ].map(s => (
      <div key={s.n} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-3">
          <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-sm">{s.n}</span>
          {s.title}
        </h3>
        <p className="text-slate-600 pl-9">{s.body}</p>
      </div>
    ))}

    {/* Highlighted Section */}
    <div className="border-2 border-lg-red/20 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-lg-red px-5 py-3 flex items-center gap-3">
        <i className="fas fa-exclamation-triangle text-white text-sm"></i>
        <h3 className="font-black text-white uppercase tracking-wider text-xs">5. Returns and Warranties</h3>
      </div>
      <div className="p-5 bg-red-50/50 space-y-3">
        <p className="text-slate-700"><strong className="font-bold text-lg-red">Inspection Upon Delivery:</strong> Customers are strongly advised to inspect their electronics thoroughly at the point of delivery before signing off with the courier.</p>
        <p className="text-slate-700"><strong className="font-bold text-lg-red">Manufacturer Warranties:</strong> Many products come with official manufacturer warranties. For technical faults discovered after delivery, your remedy is to contact the manufacturer's authorized service center.</p>
      </div>
    </div>

    {[
      {
        n: '6', title: 'Intellectual Property',
        body: 'All content on this Site — including text, graphics, logos, images, and software — is the property of LG Trust Edge or its content suppliers and is protected by Nigerian and international intellectual property laws.'
      },
      {
        n: '7', title: 'Limitation of Liability',
        body: 'To the maximum extent permitted by applicable Nigerian law, LG Trust Edge shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or misuse of electronics purchased through the Site.'
      },
      {
        n: '8', title: 'User Conduct & Prohibited Uses',
        body: 'You agree not to use the Site for any unlawful purpose, to infringe upon our intellectual property rights, to upload viruses or malicious code, or to engage in fraudulent chargeback schemes.'
      },
      {
        n: '9', title: 'Governing Law',
        body: 'These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal actions must be brought before courts of competent jurisdiction in Nigeria.'
      },
    ].map(s => (
      <div key={s.n} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-3">
          <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-sm">{s.n}</span>
          {s.title}
        </h3>
        <p className="text-slate-600 pl-9">{s.body}</p>
      </div>
    ))}

    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-inner">
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">End of Terms &amp; Conditions — Last Updated June 2026</p>
    </div>
  </div>
);

const PRIVACY_CONTENT = (
  <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
    <p>LG Trust Edge ("we", "our", "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information. This policy is aligned with the <strong className="text-slate-900">Nigeria Data Protection Regulation (NDPR)</strong> issued by NITDA.</p>

    {[
      {
        n: '1', title: 'Information We Collect', icon: 'fa-database',
        body: 'We may collect: Identity Data (first name, last name), Contact Data (email address, phone number), Delivery Data (address, state, LGA, landmark), Payment Data (processed securely — we do not store card details), Technical Data (IP address, browser type, device data), and Transaction Data.'
      },
      {
        n: '2', title: 'How We Use Your Information', icon: 'fa-cogs',
        body: 'We use your information to: process and fulfill your orders and payments, communicate with you via email and WhatsApp about order status and delivery updates, send OTP verification codes, improve our website and personalize your shopping experience, and comply with legal obligations.'
      },
      {
        n: '3', title: 'Sharing Your Information', icon: 'fa-share-alt',
        body: 'We do NOT sell your personal data to third parties. We may share your information only with: secure payment processors, logistics partners for delivery, communication platforms (like WhatsApp/Email) for notifications, and law enforcement if required by law.'
      },
      {
        n: '4', title: 'Data Security', icon: 'fa-lock',
        body: 'We implement appropriate technical and organisational security measures to protect your personal data against accidental loss, unauthorised access, and disclosure. Your account password is hashed and never stored in plain text.'
      },
      {
        n: '5', title: 'Your Rights Under Nigerian Law (NDPR)', icon: 'fa-user-shield',
        body: 'Under the NDPR, you have the right to: request access to the personal data we hold about you, request correction of inaccurate or incomplete data, request erasure of your personal data, object to or restrict how we process your data, and lodge a complaint with NITDA.'
      },
      {
        n: '6', title: 'Cookies', icon: 'fa-cookie',
        body: 'Our website uses session-based storage and local storage to maintain your shopping cart and login state. We do not use tracking cookies for intrusive advertising purposes.'
      },
      {
        n: '7', title: "Children's Privacy", icon: 'fa-child',
        body: 'Our Site is not directed at children under 18. We do not knowingly collect personal information from minors.'
      },
    ].map(s => (
      <div key={s.n} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center gap-3">
          <span className="w-8 h-8 bg-slate-50 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center text-sm shadow-sm group-hover:scale-110 group-hover:bg-lg-red group-hover:text-white transition-all duration-300">
            <i className={`fas ${s.icon}`}></i>
          </span>
          {s.title}
        </h3>
        <p className="text-slate-600 pl-11">{s.body}</p>
      </div>
    ))}

    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-inner">
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">End of Privacy Policy — Last Updated June 2026</p>
    </div>
  </div>
);

export default function LegalModal({ type, onClose, onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  const isTerms = type === 'terms';
  const title = isTerms ? 'Terms & Conditions' : 'Privacy Policy';
  const content = isTerms ? TERMS_CONTENT : PRIVACY_CONTENT;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
    setScrollProgress(progress);
    if (progress >= 95) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check if content is smaller than container (no scroll needed)
    if (el && el.scrollHeight <= el.clientHeight + 20) {
       setHasScrolledToBottom(true);
       setScrollProgress(100);
    }

    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, [handleScroll]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up transform transition-all" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 sm:px-8 py-5 flex-shrink-0 bg-gradient-to-r ${isTerms ? 'from-slate-900 to-slate-800' : 'from-lg-red to-red-900'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                <i className={`fas ${isTerms ? 'fa-file-contract' : 'fa-shield-alt'} text-white text-xl drop-shadow-md`}></i>
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-widest text-lg drop-shadow-md">{title}</h2>
              <p className="text-white/70 text-xs font-bold tracking-wider mt-0.5">Please review before continuing</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10 hover:scale-105 active:scale-95">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Scroll Progress Bar */}
        <div className="h-1.5 bg-slate-100 flex-shrink-0 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${hasScrolledToBottom ? 'bg-emerald-500' : isTerms ? 'bg-slate-800' : 'bg-lg-red'}`}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Scroll hint alert */}
        <div className={`overflow-hidden transition-all duration-500 flex-shrink-0 ${hasScrolledToBottom ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'}`}>
            <div className="flex items-center justify-center gap-3 bg-amber-50 border-b border-amber-100 px-6 py-2.5">
                <i className="fas fa-arrow-down text-amber-500 text-xs animate-bounce"></i>
                <span className="text-amber-700 text-[10px] font-black uppercase tracking-widest">Please scroll to the bottom to accept</span>
                <i className="fas fa-arrow-down text-amber-500 text-xs animate-bounce"></i>
            </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto px-6 sm:px-8 py-8 custom-scrollbar bg-slate-50/50"
          style={{ overscrollBehavior: 'contain' }}
        >
          {content}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-slate-100 px-6 sm:px-8 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            {hasScrolledToBottom ? (
              <>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-scale-in">
                    <i className="fas fa-check"></i>
                </div>
                <span className="text-emerald-600 uppercase tracking-wider">Document read completely</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <i className="fas fa-book-open"></i>
                </div>
                <span className="uppercase tracking-wider">{scrollProgress}% read — keep scrolling</span>
              </>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3.5 border-2 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
            >
              Decline
            </button>
            <button
              onClick={() => { onAccept(type); onClose(); }}
              disabled={!hasScrolledToBottom}
              className={`flex-1 sm:flex-none px-8 py-3.5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 relative overflow-hidden group ${
                hasScrolledToBottom
                  ? 'bg-slate-900 hover:bg-lg-red text-white shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {hasScrolledToBottom && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
              <i className={`fas ${hasScrolledToBottom ? 'fa-check-circle' : 'fa-lock'} text-sm z-10`}></i>
              <span className="z-10">{hasScrolledToBottom ? `I Accept` : 'Scroll to Accept'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
