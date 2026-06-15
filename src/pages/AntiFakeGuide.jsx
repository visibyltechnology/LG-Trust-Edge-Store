import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

export default function AntiFakeGuide() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col selection:bg-lg-red selection:text-white">
            <SEO 
                title="How to Spot Fake LG Appliances | Anti-Fake Guide by LG Trust Edge"
                description="Learn how to identify original LG electronics in Nigeria. Check serial numbers, warranty cards, and avoid counterfeit home appliances."
            />
            
            {/* Header Hero */}
            <div className="bg-lg-dark text-white py-16 px-6 sm:px-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-lg-red/10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-lg-red text-white px-4 py-1.5 rounded-full mb-6 font-bold uppercase tracking-widest text-xs shadow-lg">
                        <i className="fas fa-shield-halved"></i> Customer Protection Guide
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-md">
                        How to Spot Fake <span className="text-lg-red">LG Electronics</span> in Nigeria
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
                        Don't fall victim to counterfeiters. Learn the exact methods our experts at LG Trust Edge Ikorodu use to verify 100% original LG appliances.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
                
                {/* Intro */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-10 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        The Nigerian electronics market is flooded with counterfeit products disguised as premium brands. Buying a fake LG appliance not only wastes your hard-earned money, but it can also pose severe electrical hazards to your home.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        As an authorized dealer located in <strong>Ikorodu, Lagos</strong>, LG Trust Edge guarantees that every single item in our showroom is 100% authentic. Below is our definitive guide to verifying your LG purchases.
                    </p>
                </div>

                {/* The Guide Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    
                    {/* Step 1 */}
                    <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-lg-red hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-red-50 text-lg-red rounded-full flex items-center justify-center text-2xl mb-6 shadow-sm">
                            <i className="fas fa-barcode"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">1. Check the Serial Number</h3>
                        <p className="text-gray-600 mb-4">
                            Every original LG product comes with a unique 15-character serial number (S/N) printed on a high-quality, tamper-proof sticker at the back of the unit.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>The sticker should never look peeled or glued-on cheaply.</li>
                            <li>You can verify this serial number directly with LG customer support.</li>
                        </ul>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-6 shadow-sm">
                            <i className="fas fa-file-contract"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">2. Official Warranty Card</h3>
                        <p className="text-gray-600 mb-4">
                            Original LG products sold in Nigeria must come with a regional West African LG warranty card.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>Look for the Fouani Nigeria or official LG Electronics seal.</li>
                            <li>The warranty card should match the serial number on the unit exactly.</li>
                        </ul>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl mb-6 shadow-sm">
                            <i className="fas fa-mobile-screen"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">3. LG ThinQ App Integration</h3>
                        <p className="text-gray-600 mb-4">
                            For Smart TVs, ACs, and modern washing machines, the ultimate test is the <strong>LG ThinQ App</strong>.
                        </p>
                        <p className="text-gray-600">
                            Counterfeit operating systems cannot connect to LG's official servers. If your smart appliance cannot sync with the official LG ThinQ app downloaded from the Google Play or Apple App Store, it is 100% fake.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white rounded-2xl shadow-md p-8 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl mb-6 shadow-sm">
                            <i className="fas fa-weight-hanging"></i>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">4. Build Quality & Weight</h3>
                        <p className="text-gray-600 mb-4">
                            Original LG compressors (like the Smart Inverter Compressor) are built with heavy, premium metals.
                        </p>
                        <p className="text-gray-600">
                            Fake refrigerators and AC units often use extremely cheap, lightweight plastic housing for internal components. The LG logo should be embedded into the metal/plastic, not just a cheap flat sticker that easily scratches off.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-slate-900 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lg-red rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>
                    
                    <h2 className="text-3xl font-black text-white mb-4 relative z-10">Buy with 100% Confidence</h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Skip the anxiety of the open market. Every item purchased at LG Trust Edge is verifiable, comes with a solid warranty, and is delivered straight from our Ikorodu showroom to your door.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link to="/products" className="bg-lg-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(226,0,26,0.3)]">
                            Shop Original Products
                        </Link>
                        <a href="https://wa.me/2347080441764?text=Hi%20LG%20Trust%20Edge%20Ikorodu%20Showroom%2C%20I%20want%20to%20verify%20an%20original%20LG%20product." target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2">
                            <i className="fab fa-whatsapp text-lg"></i> Chat on WhatsApp
                        </a>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
