import React from 'react';
import { Link } from 'react-router-dom';

const SEARCH_CATEGORIES = [
    {
        title: "Top Showrooms & Stores",
        links: [
            "electronics showroom in ikorodu",
            "electronics store in nigeria",
            "electronics store in ikorodu",
            "online electronics shop lagos",
            "home appliances store near me",
            "cheapest electronics market in lagos",
            "electronics center in ikorodu",
            "electronics shop near computer village ikeja",
            "electronics store in abuja",
            "electronics store in lagos"
        ]
    },
    {
        title: "Power & Solar Energy",
        links: [
            "solar inverter price in nigeria",
            "3kva pure sine wave inverter price",
            "complete solar system setup cost nigeria",
            "lithium inverter battery 200ah",
            "elepaq generator 2.5kva price lagos",
            "sumec firman generator price list slot",
            "automatic voltage stabilizer for home tv",
            "solar panel installers in ikorodu lagos",
            "solar inverters shop in ikorodu",
            "buy solar inverters online ikorodu pay on delivery"
        ]
    },
    {
        title: "Cooling & Home Appliances",
        links: [
            "rechargeable standing fan with solar panel",
            "rechargeable fan with remote control",
            "rechargeable fan price in ikorodu",
            "haier thermocool smart inverter AC split",
            "rechargeable ac price ikorodu",
            "scanfrost chest freezer price lagos",
            "deep freezers shop in ikorodu",
            "buy deep freezers online ikorodu pay on delivery"
        ]
    },
    {
        title: "Smartphones & Gadgets",
        links: [
            "uk used iphone price in nigeria",
            "tokunbo phones for sale in computer village",
            "uk used iphone shop in ikorodu",
            "tecno phone price list slot nigeria",
            "infinix hot series phones on installment",
            "oraimo power bank 20000mah original price",
            "samsung galaxy a series price in naira",
            "buy redmi note phones online nigeria",
            "direct uk used phones cash on delivery",
            "cheap android phones under 50000 naira",
            "smartphones shop in ikorodu",
            "uk used phones shop in ikorodu",
            "oraimo wireless earbuds latest model"
        ]
    },
    {
        title: "Computing & Workstations",
        links: [
            "tokunbo laptops in computer village ikeja",
            "uk used hp elitebook core i5 price",
            "cheap dell laptops for students in nigeria",
            "core i7 16gb ram desktop setup for coding",
            "macbook pro uk used price lagos",
            "laptop computers for sale in ikorodu",
            "cheap coding laptops for web developers lagos",
            "laptops shop in ikorodu",
            "tokunbo laptops shop in ikorodu",
            "computer repair shop in ikorodu"
        ]
    },
    {
        title: "TVs & Entertainment",
        links: [
            "hisense 55 inch 4k smart tv price nigeria",
            "royal electronics tv price naira",
            "home theater soundbar system price lagos",
            "tcl google tv frameless price in nigeria",
            "zealot bluetooth speaker heavy bass price",
            "smart tv store in ikorodu town",
            "smart tvs shop in ikorodu"
        ]
    },
    {
        title: "Gaming & Accessories",
        links: [
            "second hand ps5 price in nigeria",
            "cheap gaming pc build price lagos",
            "gaming mouse and mechanical keyboard bundle"
        ]
    }
];

export default function PopularSearches() {
    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Trending Electronics Searches in Nigeria</h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Quick links to our most requested products and local deals</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                    {SEARCH_CATEGORIES.map((category, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-black text-lg-red uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-3 bg-lg-red rounded-full"></span>
                                {category.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {category.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link 
                                            to={`/products?search=${encodeURIComponent(link)}`}
                                            className="text-[13px] text-gray-500 hover:text-lg-dark hover:underline underline-offset-2 transition-all font-medium block leading-snug"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-gray-200">
                        <i className="fas fa-search"></i> 
                        Buy Electronics Online Pay on Delivery
                    </div>
                </div>
            </div>
        </section>
    );
}
