"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Product } from "@/components/ProductCard";

export interface CartItem {
    product: Product;
    quantity: number;
    action: "buy" | "sell";
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, action?: "buy" | "sell") => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const addToCart = useCallback((product: Product, action: "buy" | "sell" = "buy") => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id === product.id && item.action === action);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id && item.action === action
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, action }];
        });
        setIsDrawerOpen(true);
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prev => prev.filter(item => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(item => item.product.id !== productId));
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemCount,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
