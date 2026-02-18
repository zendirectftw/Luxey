import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Why Us",
    description:
        "Discover why Luxey is the fastest and most trusted precious metals exchange. Fastest labels, fastest payouts, verified vault custody.",
};

export default function WhyUsPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-black py-24 px-6 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
                        The Luxey Difference
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-tight leading-none mb-6">
                        Speed is<br />Everything
                    </h1>
                    <p className="text-sm md:text-base text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
                        We built Luxey to be the real-time precious metals exchange.
                        Fast labels. Fast payouts. Fast response times.
                    </p>
                </div>

                {/* Background bolt */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-[40rem] leading-none">⚡</span>
                </div>
            </section>

            {/* Speed Metrics */}
            <section className="max-w-7xl mx-auto py-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-10 text-center hover:border-[#D4AF37] transition-all group">
                        <div className="text-5xl font-serif font-bold text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                            &lt; 5 min
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-2">
                            Shipping Labels
                        </h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Shipping labels generated automatically within minutes of sell confirmation.
                        </p>
                    </div>
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-10 text-center hover:border-[#D4AF37] transition-all group">
                        <div className="text-5xl font-serif font-bold text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                            RTP
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-2">
                            Real-Time Payouts
                        </h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Funds hit your bank account the instant verification completes at
                            our Denver vault. Not days — seconds.
                        </p>
                    </div>
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-10 text-center hover:border-[#D4AF37] transition-all group">
                        <div className="text-5xl font-serif font-bold text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                            24/7
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-2">
                            Transparency
                        </h3>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Easily track purchase order status from Lock to Paid. From potential to realized profits.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-[#FAFAFA] border-y border-[#E4E4E4] py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                            Simple by Design
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl text-black uppercase tracking-tight leading-none">
                            How Luxey Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Browse",
                                desc: "Explore our catalog of certified gold, silver, and platinum products with real-time bid/ask pricing.",
                            },
                            {
                                step: "02",
                                title: "Trade",
                                desc: "Buy at the ask or sell at the bid. We connect buyers and sellers at amazing, transparent prices.",
                            },
                            {
                                step: "03",
                                title: "Ship",
                                desc: "Sellers get near-instant shipping labels. Buyers receive insured delivery or products are immediately added to your Luxey Locker.",
                            },
                            {
                                step: "04",
                                title: "Get Paid",
                                desc: "Real-Time Payments are deposited instantly to your account upon verification.",
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-black rounded-full text-[#D4AF37] text-lg font-black mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-black mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="max-w-7xl mx-auto py-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                            The Luxey Locker Difference
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl text-black uppercase tracking-tight leading-none mb-6">
                            Your Metals.<br />Our Vault.
                        </h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                            Secure your wealth with confidence. Every item purchased may be stored in your LUXEY LOCKER, held within our world-class, 24/7 safeguarded, and fully insured vault. Your precious metals are always physically segregated from other clients. Meticulous serial number tracking and auditing ensure your investments are always protected and verified.
                        </p>
                        <Link
                            href="/explore"
                            className="inline-block bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                        >
                            Start Browsing
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Insured Storage", icon: "🔒" },
                            { label: "Serial Tracking", icon: "📋" },
                            { label: "Physically Segregated", icon: "🛡️" },
                            { label: "24/7 Monitor", icon: "👁️" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-white border border-[#E4E4E4] rounded-sm p-6 text-center hover:border-[#D4AF37] transition-colors"
                            >
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-black py-16 px-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                    Ready to Start?
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-tight leading-none mb-8">
                    Join the Fastest Precious Metals Exchange
                </h3>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/explore"
                        className="bg-[#D4AF37] text-black px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#C4A030] transition-colors"
                    >
                        Browse Products
                    </Link>
                    <Link
                        href="/sign-in"
                        className="border-2 border-[#D4AF37] text-[#D4AF37] px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </section>
        </>
    );
}
