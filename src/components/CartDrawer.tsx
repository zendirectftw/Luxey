"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        isDrawerOpen,
        closeDrawer,
    } = useCart();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    // Parse price string to number
    const parsePrice = (price: string) => {
        return parseFloat(price.replace(/[$,]/g, ""));
    };

    const subtotal = items.reduce((sum, item) => {
        const price = item.action === "buy"
            ? parsePrice(item.product.ask)
            : parsePrice(item.product.bid);
        return sum + price * item.quantity;
    }, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#E4E4E4]">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-black">
                            Shopping Cart
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="w-8 h-8 rounded-full border border-[#E4E4E4] flex items-center justify-center hover:border-black transition-colors"
                        aria-label="Close cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#E4E4E4] flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">
                                Your cart is empty
                            </p>
                            <p className="text-xs text-gray-400 mb-6">
                                Browse our marketplace and add products to get started.
                            </p>
                            <Link
                                href="/explore"
                                onClick={closeDrawer}
                                className="inline-block bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F5F5F5]">
                            {items.map((item) => {
                                const price = item.action === "buy"
                                    ? item.product.ask
                                    : item.product.bid;

                                return (
                                    <div key={item.product.id} className="px-6 py-5 flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 bg-[#FAFAFA] border border-[#E4E4E4] rounded flex items-center justify-center p-1.5 flex-shrink-0">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                width={48}
                                                height={48}
                                                className="object-contain mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[11px] font-black uppercase tracking-wider text-black truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                                                {item.product.weight} • {item.product.mint}
                                            </p>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-6 h-6 border border-[#E4E4E4] rounded flex items-center justify-center text-xs font-bold hover:border-black transition-colors"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-black tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-6 h-6 border border-[#E4E4E4] rounded flex items-center justify-center text-xs font-bold hover:border-black transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <p className="text-sm font-black tracking-tighter tabular-nums">
                                                    {price}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors self-start mt-0.5 flex-shrink-0"
                                            aria-label={`Remove ${item.product.name}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 6 6 18" />
                                                <path d="m6 6 12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer — Order Summary */}
                {items.length > 0 && (
                    <div className="border-t border-[#E4E4E4] px-6 py-5 bg-[#FAFAFA]">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold uppercase tracking-wider text-gray-500">
                                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                                </span>
                                <span className="font-black tracking-tighter tabular-nums">
                                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold uppercase tracking-wider text-gray-500">
                                    Shipping
                                </span>
                                <span className="font-bold text-gray-400 tracking-tighter">
                                    Free Insured
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-[#E4E4E4] pt-4 mb-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Estimated Total
                                </span>
                                <span className="text-xl font-black tracking-tighter tabular-nums">
                                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout?from=cart"
                            onClick={closeDrawer}
                            className="block w-full bg-black text-white text-center py-4 text-[11px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                        >
                            Proceed to Checkout
                        </Link>

                        <button
                            onClick={clearCart}
                            className="w-full text-center mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
