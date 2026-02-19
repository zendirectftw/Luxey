"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LuxeyLogo from "./LuxeyLogo";

const navSections = [
    {
        label: "Management",
        links: [
            { href: "/admin", icon: "📊", text: "Dashboard" },
            { href: "/admin/products", icon: "📦", text: "Products" },
            { href: "/admin/categories", icon: "📂", text: "Categories" },
            { href: "/admin/attributes", icon: "🏷️", text: "Attributes" },
            { href: "/admin/dealers", icon: "🏢", text: "Dealers" },
        ],
    },
    {
        label: "Operations",
        links: [
            { href: "/admin/purchase-orders", icon: "📥", text: "Purchase Orders" },
            { href: "/admin/orders", icon: "📜", text: "Orders" },
            { href: "/admin/customers", icon: "👤", text: "Customers" },
            { href: "/admin/referral-tree", icon: "🌳", text: "Referral Tree" },
            { href: "/admin/referral-network", icon: "🔗", text: "Referral Network" },
            { href: "/admin/status", icon: "⚙️", text: "Status & Commissions" },
            { href: "/admin/payouts", icon: "💰", text: "Payouts" },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 bg-white border-r border-[#E4E4E4] flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-8 border-b border-[#E4E4E4] flex items-center gap-2">
                <LuxeyLogo size={40} variant="dark" />
                <span className="font-serif text-3xl uppercase font-bold tracking-tighter">
                    Luxey<span className="text-[10px] align-top font-sans">©</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 overflow-y-auto">
                {navSections.map((section) => (
                    <div key={section.label} className="mb-6">
                        <div className="px-8 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            {section.label}
                        </div>
                        {section.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`sidebar-link ${isActive(link.href) ? "sidebar-link-active" : ""}`}
                            >
                                <span>{link.icon}</span> {link.text}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-8 border-t border-[#E4E4E4]">
                <Link
                    href="/"
                    className="block w-full text-center bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                    Back to Storefront
                </Link>
            </div>
        </aside>
    );
}
