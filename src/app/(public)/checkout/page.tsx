"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { sampleProducts } from "@/data/products";
import LuxeyCTA from "@/components/LuxeyCTA";
import { useCart, CartItem } from "@/context/CartContext";

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-4xl mx-auto w-full py-20 px-6 text-center">
                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                        Loading checkout...
                    </p>
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const cart = useCart();

    // Determine mode: "cart" (multi-item) or "single" (sell flow)
    const fromCart = searchParams.get("from") === "cart";
    const productId = searchParams.get("product") || "";
    const action = searchParams.get("action") || "buy";

    // Build the items list for this checkout
    let checkoutItems: { product: typeof sampleProducts[0]; quantity: number; action: string }[] = [];

    if (fromCart && cart.items.length > 0) {
        checkoutItems = cart.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            action: item.action,
        }));
    } else if (productId) {
        const found = sampleProducts.find((p) => p.id === productId);
        if (found) {
            checkoutItems = [{ product: found, quantity: 1, action }];
        }
    }

    const isSelling = checkoutItems.length === 1 && checkoutItems[0].action === "sell";

    const [seconds, setSeconds] = useState(30);
    const [quantities, setQuantities] = useState<number[]>(
        checkoutItems.map((item) => item.quantity)
    );
    const [checks, setChecks] = useState([false, false, false]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleCheck = (index: number) => {
        const next = [...checks];
        next[index] = !next[index];
        setChecks(next);
    };

    const updateCheckoutQty = (idx: number, qty: number) => {
        const next = [...quantities];
        next[idx] = Math.max(1, qty);
        setQuantities(next);
    };

    const allChecked = checks.every((c) => c);

    // Parse price string to number
    const parsePrice = (price: string) =>
        parseFloat(price.replace(/[$,]/g, ""));

    const subtotal = checkoutItems.reduce((sum, item, idx) => {
        const price = item.action === "sell"
            ? parsePrice(item.product.bid)
            : parsePrice(item.product.ask);
        return sum + price * quantities[idx];
    }, 0);

    const handleConfirmOrder = () => {
        if (fromCart) cart.clearCart();
        setOrderPlaced(true);
    };

    // Empty state
    if (checkoutItems.length === 0 && !orderPlaced) {
        return (
            <section className="max-w-4xl mx-auto w-full py-20 px-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAFAFA] border border-[#E4E4E4] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                </div>
                <h1 className="font-serif text-3xl uppercase mb-3">No Items to Checkout</h1>
                <p className="text-xs text-gray-400 mb-6">Your cart is empty. Browse our marketplace to find what you&apos;re looking for.</p>
                <Link
                    href="/explore"
                    className="inline-block bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                    Browse Products
                </Link>
            </section>
        );
    }

    // Order placed success state
    if (orderPlaced) {
        return (
            <section className="max-w-4xl mx-auto w-full py-20 px-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl uppercase tracking-tight mb-3">
                    {isSelling ? "Sale Confirmed" : "Order Confirmed"}
                </h1>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Purchase Order #LX-{Math.floor(100000 + Math.random() * 900000)}
                </p>
                <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                    {isSelling
                        ? "Your sale has been submitted. You'll receive shipping instructions shortly."
                        : "Your order has been received. Items will ship from our insured Denver vault within 1-2 business days."}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/orders"
                        className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                    >
                        View Orders
                    </Link>
                    <Link
                        href="/explore"
                        className="border border-[#E4E4E4] text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-4xl mx-auto w-full py-10 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-4xl md:text-5xl text-black tracking-tight uppercase leading-none mb-2">
                        {isSelling ? "Sell" : "Checkout"}
                    </h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {checkoutItems.length === 1
                            ? `Review and confirm your ${isSelling ? "sale" : "purchase"}`
                            : `${checkoutItems.length} items in your order`}
                    </p>
                </div>

                {/* Timer */}
                <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Price Expires In
                    </p>
                    <div className="bg-black text-white px-4 py-2 rounded-sm">
                        <span className="text-2xl font-black tracking-tighter tabular-nums">
                            00:{seconds < 10 ? `0${seconds}` : seconds}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ═══ LEFT: ITEM DETAILS ═══ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Summary — one card per item */}
                    {checkoutItems.map((item, idx) => {
                        const price = item.action === "sell" ? item.product.bid : item.product.ask;
                        return (
                            <div key={item.product.id} className="bg-white border border-[#E4E4E4] rounded-sm overflow-hidden shadow-sm">
                                <div className="p-6 flex gap-6 items-start">
                                    <div className="w-24 h-24 bg-[#FAFAFA] border border-[#E4E4E4] rounded flex items-center justify-center p-2 flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            className="object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-sm font-black uppercase tracking-wider text-black mb-1">
                                            {item.product.name}
                                        </h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                            {item.product.weight} • {item.product.mint}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                                    {item.action === "sell" ? "Bid Price" : "Ask Price"}
                                                </p>
                                                <p className="text-xl font-black tracking-tighter tabular-nums">
                                                    {price}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                    Qty
                                                </p>
                                                <button
                                                    onClick={() => updateCheckoutQty(idx, quantities[idx] - 1)}
                                                    className="w-8 h-8 border border-[#E4E4E4] rounded flex items-center justify-center text-sm font-bold hover:border-black transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-black text-sm tabular-nums">
                                                    {quantities[idx]}
                                                </span>
                                                <button
                                                    onClick={() => updateCheckoutQty(idx, quantities[idx] + 1)}
                                                    className="w-8 h-8 border border-[#E4E4E4] rounded flex items-center justify-center text-sm font-bold hover:border-black transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Checklist */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-6 shadow-sm">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            Required Confirmations
                        </h3>
                        <div className="space-y-4">
                            {[
                                isSelling
                                    ? "I confirm this item is authentic, in my possession, and matches the listed condition."
                                    : "I understand this purchase is final and non-refundable once confirmed.",
                                isSelling
                                    ? "I agree to ship within 3 business days of generating a shipping label."
                                    : "I agree to the current ask price and applicable platform fees.",
                                "I have reviewed and agree to the Luxey Terms of Service and Privacy Policy.",
                            ].map((text, idx) => (
                                <label
                                    key={idx}
                                    className="flex items-start gap-4 p-4 border border-[#F5F5F5] rounded-sm cursor-pointer hover:border-[#E4E4E4] transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checks[idx]}
                                        onChange={() => toggleCheck(idx)}
                                        className="mt-0.5 w-5 h-5 accent-black flex-shrink-0"
                                    />
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider leading-relaxed">
                                        {text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-6 shadow-sm">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            {isSelling ? "Payout Details" : "Payment Details"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">
                                    {isSelling ? "Bank Name" : "Card Number"}
                                </label>
                                <input
                                    type="text"
                                    placeholder={isSelling ? "Chase Bank" : "•••• •••• •••• ••••"}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">
                                    {isSelling ? "Account Number" : "Expiry / CVV"}
                                </label>
                                <input
                                    type="text"
                                    placeholder={isSelling ? "••••••7890" : "MM/YY   CVV"}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-6 shadow-sm">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            {isSelling ? "Return Address" : "Shipping Address"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="form-label">Street Address</label>
                                <input
                                    type="text"
                                    placeholder="123 Main Street"
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    placeholder="Denver"
                                    className="form-input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        placeholder="CO"
                                        className="form-input"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">ZIP</label>
                                    <input
                                        type="text"
                                        placeholder="80202"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT: ORDER SUMMARY ═══ */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-[#E4E4E4] rounded-sm p-6 shadow-sm sticky top-24">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                            Order Summary
                        </h3>

                        <div className="space-y-3 mb-6">
                            {checkoutItems.map((item, idx) => {
                                const price = item.action === "sell" ? item.product.bid : item.product.ask;
                                return (
                                    <div key={item.product.id} className="flex justify-between text-sm">
                                        <span className="font-bold uppercase tracking-wider text-gray-500 truncate max-w-[140px]">
                                            {item.product.name}
                                        </span>
                                        <span className="font-black tracking-tighter tabular-nums whitespace-nowrap ml-2">
                                            {price} ×{quantities[idx]}
                                        </span>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between text-sm">
                                <span className="font-bold uppercase tracking-wider text-gray-500">
                                    Platform Fee (0.60%)
                                </span>
                                <span className="font-bold text-gray-400 tracking-tighter tabular-nums">
                                    Included
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold uppercase tracking-wider text-gray-500">
                                    Shipping
                                </span>
                                <span className="font-bold text-gray-400 tracking-tighter">
                                    {isSelling ? "Label Provided" : "Free Insured"}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-[#E4E4E4] pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {isSelling ? "Total Payout" : "Total Due"}
                                </span>
                                <span className="text-2xl font-black tracking-tighter tabular-nums">
                                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            disabled={!allChecked}
                            className={`w-full py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${allChecked
                                ? "bg-black text-white hover:bg-[#D4AF37] hover:text-black cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isSelling ? "CONFIRM SALE" : "PLACE ORDER"}
                        </button>

                        {!allChecked && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-400 text-center mt-3">
                                Complete all confirmations above
                            </p>
                        )}

                        <div className="mt-6 pt-4 border-t border-[#F5F5F5]">
                            <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                {isSelling
                                    ? "Funds are sent via Real-Time Payment (RTP) once your items are verified at our Denver vault."
                                    : "Items are shipped from our insured Denver vault within 1-2 business days."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
