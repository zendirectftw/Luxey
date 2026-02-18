"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LuxeyLogo from "./LuxeyLogo";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Why Us", href: "/why-us" },
    { label: "About", href: "/about" },
    { label: "Charts", href: "/charts" },
];

const accountLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "❤️ Favorites", href: "/favorites" },
    { label: "Profile", href: "/profile" },
    { label: "Purchase Orders", href: "/purchase-orders" },
    { label: "Shipments", href: "/shipments" },
    { label: "Orders", href: "/orders" },
    { label: "My Locker", href: "/locker" },
    { label: "Payments", href: "/payments" },
    { label: "Commissions", href: "/commissions" },
    { label: "Status Tier", href: "/status" },
    { label: "Referrals", href: "/referrals" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const { itemCount, openDrawer } = useCart();

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-[#E4E4E4] px-6 md:px-12 py-3 shrink-0">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 relative">
                        <LuxeyLogo size={48} variant="dark" />
                        <div className="relative flex items-center h-12">
                            <span className="font-serif nav-logo-text uppercase font-bold text-black leading-none">
                                Luxey
                            </span>
                            <span className="absolute -top-1 -right-4 text-[10px] font-sans font-bold text-black uppercase">
                                ©
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Cart + Account */}
                        <div className="flex items-center gap-3">
                            {/* Cart Icon */}
                            <button
                                onClick={openDrawer}
                                className="relative w-9 h-9 bg-[#F5F5F5] rounded-full border border-[#E4E4E4] flex items-center justify-center hover:border-black transition-all"
                                aria-label="Open cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            <div className="h-6 w-px bg-[#E4E4E4]" />

                            {/* Account Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-tighter">
                                    Welcome,{" "}
                                    <span className="text-black font-extrabold uppercase">
                                        Jerrold
                                    </span>
                                </span>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDropdownOpen(!dropdownOpen);
                                        }}
                                        className="w-9 h-9 bg-[#F5F5F5] rounded-full border border-[#E4E4E4] flex items-center justify-center hover:border-black transition-all"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-[220px] bg-white border border-[#E4E4E4] rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50 animate-slide-down">
                                            {accountLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="dropdown-item"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                            {user.isAdmin && (
                                                <div className="border-t border-[#E4E4E4]">
                                                    <Link
                                                        href="/admin"
                                                        className="dropdown-item flex items-center gap-2 text-[#D4AF37] hover:text-black hover:bg-yellow-50"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        🛡️ Admin Panel
                                                    </Link>
                                                </div>
                                            )}
                                            <div className="border-t border-[#E4E4E4]">
                                                <Link
                                                    href="/sign-in"
                                                    className="dropdown-item text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    Sign Out
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-6 w-px bg-[#E4E4E4]" />

                            <Link
                                href="/"
                                className="bg-black text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                            >
                                Home
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                        />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-[#E4E4E4] pt-4 animate-slide-down">
                        <div className="space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-3 px-4 text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-black hover:bg-[#FAFAFA] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-[#F5F5F5] my-2" />
                            <p className="px-4 pt-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                My Account
                            </p>
                            {accountLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#D4AF37] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user.isAdmin && (
                                <>
                                    <div className="border-t border-[#F5F5F5] my-2" />
                                    <Link
                                        href="/admin"
                                        className="block py-3 px-4 text-[11px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-black transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        🛡️ Admin Panel
                                    </Link>
                                </>
                            )}
                            <div className="border-t border-[#F5F5F5] my-2" />
                            <Link
                                href="/sign-in"
                                className="block py-3 px-4 text-[11px] font-black uppercase tracking-widest text-red-500"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign Out
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            <CartDrawer />
        </>
    );
}
