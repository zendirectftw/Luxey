import React from "react";
import Link from "next/link";
import LuxeyLogo from "./LuxeyLogo";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-16 px-6 border-t border-[#D4AF37] mt-12 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 items-center md:items-start text-center md:text-left">
                <div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 relative mb-4 justify-center md:justify-start"
                    >
                        <LuxeyLogo size={40} variant="light" />
                        <div className="relative flex items-center h-10 text-white">
                            <span className="font-serif text-[2.2rem] tracking-tighter uppercase font-bold leading-none text-white">
                                Luxey
                            </span>
                            <span className="absolute -top-1 -right-3 text-[8px] font-sans font-bold text-white uppercase">
                                ©
                            </span>
                        </div>
                    </Link>
                    <p className="text-zinc-500 text-xs font-light max-w-xs leading-snug font-sans">
                        We help you to build wealth and gain financial freedom by investing in physical gold,
                        silver and rare coins.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                    <div className="flex gap-6">
                        <Link
                            href="/explore"
                            className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#D4AF37] transition-colors"
                        >
                            Explore
                        </Link>
                        <Link
                            href="/why-us"
                            className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#D4AF37] transition-colors"
                        >
                            Why Us
                        </Link>
                        <Link
                            href="/about"
                            className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#D4AF37] transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/charts"
                            className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-[#D4AF37] transition-colors"
                        >
                            Charts
                        </Link>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] opacity-60">
                        Verified Exchange • Denver Vault
                    </div>
                </div>
            </div>
        </footer>
    );
}
