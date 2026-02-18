import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description:
        "Luxey is a gold and precious metals exchange headquartered in Denver, Colorado. Building wealth through gold, silver, and rare coins.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-black py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6">
                        Our Story
                    </p>
                    <h1 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-tight leading-none mb-6">
                        Building Wealth<br />Through Gold
                    </h1>
                    <p className="text-sm md:text-base text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Luxey was founded with a single mission: make it radically easy to
                        build wealth through physical ownership of gold and precious metals.
                        We believe gold and silver should be as accessible as any other asset class.
                    </p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-[40rem] leading-none">⚡</span>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-5xl mx-auto py-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                            Our Mission
                        </p>
                        <h2 className="font-serif text-4xl text-black uppercase tracking-tight leading-none mb-6">
                            Financial Freedom<br />Starts Here
                        </h2>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                            At <span style={{ letterSpacing: '0.2em' }} className="font-black">LUXEY</span>, we believe that owning physical precious metals is one of the most
                            reliable paths to building lasting wealth. Gold has been a store of
                            value for over 5,000 years — and yet, buying it and storing it has always been
                            unnecessarily complex.
                        </p>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            <span style={{ letterSpacing: '0.2em' }} className="font-black">LUXEY</span> changes that. Our platform combines compelling real-time pricing
                            and a secure storage option for buyers with fast payouts and referral
                            commissions for sellers. We help you build wealth through precious
                            metals ownership. Finally, gold and precious metals are accessible to everyone!
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                stat: "Denver, CO",
                                label: "Headquarters & Vault",
                                desc: "Our insured vault facility operates 24/7 with full serial number tracking.",
                            },
                            {
                                stat: "5 Tiers",
                                label: "Status Levels",
                                desc: "From Bronze to Titanium — earn lower fees and higher commissions as you grow.",
                            },
                            {
                                stat: "35%",
                                label: "Max Commission",
                                desc: "Earn up to 35% of platform fees from your referral network, paid monthly.",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="bg-white border border-[#E4E4E4] rounded-sm p-6 hover:border-[#D4AF37] transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl font-serif font-bold text-[#D4AF37] whitespace-nowrap">
                                        {item.stat}
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-1">
                                            {item.label}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-black py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                            What We Stand For
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl text-white uppercase tracking-tight leading-none">
                            Our Values
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Transparency",
                                desc: "Real-time bid/ask pricing. No hidden fees, no markups, no surprises. You see exactly what the market is offering.",
                                icon: "🔍",
                            },
                            {
                                title: "Speed",
                                desc: "From shipping labels to payouts, everything on Luxey is designed to be the fastest in the industry. Your time matters.",
                                icon: "⚡",
                            },
                            {
                                title: "Security",
                                desc: "Every item is stored in our insured Denver vault with tamper-proof packaging, serial tracking, and 24/7 monitoring.",
                                icon: "🛡️",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="border border-zinc-800 rounded-sm p-10 text-center hover:border-[#D4AF37] transition-all"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Network */}
            <section className="max-w-5xl mx-auto py-20 px-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
                    Grow With Us
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-black uppercase tracking-tight leading-none mb-6">
                    Your Golden Network
                </h2>
                <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                    Luxey isn&apos;t just a marketplace — it&apos;s a network. As you refer
                    your friends and grow your volumes, you unlock higher status tiers
                    that reduce platform fees and increase commissions. The more you
                    help us grow, the more you earn.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
                    {[
                        { tier: "Bronze", vol: "$25k", color: "#A0522D" },
                        { tier: "Silver", vol: "$75k", color: "#808080" },
                        { tier: "Gold", vol: "$150k", color: "#D4AF37" },
                        { tier: "Platinum", vol: "$300k", color: "#5F9EA0" },
                        { tier: "Titanium", vol: "$500k", color: "#444444" },
                    ].map((t) => (
                        <div
                            key={t.tier}
                            className="bg-white border border-[#E4E4E4] rounded-sm p-4 text-center hover:border-[#D4AF37] transition-colors"
                        >
                            <p
                                className="text-lg font-black uppercase mb-1"
                                style={{ color: t.color }}
                            >
                                {t.tier}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                {t.vol}/mo
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#D4AF37] py-16 px-6 text-center">
                <h3 className="font-serif text-3xl md:text-4xl text-black uppercase tracking-tight leading-none mb-6">
                    Start Your Gold Journey
                </h3>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/explore"
                        className="bg-black text-white px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                    >
                        Browse Products
                    </Link>
                    <Link
                        href="/sign-in"
                        className="border-2 border-black text-black px-10 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </section>
        </>
    );
}
